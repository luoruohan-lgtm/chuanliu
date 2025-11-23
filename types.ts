export interface CityTheme {
  id: string;
  name: string;
  trait: string; // e.g., "Chill/Buddhist"
  productName: string; // e.g., "Lychee Wine"
  fruit: string; // e.g., "Lychee"
  brandName: string; // e.g., "荔想派"
  brandEnglish: string; // e.g., "DreamPie"
  description: string;
  color: string;
}

export interface GeneratedContent {
  imageUrl: string;
  story: string;
  cityName: string;
  productName: string;
  brandName: string;
  brandEnglish: string;
}

export enum AppState {
  IDLE = 'IDLE',
  OPENING = 'OPENING', // Animation playing
  GENERATING = 'GENERATING', // AI working
  REVEALED = 'REVEALED',
}