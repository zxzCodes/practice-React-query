import { fetchData, postData } from "@/lib/fetch-utils";
import {   InfiniteData, QueryKey, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CommentsResponse } from "../api/comments/route";
import { Comment } from "../api/comments/data";
const queryKey:QueryKey = ["comments"]

export function useCommentsQuery() {
  return useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) =>
      fetchData<CommentsResponse>(
        `/api/comments?${pageParam ? `cursor=${pageParam}` : ""}`
      ),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
}

export function useCreateCommentMutation() {

    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (newComment:{text:string}) => postData<{comment:Comment}>("/api/comments", newComment),
        onSuccess: async ({comment}) => {
            await queryClient.cancelQueries({queryKey})
            queryClient.setQueryData<InfiniteData<CommentsResponse>>(queryKey,
                oldData => {
                    if (!oldData) return oldData
                    const newPage = {
                        ...oldData.pages[0],
                        comments: [comment, ...oldData.pages[0].comments]
                    } // Add the new comment to the first page
                    return {
                        ...oldData,
                        pages: [newPage, ...oldData.pages.slice(1)]
                    } // Update the first page with the new comment
                }
            )
          
        }

    });
    
    
}