import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { ImageKit } from "imagekit-javascript";

export async function POST(req:NextRequest){
    try {
        const {userId}= await auth()
        if(!userId){
            return NextResponse.json({error:"Unauthorized"},{status:401})
        }

        //parse request body
        const body=await req.json()
        const {imagekit,userId:bodyUserId}=body
        if(bodyUserId!==userId){
            return NextResponse.json({error:"Unauthorized"},{status:401})
        }
        if(!imagekit || imagekit.url){
            return NextResponse.json({error:"Invalid file uplaod data"},{status:400})
        }
        const fileData={
            name:imagekit.name || "untitled",
            path:imagekit.filePath,
            size:imagekit.size || 0,
            type:imagekit.fileType || "image",
            fileUrl:imagekit.url,
            thumbnailUrl:imagekit.thumbnailUrl ||null,
            userId:userId,
            //root levl by default
            parentFolderId:null,
            isFolder:false,
            isBookmarked:false,
            isTrashed:false,
            createdAt:new Date(),
            updatedAt:new Date(),
        }
        const [newFile]=await db.insert(files).values(fileData).returning()
        return NextResponse.json(newFile,{status:201})
    } catch (error:any) {
        return NextResponse.json({
            error:"Failed to save info to database"
        },{status:500})
    }
}