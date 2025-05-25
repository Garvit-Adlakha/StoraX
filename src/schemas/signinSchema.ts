import * as z from "zod"

export const signinSchema=z.object({
    email:z.string()
            .min(1, {message: "Email is required"})
            .email({message: "Invalid email address"}),
    password:z.string()
            .min(1, {message: "Password is required"})
            .min(8, {message: "Password must be at least 8 characters long"}),
})

export type SigninSchema = z.infer<typeof signinSchema>
