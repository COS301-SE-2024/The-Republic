import supabase from "@/modules/shared/services/supabaseClient";
import { Organization, OrganizationMember, JoinRequest } from "@/modules/shared/models/organization";
import { APIError } from "@/types/response";
import { PaginationParams } from "@/types/pagination";

export class OrganizationRepository {
    async createOrganization(organization: Partial<Organization>): Promise<Organization> {
        const { data, error } = await supabase
          .from("organizations")
          .insert({
            name: organization.name,
            username: organization.username,
            bio: organization.bio,
            website_url: organization.website_url,
            join_policy: organization.join_policy,
            created_at: new Date().toISOString(),
            verified_status: false,
            points: 0
          })
          .select()
          .single();
      
        if (error) {
          console.error("Error creating organization:", error);
          throw APIError({
            code: 500,
            success: false,
            error: "An error occurred while creating the organization.",
          });
        }
      
        return data as Organization;
      }

      async updateOrganization(id: string, updates: Partial<Organization>): Promise<Organization> {
        const safeUpdates = { ...updates };
        delete safeUpdates.id;
        delete safeUpdates.created_at;
        delete safeUpdates.verified_status;
        delete safeUpdates.points;
    
        const { data, error } = await supabase
          .from("organizations")
          .update(safeUpdates)
          .eq('id', id)
          .select()
          .single();
    
        if (error) {
          console.error("Error updating organization:", error);
          throw APIError({
            code: 500,
            success: false,
            error: "An error occurred while updating the organization.",
          });
        }
    
        return data as Organization;
      }

