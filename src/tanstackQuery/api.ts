export type ApiRequestConfig = import("axios").AxiosRequestConfig;

export type RequestConfig<Params = undefined> = Params extends undefined
  ? { config?: ApiRequestConfig }
  : { params: Params; config?: ApiRequestConfig };

export interface QuerySettings<Func = unknown> {
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
