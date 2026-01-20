
export enum BannerStyle {
  GAMING = 'Gaming',
  PODCAST = 'Podcast',
  MINIMAL = 'Minimalist',
  VIBRANT = 'Vibrant',
  DARK = 'Dark/Cyberpunk',
  NATURE = 'Nature/Relaxing'
}

export interface GeneratedBanner {
  url: string;
  prompt: string;
  timestamp: number;
}

export type AspectRatio = "1:1" | "3:4" | "4:3" | "9:16" | "16:9";
export type ImageSize = "1K" | "2K" | "4K";

export interface GenerationConfig {
  style: BannerStyle;
  customPrompt: string;
  highQuality: boolean;
}
