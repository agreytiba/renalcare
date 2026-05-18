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
        Insert: {
          id?: string
          name_en: string
          name_sw: string
          potassium_level: string
          sodium_level: string
          sugar_impact: string
          phosphorus_level: string
          kidney_safety_score: number
          diabetes_safety_score: number
        }
        Update: {
          id?: string
          name_en?: string
          name_sw?: string
          potassium_level?: string
          sodium_level?: string
          sugar_impact?: string
          phosphorus_level?: string
          kidney_safety_score?: number
          diabetes_safety_score?: number
        }
      }
      glucose_logs: {
        Row: {
          id: string
          user_id: string
          level: number
          reading_time: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          level: number
          reading_time?: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          level?: number
          reading_time?: string
          notes?: string | null
          created_at?: string
        }
      }
      dialysis_sessions: {
        Row: {
          id: string
          user_id: string
          session_date: string
          duration_minutes: number
          weight_before: number | null
          weight_after: number | null
          blood_pressure_before: string | null
          blood_pressure_after: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          session_date: string
          duration_minutes: number
          weight_before?: number | null
          weight_after?: number | null
          blood_pressure_before?: string | null
          blood_pressure_after?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          session_date?: string
          duration_minutes?: number
          weight_before?: number | null
          weight_after?: number | null
          blood_pressure_before?: string | null
          blood_pressure_after?: string | null
          notes?: string | null
          created_at?: string
        }
      }
      medications: {
        Row: {
          id: string
          user_id: string
          name: string
          dosage: string
          frequency: string
          time_of_day: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          dosage: string
          frequency: string
          time_of_day?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          dosage?: string
          frequency?: string
          time_of_day?: string | null
          notes?: string | null
          created_at?: string
        }
      }
      water_intake: {
        Row: {
          id: string
          user_id: string
          amount_ml: number
          intake_time: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount_ml: number
          intake_time?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount_ml?: number
          intake_time?: string
          created_at?: string
        }
      }
    }
  }
}
