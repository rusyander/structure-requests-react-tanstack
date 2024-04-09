import React, { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { TodosProps, useGetTodos } from "./getTodos";
import { usePostTodosMutation } from "./postTodos";
import { useDeleteTodosMutation } from "./deleteTodos";
import { useUpdateTodosMutation } from "./updateTodos";

const TodosList: React.FC<TodosProps> = ({
  checked,
  description,
  id,
  title,
}) => {
  const [isSelected, setIsSelected] = React.useState(checked);
  const deleteTodosMutation = useDeleteTodosMutation();

  const deleteTodos = () => {
    deleteTodosMutation.mutate({
      params: {
        id,
      },
    });
  };
  const updateTodosMutation = useUpdateTodosMutation();

  const updateTodos = () => {
    updateTodosMutation.mutate({
      params: { id, title, description, checked: isSelected },
    });
  };

  const handleSelect = () => {
    setIsSelected(checked === true ? false : true);

    // updateTodos();
  };

  useEffect(() => {
    console.log("work useEffect");

    updateTodos();
  }, [isSelected]);

  return (
    <li className="flex">
      {String(isSelected)}
      <h2>{title}</h2>
      <h3>{id}</h3>
      <p>{description}</p>
      <input type="checkbox" checked={isSelected} onChange={handleSelect} />
      <button onClick={deleteTodos}>delete</button>
    </li>
  );
};

const GetTodosComp = () => {
  const queryClient = useQueryClient();
  const getTodosQuery = useGetTodos();
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
      <ul>{todos?.map((todo) => <TodosList key={todo.id} {...todo} />)}</ul>
    </>
  );
};

const PostTodosComp = () => {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");

  const postTodosMutation = usePostTodosMutation();

  const submit = async () => {
    if (!title || !description)
      return console.log("title or description is empty");
    postTodosMutation.mutate({
      params: {
        title,
        description,
        checked: false,
        id: Math.random(),
      },
    });

    // console.log("postTodosMutation", postTodosMutation);
  };

  return (
    <div className="flex">
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
    <>
      <h1>Todos</h1>
      <PostTodosComp />
      <GetTodosComp />
    </>
  );
}
