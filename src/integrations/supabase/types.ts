export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      analyses: {
        Row: {
          analysis_name: string
          analysis_type: string
          created_at: string
          id: string
          methodology: string
          owner_id: string
          processing_status: string
          results: Json
          source_file: string
          source_url: string
          study_id: string
        }
        Insert: {
          analysis_name: string
          analysis_type: string
          created_at?: string
          id?: string
          methodology: string
          owner_id?: string
          processing_status?: string
          results?: Json
          source_file: string
          source_url: string
          study_id: string
        }
        Update: {
          analysis_name?: string
          analysis_type?: string
          created_at?: string
          id?: string
          methodology?: string
          owner_id?: string
          processing_status?: string
          results?: Json
          source_file?: string
          source_url?: string
          study_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "analyses_study_id_fkey"
            columns: ["study_id"]
            isOneToOne: false
            referencedRelation: "studies"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_measurements: {
        Row: {
          created_at: string
          data: Json
          id: string
          owner_id: string
          title: string
        }
        Insert: {
          created_at?: string
          data?: Json
          id?: string
          owner_id?: string
          title: string
        }
        Update: {
          created_at?: string
          data?: Json
          id?: string
          owner_id?: string
          title?: string
        }
        Relationships: []
      }
      evidence_links: {
        Row: {
          created_at: string
          evidence_note: string
          id: string
          owner_id: string
          reference_id: string
          target_id: string
          target_type: string
        }
        Insert: {
          created_at?: string
          evidence_note: string
          id?: string
          owner_id?: string
          reference_id: string
          target_id: string
          target_type: string
        }
        Update: {
          created_at?: string
          evidence_note?: string
          id?: string
          owner_id?: string
          reference_id?: string
          target_id?: string
          target_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "evidence_links_reference_id_fkey"
            columns: ["reference_id"]
            isOneToOne: false
            referencedRelation: "references"
            referencedColumns: ["id"]
          },
        ]
      }
      references: {
        Row: {
          created_at: string
          data: Json
          id: string
          owner_id: string
          title: string
        }
        Insert: {
          created_at?: string
          data?: Json
          id?: string
          owner_id?: string
          title: string
        }
        Update: {
          created_at?: string
          data?: Json
          id?: string
          owner_id?: string
          title?: string
        }
        Relationships: []
      }
      research_catalog: {
        Row: {
          created_at: string
          data: Json
          id: string
          kind: string
          title: string
        }
        Insert: {
          created_at?: string
          data?: Json
          id: string
          kind: string
          title: string
        }
        Update: {
          created_at?: string
          data?: Json
          id?: string
          kind?: string
          title?: string
        }
        Relationships: []
      }
      research_notes: {
        Row: {
          created_at: string
          data: Json
          id: string
          owner_id: string
          title: string
        }
        Insert: {
          created_at?: string
          data?: Json
          id?: string
          owner_id?: string
          title: string
        }
        Update: {
          created_at?: string
          data?: Json
          id?: string
          owner_id?: string
          title?: string
        }
        Relationships: []
      }
      roadmap_items: {
        Row: {
          created_at: string
          data: Json
          id: string
          owner_id: string
          title: string
        }
        Insert: {
          created_at?: string
          data?: Json
          id?: string
          owner_id?: string
          title: string
        }
        Update: {
          created_at?: string
          data?: Json
          id?: string
          owner_id?: string
          title?: string
        }
        Relationships: []
      }
      studies: {
        Row: {
          created_at: string
          data_types: string[] | null
          description: string
          experimental_conditions: string | null
          id: string
          organism: string | null
          osdr_accession: string
          provenance: Json
          source_url: string
          tissue: string | null
          title: string
          verification_status: string
        }
        Insert: {
          created_at?: string
          data_types?: string[] | null
          description: string
          experimental_conditions?: string | null
          id: string
          organism?: string | null
          osdr_accession: string
          provenance?: Json
          source_url: string
          tissue?: string | null
          title: string
          verification_status?: string
        }
        Update: {
          created_at?: string
          data_types?: string[] | null
          description?: string
          experimental_conditions?: string | null
          id?: string
          organism?: string | null
          osdr_accession?: string
          provenance?: Json
          source_url?: string
          tissue?: string | null
          title?: string
          verification_status?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
