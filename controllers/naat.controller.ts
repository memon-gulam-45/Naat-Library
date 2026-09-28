import { Types } from "mongoose";

import Naat from "@/models/Naat";

export async function getAllNaats() {
  const naats = await Naat.find()
    .select("title slug")
    .populate("authors", "name slug")
    .populate("sanakhwans", "name slug")
    .populate("festivals", "name slug")
    .populate("categories", "name slug")
    .sort({ title: 1 });

  const total = await Naat.countDocuments();

  return {
    naats,
    total,
  };
}

export async function getNaatsWithLimit(page = 1, limit = 20) {
  const skip = (page - 1) * limit;

  const naats = await Naat.find()
    .select("title slug")
    .populate("authors", "name slug")
    .populate("sanakhwans", "name slug")
    .populate("festivals", "name slug")
    .populate("categories", "name slug")
    .sort({ title: 1 })
    .skip(skip)
    .limit(limit);

  const total = await Naat.countDocuments();

  return {
    naats,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
    },
  };
}

export async function getNaatBySlug(slug: string) {
  const naat = await Naat.findOne({ slug })
    .populate("authors", "name slug")
    .populate("sanakhwans", "name slug")
    .populate("festivals", "name slug")
    .populate("categories", "name slug");

  if (!naat) {
    throw new Error("Naat not found");
  }

  return naat;
}


export async function createNaat(data: any) {
  const naat = await Naat.create(data);

  return naat;
}

export async function updateNaat(id: string, data: any) {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error("Invalid Naat Id");
  }

  const naat = await Naat.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!naat) {
    throw new Error("Naat not found");
  }

  return naat;
}

export async function deleteNaat(id: string) {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error("Invalid Naat Id");
  }

  const naat = await Naat.findByIdAndDelete(id);

  if (!naat) {
    throw new Error("Naat not found");
  }

  return naat;
}
