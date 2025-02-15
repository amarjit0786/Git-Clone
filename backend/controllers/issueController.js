import mongoose from "mongoose";
import Repository from "../models/repoModel.js";
import Issue from "../models/issueModel.js";
import User from "../models/userModel.js";

// Create a new issue and save it to the database
async function createIssue(req, res) {
  const { title, description } = req.body;
  const { id } = req.params;
  try {
    const issue = new Issue({
      title,
      description,
      repository: id,
    });

    await issue.save();
    res.status(201).json({ message: "Issue created successfully", issue });
  } catch (error) {
    console.error("Error during issue creation : ", error.message);
    res.status(500).send("Server error");
  }
}

// Update an issue by its ID
async function updateIssueById(req, res) {
  const { id } = req.params;
  const { title, description, status } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid issue ID" });
    }
    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }
    issue.title = title;
    issue.description = description;
    issue.status = status;
    await issue.save();
    res.status(200).json({ message: "Issue updated successfully", issue });
  } catch (error) {
    console.error("Error during issue updation : ", error.message);
    res.status(500).send("Server error");
  }
}

// Delete an issue by its ID
async function deleteIssueById(req, res) {
  const {id}= req.params;
  try {
    const issue= await Issue.findByIdAndDelete(id);
    if(!issue){
      return res.status(404).json({message: "Issue not found"});
    }
    res.status(200).json({message: "Issue deleted successfully"});
  } catch (error) {
    console.error("Error during issue deletion : ", error.message);
    res.status(500).send("Server error");
  }
}

// Fetch all issues from the database
async function getAllIssues(req, res) {
    try{
        const issues =await Issue.find({});
        if(!issues){
            return res.status(404).json({message: "No issues found"});
        }
        res.status(200).json(issues);
    }
    catch(error){
        console.error("Error during fetching issues : ", error.message);
        res.status(500).send("Server error");
    }
}

// Fetch an issue by its ID
async function getIssueById(req, res) {
  const {id}=req.params;
  try{
    const issue = await Issue.findById(id);
    if(!issue){
      return res.status(404).json({message: "Issue not found"});
    }
    res.status(200).json(issue);

  }catch(error){
    console.error("Error during fetching issue : ", error.message);
    res.status(500).send("Server error");
  }
}

export {
  createIssue,
  updateIssueById,
  deleteIssueById,
  getAllIssues,
  getIssueById,
};
