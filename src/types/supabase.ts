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
      scrapbooks: {
        Row: {
          id: string
          code: string
          title: string
          note: string | null
          photos: Json
          song_id: string | null
          is_published: boolean
          created_at: string
        }
        Insert: {
          id?: string
          code: string
          title: string
          note?: string | null
          photos?: Json
          song_id?: string | null
          is_published?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          code?: string
          title?: string
          note?: string | null
          photos?: Json
          song_id?: string | null
          is_published?: boolean
          created_at?: string
        }
      }
    }
  }
} 