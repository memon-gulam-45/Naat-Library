import mongoose, { Schema, model } from "mongoose";

const festivalSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, trim: true },
    biography: { type: String },
    profileImage: { type: String },
    seo: {
      metaTitle: { type: String },
      metaDescription: { type: String },
      metaKeywords: [{ type: String }],
    },
  },
  { timestamps: true },
);

export default mongoose.models.Festival || model("Festival", festivalSchema);
