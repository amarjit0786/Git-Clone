import fs from "fs/promises";
import path from "path";
import { s3, S3_BUCKET } from "../config/aws-config.js";

export default async function pullRepo(params) {
  const repoPath = path.resolve(process.cwd(), ".apnaGit");
  const commitsPath = path.join(repoPath, "commits");

  try {
    const data = await s3.listObjects({ Bucket: S3_BUCKET }).promise();
    const objects = data.Contents;
    for (const object of objects) {
      const key = object.Key;
      const commitDir = path.join(
        commitsPath,
        path.dirname(key).split("/").pop()
      );

      await fs.mkdir(commitDir, { recursive: true });

      const downloadParams = {
        Bucket: S3_BUCKET,
        Key: key,
      };
      const fileContent = await s3.getObject(downloadParams).promise();
      await fs.writeFile(path.join(repoPath, key), fileContent.Body);
    }
    console.log("All commits pulled from S3.");
  } catch (error) {
    console.error("Error pulling from S3 : ", error);
  }
}
