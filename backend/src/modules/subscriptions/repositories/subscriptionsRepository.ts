import supabase from "@/modules/shared/services/supabaseClient";
import { SubsParams } from "@/types/subscriptions";
import { APIError } from "@/types/response";

export default class SubscriptionsRepository {
  async issueSubscriptions({
    user_id,
    issue_id,
  }: Partial<SubsParams>) {
    if (!user_id || !issue_id) {
      throw APIError({
        code: 400,
        success: false,
        error: "Missing required parameters: user_id or issue_id",
      });
    }

    const { data: selectData, error: selectError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user_id)
      .single();

    console.log("User ID: ", user_id);
    console.log("Issue ID: ", issue_id);
    console.log("Data: ", selectData);
    console.log("Error: ", selectError);
  
    if (selectData && !selectError) {
      if (selectData.issues.includes(issue_id)) {
        const updatedIssues = selectData.issues.filter((issue: string) => issue !== issue_id);
        const { data: updateData, error: updateError } = await supabase
          .from('subscriptions')
          .update({ issues: updatedIssues })
          .eq('user_id', user_id);

        if (!updatedIssues) {
          console.error(updateError);
          console.error(updateData);
          throw APIError({
            code: 500,
            success: false,
            error: "An unexpected error occurred while updating the subscription. Please try again later.",
          });
        }
  
        return "Subscription successfully removed!";
      } else {
        const updatedIssues = [...selectData.issues, issue_id];
        const { data: updateData, error: updateError } = await supabase
          .from('subscriptions')
          .update({ issues: updatedIssues })
          .eq('user_id', user_id);
        
        if (!updatedIssues) {
          console.error(updateError);
          console.error(updateData);
          throw APIError({
            code: 500,
            success: false,
            error: "An unexpected error occurred while updating the subscription. Please try again later.",
          });
        }
  
        return "Subscription successfully created!";
      }
    } else {
      const { data: insertData, error: insertError } = await supabase
        .from('subscriptions')
        .insert({
          user_id: user_id,
          issues: [issue_id],
          categories: [],
          locations: [],
        })
        .select()
        .single();
  
      if (insertError || !insertData) {
        console.error(insertError);
        throw APIError({
          code: 500,
          success: false,
          error: "An unexpected error occurred while creating the subscription. Please try again later.",
        });
      }
  
      return "Subscription successfully created!";
    }
  }

  async categorySubscriptions({
    user_id,
    category_id,
  }: Partial<SubsParams>) {
    if (!user_id || !category_id) {
      throw APIError({
        code: 400,
        success: false,
        error: "Missing required parameters: user_id or category_id",
      });
    }

    const { data: selectData, error: selectError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user_id)
      .single();
  
    if (selectData && !selectError) {
      if (selectData.categories.includes(category_id)) {
        const updatedCategories = selectData.categories.filter((category: string) => category !== category_id);
        const { data: updateData, error: updateError } = await supabase
          .from('subscriptions')
          .update({ categories: updatedCategories })
          .eq('user_id', user_id);

        if (!updatedCategories) {
          console.error(updateError);
          console.error(updateData);
          throw APIError({
            code: 500,
            success: false,
            error: "An unexpected error occurred while updating the subscription. Please try again later.",
          });
        }
  
        return "Subscription successfully removed!";
      } else {
        const updatedCategories = [...selectData.categories, category_id];
        const { data: updateData, error: updateError } = await supabase
          .from('subscriptions')
          .update({ categories: updatedCategories })
          .eq('user_id', user_id);
        
        if (!updatedCategories) {
          console.error(updateError);
          console.error(updateData);
          throw APIError({
            code: 500,
            success: false,
            error: "An unexpected error occurred while updating the subscription. Please try again later.",
          });
        }
  
        return "Subscription successfully created!";
      }
    } else {
      const { data: insertData, error: insertError } = await supabase
        .from('subscriptions')
        .insert({
          user_id: user_id,
          categories: [category_id],
          issues: [],
          locations: [],
        })
        .select()
        .single();
  
      if (insertError || !insertData) {
        console.error(insertError);
        throw APIError({
          code: 500,
          success: false,
          error: "An unexpected error occurred while creating the subscription. Please try again later.",
        });
      }
  
      return "Subscription successfully created!";
    }
  }

  async locationSubscriptions({
    user_id,
    location_id,
  }: Partial<SubsParams>) {
    const { data: selectData, error: selectError } = await supabase
      .from('subscriptions')
      .select('locations')
      .eq('user_id', user_id)
      .single();
    
    if (selectData && !selectError) {
      if (selectData.locations.includes(location_id)) {
        const updatedlocations = selectData.locations.filter((location: string) => location !== location_id);
        const { data: updateData, error: updateError } = await supabase
          .from('subscriptions')
          .update({ locations: updatedlocations })
          .eq('user_id', user_id);

        if (!updatedlocations) {
          console.error(updateError);
          console.error(updateData);
          throw APIError({
            code: 500,
            success: false,
            error: "An unexpected error occurred while updating the subscription. Please try again later.",
          });
        }
  
        return "Subscription successfully removed!";
      } else {
        const updatedlocations = [...selectData.locations, location_id];
        const { data: updateData, error: updateError } = await supabase
          .from('subscriptions')
          .update({ locations: updatedlocations })
          .eq('user_id', user_id);
        
        if (!updatedlocations) {
          console.error(updateError);
          console.error(updateData);
          throw APIError({
            code: 500,
            success: false,
            error: "An unexpected error occurred while updating the subscription. Please try again later.",
          });
        }
  
        return "Subscription successfully created!";
      }
    } else {
      const { data: insertData, error: insertError } = await supabase
        .from('subscriptions')
        .insert({
          user_id: user_id,
          locations: [location_id],
          categories: [],
          issues: [],
        })
        .select()
        .single();
  
      if (insertError || !insertData) {
        console.error(insertError);
        throw APIError({
          code: 500,
          success: false,
          error: "An unexpected error occurred while creating the subscription. Please try again later.",
        });
      }
  
      return "Subscription successfully created!";
    }
  }

  async getSubscriptions({
    user_id,
  }: Partial<SubsParams>) {
    const { data: selectData } = await supabase
      .from('subscriptions')
      .select('issues, categories, locations')
      .eq('user_id', user_id)
      .single();

    const result = {
      issues: selectData?.issues || [],
      categories: selectData?.categories || [],
      locations: selectData?.locations || [],
    };

    return result;
  }
}
