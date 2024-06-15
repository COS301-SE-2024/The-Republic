import { Issue } from "../models/issue";
import supabase from "../services/supabaseClient";
import { DateTime } from 'luxon';
import ReactionRepository from "./reactionRepository";
import { GetIssuesParams } from "../types/issue";
import { CategoryRepository } from "./categoryRepository";
import { APIData, APIError } from "../types/response";

const reactionRepository = new ReactionRepository();
const categoryRepository = new CategoryRepository();

export default class IssueRepository {
  async getIssues({
    from,
    amount,
    category,
    mood,
    user_id
  }: GetIssuesParams) {
    let query = supabase
      .from("issue")
      .select(`
        *,
        user: user_id (
          user_id,
          email_address,
          username,
          fullname,
          image_url
        ),
        category: category_id (
          name
        )
      `)
      .order("created_at", { ascending: false })
      .range(from, from + amount - 1);

    if (category) {
      const categoryId = await categoryRepository.getCategoryId(category);
      query = query.eq("category_id", categoryId);
    }

    if (mood) {
      query = query.eq("sentiment",  mood);
    }

    const { data, error } = await query;

    console.error(error);

    if (error) throw APIError({
      code: 500,
      success: false,
      error: "An unexpected error occurred. Please try again later."
    });

    const issues = await Promise.all(data.map(
      async (issue: Issue) => {
        const reactions = await reactionRepository.getReactionCountsByIssueId(issue.issue_id);
        return {
          ...issue,
          reactions,
          is_owner: issue.user_id === user_id
        };
      }
    ));

    return APIData<Issue[]>({
      code: 200,
      success: true,
      data: issues,
    });
  }

  async getIssueById(issueId: number, user_id?: string) {
    const { data, error } = await supabase
      .from("issue")
      .select(`
        *,
        user: user_id (
          user_id,
          email_address,
          username,
          fullname,
          image_url
        ),
        category: category_id (
          name
        )
      `)
      .eq("issue_id", issueId)
      .maybeSingle();

    console.error(error);

    if (error) throw APIError({
      code: 500,
      success: false,
      error: "An unexpected error occurred. Please try again later."
    });

    if (!data) throw APIError({
      code: 404,
      success: false,
      error: "Issue does not exist"
    });

    // Fetch reaction counts for the issue
    const reactions = await reactionRepository.getReactionCountsByIssueId(data.issue_id);

    return APIData<Issue>({
      code: 200,
      success: true,
      data: {
        ...data,
        reactions,
        is_owner: data.user_id === user_id
      }
    });
  }

  async createIssue(issue: Partial<Issue>) {
    issue.created_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("issue")
      .insert(issue)
      .select()
      .single();

    console.error(error);

    if (error) throw APIError({
      code: 500,
      success: false,
      error: "An unexpected error occurred. Please try again later."
    });

    const reactions = await reactionRepository.getReactionCountsByIssueId(data.issue_id);

    return APIData<Issue>({
      code: 201,
      success: true,
      data: {
        ...data,
        reactions,
        is_owner: true
      }
    });
  }

  async updateIssue(
    issueId: number,
    issue: Partial<Issue>,
    user_id: string
  ) {
    const { data, error } = await supabase
      .from("issue")
      .update(issue)
      .eq("issue_id", issueId)
      .eq("user_id", user_id)
      .select()
      .maybeSingle();

    console.error(error);

    if (error) throw APIError({
      code: 500,
      success: false,
      error: "An unexpected error occurred. Please try again later."
    });

    if (!data) throw APIError({
      code: 404,
      success: false,
      error: "Issue does not exist"
    });

    const reactions = await reactionRepository.getReactionCountsByIssueId(data.issue_id);

    return APIData<Issue>({
      code: 200,
      success: true,
      data: {
        ...data,
        reactions,
        is_owner: true
      }
    });
  }

  async deleteIssue(issueId: number, user_id: string) {
    const { data, error } = await supabase
      .from("issue")
      .delete()
      .eq("issue_id", issueId)
      .eq("user_id", user_id)
      .select()
      .maybeSingle();

    if (error) throw APIError({
      code: 500,
      success: false,
      error: "An unexpected error occurred. Please try again later."
    });

    if (!data) throw APIError({
      code: 404,
      success: false,
      error: "Issue does not exist"
    });

    return APIData({
      code: 204,
      success: true
    });
  }

  async resolveIssue(issueId: number, user_id: string) {
    // TODO: Allow officials to resolve user issues

    const resolvedAt = DateTime.now().setZone('UTC+2').toISO();
    const { data, error } = await supabase
      .from("issue")
      .update({ resolved_at: resolvedAt })
      .eq("issue_id", issueId)
      .eq("user_id", user_id)
      .select()
      .maybeSingle();

    if (error) throw APIError({
      code: 500,
      success: false,
      error: "An unexpected error occurred. Please try again later."
    });

    if (!data) throw APIError({
      code: 404,
      success: false,
      error: "Issue does not exist"
    });

    return APIData<Issue>({
      code: 200,
      success: true,
      data: data,
    });
  }
}
