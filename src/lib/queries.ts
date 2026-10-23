import { queryOptions } from "@tanstack/react-query";
import { getProducts, getProduct, adminListProducts, adminListOrders } from "@/lib/store.functions";

export const productsQueryOptions = queryOptions({
  queryKey: ["products"],
  queryFn: () => getProducts(),
});

export const productQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["product", slug],
    queryFn: () => getProduct({ data: { slug } }),
  });

export const adminProductsQueryOptions = queryOptions({
  queryKey: ["admin-products"],
  queryFn: () => adminListProducts(),
});

export const adminOrdersQueryOptions = queryOptions({
  queryKey: ["admin-orders"],
  queryFn: () => adminListOrders(),
});

export const adminStatsQueryOptions = queryOptions({
  queryKey: ["admin-stats"],
  queryFn: () => adminListOrders(),
});
