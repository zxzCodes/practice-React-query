import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useCreateCommentMutation } from "./use-comments-hooks";
import { toast } from "sonner";
import { useCreateCommentMutationOptimistic } from "./use-comments-hook-opti";

export function CommentForm() {
  const [commentText, setCommentText] = useState("");

  const mutation = useCreateCommentMutationOptimistic()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!commentText.trim()) return; // Prevent empty comments from being submitted 

    mutation.mutate(
      { text: commentText },
      {
        onSuccess: () => {
          setCommentText("");
          toast.success("Comment added successfully!");
        },
        onError: (error) => {
          // Handle error if needed
          toast.error(`Error adding comment: ${error.message}`);
        },
      }
    
    
    
    );

  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
      <Input
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="Add a comment..."
        className="flex-1"
        disabled={mutation.isPending}
      />
      <Button type="submit" disabled={!commentText.trim() || mutation.isPending}>
      {
        mutation.isPending ? "Posting..." : "Post"
      }
      </Button>
    </form>
  );
}
