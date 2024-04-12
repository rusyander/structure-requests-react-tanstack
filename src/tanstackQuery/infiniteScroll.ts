import { api } from "@/api/axios/instance";
import { QuerySettings, RequestConfig } from "./api";
import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";

interface ProductsProps {
  id: number;
  name: string;
}

export interface InfiniteScrollProps {
  products?: ProductsProps[];
}

type GetProductsRequestConfig = RequestConfig<InfiniteScrollProps>;

const getProducts = (
  { pageParam }: { pageParam: number },
  requestConfig?: GetProductsRequestConfig
) =>
  api.get<ProductsProps[]>(
    `products?_page=${pageParam + 1}&_limit=3`,
    requestConfig?.config
  );

export const useGetProducts = () => {
  return useInfiniteQuery({
    queryKey: ["getProducts"],
    queryFn: getProducts,

    initialPageParam: 0,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (lastPage.data.length === 0) {
        return undefined;
      }
      return lastPageParam + 1;
    },
    getPreviousPageParam: (_, __, firstPageParam) => {
      if (firstPageParam <= 1) {
        return undefined;
      }
      return firstPageParam - 1;
    },
  });
};

// ************************************************************************************************

// export const getProduct = async (id: number) => {
//   return await api.get<ProductsProps>(`products/${id}`);
// };

// export function useGetProduct(id: number | null) {
//   const queryClient = useQueryClient();

//   return useQuery({
//     queryKey: ["product", { id }],
//     queryFn: () => getProduct(id!),
//     enabled: !!id,
//     // placeholderData: () => {
//     //   const cachedProducts = (
//     //     queryClient.getQueryData(["getProducts"]) as {
//     //       pages: ProductsProps[] | undefined;
//     //     }
//     //   )?.pages?.flat(2);

//     //   if (cachedProducts) {
//     //     return cachedProducts.find((item) => item.id === id);
//     //   }
//     // },
//     placeholderData: keepPreviousData,
//   });
// }

export interface ProductProps {
  id: number;
  name: string;
}

export interface ProductDataProps {
  projects?: ProductProps[];
  id: number | null;
}

type ProductRequestConfig = RequestConfig<ProductDataProps>;

export const getProduct = (requestConfig?: ProductRequestConfig) => {
  return api.get<ProductProps>(
    `products/${requestConfig?.params?.id}`,
    requestConfig?.config
  );
};

export const useGetProduct = (settings: QuerySettings<typeof getProduct>) => {
  console.log("settings.id", settings.id);

  return useQuery({
    queryKey: ["product", settings?.id],
    queryFn: () =>
      getProduct({
        params: { id: settings.id! },
        config: settings.config,
      }),
    ...settings.options,

    enabled: !!settings.id,
    placeholderData: keepPreviousData,
  });
};
