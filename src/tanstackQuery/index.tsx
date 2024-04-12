import React, { Fragment, useEffect, useState } from "react";
import { useMutationState, useQueryClient } from "@tanstack/react-query";
import { TodosProps, useGetTodos } from "./getTodos";
import { usePostTodosMutation } from "./postTodos";
import { useDeleteTodosMutation } from "./deleteTodos";
import { useUpdateTodosMutation } from "./updateTodos";
import { useGetProjects } from "./pagination";
import { useQueryString } from "./api";
import { useGetProduct, useGetProducts } from "./infiniteScroll";

const InfiniteScroll = () => {
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );

  const productsQuery = useGetProducts();
  const productQuery = useGetProduct({ id: selectedProductId! });
  console.log("render");

  // console.log("productsQuery----", productsQuery?.data?.pages[0].data);
  // console.log("productQuery********", productQuery?.data?.data);
  console.log(productsQuery?.data?.pages);

  return (
    <>
      <h1>InfiniteScroll</h1>
      {productsQuery?.data?.pages?.map((data, index) => (
        <Fragment key={index}>
          {data?.data.map((product) => (
            <Fragment key={product.id}>
              <button onClick={() => setSelectedProductId(product?.id)}>
                {product.name}
              </button>
              <br />
            </Fragment>
          ))}
        </Fragment>
      ))}

      <br />
      <div>
        <button
          onClick={() => productsQuery.fetchNextPage()}
          disabled={
            !productsQuery.hasNextPage || productsQuery.isFetchingNextPage
          }
        >
          {productsQuery.isFetchingNextPage
            ? "Loading more..."
            : productsQuery.hasNextPage
              ? "Load More"
              : "Nothing more to load"}
        </button>
      </div>
      <div>Selected product:</div>
      <h6>-{JSON.stringify(productQuery?.data?.data)}-</h6>
      <hr />
    </>
  );
};

const PaginationsExample: React.FC = () => {
  const queryParams = useQueryString();

  const currentPage =
    queryParams.page === 1 ? 1 : Number(queryParams.page ?? 1);
  const currentLimit = queryParams.limit === 5 ? 5 : Number(queryParams.limit);

  const [page, setPage] = React.useState<number>(currentPage);
  const [limit, setLimit] = React.useState<number>(currentLimit);

  const { data, isPlaceholderData, isFetching, isError, error, isPending } =
    useGetProjects({ page, limit });

  return (
    <div>
      {isPending ? (
        <div>loading...</div>
      ) : isError ? (
        <div>Error: {error.message}</div>
      ) : (
        <div>
          {data?.data.map((project) => <p key={project.id}>{project.name}</p>)}
        </div>
      )}
      <span>Current page: {page}</span>

      <button disabled={page === 1} onClick={() => setPage((old) => old - 1)}>
        Previous Page
      </button>
      <button
        onClick={() => {
          if (!isPlaceholderData) {
            setPage((old) => old + 1);
          }
        }}
        disabled={isPlaceholderData}
      >
        Next Page
      </button>
      {isFetching ? <span>LOADING...</span> : null}
    </div>
  );
};

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
    // console.log("work useEffect");

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
  // console.log(todos);

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

  const mutationKey = ["postTodos"];
  // queryClient.invalidateQueries({ queryKey: ["postTodos"] });
  // queryClient.setMutationDefaults({ mutationKey: ["postTodos"], options: { pa }})
  const data = useMutationState({
    // this mutation key needs to match the mutation key of the given mutation (see above)
    filters: { mutationKey },
    select: (mutation) => mutation.state.data,
  });

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

  const autoCreate = () => {
    console.log("data", data);
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
      <button onClick={autoCreate}>auto create</button>
    </div>
  );
};

export default function Index() {
  return (
    <>
      <h1>Todos</h1>
      <InfiniteScroll />
      <PaginationsExample />
      <PostTodosComp />
      <GetTodosComp />
    </>
  );
}
