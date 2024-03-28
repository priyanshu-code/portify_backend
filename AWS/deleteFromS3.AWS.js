import { CustomAPIError } from '../errors/index.js';
import { AWS_S3_BUCKET_NAME, AWS_REGION, ENV } from '../globals/globals.js';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { updateUserDataOnImageDeleteFromS3 } from '../services/userData.service.js';

import client from './s3Client.AWS.js';

// Function to delete an object from an S3 bucket
export const deleteObjectFromS3 = async ({ userId, objectUrl }) => {
  const objectKey = objectUrl.split(`https://${AWS_S3_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/`)[1];
  try {
    const params = {
      Bucket: AWS_S3_BUCKET_NAME,
      Key: objectKey,
    };
    const deleteCommand = new DeleteObjectCommand(params);
    if (ENV === 'PROD') {
      await client.send(deleteCommand);
    }
    console.log(`${objectKey} deleted successfully from S3.`);
    await updateUserDataOnImageDeleteFromS3({ userId, objectKey });
    return objectUrl;
  } catch (error) {
    console.log(error);
    throw new CustomAPIError('Error deleting Image from S3');
  }
};
