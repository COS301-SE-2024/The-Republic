import { Issue } from "../models/issue";
import supabase from "../services/supabaseClient";
import { DateTime } from 'luxon';
import ReactionRepository from "./reactionRepository";
import { GetIssuesParams } from "../types/issue";

const reactionRepository = new ReactionRepository();

export default class IssueRepository {
  async getAllIssues(): Promise<Issue[]> {
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
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);

    // Fetch reaction counts for each issue
    const issues = await Promise.all(data.map(async (issue: Issue) => {
      const reactions = await reactionRepository.getReactionCountsByIssueId(issue.issue_id);
      return { ...issue, reactions };
    }));

    return issues as Issue[];
  }

  async getIssues({
    from,
    amount,
  }: GetIssuesParams): Promise<Issue[]> {
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

    const { data, error } = await query;

    if (error) throw new Error(error.message);

    // Fetch reaction counts for each issue
    const issues = await Promise.all(data.map(async (issue: Issue) => {
      const reactions = await reactionRepository.getReactionCountsByIssueId(issue.issue_id);
      return { ...issue, reactions };
    }));

    return issues as Issue[];
  }


  async getIssueById(issueId: number): Promise<Issue | null> {
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
      .single();
    if (error) throw new Error(error.message);

    if (!data) {
      return null;
    }

    // Fetch reaction counts for the issue
    const reactions = await reactionRepository.getReactionCountsByIssueId(data.issue_id);

    return { ...data, reactions } as Issue;
  }

  async createIssue(issue: Partial<Issue>): Promise<Issue> {
    const { data, error } = await supabase
      .from("issue")
      .insert(issue)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Issue;
  }

  async updateIssue(issueId: number, issue: Partial<Issue>): Promise<Issue> {
    const { data, error } = await supabase
      .from("issue")
      .update(issue)
      .eq("issue_id", issueId)
      .single();
    if (error) throw new Error(error.message);
    return data as Issue;
  }

  async deleteIssue(issueId: number): Promise<void> {
    const { error } = await supabase
      .from("issue")
      .delete()
      .eq("issue_id", issueId);
    if (error) throw new Error(error.message);
  }

  async resolveIssue(issueId: number): Promise<Issue> {
    const resolvedAt = DateTime.now().setZone('UTC+2').toISO();
    const { data, error } = await supabase
      .from("issue")
      .update({ resolved_at: resolvedAt })
      .eq("issue_id", issueId)
      .single();
    if (error) throw new Error(error.message);
    return data as Issue;
  }
}
