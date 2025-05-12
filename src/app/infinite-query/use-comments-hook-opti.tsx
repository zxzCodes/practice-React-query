import { postData } from "@/lib/fetch-utils";
import { InfiniteData, QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { CommentsResponse } from "../api/comments/route";
import { Comment } from "../api/comments/data";

const queryKey:QueryKey = ["comments"]

export function useCreateCommentMutationOptimistic() {

    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (newComment:{text:string}) => postData<{comment:Comment}>("/api/comments", newComment),
    onMutate: async (newComment) => {

        await queryClient.cancelQueries({queryKey})

        const previousData = queryClient.getQueryData<InfiniteData<CommentsResponse, number| undefined>>(queryKey)

        const optimisticComment:Comment = {
            id: Date.now(),
            text: newComment.text,
            createdAt: new Date().toISOString(), // Use current date as createdAt 
            user: {
                name: "zxz",
                avatar: "ZX",
            },
        }
        await queryClient.cancelQueries({queryKey})
                    queryClient.setQueryData<InfiniteData<CommentsResponse>>(queryKey,
                        oldData => {
                            if (!oldData) return oldData
                            const newPage = {
                                ...oldData.pages[0],
                                comments: [optimisticComment, ...oldData.pages[0].comments]
                            } // Add the new comment to the first page
                            return {
                                ...oldData,
                                pages: [newPage, ...oldData.pages.slice(1)]
                            } // Update the first page with the new comment
                        }
                    )

        return { previousData } // Return the previous data and the optimistic comment




    },

    onError: (error, newComment, context) => {
        // Rollback to the previous data
        queryClient.setQueryData<InfiniteData<CommentsResponse>>(queryKey, context?.previousData)
    }
    

    });
    
    
}