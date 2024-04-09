import React from "react";

// import * as axios from "./api/axios/requests";
// import * as fetch from "./api/fetch/requests";
// import * as ky from "./api/ky/requests";
import Index from "./tanstackQuery";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const ReactQueryDevtoolsProduction = React.lazy(() =>
  import("@tanstack/react-query-devtools/build/modern/production.js").then(
    (d) => ({
      default: d.ReactQueryDevtools,
    })
  )
);

function App() {
  // const [users, setUsers] = React.useState<User[]>([]);
  // const [loading, setLoading] = React.useState(true);

  // // omg wrong
  // React.useEffect(() => {
  //   setLoading(false);
  // }, [users.length]);

  const [showDevtools, setShowDevtools] = React.useState(false);

  React.useEffect(() => {
    // @ts-expect-error
    window.toggleDevtools = () => setShowDevtools((old) => !old);
  }, []);

  return (
    <>
      {/* <div>{loading ? "loading..." : JSON.stringify(users, null, 2)}</div>
      <button
        onClick={async () => {
          setLoading(true);
          const getUsersResponses = await Promise.all([
            axios.getUsers(),
            fetch.getUsers(),

            ky.getUsers(),
          ]);

          // setLoading(false);

          const [axiosGetUsersResponse] = getUsersResponses;

          setUsers(axiosGetUsersResponse.data);
        }}
        get users
      </button> */}
      <Index />
      <ReactQueryDevtools initialIsOpen />
      {showDevtools && (
        <React.Suspense fallback={null}>
          <ReactQueryDevtoolsProduction />
        </React.Suspense>
      )}
    </>
  );
}

export default App;
