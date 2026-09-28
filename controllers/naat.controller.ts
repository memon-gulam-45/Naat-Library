import { Types } from "mongoose";
import Naat from "@/models/Naat";

export async function getAllNaats() {
  try {
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
  } catch (error) {
    console.error("Error fetching naats:", error);
    throw new Error("Failed to fetch naats");
  }
}

export async function getNaatsWithLimit(page = 1, limit = 20) {
  try {
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
  } catch (error) {
    console.error("Error fetching naats:", error);
    throw new Error("Failed to fetch naats");
  }
}

export async function getNaatById(id: string) {
  try {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid Naat Id");
    }

    const naat = await Naat.findById(id)
      .populate("authors", "name slug")
      .populate("sanakhwans", "name slug")
      .populate("festivals", "name slug")
      .populate("categories", "name slug");

    if (!naat) {
      throw new Error("Naat not found");
    }
    return naat;
  } catch (error) {
    console.error("Error fetching naat by Id:", error);
    throw new Error("Failed to fetch naat by Id");
  }
}

export async function createNaat(data: any) {
  try {
    const naat = await Naat.create(data);

    return naat;
  } catch (error) {
    console.error("Error creating naat:", error);
    throw new Error("Failed to create naat");
  }
}

export async function updateNaat(id: string, data: any) {
  try {
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
  } catch (error) {
    console.error("Error updating naat:", error);
    throw new Error("Failed to update naat");
  }
}

export async function deleteNaat(id: string) {
  try {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid Naat Id");
    }

    const naat = await Naat.findByIdAndDelete(id);

    if (!naat) {
      throw new Error("Naat not found");
    }

    return naat;
  } catch (error) {
    console.error("Error deleting naat:", error);
    throw new Error("Failed to delete naat");
  }
}
