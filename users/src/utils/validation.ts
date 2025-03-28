import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
  }),
});

export const updateUserSchema = z.object({
  params: z.object({
    id: z.string().min(1, { message: "User ID is required" }),
  }),
  body: z.object({
    name: z.string().min(1, { message: "Name is required" }).optional(),
    email: z.string().email({ message: "Invalid email address" }).optional(),
  }),
});

export const getUserSchema = z.object({
  params: z.object({
    id: z.string().min(1, { message: "User ID is required" }),
  }),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type GetUserInput = z.infer<typeof getUserSchema>;
