import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { PAGES } from "@/router/constants";
import trpc from "@/utils/api";
import { setAuthenticated, setUser } from "@/store/auth";
import { useAppDispatch } from "@/utils/redux";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [message, setMessage] = useState("Подтверждение электронной почты...");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );

  useEffect(() => {
    const verifyEmail = async () => {
      const id = searchParams.get("id");
      const token = searchParams.get("token");

      if (id && token) {
        try {
          await trpc.auth.verifyEmail.mutate({ id, token });

          setMessage("Электронная почта успешно подтверждена!");
          setStatus("success");

          // Получаем информацию о пользователе
          const response = await trpc.user.getMe.query();

          if (response.data.user) {
            // Обновляем состояние аутентификации в Redux
            dispatch(setAuthenticated(true));
            dispatch(setUser(response.data.user));
          }

          setTimeout(() => navigate(PAGES.WELCOME.path), 3000);
        } catch (error: unknown) {
          if (error instanceof Error) {
            setMessage(error.message);
          } else {
            setMessage("Ошибка при подтверждении почты.");
          }
          setStatus("error");
        }
      } else {
        setMessage("Неверная ссылка подтверждения.");
        setStatus("error");
      }
    };

    verifyEmail();
  }, [searchParams]);

  return (
    <div>
      <h2>{message}</h2>
      {status === "loading" && <p>Пожалуйста, подождите...</p>}
      {status === "success" && (
        <p>Вы будете перенаправлены на главную страницу.</p>
      )}
      {status === "error" && (
        <div>
          <p>Проверьте правильность ссылки или запросите новое письмо.</p>
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;
