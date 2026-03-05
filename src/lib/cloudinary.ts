import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_CLOUD_APIKEY!,
  api_secret: process.env.CLOUDINARY_CLOUD_APISECRET!,
});


// =======================
// ✅ Upload Image
// =======================
export const uploadOnCloudinary = async (
  file: Blob
): Promise<string | null> => {
  if (!file) return null;

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          folder: "products",   // ⭐ IMPORTANT
        },
        (error, result) => {
          if (error) {
            console.log("Cloudinary Error:", error);
            reject(error);
          } else {
            resolve(result?.secure_url ?? null);
          }
        }
      );

      uploadStream.end(buffer);
    });
  } catch (error) {
    console.log("Upload failed:", error);
    return null;
  }
};



// =======================
// ✅ Delete Image
// =======================
export const deleteFromCloudinary = async (imageUrl: string) => {
  try {
    if (!imageUrl) return;

    // 👉 extract public_id from url
    const parts = imageUrl.split("/");
    const fileName = parts[parts.length - 1];
    const folder = parts[parts.length - 2];

    const publicId = `${folder}/${fileName.split(".")[0]}`;

    const result = await cloudinary.uploader.destroy(publicId);

    console.log("Deleted Cloudinary:", publicId, result.result);
  } catch (error) {
    console.log("Cloudinary delete error:", error);
  }
};