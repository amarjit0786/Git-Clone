import mongoose from "mongoose";
import { Schema } from "mongoose";

const RepositorySchema = new Schema({
    name: { type: String, required: true,unique: true },
    description: { type: String },
    content:[{type:String}],
    visibilty: { type: Boolean },
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    issues: [{ type: Schema.Types.ObjectId, ref: "Issue" }],
});

const Repository = mongoose.model("Repository", RepositorySchema);
export default Repository;