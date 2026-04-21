import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getAllPostsWithPaginationFn } from "@/lib/posts"
import { createFileRoute, Link } from "@tanstack/react-router"
import { z } from "zod"

const searchParamsSchema = z.object({
  page: z.number().catch(1),
})
export const Route = createFileRoute("/posts/")({
  loaderDeps: ({ search: page }) => page,
  loader: async ({ deps: { page } }) =>
    getAllPostsWithPaginationFn({ data: { page } }),
  validateSearch: searchParamsSchema,
  component: PostsListPage,
})

function PostsListPage() {
  const { posts, pagination } = Route.useLoaderData()

  return (
    <div className="mx-auto max-w-3xl p-6">
      {posts.length === 0 ? (
        <p className="text-muted-foreground">No posts yet.</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Link
              key={post.id}
              to="/posts/$postId"
              params={{ postId: post.id }}
            >
              <Card className="transition-colors hover:bg-accent/50">
                <CardHeader>
                  <CardTitle>{post.title}</CardTitle>
                  <CardDescription>
                    By {post.author_email} &middot;{" "}
                    {new Date(post.created_at).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
      {pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <Button variant="outline" asChild>
            <Link
              to="/posts"
              search={{ page: pagination.page - 1 }}
            >
              Previous
            </Link>
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            disabled={pagination.page >= pagination.totalPages}
            asChild
          >
            <Link
              to="/posts"
              search={{ page: pagination.page + 1 }}
            >
              Next
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}
