import mongoose, { Schema, model } from "mongoose";

const festivalSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  biography: { type: String },
  profileImage: { type: String },
  seo: {
    metaTitle: { type: String },
    metaDescription: { type: String },
    metaKeywords: [{ type: String }],
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Festival || model("Festival", festivalSchema);
