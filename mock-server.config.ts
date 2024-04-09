import type { MockServerConfig } from "mock-config-server";

const DATABASE = [
  {
    id: 6,
    title: "title6",
    description: "desc6",
    checked: true,
  },
  {
    id: 0.19499048848154277,
    title: "1",
    description: "1",
    checked: true,
  },
  {
    id: 0.4109820596187579,
    title: "12",
    description: "12",
    checked: false,
  },
];

const mockServerConfig: MockServerConfig = {
  baseUrl: "/api",
  interceptors: {
    request: ({ setDelay }) => setDelay(1000),
  },
  rest: {
    configs: [
      {
        method: "get",
        path: "/todos",
        routes: [
          {
            data: DATABASE,
          },
        ],
      },
      {
        method: "post",
        path: "/todos",
        interceptors: {
          response: (_, { request }) => {
            const { body } = request;
            // const email = DATABASE.otps.find(({ value }) => body.email === value);

            // if (email && email.endTime > Date.now()) {
            //   return { retryDelay: email.endTime - Date.now() };
            // }

            // if (email && email.endTime < Date.now()) {
            //   DATABASE.otps = DATABASE.otps.filter(({ value }) => value !== body.email);
            // }

            DATABASE.push({
              id: Math.random(),
              title: body.title,
              description: body.description,
              checked: false,
            });

            return { success: true };
          },
        },
        routes: [
          {
            data: { success: true },
          },
        ],
      },
      {
        method: "delete",
        path: "/todos/:id",
        interceptors: {
          response: (_, { request }) => {
            const id = request.originalUrl.split("/").at(-1);

            // DATABASE = DATABASE.filter((todo) => todo.id !==  Number(id));

            const index = DATABASE.findIndex((todo) => todo.id === Number(id));

            DATABASE.splice(index, 1);

            return { success: true };
          },
        },
        routes: [
          {
            data: { success: true },
          },
        ],
      },
      {
        method: "put",
        path: "/todos/:id",
        interceptors: {
          response: (_, { request }) => {
            const { body } = request;

            const index = DATABASE.findIndex((todo) => todo.id === body.id);
            DATABASE[index] = body;

            return { success: true };
          },
        },
        routes: [
          {
            data: { success: true },
          },
        ],
      },

      // {
      //   method: 'get',
      //   path: '/users/:id',
      //   routes: [
      //     {
      //       data: { id: 1, emoji: '🎉' }
      //     },
      //     {
      //       data: { id: 2, emoji: '🔥' },
      //       entities: {
      //         params: {
      //           id: 2
      //         }
      //       }
      //     }
      //   ]
      // },
      // {
      //   method: 'post',
      //   path: '/users',
      //   routes: [
      //     {
      //       data: { id: 3, emoji: '🍕' }
      //     }
      //   ]
      // },
      // {
      //   method: 'get',
      //   path: '/posts',
      //   routes: [
      //     {
      //       data: [{ text: 'Post 1' }, { text: 'Post 2' }]
      //     }
      //   ]
      // }
    ],
  },
};

export default mockServerConfig;
