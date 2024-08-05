import supabase from "@/modules/shared/services/supabaseClient";
import { APIError } from "@/types/response";
import { Resolution } from "@/modules/shared/models/resolution";

export class ResolutionRepository {
  async createResolution(resolution: Omit<Resolution, 'resolution_id' | 'created_at' | 'updated_at'>): Promise<Resolution> {
    const { data, error } = await supabase
      .from('resolution')
      .insert(resolution)
      .select()
      .single();

    if (error) {
      console.error(error);
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while creating a resolution.",
      });
    }

    return data;
  }

  async getResolutionById(resolutionId: string): Promise<Resolution> {
    const { data, error } = await supabase
      .from('resolution')
      .select('*')
      .eq('resolution_id', resolutionId)
      .single();

    if (error) {
      console.error(error);
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while fetching the resolution.",
      });
    }

    return data;
  }

  async updateResolution(resolutionId: string, updates: Partial<Resolution>): Promise<Resolution> {
    const { data, error } = await supabase
      .from('resolution')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('resolution_id', resolutionId)
      .select()
      .single();

    if (error) {
      console.error(error);
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while updating the resolution.",
      });
    }

    return data;
  }

  async getResolutionsByIssueId(issueId: number): Promise<Resolution[]> {
    const { data, error } = await supabase
      .from('resolution')
      .select('*')
      .eq('issue_id', issueId);

    if (error) {
      console.error(error);
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while fetching resolutions for the issue.",
      });
    }

    return data;
  }

  async getUserResolutions(userId: string): Promise<Resolution[]> {
    const { data, error } = await supabase
      .from('resolution')
      .select('*')
      .eq('resolver_id', userId)
      .order('created_at', { ascending: false });
  
    if (error) {
      console.error(error);
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while fetching user resolutions.",
      });
    }
  
    return data;
  }
  
  async deleteResolution(resolutionId: string, userId: string): Promise<void> {
    const { data: resolution, error: fetchError } = await supabase
      .from('resolution')
      .select('*')
      .eq('resolution_id', resolutionId)
      .eq('resolver_id', userId)
      .single();
  
    if (fetchError) {
      console.error(fetchError);
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while fetching the resolution.",
      });
    }
  
    if (!resolution) {
      throw APIError({
        code: 404,
        success: false,
        error: "Resolution not found or you don't have permission to delete it.",
      });
    }
  
    if (resolution.status !== 'pending') {
      throw APIError({
        code: 400,
        success: false,
        error: "Only pending resolutions can be deleted.",
      });
    }
  
    const { error: deleteError } = await supabase
      .from('resolution')
      .delete()
      .eq('resolution_id', resolutionId)
      .eq('resolver_id', userId);
  
    if (deleteError) {
      console.error(deleteError);
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while deleting the resolution.",
      });
    }
  }
}