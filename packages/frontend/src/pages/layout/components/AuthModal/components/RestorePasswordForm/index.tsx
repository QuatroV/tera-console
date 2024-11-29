import { useState } from "react";
import { Formik, Form } from "formik";
import { HiOutlineMail } from "react-icons/hi";
import { RestorePasswordFormValues } from "./types";
import { FIELDS } from "./constants";
import { validate } from "./validation";
import Button from "@/components/Button";
import InputField from "../InputField";
import { useAppDispatch } from "@/utils/redux";
import { closeAuthModal } from "@/store/auth";

const initialValues: RestorePasswordFormValues = {
  [FIELDS.EMAIL]: "",
};

const RestorePasswordForm = () => {
  const dispatch = useAppDispatch();

  const [letterSent, setLetterSent] = useState(false);

  const onSubmit = (values: RestorePasswordFormValues) => {
    console.log({ values });
    setLetterSent(true);
  };

  const formikProps = {
    initialValues,
    onSubmit,
    validate,
  };

  if (letterSent) {
    return (
      <div className="flex flex-col gap-3 w-96">
        <div className=" bg-gray-100 p-4 rounded-xl flex flex-col gap-3 items-center">
          <HiOutlineMail size={56} className="text-gray-500" />
          <p className="text-center text-gray-500">
            Если вы ранее регистрировались в системе, то на вашу почту придет
            письмо с инструкциями по восстановлению пароля
          </p>
        </div>
        <div className="flex justify-end items-center gap-2">
          <Button
            onClick={() => dispatch(closeAuthModal())}
            variant="filled"
            color="secondary"
            size="large"
          >
            Закрыть
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Formik<RestorePasswordFormValues> {...formikProps}>
      {() => (
        <Form className="flex flex-col gap-3 w-96">
          <div className=" bg-gray-100 p-4 rounded-xl flex flex-col gap-3">
            <p>Введите почтовый адрес, который вы указывали при регистрации:</p>
            <InputField id={FIELDS.EMAIL} placeholder="yourmail@mail.com..." />
          </div>
          <div className="flex justify-end items-center gap-2">
            <Button
              type="submit"
              variant="filled"
              color="secondary"
              size="large"
            >
              Восстановить пароль
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default RestorePasswordForm;
