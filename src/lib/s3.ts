import AWS from 'aws-sdk'

export async function uploadToS3(file: File){
    try{
      // Configure AWS SDK with your credentials and region
      AWS.config.update({
        accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY,
      })

      // Configure S3 instance
      const s3 = new AWS.S3({
        params: {
          Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,          
        },
        region: 'ap-south-1'
      });

      // Create file key = uploads/{date}{file-name}
      const file_key = 'uploads/' + Date.now().toString() + file.name.replace(' ','-')

      const params = {
        // Bucket can be string | undefined, so use typescript! or as string
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
        Key: file_key,
        Body: file
      }

      // Upload params to s3 object and shows the percentage of file upload completion
      const upload = s3.putObject(params).on('httpUploadProgress', evt => {
        console.log('Uploading to s3... ', parseInt(((evt.loaded*100)/evt.total).toString()))
      }).promise()

      await upload.then(data => {
        console.log('Successfully uploaded to S3!', file_key)
      });

      return Promise.resolve({
        file_key,
        file_name: file.name,
      })
    }
    catch(error){

    }
}

// Get publicly accessible url using file key
export function getS3Url(file_key: string ){
  const url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.ap-south-1.amazonaws.com/${file_key}`;
  return url;
}