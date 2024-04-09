import { api } from "@/api/axios/instance";
import { useQuery } from "@tanstack/react-query";
import { QuerySettings, RequestConfig } from "./api";

export interface TodosProps {
  id: number;
  title: string;
  description: string;
  checked: boolean;
}

type GetTodosRequestConfig = RequestConfig | void;

const getTodos = (requestConfig?: GetTodosRequestConfig) =>
  api.get<TodosProps[]>("todos", requestConfig?.config);

export const useGetTodos = (settings?: QuerySettings<typeof getTodos>) => {
  return useQuery({
    queryKey: ["getTodos"],
    queryFn: () => getTodos({ config: settings?.config }),
    ...settings?.options,
  });
};
