import * as z from "zod"

export const signupSchema = z.object({
    name:z.string()
            .min(1, {message: "Name is required"})
            .max(50, {message: "Name must be less than 50 characters"}),
    email:z.string()
            .min(1, {message: "Email is required"})
            .email({message: "Invalid email address"}),
    password:z.string()
            .min(1, {message: "Password is required"})
            .min(8, {message: "Password must be at least 8 characters long"}),
    confirmPassword:z.string()
            .min(1, {message: "Confirm password is required"})
            .min(8, {message: "Password must be at least 8 characters long"}),
}).refine((data)=>data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match"
})

export type SignupSchema = z.infer<typeof signupSchema>

//refine((data)=>{},{
//    path: 
//    message: 
//})