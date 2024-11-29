import { FIELDS } from "./constants";

export type RegisterFormValues = {
  [FIELDS.NAME]: string;
  [FIELDS.EMAIL]: string;
  [FIELDS.PASSWORD]: string;
  [FIELDS.CONFIRM_PASSWORD]: string;
  [FIELDS.CONFIRM_SEND_PERSONAL_INFO]: boolean;
  [FIELDS.CONFIRM_READ_RULES]: boolean;
};
