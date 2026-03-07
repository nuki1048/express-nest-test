export interface IBlogPost {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  mainPhoto: string;
  createdAt: string;
  updatedAt: string;
  readTime: string;
  views: number;
  likes: number;
  isPublished: boolean;
}

export type TypeBlogPost = IBlogPost