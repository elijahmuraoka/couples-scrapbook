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
          music_id: string | null
          is_published: boolean
          created_at: string
        }
        Insert: {
          id?: string
          code: string
          title: string
          note?: string | null
          music_id?: string | null
          is_published?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          code?: string
          title?: string
          note?: string | null
          music_id?: string | null
          is_published?: boolean
          created_at?: string
        }
      }
      photos: {
        Row: {
          id: string
          scrapbook_id: string
          url: string
          order: number
          caption: string | null
          location: string | null
          taken_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          scrapbook_id: string
          url: string
          order: number
          caption?: string | null
          location?: string | null
          taken_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          scrapbook_id?: string
          url?: string
          order?: number
          caption?: string | null
          location?: string | null
          taken_at?: string | null
          created_at?: string
        }
      }
    }
  }
}
