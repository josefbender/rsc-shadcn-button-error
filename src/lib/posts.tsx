import { PostContent } from "@/components/PostContent"
import { createServerFn } from "@tanstack/react-start"
import { renderServerComponent } from "@tanstack/react-start/rsc"
import { z } from "zod"
import { getAllPostsWithPagination, getPostById } from "./db.server"

export const getAllPostsWithPaginationFn = createServerFn()
  .inputValidator(z.object({ page: z.number().int().min(1) }))
  .handler(({ data }) => getAllPostsWithPagination(data.page))

export const getPostByIdFn = createServerFn()
  .inputValidator(z.object({ id: z.string() }))
  .handler(({ data }) => getPostById(data.id))

export const getPostComponentFn = createServerFn()
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const post = await getPostById(data.id)
    return renderServerComponent(<PostContent post={post} />)
  })
