export interface KhataItem {
  id: string;
  date: string;
  description: string;
  amount: number;
}

export interface TaxDetails {
  subtotal: number;
  cgst: number; // 9%
  sgst: number; // 9%
  total: number;
}

export interface KhataRecord {
  id: string;
  timestamp: string; // ISO String
  items: KhataItem[];
  taxDetails: TaxDetails;
}

export interface User {
  username: string;
  name: string;
  shopType: ShopType;
}

export interface Poster {
  id: string;
  headline: string;
  subline: string;
  body: string;
  colorTheme: string;
  imageUrl?: string; // Base64
  createdAt: string;
}

export enum ShopType {
  GENERAL = 'General Store',
  GROCERY = 'Kirana / Grocery',
  MEDICAL = 'Pharmacy / Medical',
  ELECTRONICS = 'Electronics',
  RESTAURANT = 'Restaurant / Cafe',
  HARDWARE = 'Hardware'
}

export enum AppStep {
  LOGIN = 'LOGIN',
  MAIN_APP = 'MAIN_APP', // Replaces DASHBOARD as the container for views
  UPLOAD = 'UPLOAD',
  PROCESSING = 'PROCESSING',
  VERIFICATION = 'VERIFICATION',
  TAX_ANALYSIS = 'TAX_ANALYSIS',
  FINAL_PREVIEW = 'FINAL_PREVIEW',
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  REPORTS = 'REPORTS',
  MARKETING = 'MARKETING',
  SETTINGS = 'SETTINGS'
}

export enum PipelineStage {
  IDLE = 'IDLE',
  YOLO_DETECTION = 'YOLO_DETECTION',
  CROPPING = 'CROPPING',
  TROCR_RECOGNITION = 'TROCR_RECOGNITION',
  LLM_STRUCTURING = 'LLM_STRUCTURING',
  DB_FILLING = 'DB_FILLING',
  COMPLETE = 'COMPLETE'
}