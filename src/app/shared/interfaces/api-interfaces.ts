export interface Progress {
  error: number;
  message: string;
  total_progress: number;
  cur_progress: number;
}

export interface ResultData {
  tif_name: string;
  min: number;
  max: number;
  mean: number;
  median: number;
}
