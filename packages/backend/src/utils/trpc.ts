import { initTRPC, TRPCError } from "@trpc/server";
import { Context } from "./context";

import { Response } from "express";
import { CookieOptions } from "express";
import customConfig from "../config/default";

const t = initTRPC.context<Context>().create(); // initialize trpc (must be done once)

const isAuthorized = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to access this resource",
    });
  }
  return next();
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuthorized);

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
/**
 * Устанавливает токены в куки
 * @param res Ответ Express
 * @param access_token Токен доступа
 * @param refresh_token Токен обновления
 */
export function setTokens(
  res: Response,
  access_token: string,
  refresh_token: string
): void {
  // Устанавливаем access_token в куки
  res.cookie("access_token", access_token, accessTokenCookieOptions);
  // Устанавливаем refresh_token в куки
  res.cookie("refresh_token", refresh_token, refreshTokenCookieOptions);
  // Устанавливаем флаг logged_in для клиентской стороны
  res.cookie("logged_in", true, {
    ...accessTokenCookieOptions,
    httpOnly: false,
  });
}
