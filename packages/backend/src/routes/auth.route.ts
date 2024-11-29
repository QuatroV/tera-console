import { TRPCError } from "@trpc/server";
import { router, publicProcedure, setTokens } from "../utils/trpc";
import {
  createUser,
  findUniqueUser,
  findUser,
  findUsers,
  signTokens,
  updateUser,
} from "../services/db.service";
import { CookieOptions } from "express";
import customConfig from "../config/default";
import { Prisma } from "@prisma/client";
import {
  createUserSchema,
  loginUserSchema,
  verifyEmailSchema,
} from "../schema/auth.schema";
import bcrypt from "bcryptjs";
import { signJwt, verifyJwt } from "../utils/jwt";
import redisClient from "../utils/connectRedis";
import {
  generateAndSendVerificationToken,
  sendVerificationEmail,
} from "../services/email.service";
import crypto from "crypto";

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
};

const accessTokenCookieOptions: CookieOptions = {
  ...cookieOptions,
  expires: new Date(Date.now() + customConfig.accessTokenExpiresIn * 60 * 1000),
};

const refreshTokenCookieOptions: CookieOptions = {
  ...cookieOptions,
  expires: new Date(
    Date.now() + customConfig.refreshTokenExpiresIn * 60 * 1000
  ),
};

const authRouter = router({
  // Регистрация нового пользователя
  register: publicProcedure
    .input(createUserSchema)
    .mutation(async ({ input }) => {
      try {
        // Хэшируем пароль
        const hashedPassword = await bcrypt.hash(input.password, 12);

        // Создаем пользователя с неподтвержденной почтой
        const user = await createUser({
          email: input.email.toLowerCase(),
          name: input.name,
          password: hashedPassword,
          photo: input.photo,
          provider: "local",
          verified: false,
        });

        // Генерируем и отправляем токен подтверждения
        await generateAndSendVerificationToken(user);

        return {
          status: "success",
          message:
            "Регистрация успешна! Пожалуйста, подтвердите вашу электронную почту.",
        };
      } catch (err: any) {
        // Обработка ошибок базы данных Prisma
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          if (err.code === "P2002") {
            throw new TRPCError({
              code: "CONFLICT",
              message: "Пользователь с таким e-mail уже существует",
            });
          }
        }
        throw err;
      }
    }),

  // Подтверждение электронной почты
  verifyEmail: publicProcedure
    .input(verifyEmailSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        // Поиск пользователя по ID
        const user = await findUniqueUser({ id: input.id });

        // Проверяем, существует ли пользователь и не подтверждена ли уже почта
        if (!user || user.verified) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Недействительная или истекшая ссылка подтверждения",
          });
        }

        // Проверяем токен подтверждения
        if (user.verificationToken !== input.token) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Недействительная или истекшая ссылка подтверждения",
          });
        }

        // Обновляем статус пользователя на подтвержденный и удаляем токен
        await updateUser(
          { id: user.id },
          {
            verified: true,
            verificationToken: null,
          }
        );

        // Генерируем новые access и refresh токены
        const { access_token, refresh_token } = await signTokens(user);

        // Устанавливаем токены в куки
        setTokens(ctx.res, access_token, refresh_token);

        // Возвращаем результат
        return {
          status: "success",
          message: "Электронная почта успешно подтверждена!",
          access_token,
        };
      } catch (err: any) {
        throw err;
      }
    }),

  // Вход пользователя
  login: publicProcedure
    .input(loginUserSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        // Получаем пользователя из базы данных
        const user = await findUser({ email: input.email.toLowerCase() });

        // Проверяем, существует ли пользователь и правильный ли пароль
        if (!user || !(await bcrypt.compare(input.password, user.password))) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Неверный email или пароль",
          });
        }

        // Генерируем новые access и refresh токены
        const { access_token, refresh_token } = await signTokens(user);

        // Устанавливаем токены в куки
        setTokens(ctx.res, access_token, refresh_token);

        // Возвращаем access_token
        return {
          status: "success",
          access_token,
        };
      } catch (err: any) {
        throw err;
      }
    }),

  // Обновление access токена
  refreshAccessToken: publicProcedure.mutation(async ({ ctx }) => {
    try {
      // Получаем refresh_token из куки
      const refresh_token = ctx.req.cookies?.refresh_token as string;

      const message = "Не удалось обновить access token";
      if (!refresh_token) {
        throw new TRPCError({ code: "FORBIDDEN", message });
      }

      // Валидация refresh_token
      const decoded = verifyJwt<{ sub: string }>(
        refresh_token,
        "refreshTokenPublicKey"
      );

      if (!decoded) {
        throw new TRPCError({ code: "FORBIDDEN", message });
      }

      // Проверяем, есть ли активная сессия пользователя
      const session = await redisClient.get(decoded.sub);
      if (!session) {
        throw new TRPCError({ code: "FORBIDDEN", message });
      }

      // Проверяем, существует ли пользователь
      const user = await findUniqueUser({ id: JSON.parse(session).id });

      if (!user) {
        throw new TRPCError({ code: "FORBIDDEN", message });
      }

      // Генерируем новый access_token
      const access_token = signJwt({ sub: user.id }, "accessTokenPrivateKey", {
        expiresIn: `${customConfig.accessTokenExpiresIn}m`,
      });

      // Устанавливаем новый access_token в куки
      ctx.res.cookie("access_token", access_token, accessTokenCookieOptions);
      ctx.res.cookie("logged_in", true, {
        ...accessTokenCookieOptions,
        httpOnly: false,
      });

      // Возвращаем новый access_token
      return {
        status: "success",
        access_token,
      };
    } catch (err: any) {
      throw err;
    }
  }),

  // Выход пользователя
  logout: publicProcedure.mutation(async ({ ctx }) => {
    try {
      const user = ctx.user;
      // Удаляем сессию пользователя из Redis
      await redisClient.del(user?.id as string);

      // Удаляем куки
      ctx.res.cookie("access_token", "", { maxAge: -1 });
      ctx.res.cookie("refresh_token", "", { maxAge: -1 });
      ctx.res.cookie("logged_in", "", {
        maxAge: -1,
      });
      return { status: "success" };
    } catch (err: any) {
      throw err;
    }
  }),

  // Получение списка всех пользователей
  getAllUsers: publicProcedure.query(async () => {
    // Получаем список пользователей из базы данных
    const users = await findUsers();
    return { users };
  }),
});

export default authRouter;
