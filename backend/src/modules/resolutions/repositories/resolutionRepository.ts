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
}