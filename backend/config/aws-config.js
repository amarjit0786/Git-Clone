import AWS from "aws-sdk";

AWS.config.update({ region: "ap-south-1",accessKeyId: "AKIAYSE4OAHVG3IOEWWX",
    secretAccessKey: "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" });

const s3 = new AWS.S3();
const S3_BUCKET = "github-demo-bucket";

export { s3, S3_BUCKET };
// github-demo-bucket
