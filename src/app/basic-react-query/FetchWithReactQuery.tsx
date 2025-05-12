import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { Post } from '../api/posts/data'
import { fetchData } from '@/lib/fetch-utils'

export default function FetchWithReactQuery(
{
    category
}:{category:string}
) {

    const {
        data:posts,
        isLoading,
        isError,
        error
    } = useQuery({
        queryKey:['posts',category],
        queryFn: async () =>  await fetchData<Post[]>(`/api/posts?category=${category}`)

    })

    return (
        <div>
             <h2 className="text-xl font-bold mb-4">
        {category.charAt(0).toUpperCase() + category.slice(1)} Posts
      </h2>

      {isLoading &&  <div className="mb-4 text-blue-500">Loading posts...</div>}


{isError && <div className="mb-4 text-red-500">Error: {error.message}</div>}

{posts?.length === 0 && !isError && !isLoading && (
              <div className="mb-4">No posts found for this category.</div>
            )}
    {posts && posts.length > 0 && (
              <ul className="space-y-4">
                {posts.map((post) => (
                  <li key={post.id} className="border p-3 rounded">
                    <h3 className="font-semibold">{post.title}</h3>
                    <p>{post.body}</p>
                  </li>
                ))}
              </ul>
            )}
        </div>
    )


 
}
