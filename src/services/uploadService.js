const s3 = require('../config/aws');
const {PutObjectCommand, GetObjectCommand} =  require('@aws-sdk/client-s3')
const crypto = require("crypto");
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const randomImageName = (bytes = 32) => {
  return crypto.randomBytes(bytes).toString('hex');
}
const uploadFile = async (file) => {
  console.log("file", file);

  const imageName = randomImageName()
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: imageName,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    const command = new PutObjectCommand(params);
    const response = await s3.send(command);
    return {imageName,response};
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw new Error('Failed to upload file to S3');
  }
};

const getPreSignedUrl = async (key, expiresIn = 3600) => {
  const bucketName = process.env.AWS_BUCKET_NAME;

  if (!bucketName) {
    throw new Error('AWS_BUCKET_NAME is not defined in the environment variables.');
  }

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  try {
      const signedUrl = await getSignedUrl(s3, command, { expiresIn });
      return signedUrl;
  } catch (error) {
    console.error('Error generating signed URL:', error.message);
    throw new Error('Failed to generate signed URL');
  }
};

module.exports = {
  uploadFile,
  getPreSignedUrl
};
