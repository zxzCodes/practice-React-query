'use client';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";




export default  function ReactQueryProvider({
    children
}:Readonly<{ children: React.ReactNode }>) {
   const [queyClient] = useState(() => new QueryClient()); // useState is used to create a single instance of QueryClient

   return (
    <QueryClientProvider client={queyClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
   )

}