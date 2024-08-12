import supabase from "@/modules/shared/services/supabaseClient";
import { SubsParams } from "@/types/subscriptions";
import { APIError } from "@/types/response";

import { Notification } from "@/types/subscriptions";

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

    if (selectData && !selectError) {
      if (selectData.issues.includes(issue_id?.toString())) {
        const updatedIssues = selectData.issues.filter((issue: string) => issue !== issue_id);
        const { data: updateData, error: updateError } = await supabase
          .from('subscriptions')
          .update({ issues: updatedIssues })
          .eq('user_id', user_id)
          .select();

        if (updateError || !updateData) {
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
          .eq('user_id', user_id)
          .select();
        
        if (updateError || !updateData) {
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
      if (selectData.categories.includes(category_id?.toString())) {
        const updatedCategories = selectData.categories.filter((category: string) => category !== category_id);
        const { data: updateData, error: updateError } = await supabase
          .from('subscriptions')
          .update({ categories: updatedCategories })
          .eq('user_id', user_id)
          .select();

        if (updateError || !updateData) {
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
          .eq('user_id', user_id)
          .select();
        
        if (updateError || !updateData) {
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
      if (selectData.locations.includes(location_id?.toString())) {
        const updatedlocations = selectData.locations.filter((location: string) => location !== location_id);
        const { data: updateData, error: updateError } = await supabase
          .from('subscriptions')
          .update({ locations: updatedlocations })
          .eq('user_id', user_id)
          .select();

        if (updateError || !updateData) {
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
          .eq('user_id', user_id)
          .select();
        
        if (updateError || !updateData) {
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


  async getNotifications({
    user_id
  } : Partial<SubsParams>) {    
    const subscriptions = await this.getSubscriptions({ user_id });
    if (!subscriptions) {
      console.error('Failed to retrieve subscriptions');
      return [];
    }
    
    const { issues: subIssues, categories: subCategories, locations: subLocations } = subscriptions;
    const { data: issueData, error: issueError } = await supabase
      .from('issue')
      .select(`
        issue_id,
        user_id,
        location_id,
        category_id,
        content,
        is_anonymous,
        created_at,
        sentiment,
        comment (
          user_id,
          content,
          is_anonymous,
          created_at
        ),
        reaction (
          user_id,
          emoji,
          created_at
        ),
        resolution (
          resolver_id,
          resolution_text,
          status,
          created_at
        )
      `);

    if (issueError) {
      console.error('Error fetching issue data:', issueError);
      return [];
    }

    const { data: pointsData, error: pointsError } = await supabase
      .from('points_history')
      .select(`
        user_id,
        action,
        points,
        created_at
      `);

    if (pointsError) {
      console.error('Error fetching points history:', pointsError);
      return [];
    }

    const filteredNotifications: Notification[] = [];
    const addedIssues = new Set<string>();

    issueData.forEach(issue => {
      const issueIdStr = issue.issue_id?.toString();
      const categoryIdStr = issue.category_id?.toString();
      const locationIdStr = issue.location_id?.toString();
      
      if (subIssues.includes(issueIdStr) || subCategories.includes(categoryIdStr) || subLocations.includes(locationIdStr) || issue.user_id === user_id) {
        if (!addedIssues.has(issueIdStr)) {
          filteredNotifications.push({
            type: 'issue',
            content: issue.content,
            issue_id: issue.issue_id,
            category: issue.category_id,
            location: issue.location_id,
            created_at: issue.created_at
          });
          addedIssues.add(issueIdStr);
        }
      }

      if (issue.comment) {
        issue.comment.forEach(comment => {
          if (subIssues.includes(issueIdStr) || comment.user_id === user_id) {
            filteredNotifications.push({
              type: 'comment',
              content: comment.content,
              issue_id: issue.issue_id,
              category: issue.category_id,
              location: issue.location_id,
              created_at: comment.created_at
            });
          }
        });
      }

      if (issue.reaction) {
        issue.reaction.forEach(reaction => {
          if (subIssues.includes(issueIdStr) || reaction.user_id === user_id) {
            filteredNotifications.push({
              type: 'reaction',
              content: `reacted with ${reaction.emoji}`,
              issue_id: issue.issue_id,
              category: issue.category_id,
              location: issue.location_id,
              created_at: reaction.created_at
            });
          }
        });
      }

      if (issue.resolution) {
        issue.resolution.forEach(resolution => {
          if (subIssues.includes(issueIdStr) || resolution.resolver_id === user_id) {
            filteredNotifications.push({
              type: 'resolution',
              content: `Your ${resolution.resolution_text}`,
              issue_id: issue.issue_id,
              category: issue.category_id,
              location: issue.location_id,
              created_at: resolution.created_at
            });
          }
        });
      }
    });

    pointsData.forEach(points => {
      if (points.user_id === user_id) {
        filteredNotifications.push({
          type: 'points',
          content: `You earned ${points.points} points, because you ${points.action}.`,
          created_at: points.created_at
        });
      }
    });
      
    return filteredNotifications.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }
}
