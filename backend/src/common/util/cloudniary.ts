import { BadRequestException } from '@nestjs/common';
import { CloudinaryUploadResponse } from '../type/cloudinary-upload';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const cloudinaryUpload = async (
  file: string,
  folder: string,
): Promise<CloudinaryUploadResponse> => {
  try {
    return await cloudinary.uploader.upload(file, { folder: folder });
  } catch (error) {
    throw new BadRequestException(error.message);
  }
};

export const cloudinaryDeleteFile = async (
  public_id: string,
): Promise<{ result: string }> => {
  try {
    return await cloudinary.uploader.destroy(public_id);
  } catch (error) {
    throw new BadRequestException(error.message);
  }
};
