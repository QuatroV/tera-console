import { z } from "zod";
import { LoginFormValues } from "./types";
import { passwordSchema } from "@/schemas/password";
import { FIELDS } from "./constants";

const loginSchema = z.object({
  [FIELDS.EMAIL]: z.string().email("Невалидный почтовый адрес"),
  [FIELDS.PASSWORD]: passwordSchema,
});

export const validate = (values: LoginFormValues) => {
  try {
    loginSchema.parse(values);
    return {};
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.formErrors.fieldErrors;
    } else {
      console.error(error);
    }
  }
};
