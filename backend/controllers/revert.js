import fs from "fs";
import path from "path";
import { promisify } from "util";

const readdir = promisify(fs.readdir);
const copyFile = promisify(fs.copyFile);


export default async function revertRepo(commitID) {
    const repoPath = path.resolve(process.cwd(), ".apnaGit");

    try {
        const commitDir = path.join(repoPath, "commits", commitID);
        const files = await readdir(commitDir);
        const parentDir = path.join(repoPath, "..");
        for (const file of files) {
            await copyFile(path.join(commitDir, file), path.join(parentDir, file));
        }
        console.log("Reverted to commit: ", commitID);
    } catch (error) {
        console.error("Error reverting to commit: ", error);
        
    }
}