import { api } from "@/api/axios/instance";
import { useQuery } from "@tanstack/react-query";
import { QuerySettings, RequestConfig } from "./api";

export interface TodosProps {
  id: number;
  title: string;
  description: string;
  checked: boolean;
}

export type GetTodosRequestConfig = RequestConfig | void;

const getTodos = (requestConfig?: GetTodosRequestConfig) =>
  api.get<TodosProps[]>("todos", requestConfig?.config);

export const useGetTodos = (settings?: QuerySettings<typeof getTodos>) => {
  console.log("settings?.config", settings?.config);

  return useQuery({
    queryKey: ["getTodos"],
    queryFn: () => getTodos({ config: settings?.config }),
    ...settings?.options,
  });
};
