export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          full_name: string | null
          age: number | null
          gender: string | null
          weight: number | null
          height: number | null
          diabetes_type: string | null
          dialysis_type: string | null
          preferred_language: string
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          age?: number | null
          gender?: string | null
          weight?: number | null
          height?: number | null
          diabetes_type?: string | null
          dialysis_type?: string | null
          preferred_language?: string
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          age?: number | null
          gender?: string | null
          weight?: number | null
          height?: number | null
          diabetes_type?: string | null
          dialysis_type?: string | null
          preferred_language?: string
          created_at?: string
        }
      }
      foods: {
        Row: {
          id: string
          name_en: string
          name_sw: string
          potassium_level: string // 'High', 'Medium', 'Low'
          sodium_level: string
          sugar_impact: string
          phosphorus_level: string
          kidney_safety_score: number
          diabetes_safety_score: number
        }
        // ... (Insert/Update omitted for brevity)
      }
      // Add other tables (glucose_logs, dialysis_sessions, medications, water_intake, etc.)
    }
  }
}
