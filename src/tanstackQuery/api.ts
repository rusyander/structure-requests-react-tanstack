import { useRef, useMemo } from "react";

export type ApiRequestConfig = import("axios").AxiosRequestConfig;

export type RequestConfig<Params = undefined> = Params extends undefined
  ? { config?: ApiRequestConfig }
  : { params: Params; config?: ApiRequestConfig };

export interface QuerySettings<Func = unknown> {
  page?: number;
  limit?: number;
  id?: number;
  config?: ApiRequestConfig;
  options?: Omit<
    import("@tanstack/react-query").UseQueryOptions<
      Awaited<ReturnType<Func>>,
      any,
      Awaited<ReturnType<Func>>,
      any
    >,
    "queryKey"
  >;
}

export interface MutationSettings<Params = void, Func = unknown> {
  config?: ApiRequestConfig;
  options?: import("@tanstack/react-query").UseMutationOptions<
    Awaited<ReturnType<Func>>,
    any,
    Params,
    any
  >;
}

export interface QueryParamsProps {
  page: number;
  limit: number;
}

export const useQueryString = (): QueryParamsProps => {
  const queryString = window.location.search;

  const queryParamsRef = useRef({});

  useMemo(() => {
    const params = new URLSearchParams(queryString);
    const paramsObject: Record<string, string> = {};

    for (const [key, value] of params.entries()) {
      paramsObject[key.replace("_", "")] = value;
    }

    queryParamsRef.current = paramsObject;
  }, [queryString]);

  return queryParamsRef.current as QueryParamsProps;
};

export function getQueryParams(params: Record<string, string>) {
  const searchParams = new URLSearchParams(window.location.search);
  Object.entries(params).forEach(([name, value]) => {
    if (value) {
      searchParams.set(name, value);
    }
  });
  return `?${searchParams.toString()}`;
}

// Функция добавляет параметры в url
export function addQueryParams(params: Record<string, string>) {
  window.history.pushState(null, "", getQueryParams(params));
}
