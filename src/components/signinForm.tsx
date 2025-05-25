"use client"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useSignIn } from "@clerk/nextjs"
import { signinSchema, SigninSchema } from "../schemas/signinSchema"
import {useRouter} from "next/navigation"

const signinForm = () => {

const {signIn,setActive,isLoaded} = useSignIn()
const [isSubmitting,setIsSubmitting] = useState(false)
const [authError,setAuthError] = useState<string | null>(null)
const router=useRouter()

const {register,handleSubmit,formState:{errors}} =useForm<SigninSchema>({
    resolver:zodResolver(signinSchema),
    defaultValues:{
        email:"",
        password:""
    }
})

const onSubmit=async(data:SigninSchema)=>{
    if(!isLoaded) return;
    setIsSubmitting(true)
    setAuthError(null)
    try {
       const result= await signIn.create({
            identifier:data.email,
            password:data.password
        })
        if(result.status==="complete"){
           await setActive({
                session:result.createdSessionId
            })
            router.push("/dashboard")
        }
        else{
            setAuthError("Something went wrong")
        }
    } catch (error:any) {
        setAuthError(error.errors?.[0].message || "Something went wrong")
    }
    finally{
        setIsSubmitting(false)
    }
}
return(
<h1>Signin</h1>
)

}

export default signinForm;