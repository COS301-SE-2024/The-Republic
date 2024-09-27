import { Issue } from "@/modules/shared/models/issue";
import supabase from "@/modules/shared/services/supabaseClient";
import { GetIssuesParams } from "@/types/issue";
import { APIError } from "@/types/response";
import {
  Counts,
  CategoryCounts,
  NameValue,
} from "@/modules/shared/models/reports";

export default class ReportsRepository {
  async getAllIssuesGroupedByResolutionStatus({
    from,
    amount,
  }: Partial<GetIssuesParams>) {
    const { data, error } = await supabase
      .from("issue")
      .select(
        `
        *,
        category: category_id (
          name
        ),
        location: location_id (
          suburb,
          city,
          province
        )
      `,
      )
      .order("created_at", { ascending: false })
      .range(from!, from! + amount! - 1);

    if (error) {
      console.error(error);
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred. Please try again later.",
      });
    }

    const groupedIssues = data.reduce(
      (acc, issue) => {
        const key = issue.resolved_at ? "resolved" : "unresolved";
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push({
          ...issue,
          user: undefined,
        });
        return acc;
      },
      { resolved: [], unresolved: [] },
    );

    return groupedIssues;
  }

  async getIssueCountsGroupedByResolutionStatus({
    from,
    amount,
  }: Partial<GetIssuesParams>) {
    const { data, error } = await supabase
      .from("issue")
      .select(
        `
        resolved_at
      `,
      )
      .order("created_at", { ascending: false })
      .range(from!, from! + amount! - 1);

    if (error) {
      console.error(error);
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred. Please try again later.",
      });
    }

    const counts = data.reduce(
      (acc, issue) => {
        const key = issue.resolved_at ? "resolved" : "unresolved";
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      },
      { resolved: 0, unresolved: 0 },
    );

    return counts;
  }

  async getIssueCountsGroupedByResolutionAndCategory({
    from,
    amount,
  }: Partial<GetIssuesParams>) {
    const { data, error } = await supabase
      .from("issue")
      .select(
        `
        *,
        category: category_id (
          name
        )
      `,
      )
      .order("created_at", { ascending: false })
      .range(from!, from! + amount! - 1);

    if (error) {
      console.error(error);
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred. Please try again later.",
      });
    }

    const groupedIssues = data.reduce(
      (acc, issue) => {
        const resolutionKey = issue.resolved_at ? "resolved" : "unresolved";
        const categoryKey = issue.category.name;

        if (!acc[resolutionKey][categoryKey]) {
          acc[resolutionKey][categoryKey] = 0;
        }

        acc[resolutionKey][categoryKey] += 1;

        return acc;
      },
      { resolved: {}, unresolved: {} },
    );

    return groupedIssues;
  }

  async getIssuesGroupedByCreatedAt({
    from,
    amount,
  }: Partial<GetIssuesParams>) {
    const { data, error } = await supabase
      .from("issue")
      .select(
        `
        *,
        category: category_id (
          name
        )
      `,
      )
      .order("created_at", { ascending: false })
      .range(from!, from! + amount! - 1);

    if (error) {
      console.error(error);
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred. Please try again later.",
      });
    }

    const groupedByCreatedAt = data.reduce((acc, issue) => {
      const createdAtDate = issue.created_at.split("T")[0];
      if (!acc[createdAtDate]) {
        acc[createdAtDate] = [];
      }
      acc[createdAtDate].push(issue);
      return acc;
    }, {});

    return groupedByCreatedAt;
  }

  async getIssuesGroupedByCategory({ from, amount }: Partial<GetIssuesParams>) {
    const { data, error } = await supabase
      .from("issue")
      .select(
        `
        *,
        category: category_id (
          name
        )
      `,
      )
      .order("created_at", { ascending: false })
      .range(from!, from! + amount! - 1);

    if (error) {
      console.error(error);
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred. Please try again later.",
      });
    }

    const groupedByCategory = data.reduce((acc, issue) => {
      const categoryName = issue.category.name;
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(issue);
      return acc;
    }, {});

    return groupedByCategory;
  }

  async getIssuesCountGroupedByCategoryAndCreatedAt({
    from,
    amount,
  }: Partial<GetIssuesParams>) {
    const { data, error } = await supabase
      .from("issue")
      .select(
        `
        *,
        category: category_id (
          name
        ),
        created_at
      `,
      )
      .order("created_at", { ascending: false })
      .range(from!, from! + amount! - 1);

    if (error) {
      console.error(error);
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred. Please try again later.",
      });
    }

    const groupedByCategory = data.reduce(
      (acc: { [key: string]: Issue[] }, issue: Issue) => {
        const categoryName = issue.category.name;
        if (!acc[categoryName]) {
          acc[categoryName] = [];
        }
        acc[categoryName].push(issue);
        return acc;
      },
      {},
    );

    const groupedAndCounted = Object.keys(groupedByCategory).reduce(
      (acc: CategoryCounts, categoryName: string) => {
        const issues = groupedByCategory[categoryName];
        const countsByCreatedAt = issues.reduce(
          (counts: Counts, issue: Issue) => {
            const createdAt = issue.created_at.split("T")[0];
            counts[createdAt] = (counts[createdAt] || 0) + 1;
            return counts;
          },
          {},
        );

        acc[categoryName] = countsByCreatedAt;
        return acc;
      },
      {},
    );

    const allDates = new Set<string>();
    Object.values(groupedAndCounted).forEach((countsByCreatedAt) => {
      Object.keys(countsByCreatedAt).forEach((date) => allDates.add(date));
    });

    const normalizedCounts = Object.keys(groupedAndCounted).reduce(
      (acc: CategoryCounts, categoryName: string) => {
        const categoryCounts = groupedAndCounted[categoryName];
        const normalizedCategoryCounts: Counts = {};
        allDates.forEach((date) => {
          normalizedCategoryCounts[date] = categoryCounts[date] || 0;
        });
        acc[categoryName] = normalizedCategoryCounts;
        return acc;
      },
      {},
    );

    return normalizedCounts;
  }

  async groupedByPoliticalAssociation(): Promise<NameValue[]> {
    const { data, error } = await supabase.from("resolution").select(`
        name: political_association,
        value: num_cluster_members_accepted.sum()
      `);

    if (error) {
      console.log(error);
      throw APIError({
        code: 500,
        success: false,
        error: "An unexpected error occurred. Please try again later.",
      });
    }

    return (data as NameValue[]).reduce<NameValue[]>((newData, current) => {
      if (["NONE", null].includes(current.name)) {
        if (newData[0]?.name === "No party") {
          newData[0].value += current.value;
        } else {
          newData.unshift({
            name: "No party",
            value: current.value,
          });
        }
      } else {
        newData.push(current);
      }

      return newData;
    }, []);
  }

  async getOrganizationReport(organizationId: string) {
    const categories = await this.categoryRepository.getCategories();

    categories.unshift({
      category_id: null,
      name: "All"
    });

    const report = await categories.reduce(async (report, category) => {
      const { data, error } = await supabase
        .rpc("org_report", {
          p_org_id: organizationId,
          p_category_id: category.category_id,
        });

      if (error) {
        console.error("getOrganizationReport: ", error);
        throw APIError({
          code: 500,
          success: false,
          error: "An unexpected error occurred. Please try again later.",
        });
      }

      return { 
        ...(await report),
        [category.name]: data.map((row: { [key: string]: string | number }) => ({
          suburb: row.r_suburb || "N/A",
          our_issues: row.r_our_issues,
          our_issues_resolved: row.r_our_issues_resolved,
          issues_resolved_by_us: row.r_issues_resolved_by_us
        }))
      };
    }, {} as Promise<{ 
      [category: string]: {
        suburb: string,
        our_issues: string,
        our_issues_resolved: string,
        issues_resolved_by_us: string,
      }[]
    }>);

    return report;
  }

  async getOrganizationMembersReport(organizationId: string) {
    const categories = await this.categoryRepository.getCategories();

    categories.unshift({
      category_id: null,
      name: "All"
    });

    const report = await categories.reduce(async (report, category) => {
      const { data, error } = await supabase
        .rpc("org_members_report", {
          p_org_id: organizationId,
          p_category_id: category.category_id,
        });

      if (error) {
        console.error("geOrganizationMembersReport (report): ", error);
        throw APIError({
          code: 500,
          success: false,
          error: "An unexpected error occurred. Please try again later.",
        });
      }

      return { 
        ...(await report),
        [category.name]: data.map((row: { [key: string]: string | number | Date }) => ({
          user_id: row.r_user_id,
          fullname: row.r_fullname,
          username: row.r_username,
          email: row.r_email_address,
          joined_at: new Date(row.r_joined_at),
          my_issues: row.r_my_issues,
          my_issues_resolved: row.r_my_issues_resolved,
          issues_resolved_by_me: row.r_issues_resolved_by_me,
        }))
      };
    }, {} as Promise<{ 
      [category: string]: {
        user_id: string,
        fullname: string,
        username: string,
        email: string,
        joined_at: Date,
        my_issues: number,
        my_issues_resolved: number,
        issues_resolved_by_me: number,
      }[]
    }>);

    return report;
  }

}
