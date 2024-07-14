export interface VizData {
  $count?: number;
  [place: string]: VizData | number | undefined;
}
