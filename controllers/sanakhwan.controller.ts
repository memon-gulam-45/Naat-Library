import { Sanakhwan } from "@/models";

// GET ALL SANAKHWANS
export async function getAllSanakhwans() {
  const sanakhwans = await Sanakhwan.find()
    .select("name slug profileImage")
    .sort({ name: 1 });

  return sanakhwans;
}

// GET SANAKHWAN BY SLUG
export async function getSanakhwanBySlug(slug: string) {
  const sanakhwan = await Sanakhwan.findOne({ slug });

  if (!sanakhwan) {
    throw new Error("Sanakhwan not found");
  }

  return sanakhwan;
}

// CREATE SANAKHWAN
export async function createOneSanakhwan(data: any) {
  const sanakhwan = await Sanakhwan.create(data);

  return sanakhwan;
}

// CREATE MANY SANAKHWANS
export async function createManySanakhwans(data: any[]) {
  const sanakhwans = await Sanakhwan.insertMany(data);

  return sanakhwans;
}

// UPDATE SANAKHWAN
export async function updateSanakhwan(slug: string, data: any) {
  const sanakhwan = await Sanakhwan.findOneAndUpdate({ slug }, data, {
    new: true,
    runValidators: true,
  });

  if (!sanakhwan) {
    throw new Error("Sanakhwan not found");
  }

  return sanakhwan;
}

// DELETE SANAKHWAN
export async function deleteSanakhwan(slug: string) {
  const sanakhwan = await Sanakhwan.findOneAndDelete({
    slug,
  });

  if (!sanakhwan) {
    throw new Error("Sanakhwan not found");
  }

  return sanakhwan;
}
