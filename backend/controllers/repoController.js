import mongoose from "mongoose";
import Repository from "../models/repoModel.js";
import Issue from "../models/issueModel.js";
import User from "../models/userModel.js";

// Create a new repository and save it to the database
async function createRepository(req, res) {
  const { name, owner, content, description, visibility, issues } = req.body;
  try {
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }
    const repoName = await Repository.findOne({ name });
    if (repoName) {
      return res
        .status(400)
        .json({ message: "Repository with this name already exists" });
    }

    if (!mongoose.Types.ObjectId.isValid(owner)) {
      return res.status(400).json({ message: "Invalid owner ID" });
    }
    const newRepository = new Repository({
      name,
      owner,
      content,
      description,
      visibility,
      issues,
    });
    const result = await newRepository.save();
    res
      .status(201)
      .json({ message: "Repository created successfully", repoID: result._id });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Something went wrong" });
  }
}

// Get all repositories from the database and return them as a JSON response
async function getAllRepositories(req, res) {
  try {
    const repositories = await Repository.find({})
      .populate("issues")
      .populate("owner");
    res.status(200).json(repositories);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Something went wrong" });
  }
}

// Get a repository by its ID and return it as a JSON response if it exists in the database or a 404 response if it does not exist
async function fetchRepositoryById(req, res) {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid repository ID" });
    }
    const repository = await Repository.findById(id)
      .populate("issues")
      .populate("owner");
    if (!repository) {
      return res.status(404).json({ message: "Repository not found" });
    }
    res.status(200).json(repository);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Something went wrong" });
  }
}

// Get a repository by its name and return it as a JSON response if it exists in the database or a 404 response if it does not exist
async function fetchRepositoryByName(req, res) {
  const { name } = req.params;
  try {
    const repository = await Repository.findOne({ name })
      .populate("issues")
      .populate("owner");
    if (!repository) {
      return res.status(404).json({ message: "Repository not found" });
    }
    res.status(200).json(repository);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Something went wrong" });
  }
}

// Get all repositories for the current user and return them as a JSON response if they exist in the database or a 404 response if they do not exist
async function fetchRepositorsForCurrentUser(req, res) {
  const { userId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    const repositories = await Repository.find({ owner: userId }).populate(
      "issues"
    );
    if (!repositories) {
      res.status(404).json({ message: "Repositories not found" });
    }
    res.status(200).json({ message: "Repositories found!", repositories });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Something went wrong" });
  }
}

// Update a repository by its ID and return the updated repository as a JSON response if it exists in the database or a 404 response if it does not exist
async function updateRepositoryById(req, res) {
  const { id } = req.params;
  const { content, description } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid repository ID" });
    }
    const repository = await Repository.findById(id);
    if (!repository) {
      return res.status(404).json({ message: "Repository not found" });
    }
    const updatedRepository = await Repository.findByIdAndUpdate(
      id,
      { content, description },
      { new: true }
    );
    res.status(200).json(updatedRepository);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Something went wrong" });
  }
}

// Toggle the visibility of a repository by its ID and return the updated repository as a JSON response if it exists in the database or a 404 response if it does not exist
async function toggleRepositoryVisibilityById(req, res) {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid repository ID" });
    }
    const repository = await Repository.findById(id);
    if (!repository) {
      return res.status(404).json({ message: "Repository not found" });
    }
    const updatedRepository = await Repository.findByIdAndUpdate(
      id,
      { visibilty: !repository.visibilty },
      { new: true }
    );
    if (!updatedRepository) {
      return res
        .status(500)
        .json({ message: "Something went wrong (visibility)" });
    }
    res.status(200).json(updatedRepository);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Something went wrong" });
  }
}

// Delete a repository by its ID and return a success message as a JSON response if it exists in the database or a 404 response if it does not exist
async function deleteRepositoryById(req, res) {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid repository ID" });
    }
    const repository = await Repository.findById(id);
    if (!repository) {
      return res.status(404).json({ message: "Repository not found" });
    }
    const deletedRepository = await Repository.findByIdAndDelete(id);
    if (!deletedRepository) {
      return res.status(500).json({ message: "Something went wrong (delete)" });
    }
    res.status(200).json({ message: "Repository deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Something went wrong" });
  }
}

async function toggleStarRepository (req, res) {
  try {
    const { repoId } = req.params;
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const repo = await Repository.findById(repoId);
    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }

    const alreadyStarred = user.starRepos.includes(repoId);

    if (alreadyStarred) {
      // Agar already starred hai, to remove karenge
      user.starRepos = user.starRepos.filter(id => id.toString() !== repoId);
    } else {
      // Nahi hai to add karenge
      user.starRepos.push(repoId);
    }

    await user.save();
    res.json({ message: alreadyStarred ? "Repository unstarred" : "Repository starred", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export {
  createRepository,
  getAllRepositories,
  fetchRepositoryById,
  fetchRepositoryByName,
  fetchRepositorsForCurrentUser,
  updateRepositoryById,
  toggleRepositoryVisibilityById,
  deleteRepositoryById,
  toggleStarRepository,
};
