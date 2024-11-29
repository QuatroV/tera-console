import { useState } from "react";
import { Form, Formik } from "formik";
import Button from "@/components/Button";
import trpc from "@/utils/api";
import { useAppDispatch } from "@/utils/redux";
import { closeAuthModal, openLoginModal } from "@/store/auth";
import { RegisterFormValues } from "./types";
import { validate } from "./validation";
import { FIELDS } from "./constants";
import InputField from "../InputField";
import CheckboxField from "../CheckboxField";
import BackendErrors from "../BackendErrors";
import { HiOutlineMail } from "react-icons/hi";
import Spinner from "@/components/Spinner";

const initialValues: RegisterFormValues = {
  [FIELDS.NAME]: "",
  [FIELDS.EMAIL]: "",
  [FIELDS.PASSWORD]: "",
  [FIELDS.CONFIRM_PASSWORD]: "",
  [FIELDS.CONFIRM_SEND_PERSONAL_INFO]: false,
  [FIELDS.CONFIRM_READ_RULES]: false,
};

const RegisterForm = () => {
  const [letterSent, setLetterSent] = useState(false);
  const [backendErrorMsg, setBackendErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      setBackendErrorMsg("");
      setLoading(true);
      await trpc.auth.register.mutate({
        name: values[FIELDS.NAME],
        email: values[FIELDS.EMAIL],
        photo: "",
        password: values[FIELDS.PASSWORD],
        passwordConfirm: values[FIELDS.CONFIRM_PASSWORD],
      });

      setLetterSent(true);
    } catch (e) {
      if (e instanceof Error) {
        setBackendErrorMsg(e.message);
      } else {
        console.error(e);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoToLogin: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    dispatch(openLoginModal());
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
            На вашу почту было отправлено письмо с инструкциями для завершения
            регистрации
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
    <Formik<RegisterFormValues> {...formikProps}>
      {() => (
        <Form className="flex flex-col gap-3">
          <div className=" bg-gray-100 p-4 rounded-xl flex flex-col gap-3">
            <InputField
              label="Имя: "
              id={FIELDS.NAME}
              placeholder="Ваше имя..."
            />
            <InputField
              label="E-mail: "
              id={FIELDS.EMAIL}
              placeholder="Ваш почтовый адрес..."
            />
            <InputField
              type="password"
              label="Пароль: "
              id={FIELDS.PASSWORD}
              placeholder="Пароль..."
            />
            <InputField
              type="password"
              label="Пароль еще раз: "
              id={FIELDS.CONFIRM_PASSWORD}
              placeholder="Подтвердите пароль..."
            />
            <hr />

            <CheckboxField
              label="Я согласен на обработку персональных данных"
              id={FIELDS.CONFIRM_SEND_PERSONAL_INFO}
            />
            <CheckboxField
              label={
                <>
                  Я согласен c{" "}
                  <span className="underline cursor-pointer">
                    правилами сервиса
                  </span>
                </>
              }
              id={FIELDS.CONFIRM_READ_RULES}
            />
          </div>

          {backendErrorMsg && <BackendErrors errorMsg={backendErrorMsg} />}

          <div className="flex justify-end items-center gap-2">
            <Button
              size="large"
              onClick={handleGoToLogin}
              className="text-gray-400"
            >
              Войти
            </Button>
            <Button
              type="submit"
              variant="filled"
              color="secondary"
              size="large"
            >
              {loading ? (
                <Spinner className="h-6 w-6 text-gray-500" />
              ) : (
                "Зарегистрироваться"
              )}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default RegisterForm;
