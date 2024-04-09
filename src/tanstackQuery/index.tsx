import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useGetTodos } from "./getTodos";
import { usePostTodosMutation } from "./postTodos";

const GetTodosComp = () => {
  const queryClient = useQueryClient();

  let getTodosQuery = useGetTodos();
  //   console.log(getTodosQuery);

  const todos = getTodosQuery.data?.data;

  console.log(todos);

  return (
    <>
      <button
        onClick={async () => {
          await queryClient.invalidateQueries({ queryKey: ["getTodos"] });
        }}
      >
        getTodos
      </button>
      <ul>
        {todos?.map((todo) => (
          <li key={todo.id}>
            <h2>{todo.title}</h2>
            <p>{todo.description}</p>
            <input type="checkbox" checked={todo.checked} />
          </li>
        ))}
      </ul>
    </>
  );
};

const PostTodosComp = () => {
  const queryClient = useQueryClient();
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");

  const postTodosMutation = usePostTodosMutation();

  const submit = async () => {
    if (!title || !description)
      return console.log("title or description is empty");
    // postTodosMutation.mutate({
    //   params: {
    //     title,
    //     description,
    //     checked: false,
    //     id: Math.random(),
    //   },
    // });

    await postTodosMutation.mutateAsync({
      params: {
        title,
        description,
        checked: false,
        id: Math.random(),
      },
    });
    console.log("postTodosMutation", postTodosMutation);
    postTodosMutation.isSuccess &&
      queryClient.fetchQuery({ queryKey: ["getTodos"] });

    // queryClient.invalidateQueries("getTodos");
  };

  return (
    <div>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button onClick={submit}>submit</button>
    </div>
  );
};

export default function Index() {
  return (
    <div>
      <h1>Todos</h1>
      <PostTodosComp />
      <GetTodosComp />
    </div>
  );
}
