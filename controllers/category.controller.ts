import { Category } from "@/models";

// GET ALL CATEGORIES
export async function getAllCategories() {
  const categories = await Category.find()
    .select("name slug profileImage slug")
    .sort({ name: 1 });

  return categories;
}

// GET CATEGORY BY SLUG
export async function getCategoryBySlug(slug: string) {
  const category = await Category.findOne({ slug });

  if (!category) {
    throw new Error("Category not found");
  }

  return category;
}

// CREATE CATEGORY
export async function createOneCategory(data: any) {
  const category = await Category.create(data);

  return category;
}

// CREATE MANY CATEGORIES
export async function createManyCategory(data: any[]) {
  const categories = await Category.insertMany(data);

  return categories;
}

// UPDATE CATEGORY
export async function updateCategory(slug: string, data: any) {
  const category = await Category.findOneAndUpdate({ slug }, data, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    throw new Error("Category not found");
  }

  return category;
}

// DELETE CATEGORY
export async function deleteCategory(slug: string) {
  const category = await Category.findOneAndDelete({ slug });

  if (!category) {
    throw new Error("Category not found");
  }

  return category;
}
