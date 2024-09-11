import supabase from "@/modules/shared/services/supabaseClient";
import { Organization, OrganizationMember, JoinRequest, OrganizationPost } from "@/modules/shared/models/organization";
import { APIError } from "@/types/response";
import { PaginationParams } from "@/types/pagination";
import { MulterFile } from "@/types/users";

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
            points: 0,
            org_type: organization.org_type
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

async updateOrganization(id: string, updates: Partial<Organization>, profilePhoto?: MulterFile): Promise<Organization> {
    const safeUpdates = { ...updates };
    delete safeUpdates.id;
    delete safeUpdates.created_at;
    delete safeUpdates.verified_status;
    delete safeUpdates.points;

    // Handle profile photo upload
    if (profilePhoto) {
        const fileName = `${id}_${Date.now()}-${profilePhoto.originalname}`;
        const { error: uploadError } = await supabase.storage
            .from("organizations")
            .upload(fileName, profilePhoto.buffer);

        if (uploadError) {
            console.error("Error uploading profile photo:", uploadError);
            throw APIError({
                code: 500,
                success: false,
                error: "An error occurred while uploading the profile photo.",
            });
        }

        const { data: urlData } = supabase.storage
            .from("organizations")
            .getPublicUrl(fileName);

        safeUpdates.profile_photo = urlData.publicUrl;
    }

    // Handle location parsing and updating
    if (typeof safeUpdates.location === 'string') {
        safeUpdates.location = JSON.parse(safeUpdates.location);
    }

    if (safeUpdates.location) {
        const { data: locationData, error: locationError } = await supabase
            .from("location")
            .select("location_id")
            .eq("province", safeUpdates.location.province)
            .eq("city", safeUpdates.location.city)
            .eq("suburb", safeUpdates.location.suburb)
            .single();

        if (locationError && locationError.code !== 'PGRST116') {
            console.error("Error checking location:", locationError);
            throw APIError({
                code: 500,
                success: false,
                error: "An error occurred while checking location.",
            });
        }

        if (locationData) {
            // Update existing location
            const { error: updateError } = await supabase
                .from("location")
                .update({
                    latitude: safeUpdates.location.latitude,
                    longitude: safeUpdates.location.longitude,
                    place_id: safeUpdates.location.place_id || ""
                })
                .eq("location_id", locationData.location_id);

            if (updateError) {
                console.error("Error updating location:", updateError);
                throw APIError({
                    code: 500,
                    success: false,
                    error: "An error occurred while updating location.",
                });
            }

            safeUpdates.location_id = locationData.location_id;
        } else {
            const { data: newLocation, error: insertError } = await supabase
                .from("location")
                .insert({
                    province: safeUpdates.location.province,
                    city: safeUpdates.location.city,
                    suburb: safeUpdates.location.suburb,
                    latitude: safeUpdates.location.latitude,
                    longitude: safeUpdates.location.longitude,
                    district: "",
                    place_id: safeUpdates.location.place_id || ""
                })
                .select()
                .single();

            if (insertError) {
                console.error("Error inserting new location:", insertError);
                throw APIError({
                    code: 500,
                    success: false,
                    error: "An error occurred while creating new location.",
                });
            }

            safeUpdates.location_id = newLocation.location_id;
        }
    }

    delete safeUpdates.location;  // Remove location as it's now handled by location_id

    const { data, error } = await supabase
        .from("organizations")
        .update(safeUpdates)
        .eq('id', id)
        .select(`
            *,
            location:location_id (
                suburb,
                city,
                province
            )
        `)
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
      .select(`
        *,
        total_members:organization_members(count),
        location:location_id (
          suburb,
          city,
          province,
          latitude,
          longitude
        )
      `)
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

    const organization = {
      ...data,
      totalMembers: data.total_members[0].count
    };

    delete organization.total_members;

    return organization as Organization;
  }

  async getOrganizationMembers(organizationId: string, params: PaginationParams): Promise<{ data: OrganizationMember[], total: number }> {
    const { data, error, count } = await supabase
      .from('organization_members')
      .select('*, user:user_id(*)', { count: 'exact' })
      .eq('organization_id', organizationId)
      .order('joined_at', { ascending: false })
      .range(params.offset, params.offset + params.limit - 1);
  
    if (error) {
      console.error("Error fetching organization members:", error);
      throw APIError({
        code: 500,
        success: false,
        error: "An error occurred while fetching organization members.",
      });
    }
  
    const members: OrganizationMember[] = data?.map(member => ({
      id: member.id,
      organization_id: member.organization_id,
      user_id: member.user_id,
      role: member.role,
      joined_at: member.joined_at,
      user: {
        user_id: member.user.user_id,
        email_address: member.user.email_address,
        username: member.user.username,
        fullname: member.user.fullname,
        image_url: member.user.image_url,
        bio: member.user.bio,
        user_score: member.user.user_score,
        isAdmin: member.role === 'admin'
      }
    })) || [];
  
    return { data: members, total: count || 0 };
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
      .select(`
        *,
        user:user_id (
          user_id,
          email_address,
          username,
          fullname,
          image_url,
          bio,
          user_score
        )
      `, { count: "exact" })
      .eq("organization_id", organizationId)
      .eq("status", "pending")
      .range(params.offset, params.offset + params.limit - 1);

    if (error) {
      console.error("Error fetching join requests:", error);
      throw APIError({
        code: 500,
        success: false,
        error: "An error occurred while fetching join requests.",
      });
    }

    return { 
      data: data as JoinRequest[], 
      total: count || 0 
    };
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

  async getJoinRequestByUser(organizationId: string, userId: string): Promise<JoinRequest | null> {
    const { data, error } = await supabase
      .from("join_requests")
      .select('*')
      .eq('organization_id', organizationId)
      .eq('user_id', userId)
      .eq('status', 'pending')
      .single();
  
    if (error) {
      if (error.code === 'PGRST116') {
        // No results found
        return null;
      }
      console.error("Error getting join request:", error);
      throw APIError({
        code: 500,
        success: false,
        error: "An error occurred while getting the join request.",
      });
    }
  
    return data as JoinRequest | null;
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
          points,
          profile_photo,
          org_type
        ),
        role
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
  
    if (!data) {
      return [];
    }
  
    const organizations: Organization[] = await Promise.all(data.map(async (item: any) => {
      const { count } = await supabase
        .from("organization_members")
        .select("*", { count: "exact", head: true })
        .eq("organization_id", item.organizations.id);
  
      return {
        ...item.organizations[0],
        totalMembers: count || 0,
        userRole: item.role
      } as Organization;
    }));
  
    return organizations;
  }

  async getOrganizations(
    params: PaginationParams,
    orgType: string | null = null,
    locationId: string | null = null
  ): Promise<{ data: Organization[]; total: number }> {
    let query = supabase
      .from("organizations")
      .select(`
        *,
        total_members:organization_members(count),
        location:location_id (
          suburb,
          city,
          province
        )
      `, { count: "exact" });

    if (orgType) {
      query = query.eq('org_type', orgType);
    }

    if (locationId) {
      query = query.eq('location_id', locationId);
    }

    const { data, error, count } = await query
      .range(params.offset, params.offset + params.limit - 1);

    if (error) {
      throw APIError({
        code: 500,
        success: false,
        error: "An error occurred while fetching organizations.",
      });
    }

    const organizations = data?.map(org => ({
      ...org,
      totalMembers: org.total_members[0].count,
    }));

    return { data: organizations as Organization[], total: count || 0 };
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

  async searchOrganizations(
    searchTerm: string,
    orgType: string | null,
    locationId: string | null,
    params: PaginationParams
  ): Promise<{ data: Organization[]; total: number }> {
    let query = supabase
      .from("organizations")
      .select(`
        *,
        total_members:organization_members(count),
        location:location_id (
          suburb,
          city,
          province
        )
      `, { count: "exact" })
      .or(`name.ilike.%${searchTerm}%,username.ilike.%${searchTerm}%,bio.ilike.%${searchTerm}%`);

    if (orgType) {
      query = query.eq('org_type', orgType);
    }

    if (locationId) {
      query = query.eq('location_id', locationId);
    }

    const { data, error, count } = await query
      .range(params.offset, params.offset + params.limit - 1);

    if (error) {
      console.error("Error searching organizations:", error);
      throw APIError({
        code: 500,
        success: false,
        error: "An error occurred while searching organizations.",
      });
    }

    const organizations = data?.map(org => ({
      ...org,
      totalMembers: org.total_members[0].count,
    }));

    return { data: organizations as Organization[], total: count || 0 };
  }

  async getOrganizationPosts(organizationId: string, params: PaginationParams): Promise<{ data: OrganizationPost[], total: number }> {
    const { data, error, count } = await supabase
      .from('organization_posts')
      .select('*, author:author_id(*)', { count: 'exact' })
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false })
      .range(params.offset, params.offset + params.limit - 1);

    if (error) {
      console.error("Error fetching organization posts:", error);
      throw APIError({
        code: 500,
        success: false,
        error: "An error occurred while fetching organization posts.",
      });
    }

    return { data: data as OrganizationPost[], total: count || 0 };
  }

  async createOrganizationPost(post: Partial<OrganizationPost>): Promise<OrganizationPost> {
    const { data, error } = await supabase
      .from('organization_posts')
      .insert(post)
      .select('*, author:author_id(*)')
      .single();

    if (error) {
      console.error("Error creating organization post:", error);
      throw APIError({
        code: 500,
        success: false,
        error: "An error occurred while creating the organization post.",
      });
    }

    return data as OrganizationPost;
  }

  async getOrganizationPostById(postId: string): Promise<OrganizationPost> {
    const { data, error } = await supabase
      .from('organization_posts')
      .select('*, author:author_id(*)')
      .eq('post_id', postId)
      .single();

    if (error) {
      console.error("Error fetching organization post:", error);
      throw APIError({
        code: 500,
        success: false,
        error: "An error occurred while fetching the organization post.",
      });
    }

    return data as OrganizationPost;
  }

  async deleteOrganizationPost(postId: string): Promise<void> {
    const { error } = await supabase
      .from('organization_posts')
      .delete()
      .eq('post_id', postId);

    if (error) {
      console.error("Error deleting organization post:", error);
      throw APIError({
        code: 500,
        success: false,
        error: "An error occurred while deleting the organization post.",
      });
    }
  }

  async getTopActiveMembers(organizationId: string, limit: number = 5): Promise<OrganizationMember[]> {
    const { data, error } = await supabase
      .from('organization_members')
      .select('*, user:user_id(*)')
      .eq('organization_id', organizationId)
      .order('joined_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching top active members:", error);
      throw APIError({
        code: 500,
        success: false,
        error: "An error occurred while fetching top active members.",
      });
    }

    return data as OrganizationMember[];
  }
}