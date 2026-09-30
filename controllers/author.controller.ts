import { Author } from "@/models";

export async function getAllAuthors() {
  const authors = await Author.find()
    .select("name slug profileImage slug")
    .sort({ name: 1 });

  return authors;
}

export async function getAuthorBySlug(slug: string) {
  const author = await Author.findOne({ slug });

  if (!author) {
    throw new Error("Author not found");
  }

  return author;
}

export async function createOneAuthor(data: any) {
  const author = await Author.create(data);

  return author;
}

export async function createManyAuthors(data: any[]) {
  const authors = await Author.insertMany(data);

  return authors;
}

export async function updateAuthor(slug: string, data: any) {
  const author = await Author.findOneAndUpdate({ slug }, data, {
    new: true,
    runValidators: true,
  });

  if (!author) {
    throw new Error("Author not found");
  }

  return author;
}

export async function deleteAuthor(slug: string) {
  const author = await Author.findOneAndDelete({ slug });

  if (!author) {
    throw new Error("Author not found");
  }

  return author;
}
