import { api } from "@/api/axios/instance";
import { MutationSettings, RequestConfig } from "./api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface DeleteTodosProps {
  id: number;
  title?: string;
  description?: string;
  checked?: boolean;
}

type DeleteTodosRequestConfig = RequestConfig<DeleteTodosProps>;

const deleteTodos = ({ params, config }: DeleteTodosRequestConfig) =>
  api.delete<DeleteTodosProps>(`todos/${params.id}`, config);

export const useDeleteTodosMutation = (
  settings?: MutationSettings<DeleteTodosRequestConfig, typeof deleteTodos>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["deleteTodos"],
    mutationFn: ({ params, config }) =>
      deleteTodos({ params, config: { ...settings?.config, ...config } }),
    ...settings?.options,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getTodos"] });
    },
  });
};
