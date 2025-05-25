"use client"
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSignUp } from '@clerk/nextjs'
import { signupSchema, SignupSchema } from '../schemas/signupSchema'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import {Card, CardBody} from "@heroui/react";

const signupForm = () => {

    const router = useRouter()
    const {signUp,isLoaded,setActive} = useSignUp()

    const [verificationCode,setVerificationCode] = useState("")

    const [verification,setVerification] = useState(false)

    const [isSubmitting,setIsSubmitting] = useState(false)


    const [authError,setAuthError] = useState<string | null>(null)

    const [verificationError,setVerificationError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState:{errors}
    } = useForm<SignupSchema>({
        resolver:zodResolver(signupSchema),
        defaultValues:{
            email:"",
            name:"",
            password:"",
            confirmPassword:""
        }
    })
const onSubmit = async (data:SignupSchema)=>{
    if(!isLoaded) return
    setIsSubmitting(true)
    setAuthError(null)
    try {
        await signUp.create({
            emailAddress:data.email,
            password:data.password,
            firstName:data.name,
            lastName:data.name
        })
        await signUp.prepareEmailAddressVerification({
            strategy:"email_code"
        })
        setVerification(true)
    } catch (error:any) {
        console.log("Signup error :: ",error.message)
            setAuthError(
                error.errors?.[0]?.message || "An error occurred during signup"
            )
    }finally{
        setIsSubmitting(false)
    }
}


const handleVerificationSubmit = async (e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault()
    if(!isLoaded || !signUp) return
    setIsSubmitting(true)
    setAuthError(null)
    try {
       const result= await signUp.attemptEmailAddressVerification({
            code:verificationCode
        })
        console.log("Verification result :: ",result)
        if(result.status === "complete"){
            await setActive({
                session:result.createdSessionId
            })
            //todo: redirect to home page
            router.push("/dashboard")
        }
        else{
            console.log("Verification incomplete",result)
            setVerificationError("verification could not be completed") 
        }

    } catch (error:any) {
        console.log("Verification error :: ",error.message)
        setVerificationError(error.errors?.[0]?.message || "An error occurred during verification.please try again")
               
    }finally{
        setIsSubmitting(false)
    }
}
    if(verification){
        return(
            <div>
                This is otp verification
            </div>
        )
    }
    return(
     <Card>
        <CardBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              
            </form>
        </CardBody>
     </Card>
    )

}

export default signupForm