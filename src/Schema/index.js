import { z } from "zod"

export const projectSchema =  z.object({
  name: z.string().min(3, "Project name must be at least 3 characters"),
  description: z.string().optional(),
})

export const boardSchema =  z.object({
    name: z.string().min(3, "Board name must be at least 3 characters"),
    description: z.string().optional(),
  })

export const taskSchema =  z.object({
  title: z.string().min(3, "Title name must be at least 3 characters"),
  description: z.string().optional(),
})