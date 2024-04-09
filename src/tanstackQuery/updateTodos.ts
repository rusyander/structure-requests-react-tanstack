import { MutationSettings, RequestConfig } from "./api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/axios/instance";

export interface UpdateTodosProps {
  id: number;
  title: string;
  description: string;
  checked: boolean;
}

type UpdateTodosRequestConfig = RequestConfig<UpdateTodosProps>;

const updateTodos = ({ params, config }: UpdateTodosRequestConfig) =>
  api.put<UpdateTodosProps>(`todos/${params.id}`, params, config);

export const useUpdateTodosMutation = (
  settings?: MutationSettings<UpdateTodosRequestConfig, typeof updateTodos>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateTodos"],
    mutationFn: ({ params, config }) =>
      updateTodos({ params, config: { ...settings?.config, ...config } }),
    ...settings?.options,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getTodos"] });
    },
  });
};
