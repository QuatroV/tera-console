import { z } from "zod";
import { RestorePasswordFormValues } from "./types";
import { FIELDS } from "./constants";

const restorePasswordSchema = z.object({
  [FIELDS.EMAIL]: z.string().email("Невалидный почтовый адрес"),
});

export const validate = (values: RestorePasswordFormValues) => {
  try {
    restorePasswordSchema.parse(values);
    return {};
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.formErrors.fieldErrors;
    } else {
      console.error(error);
    }
  }
};
