import fs from "fs/promises";
import path from "path";

export default async function addRepo(filePath) {
  const repoPath = path.resolve(process.cwd(), ".apnaGit");
  const stagingPath = path.join(repoPath, "staging");

  try {
    await fs.mkdir(stagingPath, { recursive: true });
    const fileName = path.basename(filePath);
    await fs.copyFile(filePath, path.join(stagingPath, fileName));
    console.log(`File ${fileName} added the staging area`);
  } catch (error) {
    console.log("some error: ", error.message);
  }
}
