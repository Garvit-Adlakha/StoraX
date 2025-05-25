import { pgTable, serial, text,integer,uuid, boolean, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const files=pgTable("files",{
    id:uuid("id").defaultRandom().primaryKey(),

    //file info
    name:text("name").notNull(),
    path:text("path").notNull(), //path to the file
    size:integer("size").notNull(),
    type:text("type").notNull(),

    //storage info
    fileUrl:text("file_url").notNull(), //url to the file(imagekit)
    thumbnailUrl:text("thumbnail_url"), //url to the thumbnail(imagekit)

    //owner info
    userId:text("user_id").notNull(),
    parentFolderId:uuid("parent_folder_id"), //id of the parent folder null for root

    //boolean flags
    isFolder:boolean("is_folder").default(false).notNull(),
    isBookmarked:boolean("is_bookmarked").default(false).notNull(),
    isTrashed:boolean("is_trashed").default(false).notNull(),

    //timestamps
    createdAt:timestamp("created_at").defaultNow().notNull(),
    updatedAt:timestamp("updated_at").defaultNow().notNull(),


})

export const filesRelations=relations(files,({one,many})=>({
    parentFolder:one(files,{
        fields:[files.parentFolderId],
        references:[files.id]
    }), 

    //
    children:many(files,{
        relationName:"children"
    })
}))

//to get the type of the table for type safety
export const File=typeof files.$inferSelect
export type FileType=typeof files.$inferInsert