  async deleteOrganization(id: string): Promise<void> {
    const { error } = await supabase
      .from("organizations")
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting organization:", error);
      throw APIError({
        code: 500,
        success: false,
        error: "An error occurred while deleting the organization.",
      });
    }
  }

  async isUserAdmin(organizationId: string, userId: string): Promise<boolean | null> {
    const { data, error } = await supabase
      .from("organization_members")
      .select('role')
      .eq('organization_id', organizationId)
      .eq('user_id', userId)
      .single();
  
    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error("Error checking user role:", error);
      throw APIError({
        code: 500,
        success: false,
        error: "An error occurred while checking user role.",
      });
    }
  
    return data?.role === 'admin';
  }

  async addOrganizationMember(member: Partial<OrganizationMember>): Promise<OrganizationMember> {
    const { count, error: countError } = await supabase
      .from("organization_members")
      .select("*", { count: "exact", head: true })
      .eq("user_id", member.user_id);

    if (countError) {
      console.error("Error checking user's organization count:", countError);
      throw APIError({
        code: 500,
        success: false,
        error: "An error occurred while checking user's organization count.",
      });
    }

    if (count && count >= 5) {
      throw APIError({
        code: 400,
        success: false,
        error: "You have reached the maximum number of organizations you can join (5).",
      });
    }

    const { data, error } = await supabase
      .from("organization_members")
      .insert(member)
      .select()
      .single();

    if (error) {
      console.error("Error adding organization member:", error);
      throw APIError({
        code: 500,
        success: false,
        error: "An error occurred while adding the organization member.",
      });
    }

    return data as OrganizationMember;
  }
  async getOrganizationJoinPolicy(organizationId: string): Promise<string> {
    const { data, error } = await supabase
      .from("organizations")
      .select('join_policy')
      .eq('id', organizationId)
      .single();

    if (error) {
      console.error("Error getting organization join policy:", error);
      throw APIError({
        code: 500,
        success: false,
        error: "An error occurred while getting the organization join policy.",
      });
    }

    return data.join_policy;
  }

  async updateOrganizationJoinPolicy(organizationId: string, joinPolicy: string): Promise<void> {
    const { error } = await supabase
      .from("organizations")
      .update({ join_policy: joinPolicy })
      .eq('id', organizationId);

    if (error) {
      console.error("Error updating organization join policy:", error);
      throw APIError({
        code: 500,
        success: false,
        error: "An error occurred while updating the organization join policy.",
      });
    }
  }

  async removeMember(organizationId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from("organization_members")
      .delete()
      .eq('organization_id', organizationId)
      .eq('user_id', userId);

    if (error) {
      console.error("Error removing member:", error);
      throw APIError({
        code: 500,
        success: false,
        error: "An error occurred while removing the member.",
      });
    }
  }

  async getOrganizationById(id: string): Promise<Organization> {
    const { data, error } = await supabase
      .from("organizations")
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error("Error getting organization:", error);
      throw APIError({
        code: 500,
        success: false,
        error: "An error occurred while getting the organization.",
      });
    }

    return data as Organization;
  }

  async getOrganizationMembers(organizationId: string): Promise<OrganizationMember[]> {
    const { data, error } = await supabase
      .from("organization_members")
      .select('*')
      .eq('organization_id', organizationId);

    if (error) {
      console.error("Error getting organization members:", error);
      throw APIError({
        code: 500,
        success: false,
        error: "An error occurred while getting organization members.",
      });
    }

    return data as OrganizationMember[];
  }

  async isMember(organizationId: string, userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from("organization_members")
      .select('id')
      .eq('organization_id', organizationId)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error("Error checking membership:", error);
      throw APIError({
        code: 500,
        success: false,
        error: "An error occurred while checking membership.",
      });
    }

    return !!data;
  }

  async createJoinRequest(organizationId: string, userId: string): Promise<JoinRequest> {
    const { count, error: countError } = await supabase
      .from("join_requests")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("status", "pending");

    if (countError) {
      throw APIError({
        code: 500,
        success: false,
        error: "An error occurred while checking existing join requests.",
      });
    }

    if (count && count >= 5) {
      throw APIError({
        code: 400,
        success: false,
        error: "You have reached the maximum number of pending join requests.",
      });
    }

    const { data, error } = await supabase
      .from("join_requests")
      .insert({
        organization_id: organizationId,
        user_id: userId,
        status: "pending",
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw APIError({
        code: 500,
        success: false,
        error: "An error occurred while creating the join request.",
      });
    }

    return data as JoinRequest;
  }

  async getJoinRequests(organizationId: string, params: PaginationParams): Promise<{ data: JoinRequest[], total: number }> {
    const { data, error, count } = await supabase
      .from("join_requests")
      .select("*", { count: "exact" })
      .eq("organization_id", organizationId)
      .eq("status", "pending")
      .range(params.offset, params.offset + params.limit - 1);

    if (error) {
      throw APIError({
        code: 500,
        success: false,
        error: "An error occurred while fetching join requests.",
      });
    }

    return { data: data as JoinRequest[], total: count || 0 };
  }

  async getJoinRequestById(requestId: number): Promise<JoinRequest | null> {
    const { data, error } = await supabase
      .from("join_requests")
      .select('*')
      .eq('id', requestId)
      .single();
  
    if (error) {
      console.error("Error getting join request:", error);
      throw APIError({
        code: 500,
        success: false,
        error: "An error occurred while getting the join request.",
      });
    }
  
    return data as JoinRequest | null;
  }

  async updateJoinRequestStatus(requestId: number, status: "accepted" | "rejected"): Promise<JoinRequest> {
    const { data, error } = await supabase
      .from("join_requests")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", requestId)
      .select()
      .single();
  
    if (error) {
      throw APIError({
        code: 500,
        success: false,
        error: "An error occurred while updating the join request status.",
      });
    }
  
    return data as JoinRequest;
  }

  async deleteJoinRequest(requestId: number, userId: string): Promise<void> {
    const { error } = await supabase
      .from("join_requests")
      .delete()
      .eq("id", requestId)
      .eq("user_id", userId);

    if (error) {
      throw APIError({
        code: 500,
        success: false,
        error: "An error occurred while deleting the join request.",
      });
    }
  }

  async getUserOrganizations(userId: string): Promise<Organization[]> {
    const { data, error } = await supabase
      .from("organization_members")
      .select(`
        organizations (
          id,
          created_at,
          name,
          username,
          bio,
          website_url,
          verified_status,
          join_policy,
          points
        )
      `)
      .eq("user_id", userId);
  
    if (error) {
      console.error("Error fetching user organizations:", error);
      throw APIError({
        code: 500,
        success: false,
        error: "An error occurred while fetching user organizations.",
      });
    }
  
    const organizations: Organization[] = data.map(item => item.organizations[0]);
  
    return organizations;
  }

  async getOrganizations(params: PaginationParams): Promise<{ data: Organization[], total: number }> {
    const { data, error, count } = await supabase
      .from("organizations")
      .select("*", { count: "exact" })
      .range(params.offset, params.offset + params.limit - 1);

    if (error) {
      throw APIError({
        code: 500,
        success: false,
        error: "An error occurred while fetching organizations.",
      });
    }

    return { data: data as Organization[], total: count || 0 };
  }

  async isOrganizationNameUnique(name: string): Promise<boolean> {
    const { data, error } = await supabase
      .from("organizations")
      .select("id")
      .eq("name", name)
      .single();

    if (error && error.code !== "PGRST116") {
      throw APIError({
        code: 500,
        success: false,
        error: "An error occurred while checking organization name uniqueness.",
      });
    }

    return !data;
  }

  async isOrganizationUsernameUnique(username: string): Promise<boolean> {
    const { data, error } = await supabase
      .from("organizations")
      .select("id")
      .eq("username", username)
      .single();

    if (error && error.code !== "PGRST116") {
      throw APIError({
        code: 500,
        success: false,
        error: "An error occurred while checking organization username uniqueness.",
      });
    }

    return !data;
  }

  async getJoinRequestsByUser(userId: string): Promise<JoinRequest[]> {
    const { data, error } = await supabase
      .from("join_requests")
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error("Error getting user's join requests:", error);
      throw APIError({
        code: 500,
        success: false,
        error: "An error occurred while getting user's join requests.",
      });
    }

    return data as JoinRequest[];
  }

  async updateMemberRole(organizationId: string, userId: string, role: string): Promise<void> {
    const { error } = await supabase
      .from("organization_members")
      .update({ role })
      .eq('organization_id', organizationId)
      .eq('user_id', userId);

    if (error) {
      console.error("Error updating member role:", error);
      throw APIError({
        code: 500,
        success: false,
        error: "An error occurred while updating member role.",
      });
    }
  }

  async getOrganizationMemberCount(organizationId: string): Promise<number> {
    const { count, error } = await supabase
      .from("organization_members")
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organizationId);

    if (error) {
      console.error("Error getting organization member count:", error);
      throw APIError({
        code: 500,
        success: false,
        error: "An error occurred while getting organization member count.",
      });
    }

    return count || 0;
  }

  async getOrganizationAdminCount(organizationId: string): Promise<number> {
    const { count, error } = await supabase
      .from("organization_members")
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organizationId)
      .eq('role', 'admin');

    if (error) {
      console.error("Error getting organization admin count:", error);
      throw APIError({
        code: 500,
        success: false,
        error: "An error occurred while getting organization admin count.",
      });
    }

    return count || 0;
  }
}