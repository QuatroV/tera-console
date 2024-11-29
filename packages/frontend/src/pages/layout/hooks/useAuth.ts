import { setAuthenticated, setUser, setWaitForAuth } from "@/store/auth";
import trpc from "@/utils/api";
import { useAppDispatch } from "@/utils/redux";
import { useEffect } from "react";

const CANT_GET_USER_INFO_ERROR_TEXT = "Can't get user info";

/**
 * Пытаемся по access токену получить инфу по пользователю, если не получается - обновляем access токен и пробуем еще раз
 */
const useAuth = () => {
  const dispatch = useAppDispatch();

  const tryGetUserInfo = async () => {
    const response = await trpc.user.getMe.query();

    if (response.data.user) {
      dispatch(setAuthenticated(true));
      dispatch(setUser(response.data.user));
    } else {
      throw new Error(CANT_GET_USER_INFO_ERROR_TEXT);
    }
  };

  const tryWithRefreshAccessToken = async () => {
    await trpc.auth.refreshAccessToken.mutate();

    try {
      await tryGetUserInfo();
    } catch (e) {
      dispatch(setAuthenticated(false));
    }
  };

  useEffect(() => {
    const apiUserGetMe = async () => {
      try {
        await tryGetUserInfo();
      } catch (e) {
        if (
          e instanceof Error &&
          e.message.includes(CANT_GET_USER_INFO_ERROR_TEXT)
        ) {
          await tryWithRefreshAccessToken();
        } else {
          setAuthenticated(false);
        }
      } finally {
        dispatch(setWaitForAuth(false));
      }
    };
    apiUserGetMe();
  }, []);
};

export default useAuth;
