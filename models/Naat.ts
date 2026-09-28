import mongoose, { Schema, model } from "mongoose";

const naatSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, trim: true },
    content: {
      english: { type: String, required: true },
      hindi: { type: String, required: true },
    },
    authors: [{ type: Schema.Types.ObjectId, ref: "Author" }],
    sanakhwans: [{ type: Schema.Types.ObjectId, ref: "Sanakhwan" }],
    categories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    festivals: [{ type: Schema.Types.ObjectId, ref: "Festival" }],

    tazmin: { type: String },

    status: { type: String, enum: ["draft", "published"], default: "draft" },
    featured: { type: Boolean, default: false },

    seo: {
      metaTitle: { type: String },
      metaDescription: { type: String },
      metaKeywords: [{ type: String }],
    },

    views: { type: Number, default: 0 },

    publishedAt: { type: Date },
  },
  { timestamps: true },
);

export default mongoose.models.Naat || model("Naat", naatSchema);
