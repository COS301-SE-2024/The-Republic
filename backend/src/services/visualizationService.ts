import { VisualizationRepository } from "../db/visualizationRepository";
import { APIData } from "../types/response";

export class VisualizationService {
  private visualizationRepository = new VisualizationRepository();

  async getVizData() {
    const vizData = await this.visualizationRepository.getVizData();

    return APIData({
      code: 200,
      success: true,
      data: vizData,
    });
  }
}
