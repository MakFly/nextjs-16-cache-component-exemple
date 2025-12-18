"use client"

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
  type QueryKey,
} from "@tanstack/react-query"
import { api } from "../client"
import { ApiException, type RequestConfig } from "../types"

// ============================================
// Query Hook Factory
// ============================================

interface UseApiQueryOptions<TData>
  extends Omit<UseQueryOptions<TData, ApiException>, "queryKey" | "queryFn"> {
  /** API endpoint to fetch */
  endpoint: string
  /** Additional request configuration */
  requestConfig?: RequestConfig
}

/**
 * Hook for GET requests with TanStack Query integration
 *
 * @example
 * const { data, isLoading } = useApiQuery(['posts'], {
 *   endpoint: '/posts',
 * })
 */
export function useApiQuery<TData>(
  queryKey: QueryKey,
  { endpoint, requestConfig, ...options }: UseApiQueryOptions<TData>
) {
  return useQuery<TData, ApiException>({
    queryKey,
    queryFn: () => api.get<TData>(endpoint, requestConfig),
    ...options,
  })
}

// ============================================
// Mutation Hook Factory
// ============================================

interface UseApiMutationOptions<TData, TVariables>
  extends Omit<UseMutationOptions<TData, ApiException, TVariables>, "mutationFn"> {
  /** API endpoint (can be a function for dynamic endpoints) */
  endpoint: string | ((variables: TVariables) => string)
  /** HTTP method (default: POST) */
  method?: "POST" | "PUT" | "PATCH" | "DELETE"
  /** Additional request configuration */
  requestConfig?: RequestConfig
  /** Query keys to invalidate on success */
  invalidateKeys?: QueryKey[]
}

/**
 * Hook for mutations (POST, PUT, PATCH, DELETE) with TanStack Query integration
 *
 * @example
 * const createPost = useApiMutation<Post, CreatePostData>({
 *   endpoint: '/posts',
 *   method: 'POST',
 *   invalidateKeys: [['posts']],
 * })
 *
 * createPost.mutate({ title: 'New Post', body: 'Content' })
 */
export function useApiMutation<TData, TVariables = void>(
  options: UseApiMutationOptions<TData, TVariables>
) {
  const queryClient = useQueryClient()
  const {
    endpoint,
    method = "POST",
    requestConfig,
    invalidateKeys,
    ...mutationOptions
  } = options

  return useMutation<TData, ApiException, TVariables>({
    mutationFn: async (variables: TVariables) => {
      const url =
        typeof endpoint === "function" ? endpoint(variables) : endpoint

      switch (method) {
        case "DELETE":
          return api.delete<TData>(url, requestConfig)
        case "PUT":
          return api.put<TData>(url, variables, requestConfig)
        case "PATCH":
          return api.patch<TData>(url, variables, requestConfig)
        default:
          return api.post<TData>(url, variables, requestConfig)
      }
    },
    onSettled: () => {
      // Invalidate related queries on success or error
      invalidateKeys?.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key })
      })
    },
    ...mutationOptions,
  })
}

// ============================================
// Optimistic Mutation Hook
// ============================================

interface UseOptimisticMutationOptions<TData, TVariables, TContext = unknown>
  extends UseApiMutationOptions<TData, TVariables> {
  /** Query key for the data being optimistically updated */
  optimisticQueryKey: QueryKey
  /** Function to compute optimistic data */
  getOptimisticData: (
    variables: TVariables,
    previousData: TData | undefined
  ) => TData
}

/**
 * Hook for mutations with built-in optimistic updates
 *
 * @example
 * const deletePost = useOptimisticMutation<Post[], number>({
 *   endpoint: (id) => `/posts/${id}`,
 *   method: 'DELETE',
 *   optimisticQueryKey: ['posts'],
 *   getOptimisticData: (deletedId, posts) =>
 *     posts?.filter(p => p.id !== deletedId) ?? [],
 * })
 */
export function useOptimisticMutation<TData, TVariables, TContext = { previousData: TData | undefined }>(
  options: UseOptimisticMutationOptions<TData, TVariables, TContext>
) {
  const queryClient = useQueryClient()
  const { optimisticQueryKey, getOptimisticData, ...mutationOptions } = options

  return useApiMutation<TData, TVariables>({
    ...mutationOptions,
    onMutate: async (variables) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: optimisticQueryKey })

      // Snapshot previous value
      const previousData = queryClient.getQueryData<TData>(optimisticQueryKey)

      // Optimistically update
      queryClient.setQueryData<TData>(
        optimisticQueryKey,
        getOptimisticData(variables, previousData)
      )

      return { previousData } as TContext
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context && "previousData" in (context as object)) {
        queryClient.setQueryData(
          optimisticQueryKey,
          (context as { previousData: TData }).previousData
        )
      }
    },
  })
}
