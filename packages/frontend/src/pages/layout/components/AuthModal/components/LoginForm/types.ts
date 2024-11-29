import { FIELDS } from "./constants";

export type LoginFormValues = {
  [FIELDS.EMAIL]: string;
  [FIELDS.PASSWORD]: string;
};
