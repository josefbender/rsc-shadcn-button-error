import { Button } from "@/components/ui/button"
import { createFileRoute, Link } from "@tanstack/react-router"

export const Route = createFileRoute("/")({ component: App })

function App() {
  return (
    <div className="prose prose-invert p-6">
      <h1>Server Components</h1>
      <br />
      <br />
      <Button asChild>
        <Link to="/posts">Blog</Link>
      </Button>
    </div>
  )
}
