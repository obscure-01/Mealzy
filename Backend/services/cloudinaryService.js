import { v2 as cloudinary } from 'cloudinary';


cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key:  process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

const uploadImage = async (imagePath) => {
    if (!imagePath) return null;

    const uploadResult = await cloudinary.uploader.upload(
        imagePath, {
            resourcetype : 'image'
        }
    )
    return uploadResult;
}

const deleteImage = async (imageID) => {
    if (!imageID) {
        return null
    }
    const result = await cloudinary.uploader.destroy(imageID)
}

export { uploadImage, deleteImage };