import { api } from "@/api/axios/instance";
import { addQueryParams, QuerySettings, RequestConfig } from "./api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

interface ProjectsProps {
  id: number;
  name: string;
}

export interface PaginationProps {
  projects?: ProjectsProps[];
  page: number;
  limit: number;
}

type PaginationRequestConfig = RequestConfig<PaginationProps>; // requestConfig?: GetTodosRequestConfig

const getProjects = (requestConfig?: PaginationRequestConfig) => {
  addQueryParams({
    _page: String(requestConfig?.params.page),
    _limit: String(requestConfig?.params.limit),
  });
  return api.get<ProjectsProps[]>(
    `projects?_page=${requestConfig?.params.page}&_limit=${requestConfig?.params.limit}`,
    requestConfig?.config
  );
};

export const useGetProjects = (settings: QuerySettings<typeof getProjects>) => {
  return useQuery({
    queryKey: ["getProjects", settings.page, settings.limit],
    queryFn: () =>
      getProjects({
        params: { page: settings.page!, limit: settings.limit! },
        config: settings.config,
      }),
    ...settings.options,
    placeholderData: keepPreviousData,
  });
};

// const getProjects = (page: number) =>
//   api.get<ProjectsProps[]>(`projects?_page=${page}&_limit=3`);

// export function useGetProjects(page: number) {
//   return useQuery({
//     queryKey: ["projects", { page }],
//     queryFn: () => getProjects(page),
//     placeholderData: keepPreviousData,
//   });
// }
