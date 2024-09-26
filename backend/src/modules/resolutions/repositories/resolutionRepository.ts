import supabase from "@/modules/shared/services/supabaseClient";
import { APIError } from "@/types/response";
import { Resolution } from "@/modules/shared/models/resolution";

export class ResolutionRepository {
  async createResolution(
    resolution: Omit<Resolution, "resolution_id" | "created_at" | "updated_at">,
  ): Promise<Resolution> {
    const { data, error } = await supabase
      .from("resolution")
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
      .from("resolution")
      .select("*, organization:organization_id(*)")
      .eq("resolution_id", resolutionId)
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

  async updateResolution(
    resolutionId: string,
    updates: Partial<Resolution>,
  ): Promise<Resolution> {
    const { data, error } = await supabase
      .from("resolution")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("resolution_id", resolutionId)
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
      .from("resolution")
      .select("*, organization:organization_id(*)")
      .eq("issue_id", issueId);

    if (error) {
      console.error(error);
      throw APIError({
        code: 500,
        success: false,
        error:
          "An unexpected error occurred while fetching resolutions for the issue.",
      });
    }

    return data;
  }

  async getUserResolutions(userId: string): Promise<Resolution[]> {
    const { data, error } = await supabase
      .from("resolution")
      .select("*, organization:organization_id(*)")
      .eq("resolver_id", userId)
      .order("created_at", { ascending: false });

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
      .from("resolution")
      .select("*")
      .eq("resolution_id", resolutionId)
      .eq("resolver_id", userId)
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
        error:
          "Resolution not found or you don't have permission to delete it.",
      });
    }

    if (resolution.status !== "pending") {
      throw APIError({
        code: 400,
        success: false,
        error: "Only pending resolutions can be deleted.",
      });
    }

    const { error: deleteError } = await supabase
      .from("resolution")
      .delete()
      .eq("resolution_id", resolutionId)
      .eq("resolver_id", userId);

    if (deleteError) {
      console.error(deleteError);
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred while deleting the resolution.",
      });
    }
  }

  async getOrganizationResolutions(
    organizationId: string,
  ): Promise<Resolution[]> {
    const { data, error } = await supabase
      .from("resolution")
      .select("*")
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      throw APIError({
        code: 500,
        success: false,
        error:
          "An unexpected error occurred while fetching organization resolutions.",
      });
    }

    return data;
  }

  async getResolutionCount(params: { organizationId: string; startDate: Date; endDate: Date }): Promise<number> {
    const { count, error } = await supabase
      .from("resolution")
      .select("*", { count: "exact", head: true })
      .eq("organization_id", params.organizationId)
      .gte("created_at", params.startDate.toISOString())
      .lte("created_at", params.endDate.toISOString());

    if (error) {
      console.error("Error getting resolution count:", error);
      throw APIError({
        code: 500,
        success: false,
        error: "An error occurred while getting resolution count.",
      });
    }

    return count || 0;
  }

  async getUserResolutionsInDateRange(userId: string, organizationId: string, startDate: Date, endDate: Date): Promise<Resolution[]> {
    const { data, error } = await supabase
      .from('resolution')
      .select('*')
      .eq('resolver_id', userId)
      .eq('organization_id', organizationId)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());
  
    if (error) {
      console.error('Error getting user resolutions:', error);
      throw APIError({
        code: 500,
        success: false,
        error: 'An error occurred while getting user resolutions.',
      });
    }
  
    return data || [];
  }

  async getAcceptedResolutionCount(params: { organizationId: string; startDate: Date; endDate: Date }): Promise<number> {
    const { count, error } = await supabase
      .from("resolution")
      .select("*", { count: "exact", head: true })
      .eq("organization_id", params.organizationId)
      .eq("status", "accepted")
      .gte("created_at", params.startDate.toISOString())
      .lte("created_at", params.endDate.toISOString());
  
    if (error) {
      console.error("Error getting accepted resolution count:", error);
      throw APIError({
        code: 500,
        success: false,
        error: "An error occurred while getting accepted resolution count.",
      });
    }
  
    return count || 0;
  }
}
