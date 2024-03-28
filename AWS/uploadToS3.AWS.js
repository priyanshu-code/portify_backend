import { AWS_REGION, AWS_S3_BUCKET_NAME, ENV } from '../globals/globals.js';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { CustomAPIError, BadRequestError } from '../errors/index.js';
import { checkUserImageLimitService, updateUserDataOnImageUploadToS3 } from '../services/userData.service.js';
import client from './s3Client.AWS.js';

const uploadImageToS3 = async ({ userId, file }) => {
  // Check user Image Limits
  const limitReached = await checkUserImageLimitService(userId);
  if (limitReached) {
    throw new BadRequestError('Daily limit for uploading images reached');
  }

  const { originalname, buffer, mimetype, size } = file;
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  // Create new unique name without spaces
  const newName = uniqueSuffix + '-aws-' + originalname.replace(/ /g, '_');
  // Command to put object in bucket
  const command = new PutObjectCommand({
    Bucket: AWS_S3_BUCKET_NAME,
    Key: newName,
    Body: buffer,
    ContentType: mimetype,
  });
  try {
    if (ENV === 'PROD') {
      await client.send(command);
    }
    // Construct the URL for the uploaded object
    const objectUrl = `https://${AWS_S3_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${newName}`;
    console.log(`${objectUrl} \nuploaded successfully from S3.`);
    // Update user data
    await updateUserDataOnImageUploadToS3({ userId, data: { objectUrl, size, objectKey: newName } });
    return objectUrl; // Return the S3 URL
  } catch (err) {
    console.log(err);
    throw new CustomAPIError('Error uploading Image to S3');
  }
};

export { uploadImageToS3 };
