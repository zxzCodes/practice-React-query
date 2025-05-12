import { fetchData } from "@/lib/fetch-utils";
import { useEffect, useState } from "react";
import { Post } from "../api/posts/data";

export default function FetchWithUseEffect({ category }: { category: string }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    let ignore = false;
    setIsLoading(true);

    async function fetchPosts() {
      try {
        const data = await fetchData<Post[]>(`/api/posts?category=${category}`);
        if(!ignore) {
          setPosts(data);
          setError(undefined); // Clear error if data is fetched successfully
        } // Check if the component is still mounted before updating state 
        
      } catch (error) {
       
        if(!ignore) {
          console.error("Fetch error:", error);
          setError("Failed to fetch posts");
          
        } // Handle the error here 

        return () => {
          ignore = true;
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchPosts();
  }, [category]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">
        {category.charAt(0).toUpperCase() + category.slice(1)} Posts
      </h2>

      <div>
        {isLoading ? (
          <div className="mb-4 text-blue-500">Loading posts...</div>
        ) : (
          <>
            {error && <div className="mb-4 text-red-500">Error: {error}</div>}

            {posts.length === 0 && !error && (
              <div className="mb-4">No posts found for this category.</div>
            )}

            {posts.length > 0 && (
              <ul className="space-y-4">
                {posts.map((post) => (
                  <li key={post.id} className="border p-3 rounded">
                    <h3 className="font-semibold">{post.title}</h3>
                    <p>{post.body}</p>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
}
