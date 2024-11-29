import { z } from "zod";
import { RegisterFormValues } from "./types";
import { passwordSchema } from "@/schemas/password";
import { FIELDS } from "./constants";

const registerSchema = z
  .object({
    [FIELDS.EMAIL]: z.string().email("Невалидный почтовый адрес"),
    [FIELDS.NAME]: z.string().min(1, "Имя не может быть пустым"),
    [FIELDS.PASSWORD]: passwordSchema,
    [FIELDS.CONFIRM_PASSWORD]: passwordSchema,
    [FIELDS.CONFIRM_READ_RULES]: z.literal(true),
    [FIELDS.CONFIRM_SEND_PERSONAL_INFO]: z.literal(true),
  })
  .refine((data) => data[FIELDS.PASSWORD] === data[FIELDS.CONFIRM_PASSWORD], {
    message: "Пароли должны совпадать",
    path: [FIELDS.CONFIRM_PASSWORD],
  });

export const validate = (values: RegisterFormValues) => {
  try {
    registerSchema.parse(values);
    return {};
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.formErrors.fieldErrors;
    } else {
      console.error(error);
    }
  }
};
