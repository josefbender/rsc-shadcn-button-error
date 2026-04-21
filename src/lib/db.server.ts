import { notFound } from "@tanstack/react-router";
import type { Post } from "./types";


const posts: Post[] = [
  {
    id: "getting-started-with-tanstack-router",
    title: "Getting Started with TanStack Router",
    author_email: "user-1@example.com",
    created_at: "2024-02-15T10:30:00Z",
    content: `## Introduction

TanStack Router is a **fully type-safe router** for React applications. It provides an incredible developer experience with features like nested layouts, search params validation, and automatic code-splitting.

## Installation

\`\`\`bash
npm install @tanstack/react-router
# or
pnpm add @tanstack/react-router
\`\`\`

## Defining Routes

Routes are defined using a file-based convention or programmatically. Here's a basic setup:

\`\`\`tsx
import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router'

const rootRoute = createRootRoute({
  component: () => <Outlet />,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => <h1>Home</h1>,
})

const router = createRouter({
  routeTree: rootRoute.addChildren([indexRoute]),
})
\`\`\`

## Key Features

- **Type-safe navigation** — TypeScript catches invalid routes at compile time
- **Nested layouts** — share UI between routes without re-rendering
- **Search param validation** — parse and validate query strings with Zod
- **Automatic code-splitting** — lazy-load route components out of the box
- **Devtools** — built-in inspector for inspecting route state

## Type-Safe Links

One of the biggest wins is that \`<Link>\` components are fully typed:

\`\`\`tsx
// TypeScript will error if '/poost' doesn't exist
<Link to="/posts/$postId" params={{ postId: '123' }}>
  View Post
</Link>
\`\`\`

## Search Params Validation

\`\`\`tsx
import { z } from 'zod'

const searchSchema = z.object({
  page: z.number().default(1),
  q: z.string().optional(),
})

const postsRoute = createRoute({
  validateSearch: searchSchema,
  component: PostsPage,
})
\`\`\`

## Next Steps

1. Set up the router in your app's entry point
2. Add the \`<RouterProvider>\` component
3. Explore nested routes for shared layouts
4. Integrate with TanStack Query for data fetching
`,
  },
  {
    id: "react-server-components-deep-dive",
    title: "React Server Components: A Deep Dive",
    author_email: "user-2@example.com",
    created_at: "2025-03-01T14:20:00Z",
    content: `## What Are Server Components?

React Server Components (RSC) represent a **paradigm shift** in how we build React applications. They render on the server and send the result to the client — without shipping their JavaScript.

## Server vs. Client Components

| Feature | Server Component | Client Component |
|---|---|---|
| Runs on | Server only | Client (browser) |
| Can use hooks | No | Yes |
| Can fetch data directly | Yes | No (needs API) |
| Adds to JS bundle | No | Yes |
| Can access backend | Yes | No |

## A Basic Server Component

\`\`\`tsx
// app/posts/page.tsx — no 'use client' = Server Component by default

async function PostsPage() {
  // Direct DB access, no API route needed
  const posts = await db.query('SELECT * FROM posts')

  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
\`\`\`

## Adding Interactivity with Client Components

\`\`\`tsx
'use client'

import { useState } from 'react'

export function LikeButton({ postId }: { postId: string }) {
  const [liked, setLiked] = useState(false)

  return (
    <button onClick={() => setLiked(l => !l)}>
      {liked ? '❤️ Liked' : '🤍 Like'}
    </button>
  )
}
\`\`\`

You can then **import client components into server components**:

\`\`\`tsx
import { LikeButton } from './LikeButton'

async function PostPage({ id }: { id: string }) {
  const post = await getPost(id)
  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <LikeButton postId={id} />
    </article>
  )
}
\`\`\`

## Mental Model

Think of the component tree as two layers:

1. **Server layer** — fetches data, renders static HTML, zero JS cost
2. **Client layer** — handles interactivity, lives in the browser

The boundary is created with \`'use client'\`. Everything above the boundary is a Server Component by default.

## Benefits

- **Smaller bundle size** — server-only code never ships to the browser
- **Faster initial load** — no client-side data waterfalls
- **Direct backend access** — query your DB or call internal APIs directly
- **Streaming** — send HTML progressively with \`<Suspense>\`

## Common Pitfalls

- You **cannot** use \`useState\` or \`useEffect\` in Server Components
- Server Components **cannot** be passed as props to Client Components (only their rendered output can)
- Client Components **cannot** import Server Components directly
`,
  },
  {
    id: "optimizing-data-fetching-with-tanstack-query",
    title: "Optimizing Data Fetching with TanStack Query",
    author_email: "user-3@example.com",
    created_at: "2024-03-08T09:15:00Z",
    content: `## Why TanStack Query?

Manual \`useEffect\`-based data fetching leads to bugs: race conditions, stale data, loading state mismanagement. **TanStack Query** solves all of this with a declarative API.

## Setup

\`\`\`bash
npm install @tanstack/react-query
\`\`\`

\`\`\`tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  )
}
\`\`\`

## Basic Query

\`\`\`tsx
import { useQuery } from '@tanstack/react-query'

function PostList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: () => fetch('/api/posts').then(r => r.json()),
  })

  if (isLoading) return <Spinner />
  if (error) return <ErrorMessage error={error} />

  return (
    <ul>
      {data.map(post => <li key={post.id}>{post.title}</li>)}
    </ul>
  )
}
\`\`\`

## Mutations

\`\`\`tsx
import { useMutation, useQueryClient } from '@tanstack/react-query'

function CreatePost() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (newPost) => fetch('/api/posts', {
      method: 'POST',
      body: JSON.stringify(newPost),
    }),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })

  return (
    <button onClick={() => mutation.mutate({ title: 'New Post' })}>
      Create Post
    </button>
  )
}
\`\`\`

## Key Concepts

### Query Keys

Query keys uniquely identify cached data. They can be strings, arrays, or objects:

\`\`\`ts
['posts']                    // All posts
['posts', { page: 2 }]      // Posts on page 2
['posts', postId]            // A single post
\`\`\`

### Stale Time vs. Cache Time

- **staleTime** — how long data is considered fresh (no background refetch)
- **gcTime** — how long unused data stays in memory

\`\`\`ts
useQuery({
  queryKey: ['posts'],
  queryFn: fetchPosts,
  staleTime: 1000 * 60 * 5, // 5 minutes
  gcTime: 1000 * 60 * 30,   // 30 minutes
})
\`\`\`

## Optimistic Updates

\`\`\`tsx
const mutation = useMutation({
  mutationFn: updatePost,
  onMutate: async (newPost) => {
    await queryClient.cancelQueries({ queryKey: ['posts', newPost.id] })
    const previous = queryClient.getQueryData(['posts', newPost.id])
    queryClient.setQueryData(['posts', newPost.id], newPost)
    return { previous }
  },
  onError: (err, newPost, context) => {
    queryClient.setQueryData(['posts', newPost.id], context.previous)
  },
})
\`\`\`

## Summary

1. Replace \`useEffect\` + \`useState\` with \`useQuery\`
2. Use \`useMutation\` for writes, invalidate queries on success
3. Tune \`staleTime\` and \`gcTime\` for your use case
4. Use the DevTools (\`@tanstack/react-query-devtools\`) during development
`,
  },
  {
    id: "building-type-safe-forms-with-tanstack-form",
    title: "Building Type-Safe Forms with TanStack Form",
    author_email: "user-4@example.com",
    created_at: "2024-03-12T16:45:00Z",
    content: `## The Problem with Forms

Forms are deceptively complex. Validation, async submission, field-level errors, and touched/dirty state quickly become unmanageable. **TanStack Form** solves this with a type-safe, framework-agnostic API.

## Installation

\`\`\`bash
npm install @tanstack/react-form
\`\`\`

## A Basic Form

\`\`\`tsx
import { useForm } from '@tanstack/react-form'

function SignupForm() {
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      await createUser(value)
    },
  })

  return (
    <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }}>
      <form.Field
        name="email"
        validators={{
          onChange: ({ value }) =>
            !value ? 'Email is required' :
            !value.includes('@') ? 'Invalid email' : undefined,
        }}
        children={(field) => (
          <div>
            <input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
            />
            {field.state.meta.errors && (
              <span className="error">{field.state.meta.errors[0]}</span>
            )}
          </div>
        )}
      />
      <button type="submit">Sign Up</button>
    </form>
  )
}
\`\`\`

## Async Validation

\`\`\`tsx
<form.Field
  name="username"
  validators={{
    onChangeAsync: async ({ value }) => {
      const taken = await checkUsernameAvailable(value)
      return taken ? 'Username already taken' : undefined
    },
    onChangeAsyncDebounceMs: 500,
  }}
  children={...}
/>
\`\`\`

## Validation with Zod

\`\`\`tsx
import { zodValidator } from '@tanstack/zod-form-adapter'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  age: z.number().min(18, 'Must be 18 or older'),
})

const form = useForm({
  validatorAdapter: zodValidator(),
  validators: {
    onChange: schema,
  },
})
\`\`\`

## Features at a Glance

- **Field-level validation** — validate each field independently
- **Form-level validation** — cross-field rules (e.g. password confirmation)
- **Async validation** — debounced server-side checks
- **Touched/dirty tracking** — show errors only after user interaction
- **Array fields** — dynamic lists of fields with add/remove
- **Framework-agnostic** — works with React, Vue, Solid, and Vanilla JS

## Array Fields Example

\`\`\`tsx
<form.Field name="tags" mode="array">
  {(field) => (
    <>
      {field.state.value.map((_, i) => (
        <form.Field key={i} name={\`tags[\${i}]\`}>
          {(tagField) => (
            <input
              value={tagField.state.value}
              onChange={(e) => tagField.handleChange(e.target.value)}
            />
          )}
        </form.Field>
      ))}
      <button type="button" onClick={() => field.pushValue('')}>
        Add Tag
      </button>
    </>
  )}
</form.Field>
\`\`\`
`,
  },
  {
    id: "understanding-react-concurrent-features",
    title: "Understanding React Concurrent Features",
    author_email: "user-5@example.com",
    created_at: "2023-03-18T11:30:00Z",
    content: `## What Is Concurrent React?

Concurrent React allows React to **interrupt, pause, and resume rendering**. This means your UI can remain responsive even during heavy computation. It's not a feature you opt into — it's a capability unlocked by \`createRoot\`.

## Enabling Concurrent Mode

\`\`\`tsx
import { createRoot } from 'react-dom/client'

const root = createRoot(document.getElementById('root')!)
root.render(<App />)
\`\`\`

## Suspense

\`Suspense\` lets you declaratively show a fallback while waiting for async work:

\`\`\`tsx
import { Suspense } from 'react'

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <ProfilePage />
    </Suspense>
  )
}
\`\`\`

You can nest \`Suspense\` boundaries for granular loading states:

\`\`\`tsx
<Suspense fallback={<PageSkeleton />}>
  <Header />
  <Suspense fallback={<FeedSkeleton />}>
    <Feed />
  </Suspense>
  <Sidebar />
</Suspense>
\`\`\`

## Transitions

Use \`startTransition\` to mark non-urgent updates. React will keep the old UI visible while preparing the new one:

\`\`\`tsx
import { useTransition, useState } from 'react'

function SearchPage() {
  const [isPending, startTransition] = useTransition()
  const [query, setQuery] = useState('')

  const handleChange = (e) => {
    setQuery(e.target.value)                  // urgent — update input immediately
    startTransition(() => {
      setSearchResults(e.target.value)        // non-urgent — can be interrupted
    })
  }

  return (
    <>
      <input value={query} onChange={handleChange} />
      {isPending && <Spinner />}
      <Results />
    </>
  )
}
\`\`\`

## useDeferredValue

Similar to \`startTransition\` but for **values** rather than state updates:

\`\`\`tsx
import { useDeferredValue } from 'react'

function SearchResults({ query }) {
  const deferredQuery = useDeferredValue(query)

  return <ExpensiveList filter={deferredQuery} />
}
\`\`\`

## Automatic Batching

React 18 batches all state updates — even those inside \`setTimeout\` or event handlers — into a single re-render:

\`\`\`tsx
// Before React 18: causes 2 re-renders
// After React 18: batched into 1 re-render
setTimeout(() => {
  setCount(c => c + 1)
  setFlag(f => !f)
}, 1000)
\`\`\`

## When to Use What

| Scenario | Tool |
|---|---|
| Loading async data | \`Suspense\` |
| Slow user interactions (search, filter) | \`useTransition\` |
| Expensive child components | \`useDeferredValue\` |
| All state updates | Automatic batching (built-in) |
`,
  },
  {
    id: "mastering-css-in-js-with-emotion",
    title: "Mastering CSS-in-JS with Emotion",
    author_email: "user-6@example.com",
    created_at: "2024-03-22T14:15:00Z",
    content: `## Why CSS-in-JS?

Traditional CSS comes with scoping issues, specificity wars, and dead code. **Emotion** solves these by co-locating styles with components — with full TypeScript support and near-zero runtime cost.

## Installation

\`\`\`bash
npm install @emotion/react @emotion/styled
\`\`\`

## The \`css\` Prop

\`\`\`tsx
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'

const buttonStyle = css\`
  background: #0070f3;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;

  &:hover {
    background: #0051cc;
  }
\`

function Button({ children }) {
  return <button css={buttonStyle}>{children}</button>
}
\`\`\`

## Styled Components

\`\`\`tsx
import styled from '@emotion/styled'

const Card = styled.div\`
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  background: white;
\`

const Title = styled.h2<{ accent?: boolean }>\`
  font-size: 1.5rem;
  color: \${({ accent }) => accent ? '#0070f3' : '#111'};
\`
\`\`\`

## Theming

\`\`\`tsx
import { ThemeProvider } from '@emotion/react'

const theme = {
  colors: {
    primary: '#0070f3',
    text: '#111',
    background: '#fff',
  },
  spacing: (n: number) => \`\${n * 8}px\`,
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <MyApp />
    </ThemeProvider>
  )
}

// In a component:
const Box = styled.div\`
  padding: \${({ theme }) => theme.spacing(2)};
  color: \${({ theme }) => theme.colors.text};
\`
\`\`\`

## Composition

\`\`\`tsx
import { css } from '@emotion/react'

const base = css\`
  font-family: sans-serif;
  font-size: 1rem;
\`

const primary = css\`
  \${base}
  color: #0070f3;
  font-weight: 600;
\`
\`\`\`

## Keyframe Animations

\`\`\`tsx
import { keyframes } from '@emotion/react'

const spin = keyframes\`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
\`

const Spinner = styled.div\`
  width: 24px;
  height: 24px;
  border: 2px solid #ccc;
  border-top-color: #0070f3;
  border-radius: 50%;
  animation: \${spin} 0.8s linear infinite;
\`
\`\`\`

## Best Practices

- Keep styles **co-located** with their component
- Use the **theme** for all design tokens (colors, spacing, typography)
- Prefer **\`styled\`** for reusable components; use **\`css\` prop** for one-offs
- Avoid inline \`css={{}}\` objects — they generate new classes on every render
`,
  },
  {
    id: "advanced-typescript-patterns-for-react",
    title: "Advanced TypeScript Patterns for React",
    author_email: "user-7@example.com",
    created_at: "2021-04-02T09:00:00Z",
    content: `## Beyond the Basics

Once you've mastered basic TypeScript in React, there's a world of advanced patterns that let you create **self-documenting, bug-proof APIs**. This post covers the patterns used in production at scale.

## Discriminated Unions

Model component variants exhaustively:

\`\`\`tsx
type ButtonProps =
  | { variant: 'primary'; onClick: () => void }
  | { variant: 'link'; href: string }

function Button(props: ButtonProps) {
  if (props.variant === 'primary') {
    return <button onClick={props.onClick}>Click me</button>
  }
  return <a href={props.href}>Click me</a>
}

// TypeScript catches this at compile time:
<Button variant="link" onClick={() => {}} /> // ❌ Error
<Button variant="link" href="/about" />      // ✅ OK
\`\`\`

## Generic Components

\`\`\`tsx
interface ListProps<T> {
  items: T[]
  renderItem: (item: T) => React.ReactNode
  keyExtractor: (item: T) => string
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <ul>
      {items.map(item => (
        <li key={keyExtractor(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  )
}

// Usage — fully typed:
<List
  items={posts}
  keyExtractor={p => p.id}
  renderItem={p => <span>{p.title}</span>}
/>
\`\`\`

## Conditional Types

\`\`\`ts
type IsArray<T> = T extends any[] ? true : false

type A = IsArray<string[]>  // true
type B = IsArray<string>    // false
\`\`\`

Practical use — extract the element type of an array:

\`\`\`ts
type ElementOf<T> = T extends (infer U)[] ? U : never

type Post = ElementOf<Post[]>  // Post
\`\`\`

## Template Literal Types

\`\`\`ts
type Color = 'red' | 'green' | 'blue'
type Size  = 'sm' | 'md' | 'lg'
type ClassName = \`btn-\${Color}-\${Size}\`
// "btn-red-sm" | "btn-red-md" | "btn-red-lg" | ...
\`\`\`

## Mapped Types

\`\`\`ts
type Nullable<T> = { [K in keyof T]: T[K] | null }
type Optional<T> = { [K in keyof T]?: T[K] }
type Readonly<T> = { readonly [K in keyof T]: T[K] }
\`\`\`

## Polymorphic \`as\` Prop

\`\`\`tsx
type AsProp<C extends React.ElementType> = {
  as?: C
}

type PropsOf<C extends React.ElementType, P = {}> =
  AsProp<C> & P & Omit<React.ComponentPropsWithRef<C>, keyof (AsProp<C> & P)>

function Text<C extends React.ElementType = 'span'>({
  as,
  ...props
}: PropsOf<C, { bold?: boolean }>) {
  const Component = as || 'span'
  return <Component {...props} />
}

<Text as="h1">Heading</Text>   // renders <h1>
<Text as="p">Paragraph</Text>  // renders <p>
\`\`\`

## Key Takeaways

1. **Discriminated unions** prevent invalid prop combinations
2. **Generic components** preserve type information across abstraction boundaries
3. **Conditional and mapped types** let you derive types from existing ones
4. **Template literals** create precise string unions
5. All of these patterns give you errors at compile time, not runtime
`,
  },
  {
    id: "building-accessible-react-applications",
    title: "Building Accessible React Applications",
    author_email: "user-8@example.com",
    created_at: "2023-04-10T13:45:00Z",
    content: `## Why Accessibility Matters

Over **1 billion people** live with some form of disability. Inaccessible apps exclude them — and in many jurisdictions, inaccessibility is also a legal liability.

## Semantic HTML First

Before reaching for ARIA, use the right HTML element:

\`\`\`tsx
// ❌ Not semantic
<div onClick={handleClick}>Submit</div>

// ✅ Semantic — focusable, keyboard-operable, announced as "button"
<button onClick={handleClick}>Submit</button>
\`\`\`

Common semantic elements: \`<nav>\`, \`<main>\`, \`<header>\`, \`<footer>\`, \`<article>\`, \`<section>\`, \`<aside>\`

## ARIA Attributes

Use ARIA only when HTML semantics are insufficient:

\`\`\`tsx
// Accessible icon button
<button aria-label="Close dialog">
  <XIcon aria-hidden="true" />
</button>

// Live region for dynamic content
<div aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>

// Expanded/collapsed state
<button
  aria-expanded={isOpen}
  aria-controls="menu"
  onClick={() => setIsOpen(o => !o)}
>
  Menu
</button>
<ul id="menu" hidden={!isOpen}>...</ul>
\`\`\`

## Keyboard Navigation

Every interactive element must be reachable and operable by keyboard:

\`\`\`tsx
function Modal({ onClose, children }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Trap focus inside modal
    const focusable = ref.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    focusable?.[0]?.focus()
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      ref={ref}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  )
}
\`\`\`

## Color Contrast

- **Normal text**: minimum 4.5:1 contrast ratio (WCAG AA)
- **Large text (18px+ bold or 24px+)**: minimum 3:1
- **UI components**: minimum 3:1

Use tools like [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) to verify.

## Forms and Labels

\`\`\`tsx
// ❌ Placeholder is not a label
<input placeholder="Email" />

// ✅ Always use <label>
<label htmlFor="email">Email address</label>
<input
  id="email"
  type="email"
  aria-describedby="email-hint"
  aria-required="true"
/>
<span id="email-hint">We'll never share your email.</span>
\`\`\`

## Automated Testing

\`\`\`bash
npm install --save-dev @axe-core/react
\`\`\`

\`\`\`tsx
import React from 'react'
import ReactDOM from 'react-dom'

if (process.env.NODE_ENV !== 'production') {
  const axe = require('@axe-core/react')
  axe(React, ReactDOM, 1000)
}
\`\`\`

Also use **eslint-plugin-jsx-a11y** in your ESLint config to catch issues at development time.

## Checklist

- [ ] All images have descriptive \`alt\` text (or \`alt=""\` for decorative images)
- [ ] All form inputs have visible, associated labels
- [ ] All interactive elements are keyboard-accessible
- [ ] Focus order follows a logical reading order
- [ ] Color is not the only means of conveying information
- [ ] Sufficient color contrast on all text and UI elements
- [ ] Dynamic content changes are announced to screen readers
`,
  },
  {
    id: "react-performance-optimization-techniques",
    title: "React Performance Optimization Techniques",
    author_email: "user-9@example.com",
    created_at: "2026-04-15T10:20:00Z",
    content: `## Diagnosing Performance Issues First

Never optimize blindly. Use the **React DevTools Profiler** to identify which components are re-rendering and why.

\`\`\`bash
# Install React DevTools as a browser extension, then:
# Open DevTools → Profiler → Record → Interact → Stop
\`\`\`

## Memoization

### \`React.memo\`

Prevents re-rendering when props haven't changed:

\`\`\`tsx
const PostCard = React.memo(function PostCard({ post }) {
  return (
    <div>
      <h2>{post.title}</h2>
      <p>{post.excerpt}</p>
    </div>
  )
})
\`\`\`

### \`useMemo\`

Cache expensive calculations:

\`\`\`tsx
const sortedPosts = useMemo(
  () => [...posts].sort((a, b) => b.date.localeCompare(a.date)),
  [posts]
)
\`\`\`

### \`useCallback\`

Stable function references for child component props:

\`\`\`tsx
const handleDelete = useCallback((id: string) => {
  setPosts(prev => prev.filter(p => p.id !== id))
}, [])
\`\`\`

## Virtualization

Rendering thousands of DOM nodes is slow. Only render what's visible:

\`\`\`bash
npm install @tanstack/react-virtual
\`\`\`

\`\`\`tsx
import { useVirtualizer } from '@tanstack/react-virtual'

function VirtualList({ items }) {
  const parentRef = useRef(null)

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60,
  })

  return (
    <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
      <div style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map(virtualItem => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: virtualItem.start,
              height: virtualItem.size,
            }}
          >
            {items[virtualItem.index].title}
          </div>
        ))}
      </div>
    </div>
  )
}
\`\`\`

## Code Splitting

Split large bundles with dynamic imports:

\`\`\`tsx
import { lazy, Suspense } from 'react'

const HeavyChart = lazy(() => import('./HeavyChart'))

function Dashboard() {
  return (
    <Suspense fallback={<ChartSkeleton />}>
      <HeavyChart />
    </Suspense>
  )
}
\`\`\`

## Bundle Analysis

\`\`\`bash
# Vite
npx vite-bundle-visualizer

# Webpack
npx webpack-bundle-analyzer stats.json
\`\`\`

## Quick Wins Checklist

- [ ] Images use \`loading="lazy"\` and proper \`width\`/\`height\` attributes
- [ ] Fonts use \`font-display: swap\`
- [ ] Third-party scripts loaded with \`defer\` or \`async\`
- [ ] Enable HTTP/2 and Brotli compression on your server
- [ ] Use a CDN for static assets
- [ ] Avoid layout shifts (CLS) by reserving space for async content
`,
  },
  {
    id: "state-management-in-2024",
    title: "State Management in 2024: A Complete Guide",
    author_email: "user-10@example.com",
    created_at: "2024-04-20T15:30:00Z",
    content: `## The State Management Landscape

React's ecosystem offers many state management solutions. Choosing the wrong one causes unnecessary complexity; choosing the right one makes your app easier to understand and extend.

## Categories of State

First, identify what type of state you're managing:

| Type | Examples | Best Tool |
|---|---|---|
| Server state | API data, pagination | TanStack Query |
| URL state | filters, page number | URL search params |
| Form state | input values, errors | TanStack Form / React Hook Form |
| UI state | modals, tooltips | useState / useReducer |
| Global app state | auth user, theme | Zustand / Jotai |

## Context API

Best for low-frequency updates (theme, auth user):

\`\`\`tsx
const ThemeContext = createContext<'light' | 'dark'>('light')

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
\`\`\`

**Avoid** Context for frequently-changing data — every consumer re-renders on every update.

## Zustand

Simple, scalable global state. No boilerplate:

\`\`\`tsx
import { create } from 'zustand'

interface AuthStore {
  user: User | null
  setUser: (user: User | null) => void
  logout: () => void
}

const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}))

// In a component:
const user = useAuthStore(state => state.user)
const logout = useAuthStore(state => state.logout)
\`\`\`

## Jotai

Atomic state — derive state from atoms:

\`\`\`tsx
import { atom, useAtom, useAtomValue } from 'jotai'

const countAtom = atom(0)
const doubledAtom = atom((get) => get(countAtom) * 2)

function Counter() {
  const [count, setCount] = useAtom(countAtom)
  const doubled = useAtomValue(doubledAtom)
  return <button onClick={() => setCount(c => c + 1)}>{count} (×2 = {doubled})</button>
}
\`\`\`

## Redux Toolkit

For large teams with complex state transitions:

\`\`\`tsx
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const postsSlice = createSlice({
  name: 'posts',
  initialState: [] as Post[],
  reducers: {
    addPost(state, action: PayloadAction<Post>) {
      state.push(action.payload)
    },
    removePost(state, action: PayloadAction<string>) {
      return state.filter(p => p.id !== action.payload)
    },
  },
})

export const { addPost, removePost } = postsSlice.actions
\`\`\`

## Decision Guide

1. **Is it server data?** → TanStack Query
2. **Is it in the URL?** → Search params / router state
3. **Is it form state?** → TanStack Form
4. **Is it local UI state?** → \`useState\` / \`useReducer\`
5. **Is it shared, simple global state?** → Zustand or Jotai
6. **Is it complex with many reducers and middleware?** → Redux Toolkit
`,
  },
  {
    id: "testing-react-applications-with-vitest",
    title: "Testing React Applications with Vitest",
    author_email: "user-11@example.com",
    created_at: "2026-04-25T08:15:00Z",
    content: `## Why Vitest?

Vitest is **Jest-compatible** but 10–20× faster thanks to Vite's transform pipeline and native ESM support. If you're already using Vite, there's almost no configuration needed.

## Setup

\`\`\`bash
npm install --save-dev vitest @testing-library/react @testing-library/user-event jsdom
\`\`\`

\`\`\`ts
// vite.config.ts
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
})
\`\`\`

\`\`\`ts
// src/test/setup.ts
import '@testing-library/jest-dom'
\`\`\`

## Unit Tests

\`\`\`ts
import { describe, it, expect } from 'vitest'
import { formatDate } from '../utils/date'

describe('formatDate', () => {
  it('formats ISO string as readable date', () => {
    expect(formatDate('2024-01-15T10:00:00Z')).toBe('January 15, 2024')
  })

  it('returns "Invalid date" for bad input', () => {
    expect(formatDate('not-a-date')).toBe('Invalid date')
  })
})
\`\`\`

## Component Tests

\`\`\`tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Counter } from './Counter'

describe('Counter', () => {
  it('starts at zero', () => {
    render(<Counter />)
    expect(screen.getByText('Count: 0')).toBeInTheDocument()
  })

  it('increments on button click', async () => {
    const user = userEvent.setup()
    render(<Counter />)
    await user.click(screen.getByRole('button', { name: 'Increment' }))
    expect(screen.getByText('Count: 1')).toBeInTheDocument()
  })
})
\`\`\`

## Mocking

\`\`\`ts
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { PostList } from './PostList'
import * as api from '../api/posts'

vi.mock('../api/posts')

describe('PostList', () => {
  beforeEach(() => {
    vi.mocked(api.fetchPosts).mockResolvedValue([
      { id: '1', title: 'Hello World' },
    ])
  })

  it('renders posts after loading', async () => {
    render(<PostList />)
    await waitFor(() => {
      expect(screen.getByText('Hello World')).toBeInTheDocument()
    })
  })
})
\`\`\`

## Coverage

\`\`\`bash
npx vitest run --coverage
\`\`\`

\`\`\`ts
// vite.config.ts
test: {
  coverage: {
    provider: 'v8',
    reporter: ['text', 'html'],
    thresholds: {
      lines: 80,
      functions: 80,
    },
  },
}
\`\`\`

## Testing Checklist

- [ ] Unit test all pure utility functions
- [ ] Component tests verify user interactions, not implementation details
- [ ] Use \`screen.getByRole\` over \`getByTestId\` — it tests accessibility too
- [ ] Mock at the network layer (\`msw\`) rather than mocking individual modules
- [ ] Run tests in CI on every pull request
`,
  },
  {
    id: "micro-frontend-architecture-with-module-federation",
    title: "Micro-Frontend Architecture with Module Federation",
    author_email: "user-13@example.com",
    created_at: "2022-05-08T14:30:00Z",
    content: `## What Is Module Federation?

Module Federation (introduced in Webpack 5) lets you **share code between separately deployed JavaScript applications** at runtime. It's the foundation of true micro-frontend architectures.

## The Problem It Solves

Without Module Federation, sharing code between apps requires:

- Publishing npm packages (slow release cycle)
- Copy-pasting code (diverges over time)
- Monoliths (deploy everything together)

Module Federation enables **independent deployment** with **shared dependencies**.

## Core Concepts

- **Host** — the shell app that loads remote modules
- **Remote** — an app that exposes modules for others to consume
- **Shared** — dependencies shared between host and remotes (e.g., React)

## Configuration

\`\`\`js
// webpack.config.js for the HOST app
const { ModuleFederationPlugin } = require('webpack').container

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'host',
      remotes: {
        shop: 'shop@https://shop.example.com/remoteEntry.js',
        auth: 'auth@https://auth.example.com/remoteEntry.js',
      },
      shared: { react: { singleton: true }, 'react-dom': { singleton: true } },
    }),
  ],
}
\`\`\`

\`\`\`js
// webpack.config.js for the SHOP remote
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'shop',
      filename: 'remoteEntry.js',
      exposes: {
        './ProductList': './src/ProductList',
        './Cart': './src/Cart',
      },
      shared: { react: { singleton: true }, 'react-dom': { singleton: true } },
    }),
  ],
}
\`\`\`

## Consuming a Remote in React

\`\`\`tsx
import { lazy, Suspense } from 'react'

// This component lives in a completely separate deployed app
const ProductList = lazy(() => import('shop/ProductList'))

function App() {
  return (
    <Suspense fallback={<div>Loading shop...</div>}>
      <ProductList />
    </Suspense>
  )
}
\`\`\`

## Deployment Strategy

\`\`\`
┌─────────────────────────────────┐
│           Shell / Host          │  cdn.example.com
│   loads remotes dynamically     │
└──────────┬──────────┬───────────┘
           │          │
    ┌──────┴──┐  ┌────┴──────┐
    │  Shop   │  │   Auth    │
    │ Remote  │  │  Remote   │
    └─────────┘  └───────────┘
  shop.example.com  auth.example.com
\`\`\`

Each remote:
1. Builds and deploys independently
2. Exposes a \`remoteEntry.js\` manifest
3. Can be updated without redeploying the shell

## Gotchas

- **Singleton React** — always mark React as a singleton to avoid hook errors from multiple instances
- **Type safety** — use \`@module-federation/typescript\` to generate types for remote modules
- **Version mismatches** — pin shared dependency versions carefully
- **Error boundaries** — a failing remote shouldn't crash the host; wrap remotes in \`<ErrorBoundary>\`

## When to Use Micro-Frontends

Use Module Federation when:
- Teams need to deploy independently without coordination
- The app is genuinely large enough that monolithic builds are painful
- Different parts of the app have different release cadences

Don't use it for small apps — the operational complexity isn't worth it.
`,
  },
  {
    id: "react-hooks-best-practices",
    title: "React Hooks: Best Practices and Common Pitfalls",
    author_email: "user-14@example.com",
    created_at: "2025-05-15T09:45:00Z",
    content: `## The Rules of Hooks

React enforces two rules — violating them causes subtle, hard-to-debug bugs:

1. **Only call hooks at the top level** — not inside loops, conditions, or nested functions
2. **Only call hooks from React functions** — not from regular JS functions

\`\`\`tsx
// ❌ Conditional hook — breaks rule 1
if (isLoggedIn) {
  const [profile, setProfile] = useState(null)
}

// ✅ Condition inside the hook
const [profile, setProfile] = useState(null)
if (!isLoggedIn) return null
\`\`\`

Use the [**eslint-plugin-react-hooks**](https://www.npmjs.com/package/eslint-plugin-react-hooks) to enforce these rules automatically.

## useEffect Dependencies

The most common source of bugs. Every value from the component scope used inside \`useEffect\` must be in the dependency array:

\`\`\`tsx
// ❌ Missing dependency — stale closure bug
useEffect(() => {
  fetchData(userId) // userId may be stale!
}, []) // forgot userId

// ✅ Correct
useEffect(() => {
  fetchData(userId)
}, [userId])
\`\`\`

## Avoiding Infinite Loops

\`\`\`tsx
// ❌ New array reference on every render → infinite loop
useEffect(() => {
  processItems(items)
}, [items]) // if items = [] in parent, this is a new [] each render

// ✅ Memoize in the parent, or use a primitive dependency
useEffect(() => {
  processItems(items)
}, [items.length]) // only re-run when count changes
\`\`\`

## useCallback

Only use \`useCallback\` when the function is a **dependency of another hook** or a **prop to a memoized child**:

\`\`\`tsx
// ❌ Premature optimization — no benefit here
const handleClick = useCallback(() => doSomething(), [])

// ✅ Needed because it's a dep of useEffect
const fetchData = useCallback(async () => {
  const data = await api.get(endpoint)
  setData(data)
}, [endpoint])

useEffect(() => { fetchData() }, [fetchData])
\`\`\`

## Custom Hooks

Extract reusable stateful logic into custom hooks:

\`\`\`tsx
function usePagination(totalItems: number, pageSize: number) {
  const [page, setPage] = useState(1)
  const totalPages = Math.ceil(totalItems / pageSize)

  return {
    page,
    totalPages,
    goNext: () => setPage(p => Math.min(p + 1, totalPages)),
    goPrev: () => setPage(p => Math.max(p - 1, 1)),
    canGoNext: page < totalPages,
    canGoPrev: page > 1,
  }
}

// Usage
function PostList({ posts }) {
  const { page, goNext, goPrev, canGoNext, canGoPrev } = usePagination(posts.length, 10)
  // ...
}
\`\`\`

## useReducer for Complex State

When multiple state values are coupled, use \`useReducer\`:

\`\`\`tsx
type State = { isLoading: boolean; data: Post[] | null; error: string | null }
type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Post[] }
  | { type: 'FETCH_ERROR'; payload: string }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'FETCH_START':   return { isLoading: true, data: null, error: null }
    case 'FETCH_SUCCESS': return { isLoading: false, data: action.payload, error: null }
    case 'FETCH_ERROR':   return { isLoading: false, data: null, error: action.payload }
  }
}

const [state, dispatch] = useReducer(reducer, { isLoading: false, data: null, error: null })
\`\`\`

## Common Pitfalls Summary

| Pitfall | Fix |
|---|---|
| Stale closure in useEffect | Add all deps to the array |
| Infinite loop | Memoize objects/arrays with useMemo |
| Missing cleanup | Return cleanup function from useEffect |
| Overusing useCallback | Only use it when the function is a dep |
| useState for derived data | Compute it during render instead |
`,
  },
  {
    id: "building-real-time-apps-with-websockets",
    title: "Building Real-Time Apps with WebSockets",
    author_email: "user-15@example.com",
    created_at: "2026-05-22T16:00:00Z",
    content: `## Why WebSockets?

HTTP is request-response: the client asks, the server answers. **WebSockets** open a persistent, bidirectional channel — the server can push data to the client at any time without polling.

## Ideal Use Cases

- Chat applications
- Collaborative editing (like Google Docs)
- Live sports scores / dashboards
- Real-time notifications
- Multiplayer games

## A Custom useWebSocket Hook

\`\`\`tsx
import { useEffect, useRef, useState, useCallback } from 'react'

type WebSocketStatus = 'connecting' | 'open' | 'closed' | 'error'

export function useWebSocket<T>(url: string) {
  const ws = useRef<WebSocket | null>(null)
  const [status, setStatus] = useState<WebSocketStatus>('connecting')
  const [lastMessage, setLastMessage] = useState<T | null>(null)

  useEffect(() => {
    const socket = new WebSocket(url)
    ws.current = socket

    socket.onopen  = () => setStatus('open')
    socket.onclose = () => setStatus('closed')
    socket.onerror = () => setStatus('error')
    socket.onmessage = (event) => {
      setLastMessage(JSON.parse(event.data) as T)
    }

    return () => socket.close()
  }, [url])

  const send = useCallback((data: unknown) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(data))
    }
  }, [])

  return { status, lastMessage, send }
}
\`\`\`

## Reconnection Logic

\`\`\`tsx
export function useReconnectingWebSocket<T>(url: string) {
  const [attempt, setAttempt] = useState(0)
  const { status, lastMessage, send } = useWebSocket<T>(
    \`\${url}?attempt=\${attempt}\`
  )

  useEffect(() => {
    if (status === 'closed' || status === 'error') {
      const timeout = Math.min(1000 * 2 ** attempt, 30000) // exponential backoff, max 30s
      const timer = setTimeout(() => setAttempt(a => a + 1), timeout)
      return () => clearTimeout(timer)
    }
  }, [status, attempt])

  return { status, lastMessage, send }
}
\`\`\`

## Chat App Example

\`\`\`tsx
interface Message { id: string; user: string; text: string }

function ChatRoom({ roomId }: { roomId: string }) {
  const { status, lastMessage, send } = useReconnectingWebSocket<Message>(
    \`wss://api.example.com/rooms/\${roomId}\`
  )
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')

  useEffect(() => {
    if (lastMessage) {
      setMessages(prev => [...prev, lastMessage])
    }
  }, [lastMessage])

  const handleSend = () => {
    send({ text: input })
    setInput('')
  }

  return (
    <div>
      <div className="status">{status}</div>
      <ul>
        {messages.map(m => (
          <li key={m.id}><strong>{m.user}:</strong> {m.text}</li>
        ))}
      </ul>
      <input value={input} onChange={e => setInput(e.target.value)} />
      <button onClick={handleSend} disabled={status !== 'open'}>Send</button>
    </div>
  )
}
\`\`\`

## Server-Sent Events (SSE) — A Lighter Alternative

For **one-way** server-to-client streams (notifications, live feeds), SSE is simpler:

\`\`\`tsx
useEffect(() => {
  const source = new EventSource('/api/notifications')
  source.onmessage = (e) => setNotifications(n => [...n, JSON.parse(e.data)])
  source.onerror = () => source.close()
  return () => source.close()
}, [])
\`\`\`

## Production Checklist

- [ ] Implement exponential backoff for reconnection
- [ ] Handle the \`visibilitychange\` event to pause when tab is hidden
- [ ] Add message queuing for sends that happen while disconnected
- [ ] Use a managed service (Ably, Pusher, Socket.io) to avoid operating WebSocket servers at scale
`,
  },
  {
    id: "progressive-web-apps-with-react",
    title: "Progressive Web Apps with React",
    author_email: "user-16@example.com",
    created_at: "2024-05-28T11:15:00Z",
    content: `## What Makes a PWA?

A Progressive Web App is a web application that uses modern browser APIs to deliver **app-like experiences**: offline support, push notifications, home screen installation, and fast load times — without an app store.

## The Three Pillars

1. **HTTPS** — PWAs must be served over a secure connection
2. **Web App Manifest** — metadata for installation
3. **Service Worker** — the engine powering offline support and caching

## Web App Manifest

\`\`\`json
// public/manifest.json
{
  "name": "My React App",
  "short_name": "MyApp",
  "description": "A progressive web app built with React",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#0070f3",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
\`\`\`

Link it in your HTML:

\`\`\`html
<link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#0070f3" />
\`\`\`

## Service Worker with Workbox

Workbox (by Google) handles the boilerplate:

\`\`\`bash
npm install --save-dev workbox-cli
# or with Vite:
npm install --save-dev vite-plugin-pwa
\`\`\`

\`\`\`ts
// vite.config.ts
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      },
      manifest: {
        name: 'My React App',
        short_name: 'MyApp',
        theme_color: '#0070f3',
      },
    }),
  ],
})
\`\`\`

## Caching Strategies

| Strategy | Description | Best For |
|---|---|---|
| Cache First | Serve from cache, update in background | Static assets |
| Network First | Try network, fall back to cache | API responses |
| Stale While Revalidate | Serve cache immediately, update in background | Non-critical data |
| Network Only | Always fetch from network | Real-time data |

## Push Notifications

\`\`\`tsx
async function subscribeToPush() {
  const registration = await navigator.serviceWorker.ready
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
  })
  await fetch('/api/push/subscribe', {
    method: 'POST',
    body: JSON.stringify(subscription),
  })
}

function NotificationButton() {
  return (
    <button onClick={subscribeToPush}>
      Enable Notifications
    </button>
  )
}
\`\`\`

## Install Prompt

\`\`\`tsx
function InstallBanner() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      setPrompt(e as BeforeInstallPromptEvent)
    })
  }, [])

  if (!prompt) return null

  return (
    <div className="banner">
      <span>Install this app for offline access!</span>
      <button onClick={() => prompt.prompt()}>Install</button>
    </div>
  )
}
\`\`\`

## Audit with Lighthouse

Run a Lighthouse audit in Chrome DevTools → Lighthouse to score your PWA. Aim for:
- Performance: **90+**
- Accessibility: **100**
- Best Practices: **100**
- PWA: **all green**
`,
  },
  {
    id: "graphql-and-react-a-perfect-match",
    title: "GraphQL and React: A Perfect Match",
    author_email: "user-17@example.com",
    created_at: "2020-06-03T13:30:00Z",
    content: `## Why GraphQL?

REST APIs have a fundamental mismatch with UI needs: you either **over-fetch** (get too many fields) or **under-fetch** (need multiple requests). GraphQL lets the client specify exactly the data it needs.

## Schema Definition

\`\`\`graphql
type Post {
  id: ID!
  title: String!
  content: String!
  author: User!
  comments: [Comment!]!
  createdAt: String!
}

type Query {
  posts(page: Int): [Post!]!
  post(id: ID!): Post
}

type Mutation {
  createPost(title: String!, content: String!): Post!
  deletePost(id: ID!): Boolean!
}

type Subscription {
  postAdded: Post!
}
\`\`\`

## Setup with Apollo Client

\`\`\`bash
npm install @apollo/client graphql
\`\`\`

\`\`\`tsx
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'

const client = new ApolloClient({
  uri: 'https://api.example.com/graphql',
  cache: new InMemoryCache(),
})

function App() {
  return (
    <ApolloProvider client={client}>
      <Router />
    </ApolloProvider>
  )
}
\`\`\`

## Queries

\`\`\`tsx
import { useQuery, gql } from '@apollo/client'

const GET_POSTS = gql\`
  query GetPosts($page: Int) {
    posts(page: $page) {
      id
      title
      author {
        name
        avatarUrl
      }
    }
  }
\`

function PostList() {
  const { data, loading, error } = useQuery(GET_POSTS, {
    variables: { page: 1 },
  })

  if (loading) return <Spinner />
  if (error) return <p>Error: {error.message}</p>

  return (
    <ul>
      {data.posts.map(post => (
        <li key={post.id}>{post.title} — {post.author.name}</li>
      ))}
    </ul>
  )
}
\`\`\`

## Mutations

\`\`\`tsx
const CREATE_POST = gql\`
  mutation CreatePost($title: String!, $content: String!) {
    createPost(title: $title, content: $content) {
      id
      title
    }
  }
\`

function NewPostForm() {
  const [createPost, { loading }] = useMutation(CREATE_POST, {
    update(cache, { data: { createPost } }) {
      cache.modify({
        fields: {
          posts(existing = []) {
            return [...existing, { __ref: cache.identify(createPost) }]
          },
        },
      })
    },
  })

  return (
    <button
      onClick={() => createPost({ variables: { title: 'New', content: '...' } })}
      disabled={loading}
    >
      Create Post
    </button>
  )
}
\`\`\`

## Subscriptions

\`\`\`tsx
import { useSubscription, gql } from '@apollo/client'

const POST_ADDED = gql\`
  subscription OnPostAdded {
    postAdded {
      id
      title
    }
  }
\`

function LiveFeed() {
  const { data } = useSubscription(POST_ADDED)
  return data ? <div>New post: {data.postAdded.title}</div> : null
}
\`\`\`

## Code Generation

Use **GraphQL Code Generator** to automatically generate TypeScript types from your schema:

\`\`\`bash
npm install --save-dev @graphql-codegen/cli @graphql-codegen/typescript
npx graphql-codegen init
\`\`\`

This gives you fully-typed hooks — no more manual type definitions for queries.
`,
  },
  {
    id: "react-native-for-web-developers",
    title: "React Native for Web Developers",
    author_email: "user-18@example.com",
    created_at: "2025-06-10T10:00:00Z",
    content: `## The Mental Shift

React Native uses **React concepts** but renders to native UI — not HTML. There's no DOM, no CSS, and no browser APIs.

## Key Differences

| Web (React) | React Native |
|---|---|
| \`<div>\`, \`<p>\`, \`<img>\` | \`<View>\`, \`<Text>\`, \`<Image>\` |
| CSS stylesheets | StyleSheet API |
| \`onClick\` | \`onPress\` |
| \`fetch\` + browser APIs | \`fetch\` + native modules |
| React Router / TanStack Router | React Navigation / Expo Router |
| Flexbox (block layout default) | Flexbox (flex-column default) |

## Your First Component

\`\`\`tsx
import { View, Text, StyleSheet, Pressable } from 'react-native'

export function PostCard({ post, onPress }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [
      styles.card,
      pressed && styles.pressed,
    ]}>
      <View style={styles.content}>
        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.excerpt} numberOfLines={2}>
          {post.excerpt}
        </Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Android
  },
  pressed: { opacity: 0.85 },
  title: { fontSize: 18, fontWeight: '600', color: '#111' },
  excerpt: { fontSize: 14, color: '#666', marginTop: 4 },
})
\`\`\`

## Navigation with Expo Router

Expo Router brings **file-based routing** to React Native:

\`\`\`
app/
  _layout.tsx    ← root layout (like __root.tsx in TanStack)
  index.tsx      ← /
  posts/
    index.tsx    ← /posts
    [id].tsx     ← /posts/:id
\`\`\`

\`\`\`tsx
// app/posts/[id].tsx
import { useLocalSearchParams } from 'expo-router'

export default function PostScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  // fetch and display post by id
}
\`\`\`

## Platform-Specific Code

\`\`\`tsx
import { Platform } from 'react-native'

const styles = StyleSheet.create({
  shadow: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
    },
    android: {
      elevation: 4,
    },
  }),
})
\`\`\`

Or use file suffixes: \`Button.ios.tsx\`, \`Button.android.tsx\`

## Sharing Code Between Web and Native

\`\`\`tsx
// hooks/usePosts.ts — shared between web and native
export function usePosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  })
}

// Platform-specific UIs consume the same hook
// web: PostList.tsx uses <div>, <ul>
// native: PostList.native.tsx uses <View>, <FlatList>
\`\`\`

## Getting Started with Expo

\`\`\`bash
npx create-expo-app@latest my-app
cd my-app
npx expo start
\`\`\`

Scan the QR code with **Expo Go** on your phone to see the app instantly.
`,
  },
  {
    id: "animation-in-react-with-framer-motion",
    title: "Animation in React with Framer Motion",
    author_email: "user-19@example.com",
    created_at: "2026-06-17T15:45:00Z",
    content: `## Why Framer Motion?

CSS animations work for simple cases, but complex sequences, gesture-driven animations, and layout transitions require JavaScript. **Framer Motion** provides a declarative, production-ready animation API for React.

## Installation

\`\`\`bash
npm install framer-motion
\`\`\`

## Basic Animation

\`\`\`tsx
import { motion } from 'framer-motion'

function FadeIn({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
\`\`\`

## Variants — Orchestrate Multiple Elements

\`\`\`tsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
}

function PostList({ posts }) {
  return (
    <motion.ul variants={containerVariants} initial="hidden" animate="visible">
      {posts.map(post => (
        <motion.li key={post.id} variants={itemVariants}>
          {post.title}
        </motion.li>
      ))}
    </motion.ul>
  )
}
\`\`\`

## Exit Animations with AnimatePresence

\`\`\`tsx
import { AnimatePresence, motion } from 'framer-motion'

function Notifications({ notifications }) {
  return (
    <AnimatePresence>
      {notifications.map(n => (
        <motion.div
          key={n.id}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          {n.message}
        </motion.div>
      ))}
    </AnimatePresence>
  )
}
\`\`\`

## Layout Animations

Framer Motion can animate elements to their new position automatically:

\`\`\`tsx
function SortableList({ items }) {
  return (
    <ul>
      {items.map(item => (
        <motion.li key={item.id} layout>
          {item.name}
        </motion.li>
      ))}
    </ul>
  )
}
\`\`\`

## Gestures

\`\`\`tsx
function DraggableCard({ children }) {
  return (
    <motion.div
      drag
      dragConstraints={{ left: -100, right: 100, top: -50, bottom: 50 }}
      whileDrag={{ scale: 1.05, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.div>
  )
}
\`\`\`

## useAnimation — Programmatic Control

\`\`\`tsx
import { useAnimation } from 'framer-motion'

function ShakeOnError({ hasError, children }) {
  const controls = useAnimation()

  useEffect(() => {
    if (hasError) {
      controls.start({
        x: [0, -10, 10, -10, 10, 0],
        transition: { duration: 0.5 },
      })
    }
  }, [hasError, controls])

  return <motion.div animate={controls}>{children}</motion.div>
}
\`\`\`

## Performance Tips

- Use \`transform\` and \`opacity\` — they're GPU-accelerated
- Avoid animating \`width\`, \`height\`, or \`top\`/\`left\` — use \`scale\` and \`x\`/\`y\` instead
- Set \`layout\` only on elements that actually change layout
- Use \`will-change: transform\` CSS for heavy animations
`,
  },
  {
    id: "error-boundaries-and-error-handling",
    title: "Error Boundaries and Error Handling in React",
    author_email: "user-20@example.com",
    created_at: "2025-06-24T09:30:00Z",
    content: `## Why Error Handling Matters

Without error handling, a single unhandled exception crashes your entire React tree — the user sees a blank page. **Error Boundaries** let you isolate failures and show meaningful fallback UIs.

## Error Boundaries

Error Boundaries are **class components** (the only use case where class components are still required):

\`\`\`tsx
import { Component, type ReactNode } from 'react'

interface Props {
  fallback: ReactNode
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    // Log to your error monitoring service
    errorMonitor.captureException(error, { extra: info })
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children
  }
}
\`\`\`

Usage:

\`\`\`tsx
<ErrorBoundary fallback={<p>Something went wrong. Please refresh.</p>}>
  <CommentsSection postId={postId} />
</ErrorBoundary>
\`\`\`

## react-error-boundary

The **react-error-boundary** library adds hooks and resets to the pattern:

\`\`\`bash
npm install react-error-boundary
\`\`\`

\`\`\`tsx
import { ErrorBoundary } from 'react-error-boundary'

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
    >
      <MyComponent />
    </ErrorBoundary>
  )
}
\`\`\`

## Async Error Handling

Error Boundaries **don't catch** async errors. Handle those explicitly:

\`\`\`tsx
async function fetchPost(id: string) {
  const response = await fetch(\`/api/posts/\${id}\`)
  if (!response.ok) {
    throw new Error(\`HTTP \${response.status}: \${response.statusText}\`)
  }
  return response.json()
}

function PostPage({ id }: { id: string }) {
  const { data, error, isLoading } = useQuery({
    queryKey: ['post', id],
    queryFn: () => fetchPost(id),
    retry: (failureCount, error) => {
      if (error.message.startsWith('HTTP 404')) return false
      return failureCount < 3
    },
  })

  if (isLoading) return <Spinner />
  if (error) return <ErrorMessage error={error} />
  return <PostDetail post={data} />
}
\`\`\`

## Global Error Handling

Catch unhandled rejections and errors that escape component trees:

\`\`\`ts
// main.tsx
window.addEventListener('unhandledrejection', (event) => {
  errorMonitor.captureException(event.reason)
})

window.addEventListener('error', (event) => {
  errorMonitor.captureException(event.error)
})
\`\`\`

## Error Monitoring Services

Integrate with a monitoring service to be notified of production errors:

\`\`\`bash
npm install @sentry/react
\`\`\`

\`\`\`ts
import * as Sentry from '@sentry/react'

Sentry.init({
  dsn: 'YOUR_DSN',
  environment: process.env.NODE_ENV,
})

// Use Sentry's ErrorBoundary:
import { ErrorBoundary } from '@sentry/react'
\`\`\`

## Strategy Summary

| Error Type | Handling Approach |
|---|---|
| Render errors | Error Boundary |
| Data fetching errors | TanStack Query \`error\` state |
| Form submission errors | \`useMutation\` \`onError\` |
| Unhandled rejections | \`window.unhandledrejection\` listener |
| All of the above | Sentry / error monitoring |
`,
  },
  {
    id: "monorepo-management-with-turborepo",
    title: "Monorepo Management with Turborepo",
    author_email: "user-21@example.com",
    created_at: "2024-07-01T12:15:00Z",
    content: `## What Is Turborepo?

Turborepo is a **high-performance build system** for JavaScript/TypeScript monorepos. It adds intelligent caching and parallel task execution on top of your existing package manager workspace setup.

## Repository Structure

\`\`\`
my-monorepo/
├── apps/
│   ├── web/           ← Next.js or TanStack Start
│   └── mobile/        ← React Native / Expo
├── packages/
│   ├── ui/            ← shared component library
│   ├── config/        ← shared ESLint, TypeScript configs
│   └── api-client/    ← typed API client
├── turbo.json
└── package.json
\`\`\`

## Setup

\`\`\`bash
npx create-turbo@latest
# or add to existing monorepo:
npm install --save-dev turbo
\`\`\`

\`\`\`json
// package.json (root)
{
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "build": "turbo build",
    "dev":   "turbo dev",
    "lint":  "turbo lint",
    "test":  "turbo test"
  }
}
\`\`\`

## turbo.json — Task Pipeline

\`\`\`json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {},
    "test": {
      "dependsOn": ["^build"]
    }
  }
}
\`\`\`

- **\`^build\`** — run the \`build\` task in all dependencies first
- **\`outputs\`** — tell Turbo what to cache
- **\`cache: false\`** — don't cache dev servers

## Shared Package Example

\`\`\`tsx
// packages/ui/src/Button.tsx
export interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
  onClick?: () => void
}

export function Button({ children, variant = 'primary', onClick }: ButtonProps) {
  return (
    <button className={\`btn btn-\${variant}\`} onClick={onClick}>
      {children}
    </button>
  )
}
\`\`\`

\`\`\`json
// packages/ui/package.json
{
  "name": "@myorg/ui",
  "exports": {
    ".": "./src/index.ts"
  }
}
\`\`\`

\`\`\`json
// apps/web/package.json
{
  "dependencies": {
    "@myorg/ui": "*"
  }
}
\`\`\`

\`\`\`tsx
// apps/web/src/Page.tsx
import { Button } from '@myorg/ui'
\`\`\`

## Remote Caching

Share build caches across your entire team and CI:

\`\`\`bash
npx turbo login
npx turbo link
\`\`\`

Once linked, Turbo uploads and downloads cached build artifacts automatically. CI builds that hit the cache take **seconds instead of minutes**.

## Filtering Tasks

\`\`\`bash
# Build only the web app and its dependencies
turbo build --filter=web

# Run tests only for changed packages since main
turbo test --filter='[origin/main]'
\`\`\`

## Benefits at a Glance

- **Parallel execution** — tasks run in parallel where possible
- **Local caching** — unchanged packages are never rebuilt
- **Remote caching** — share caches across team and CI
- **Incremental adoption** — works with any package manager
`,
  },
  {
    id: "react-18-features-you-should-know",
    title: "React 18 Features You Should Know",
    author_email: "user-22@example.com",
    created_at: "2024-07-08T14:00:00Z",
    content: `## Upgrading to React 18

\`\`\`bash
npm install react@18 react-dom@18
\`\`\`

The first change: update your entry point to use \`createRoot\`:

\`\`\`tsx
// Before (React 17)
import ReactDOM from 'react-dom'
ReactDOM.render(<App />, document.getElementById('root'))

// After (React 18)
import { createRoot } from 'react-dom/client'
const root = createRoot(document.getElementById('root')!)
root.render(<App />)
\`\`\`

This single change opts you into **all React 18 concurrent features**.

## Automatic Batching

React 17 only batched updates inside event handlers. React 18 batches **everywhere**:

\`\`\`tsx
// React 17: 2 renders
// React 18: 1 render (batched)
setTimeout(() => {
  setCount(c => c + 1)
  setTheme('dark')
}, 1000)

// Opt out when needed:
import { flushSync } from 'react-dom'
flushSync(() => setCount(c => c + 1))   // render 1
flushSync(() => setTheme('dark'))        // render 2
\`\`\`

## Transitions

Mark state updates as non-urgent to keep the UI responsive:

\`\`\`tsx
import { useTransition } from 'react'

function FilterableList({ items }) {
  const [isPending, startTransition] = useTransition()
  const [filter, setFilter] = useState('')

  function handleChange(value: string) {
    setFilter(value)                        // urgent: update input
    startTransition(() => {
      setFilteredItems(applyFilter(items, value)) // non-urgent: filter results
    })
  }

  return (
    <>
      <input onChange={e => handleChange(e.target.value)} />
      {isPending && <Spinner />}
      <ItemList items={filteredItems} />
    </>
  )
}
\`\`\`

## useDeferredValue

Defer updates to expensive parts of the UI:

\`\`\`tsx
import { useDeferredValue } from 'react'

function SearchResults({ query }) {
  const deferredQuery = useDeferredValue(query)

  return (
    <div style={{ opacity: deferredQuery !== query ? 0.5 : 1 }}>
      <ExpensiveList filter={deferredQuery} />
    </div>
  )
}
\`\`\`

## Streaming SSR with Suspense

React 18 enables sending HTML in chunks:

\`\`\`tsx
// server (Node.js)
import { renderToPipeableStream } from 'react-dom/server'

app.get('/', (req, res) => {
  const { pipe } = renderToPipeableStream(<App />, {
    bootstrapScripts: ['/client.js'],
    onShellReady() {
      res.setHeader('Content-Type', 'text/html')
      pipe(res)
    },
  })
})

// client
<Suspense fallback={<Spinner />}>
  <Comments postId={postId} />   {/* streams in after shell */}
</Suspense>
\`\`\`

## New Hooks

### useId

Generate stable, unique IDs for accessibility:

\`\`\`tsx
function PasswordField() {
  const id = useId()
  return (
    <>
      <label htmlFor={id}>Password</label>
      <input id={id} type="password" />
    </>
  )
}
\`\`\`

### useSyncExternalStore

Safely subscribe to external stores:

\`\`\`tsx
const store = createExternalStore()

function Component() {
  const snapshot = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot, // for SSR
  )
}
\`\`\`

## Migration Checklist

- [ ] Update React and ReactDOM to v18
- [ ] Replace \`ReactDOM.render\` with \`createRoot\`
- [ ] Test for unexpected batching behavior
- [ ] Add \`<Suspense>\` boundaries around data-fetching components
- [ ] Adopt \`useTransition\` for slow UI updates
`,
  },
  {
    id: "building-design-systems-in-react",
    title: "Building Design Systems in React",
    author_email: "user-23@example.com",
    created_at: "2024-07-15T10:45:00Z",
    content: `## What Is a Design System?

A design system is a **shared language** between design and engineering: a set of reusable components, design tokens, and guidelines that ensure visual and behavioral consistency across products.

## Design Tokens

Start with tokens — the atomic values everything else is built from:

\`\`\`ts
// tokens.ts
export const tokens = {
  color: {
    brand: {
      primary:   '#0070f3',
      secondary: '#7928ca',
    },
    neutral: {
      50:  '#fafafa',
      100: '#f5f5f5',
      900: '#111111',
    },
    semantic: {
      success: '#0f9960',
      warning: '#f0b429',
      error:   '#e53e3e',
    },
  },
  spacing: {
    1: '4px',  2: '8px',  3: '12px',
    4: '16px', 6: '24px', 8: '32px',
  },
  fontSize: {
    xs: '12px', sm: '14px', base: '16px',
    lg: '18px', xl: '24px', '2xl': '32px',
  },
  borderRadius: {
    sm: '4px', md: '8px', lg: '12px', full: '9999px',
  },
} as const
\`\`\`

## Component API Design

Good component APIs are predictable and composable:

\`\`\`tsx
// Button with variant, size, and loading state
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={cn(styles.base, styles[variant], styles[size])}
    >
      {isLoading ? <Spinner /> : leftIcon}
      {children}
    </button>
  )
}
\`\`\`

## Component Composition Patterns

Prefer **compound components** for complex UI:

\`\`\`tsx
// Instead of a monolithic <Select options={...} />
// Use composable primitives:

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Choose a color" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="red">Red</SelectItem>
    <SelectItem value="blue">Blue</SelectItem>
  </SelectContent>
</Select>
\`\`\`

## Storybook Integration

\`\`\`bash
npx storybook@latest init
\`\`\`

\`\`\`tsx
// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost', 'danger'] },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    isLoading: { control: 'boolean' },
  },
}
export default meta

type Story = StoryObj<typeof Button>

export const Primary: Story = { args: { children: 'Click me', variant: 'primary' } }
export const Loading: Story = { args: { children: 'Saving...', isLoading: true } }
\`\`\`

## Accessibility in Design Systems

Every component in your design system should be accessible **by default**:

- Use [Radix UI](https://www.radix-ui.com/) or [React Aria](https://react-spectrum.adobe.com/react-aria/) for accessible primitives
- Test each component with keyboard navigation and a screen reader
- Document the expected ARIA attributes in component docs

## Versioning and Publishing

\`\`\`bash
# In your design system package
npm version patch  # bug fixes
npm version minor  # new components or props (backwards compatible)
npm version major  # breaking changes
npm publish
\`\`\`

Communicate breaking changes via a **CHANGELOG.md** and codemods where possible.

## Design System Checklist

- [ ] Design tokens defined and shared between Figma and code
- [ ] Each component has Storybook stories with all variants
- [ ] All components pass axe accessibility audit
- [ ] TypeScript types exported for all public APIs
- [ ] Components tested with component and snapshot tests
- [ ] CHANGELOG maintained for every release
`,
  },
  {
    id: "security-best-practices-for-react-apps",
    title: "Security Best Practices for React Apps",
    author_email: "user-24@example.com",
    created_at: "2024-07-22T16:20:00Z",
    content: `## Security Is Not Optional

A single vulnerability can expose user data, compromise accounts, or take down your service. This guide covers the most common attack vectors in React applications and how to prevent them.

## XSS (Cross-Site Scripting)

React escapes HTML by default — but \`dangerouslySetInnerHTML\` bypasses this:

\`\`\`tsx
// ❌ Dangerous — arbitrary HTML injection
<div dangerouslySetInnerHTML={{ __html: userContent }} />

// ✅ Sanitize first if you must render HTML
import DOMPurify from 'dompurify'
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userContent) }} />

// ✅ Even better — render as text (React's default)
<div>{userContent}</div>
\`\`\`

## Content Security Policy (CSP)

Add a strict CSP header to prevent scripts from untrusted origins:

\`\`\`
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'nonce-{RANDOM_NONCE}';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://api.example.com;
\`\`\`

## Authentication

\`\`\`tsx
// Store tokens in memory or HttpOnly cookies — NEVER in localStorage
// localStorage is accessible to any JS on the page (XSS risk)

// ✅ HttpOnly cookie (set server-side)
// The cookie is invisible to JavaScript entirely

// ✅ In-memory (lost on refresh — use refresh token in cookie)
let accessToken: string | null = null

export function setToken(token: string) { accessToken = token }
export function getToken() { return accessToken }
\`\`\`

## CSRF Protection

For state-changing requests, use CSRF tokens or same-site cookies:

\`\`\`ts
// Server-side: set a CSRF token in a cookie
// Client-side: read the cookie and send it as a header

async function apiRequest(path: string, body: unknown) {
  const csrfToken = getCookie('csrf-token')
  return fetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken ?? '',
    },
    body: JSON.stringify(body),
    credentials: 'include',
  })
}
\`\`\`

## Input Validation

**Never trust user input** — validate on both client and server:

\`\`\`ts
// Client-side validation (UX only — not a security measure)
import { z } from 'zod'

const createPostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(10).max(50000),
})

// Server-side validation (security boundary)
app.post('/api/posts', async (req, res) => {
  const result = createPostSchema.safeParse(req.body)
  if (!result.success) {
    return res.status(400).json({ error: result.error })
  }
  // proceed safely
})
\`\`\`

## Dependency Security

\`\`\`bash
# Audit for known vulnerabilities
npm audit

# Fix automatically where possible
npm audit fix

# Check for outdated packages
npx npm-check-updates
\`\`\`

Enable **Dependabot** (GitHub) or **Renovate** to automatically open PRs for dependency updates.

## Environment Variables

\`\`\`tsx
// ❌ Never expose secrets to the client
VITE_DATABASE_URL=postgres://...    // ← visible in the browser bundle!

// ✅ Secret vars stay server-only (no VITE_ prefix in Vite)
DATABASE_URL=postgres://...

// ✅ Only expose what the client truly needs
VITE_API_BASE_URL=https://api.example.com
VITE_PUBLIC_ANALYTICS_KEY=...
\`\`\`

## Security Headers Checklist

Ensure your server sets these headers:

- [ ] \`Content-Security-Policy\` — restrict resource origins
- [ ] \`X-Content-Type-Options: nosniff\` — prevent MIME sniffing
- [ ] \`X-Frame-Options: DENY\` — prevent clickjacking
- [ ] \`Strict-Transport-Security\` — enforce HTTPS
- [ ] \`Referrer-Policy: strict-origin-when-cross-origin\`
- [ ] \`Permissions-Policy\` — restrict browser feature access

Use [securityheaders.com](https://securityheaders.com) to audit your production site.
`,
  },
];

const DB_DELAY = 500; // Simulate network/database latency

const simulateDelay = () => new Promise((res) => setTimeout(res, DB_DELAY));

export async function getAllPostsWithPagination(page: number) {
  await simulateDelay();
  if(page < 1) {
    throw new Error("Invalid page number");
  }
  const pageSize = 5;
  const totalPosts = posts.length;
  const totalPages = Math.ceil(totalPosts / pageSize);
  const paginatedPosts = posts.slice((page - 1) * pageSize, page * pageSize);
  return {
    posts: paginatedPosts,
    pagination: {
      page,
      pageSize,
      totalPages,
      totalPosts,
    },
  };
}

export async function getPostById(id: string) {
  await simulateDelay();
  console.log("Getting post")
  const post = posts.find((p) => p.id === id);
  if (!post) {
    throw notFound()
  }
  return post;
}
