import { BadRequestException, Logger } from '@nestjs/common';
import { CloudinaryUploadResponse } from '../type/cloudinary-upload';
import * as fs from 'fs';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: 'dwe6cjqga',
  api_key: '272485519596644',
  api_secret: 'FNCyS7yEz0ru05eu7TuC-LMmZlo',
});

// Function to check if folder exists by listing its resources
export const checkCloudinaryFolder = async (folder: string) => {
  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: folder, // This will list resources under the folder
      max_results: 1, // We only need to check if the folder has any resource
    });

    if (result.resources && result.resources.length > 0) {
      return true; // Folder exists with resources
    } else {
      return false; // No resources, folder might not exist
    }
  } catch (error) {
    Logger.error(`Error checking Cloudinary folder: ${error.message}`);
    throw new BadRequestException('Error checking folder on Cloudinary');
  }
};

// Function to upload file to Cloudinary (creates folder if it doesn't exist)
export const cloudinaryUpload = async (
  file: string,
  folder: string,
): Promise<CloudinaryUploadResponse> => {
  try {
    // Check if file exists locally
    if (!fs.existsSync(file)) {
      throw new BadRequestException('File does not exist at the provided path');
    }

    // Perform the Cloudinary upload
    const response = await cloudinary.uploader.upload(file, { folder });
    return response;
  } catch (error) {
    Logger.error(`Cloudinary upload failed: ${JSON.stringify(error)}`); // Log full error object
    throw new BadRequestException('Cloudinary upload failed: ' + error.message || error);
  }
};

// Function to delete a file on Cloudinary
export const cloudinaryDeleteFile = async (
  public_id: string,
): Promise<{ result: string }> => {
  try {
    return await cloudinary.uploader.destroy(public_id);
  } catch (error) {
    throw new BadRequestException(error.message);
  }
};
