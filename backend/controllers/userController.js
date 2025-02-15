import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.MONGOdb_URI;
let client;

// Connect to the database
async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
  return client.db("githubcloneithubclone").collection("users");
}

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });

const handleErrors = (res, error, message = "Something went wrong") => {
  console.error(error.message);
  res.status(500).json({ message });
};

// User controller functions for handling user requests
async function signUp(req, res) {
  const { username, email, password } = req.body;
  try {
    const userCollection = await connectToDatabase();
    if (await userCollection.findOne({ username })) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const { insertedId } = await userCollection.insertOne({
      username,
      email,
      password: hashedPassword,
      repositories: [],
      followedUsers: [],
      starRepos: [],
    });

    res.status(201).json({ token: generateToken(insertedId) });
  } catch (error) {
    handleErrors(res, error);
  }
}

// Login controller function
async function login(req, res) {
  const { email, password } = req.body;
  try {
    const userCollection = await connectToDatabase();
    const user = await userCollection.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    res.status(200).json({ token: generateToken(user._id), userId: user._id });
  } catch (error) {
    handleErrors(res, error);
  }
}

// Get all users controller function
async function getAllUsers(req, res) {
  try {
    const userCollection = await connectToDatabase();
    res.status(200).json(await userCollection.find({}).toArray());
  } catch (error) {
    handleErrors(res, error);
  }
}

// Get user profile controller function
async function getUserProfile(req, res) {
  try {
    const userCollection = await connectToDatabase();
    const user = await userCollection.findOne({
      _id: new ObjectId(req.params.id),
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.send(user);
  } catch (error) {
    handleErrors(res, error);
  }
}

// Update user profile controller function
async function updateUserProfile(req, res) {
  try {
    const userCollection = await connectToDatabase();
    const { email, password } = req.body;
    let updatedFields = {};
    if (email) updatedFields.email = email;
    if (password) updatedFields.password = await bcrypt.hash(password, 10);

    const result = await userCollection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updatedFields }
    );

    if (result.modifiedCount === 0)
      return res.status(400).json({ message: "No changes made" });
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    handleErrors(res, error);
  }
}

// Delete user profile controller function
async function deleteUserProfile(req, res) {
  try {
    const userCollection = await connectToDatabase();
    const result = await userCollection.deleteOne({
      _id: new ObjectId(req.params.id),
    });
    if (result.deletedCount === 0)
      return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    handleErrors(res, error);
  }
}

export {
  getAllUsers,
  signUp,
  login,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
};
