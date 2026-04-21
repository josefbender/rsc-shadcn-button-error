import { getPostComponentFn } from "@/lib/posts"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/posts/$postId")({
  component: PostPage,
  loader: ({ params }) => getPostComponentFn({ data: { id: params.postId } }),
})

function PostPage() {
  const PostComponent = Route.useLoaderData()
  return PostComponent
}
