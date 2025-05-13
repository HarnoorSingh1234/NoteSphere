import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadButton as UploadButtonComponent, UploadDropzone as UploadDropzoneComponent, Uploader as UploaderComponent } from "@uploadthing/react";
 
const f = createUploadthing();
 
export const ourFileRouter = {
  noteFile: f({ pdf: { maxFileSize: "16MB" }, image: { maxFileSize: "8MB" } })
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      
      // Get the current user
      const user = { id: "1234" }; // Mock user, replace with actual auth
      
      // If you throw, the user will not be able to upload
      if (!user) throw new Error("Unauthorized");
      
      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);
      
      console.log("file url", file.url);
      
      // Return the file url or other data to the client
      return { uploadedBy: metadata.userId, url: file.url };
    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;
