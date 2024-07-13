import { VizData } from "../types/visualization";
import IssueRepository from "./issueRepository";

const issueRepository = new IssueRepository();

export class VisualizationRepository {
  async getVizData() {
    const issues = await issueRepository.getIssues({ from: 0, amount: 99 });

    const data: VizData = {};

    for (const issue of issues) {
      const location = issue.location;
      this.addIssue(
        data,
        location
          ? [
              location.province,
              location.city,
              location.suburb,
              location.district,
            ]
          : [],
        issue.category.name,
      );
    }

    return data;
  }

  private addIssue(data: VizData, place: string[], category: string) {
    data["$count"] ??= 0;
    data["$count"]++;
    this._addIssue(data, place, category);
  }

  private _addIssue(data: VizData, place: string[], category: string) {
    while (place.length && !place[0]) {
      place.shift();
    }

    if (place.length === 0) {
      data[category] ??= { $count: 0 };
      (data[category] as VizData)["$count"]!++;
      return;
    }

    const placeName = place.shift()!;
    data[placeName] ??= { $count: 0 };
    (data[placeName] as VizData)["$count"]!++;

    this._addIssue(data[placeName] as VizData, place, category);
  }
}
