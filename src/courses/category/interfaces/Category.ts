export interface Category {
  name: string;
  categoryMoodleId: string;
}

export interface CategoryResponce {
  error: number;
  categories: Category[];
}
