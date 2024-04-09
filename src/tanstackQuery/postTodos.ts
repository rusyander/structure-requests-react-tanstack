import { api } from "@/api/axios/instance";
import { MutationSettings, RequestConfig } from "./api";
import { useMutation } from "@tanstack/react-query";

export interface TodosProps {
  id: number;
  title: string;
  description: string;
  checked: boolean;
}

export type PostTodosRequestConfig = RequestConfig<TodosProps>;

const postTodos = ({ params, config }: PostTodosRequestConfig) =>
  api.post<TodosProps>("todos", params, config);

export const usePostTodosMutation = (
  settings?: MutationSettings<PostTodosRequestConfig, typeof postTodos>
) =>
  useMutation({
    mutationKey: ["postTodos"],
    mutationFn: ({ params, config }) =>
      postTodos({ params, config: { ...settings?.config, ...config } }),
    ...settings?.options,
  });
