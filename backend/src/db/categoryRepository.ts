import supabase from "../services/supabaseClient";

export class CategoryRepository {
  async getCategoryId(name: string) {
    const { data, error } = await supabase
      .from("category")
      .select("category_id")
      .eq("name", name)
      .single();


    if (error) {
      console.log(error);
      // TODO: Make errors follow spec
      throw 500;
    }

    return data?.category_id;
  }
}
