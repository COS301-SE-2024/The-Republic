import { User, Category } from "../models/issue";
import supabase from "../services/supabaseClient";
import { DateTime } from 'luxon';

interface SupabaseIssue {
  issue_id: number;
  user_id: string;
  location_id: number | null;
  category_id: number;
  content: string;
  image_url: string | null;
  is_anonymous: boolean;
  created_at: string;
  resolved_at: string | null;
  sentiment: string;
  user: User;
  category: Category;
}

export default class IssueRepository {
  async getAllIssues(): Promise<SupabaseIssue[]> {
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
    return data as SupabaseIssue[];
  }

  async getIssueById(issueId: number): Promise<SupabaseIssue | null> {
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
    return data as SupabaseIssue | null;
  }

  async createIssue(issue: Partial<SupabaseIssue>): Promise<SupabaseIssue> {
    const { data, error } = await supabase
      .from("issue")
      .insert(issue)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as SupabaseIssue;
  }

  async updateIssue(issueId: number, issue: Partial<SupabaseIssue>): Promise<SupabaseIssue> {
    const { data, error } = await supabase
      .from("issue")
      .update(issue)
      .eq("issue_id", issueId)
      .single();
    if (error) throw new Error(error.message);
    return data as SupabaseIssue;
  }

  async deleteIssue(issueId: number): Promise<void> {
    const { error } = await supabase
      .from("issue")
      .delete()
      .eq("issue_id", issueId);
    if (error) throw new Error(error.message);
  }

  async resolveIssue(issueId: number): Promise<SupabaseIssue> {
    const resolvedAt = DateTime.now().setZone('UTC+2').toISO();
    const { data, error } = await supabase
      .from("issue")
      .update({ resolved_at: resolvedAt })
      .eq("issue_id", issueId)
      .single();
    if (error) throw new Error(error.message);
    return data as SupabaseIssue;
  }
}
