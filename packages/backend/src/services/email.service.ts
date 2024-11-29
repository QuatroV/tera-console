import nodemailer from "nodemailer";
import customConfig from "../config/default";
import { User } from "@prisma/client";
import crypto from "crypto";
import { updateUser } from "./db.service";

// Создание транспортера
const transporter = nodemailer.createTransport({
  // Настройки почтового сервиса
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // почта
    pass: process.env.EMAIL_PASS, // пароль
  },
});

/**
 * Генерирует токен подтверждения и отправляет письмо
 * @param user Пользователь
 */
export async function generateAndSendVerificationToken(
  user: User
): Promise<void> {
  const verificationToken = crypto.randomBytes(32).toString("hex");
  await updateUser({ id: user.id }, { verificationToken });
  await sendVerificationEmail({ ...user, verificationToken });
}

export const sendVerificationEmail = async (user: User) => {
  const verificationUrl = `${customConfig.frontendUrl}/verify_email?token=${user.verificationToken}&id=${user.id}`;

  await transporter.sendMail({
    from: '"TeraCloud" <no-reply@teracloud.bmstu.ru>',
    to: user.email,
    subject: "Подтверждение электронной почты",
    html: `<p>Здравствуйте, ${user.name}!</p>
           <p>Пожалуйста, подтвердите вашу электронную почту, перейдя по ссылке ниже:</p>
           <a href="${verificationUrl}">Подтвердить почту</a>`,
  });
};
