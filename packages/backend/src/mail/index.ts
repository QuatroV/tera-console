import nodemailer from "nodemailer";

// Настройка Nodemailer для отправки почты
const transporter = nodemailer.createTransport({
  service: "Gmail", // или другой почтовый сервис
  auth: {
    user: "your-email@gmail.com", // ваш email
    pass: "your-email-password", // ваш пароль приложения или почтового сервиса
  },
});

export default transporter;
