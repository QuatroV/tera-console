/* eslint-disable react/prop-types */
import { useState } from "react";
import Button from "@/components/Button";
import {
  closeAuthModal,
  openRegisterModal,
  openRestorePasswordModal,
  setAuthenticated,
  setUser,
} from "@/store/auth";
import { useAppDispatch } from "@/utils/redux";
import InputField from "../InputField";
import { Form, Formik } from "formik";
import { FIELDS } from "./constants";
import { LoginFormValues } from "./types";
import { validate } from "./validation";
import trpc from "@/utils/api";
import BackendErrors from "../BackendErrors";
import Spinner from "@/components/Spinner";
import RememberMeCheckbox from "../RememberMeCheckbox";
import localStore from "@/utils/localStore";

const initialValues: LoginFormValues = {
  [FIELDS.EMAIL]: "",
  [FIELDS.PASSWORD]: "",
};

const LoginForm = () => {
  const [backendErrorMsg, setBackendErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(localStore.get("user") !== null);

  const dispatch = useAppDispatch();

  const handleGoToRegister: React.MouseEventHandler<HTMLButtonElement> = (
    e
  ) => {
    e.preventDefault();
    dispatch(openRegisterModal());
  };

  const handleGoToRestorePassword: React.MouseEventHandler<
    HTMLButtonElement
  > = (e) => {
    e.preventDefault();
    dispatch(openRestorePasswordModal());
  };

  const onSuccessSubmit = async (values: LoginFormValues) => {
    if (rememberMe) {
      localStore.set("user", values);
    } else {
      localStore.remove("user");
    }

    try {
      const response = await trpc.user.getMe.query();

      if (response.data.user) {
        dispatch(setAuthenticated(true));
        dispatch(setUser(response.data.user));
        dispatch(closeAuthModal());
      } else {
        throw new Error("Can't get user info");
      }
    } catch (e) {
      if (e instanceof Error) {
        setBackendErrorMsg(e.message);
      } else {
        console.error(e);
      }
    }
  };

  const onSubmit = async (values: LoginFormValues) => {
    try {
      setBackendErrorMsg("");
      setLoading(true);
      await trpc.auth.login.mutate({
        email: values[FIELDS.EMAIL],
        password: values[FIELDS.PASSWORD],
      });

      onSuccessSubmit(values);
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

  const formikProps = {
    initialValues,
    onSubmit,
    validate,
  };

  return (
    <Formik<LoginFormValues> {...formikProps}>
      {() => (
        <Form className="flex flex-col gap-3">
          <div className=" bg-gray-100 p-4 rounded-xl flex flex-col gap-3">
            <InputField
              label="E-mail:"
              id={FIELDS.EMAIL}
              placeholder="Ваш почтовый адрес..."
            />
            <InputField
              type="password"
              label="Пароль:"
              id={FIELDS.PASSWORD}
              placeholder="Пароль..."
            />

            <RememberMeCheckbox
              label="Запомнить меня на этом компьютере"
              checked={rememberMe}
              onClick={() => setRememberMe((prev) => !prev)}
            />

            <hr />

            <span
              onClick={handleGoToRestorePassword}
              className="text-xs text-gray-500 hover:underline cursor-pointer text-right"
            >
              Забыли пароль?
            </span>
          </div>

          {backendErrorMsg && <BackendErrors errorMsg={backendErrorMsg} />}

          <div className="flex justify-end items-center gap-2">
            <Button
              size="large"
              onClick={handleGoToRegister}
              className="text-gray-400"
            >
              Зарегистрироваться
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
                "Войти"
              )}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
