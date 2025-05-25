import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import ImageKit from "imagekit-javascript";

const imagekit=new ImageKit({
    publicKey:process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
    privateKey:process.env.IMAGEKIT_PRIVATE_KEY || "",
    urlEndpoint:process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
})

export async function GET(){
try {
       const {userId}= await auth()
        if(!userId){
            return NextResponse.json({error:"Unauthorized"},{status:401})
        }
        const token=imagekit.getAuthenticationParameters(userId)
        return NextResponse.json(token)
} catch (error:any) {
    return NextResponse.json({
        error:"failed to generate imagekit token"
    },{status:500})
}
}