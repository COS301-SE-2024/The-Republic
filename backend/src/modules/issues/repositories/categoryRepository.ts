import supabase from "@/utils/supabaseClient";
import { APIError } from "@/types/response";

export class CategoryRepository {
  async getCategoryId(name: string) {
    const { data, error } = await supabase
      .from("category")
      .select("category_id")
      .eq("name", name)
      .single();

    if (error) {
      console.error(error);

      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred. Please try again later.",
      });
    }

    return data!.category_id as number;
  }
}
