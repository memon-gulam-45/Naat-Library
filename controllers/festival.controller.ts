import Festival from "@/models/Festival";

// GET ALL FESTIVALS
export async function getAllFestivals() {
  const festivals = await Festival.find()
    .select("name slug profileImage slug")
    .sort({ name: 1 });

  return festivals;
}

// GET FESTIVAL BY SLUG
export async function getFestivalBySlug(slug: string) {
  const festival = await Festival.findOne({ slug });

  if (!festival) {
    throw new Error("Festival not found");
  }

  return festival;
}

// CREATE FESTIVAL
export async function createOneFestival(data: any) {
  const festival = await Festival.create(data);

  return festival;
}

// CREATE MANY FESTIVALS
export async function createManyFestivals(data: any[]) {
  const festivals = await Festival.insertMany(data);
  return festivals;
}

// UPDATE FESTIVAL
export async function updateFestival(slug: string, data: any) {
  const festival = await Festival.findOneAndUpdate({ slug }, data, {
    new: true,
    runValidators: true,
  });

  if (!festival) {
    throw new Error("Festival not found");
  }

  return festival;
}

// DELETE FESTIVAL
export async function deleteFestival(slug: string) {
  const festival = await Festival.findOneAndDelete({
    slug,
  });

  if (!festival) {
    throw new Error("Festival not found");
  }

  return festival;
}
