import { useRouter } from "next/router";
import { useMemo, useCallback } from "react";
import { useSessionProvider } from "@/providers/useSessionProvider";

interface BaseParams {
  headersParams?: object;
  ignoreAuth?: boolean;
  ignoreRefresh?: boolean;
}

interface PostParams extends BaseParams {
  body: unknown;
}

const excludeAuthPath = ["login", "register"];
const isPathHaveAuth = (url: string): boolean => {
  const paths = url.split("/");
  for (let i = 0; i < excludeAuthPath.length; i++) {
    if (paths.includes(excludeAuthPath[i])) return false;
  }
  return true;
};

const useApi = (url: string) => {
  const { fetchNewAccessToken } = useSessionProvider();

  const getMethod = useCallback(
    async <T>(params?: BaseParams) => {
      const token = document.cookie.split(";")?.[0]?.split("=")?.[1];
      if (isPathHaveAuth(url) && !token && !params?.ignoreAuth) return;
      const dataFetch = async function () {
        const data = await fetch(url, {
          method: "GET",
          headers: new Headers({
            ...(isPathHaveAuth(url) && {
              authorization: `Bearer ${token}`,
            }),
            ...params?.headersParams,
          }),
        });
        const result = await data.json();
        return result as { data: T; message?: string };
      };
      const result = await dataFetch();
      if (result.message === "Unauthorized" && !params?.ignoreRefresh) {
        await fetchNewAccessToken();
        return await dataFetch();
      }
      return result;
    },
    [fetchNewAccessToken, url]
  );

  const postMethod = useCallback(
    async <T>(params?: PostParams) => {
      const token = document.cookie.split(";")?.[0]?.split("=")?.[1];
      if (isPathHaveAuth(url) && !token && !params?.ignoreAuth) return;
      const dataFetch = async function () {
        const data = await fetch(url, {
          method: "POST",
          headers: new Headers({
            ...(isPathHaveAuth(url) && {
              authorization: `Bearer ${token}`,
            }),
            ...params?.headersParams,
          }),
          body: JSON.stringify(params?.body),
        });
        const result = await data.json();
        return result as { data: T; message?: string };
      };
      const result = await dataFetch();
      if (result.message === "Unauthorized" && !params?.ignoreRefresh) {
        await fetchNewAccessToken();
        return await dataFetch();
      }
      return result;
    },
    [fetchNewAccessToken, url]
  );

  const putMethod = useCallback(
    async <T>(params?: PostParams) => {
      const token = document.cookie.split(";")?.[0]?.split("=")?.[1];
      if (isPathHaveAuth(url) && !token && !params?.ignoreAuth) return;
      const dataFetch = async function () {
        const data = await fetch(url, {
          method: "PUT",
          headers: new Headers({
            ...(isPathHaveAuth(url) && {
              authorization: `Bearer ${token}`,
            }),
            ...params?.headersParams,
          }),
          body: JSON.stringify(params?.body),
        });
        const result = await data.json();
        return result as { data: T; message?: string };
      };
      const result = await dataFetch();
      if (result.message === "Unauthorized" && !params?.ignoreRefresh) {
        await fetchNewAccessToken();
        return await dataFetch();
      }
      return result;
    },
    [fetchNewAccessToken, url]
  );

  const patchMethod = useCallback(() => {}, []);

  const deleteMethod = useCallback(() => {}, []);

  return useMemo(
    () => ({
      getMethod,
      postMethod,
      putMethod,
      patchMethod,
      deleteMethod,
    }),
    [deleteMethod, getMethod, patchMethod, postMethod, putMethod]
  );
};

export default useApi;
``;
