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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      lead_context: {
        Row: {
          age: number | null
          best_fit_path: string | null
          budget_signal: string | null
          buy_intent_urgency: number | null
          country: string | null
          current_stage: string | null
          email: string
          lead_id: string | null
          meta: Json | null
          persona_label: string | null
          readiness_score: number | null
          registered_at: string | null
          updated_at: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          age?: number | null
          best_fit_path?: string | null
          budget_signal?: string | null
          buy_intent_urgency?: number | null
          country?: string | null
          current_stage?: string | null
          email: string
          lead_id?: string | null
          meta?: Json | null
          persona_label?: string | null
          readiness_score?: number | null
          registered_at?: string | null
          updated_at?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          age?: number | null
          best_fit_path?: string | null
          budget_signal?: string | null
          buy_intent_urgency?: number | null
          country?: string | null
          current_stage?: string | null
          email?: string
          lead_id?: string | null
          meta?: Json | null
          persona_label?: string | null
          readiness_score?: number | null
          registered_at?: string | null
          updated_at?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: []
      }
      message_analyses: {
        Row: {
          cost_usd: number | null
          created_at: string | null
          emotion: string | null
          goals: string[] | null
          intents: string[] | null
          model: string | null
          msg_idx: number
          pain_points: string[] | null
          role: string
          sentiment: number | null
          session_id: string
          summary: string | null
          ts: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          cost_usd?: number | null
          created_at?: string | null
          emotion?: string | null
          goals?: string[] | null
          intents?: string[] | null
          model?: string | null
          msg_idx: number
          pain_points?: string[] | null
          role: string
          sentiment?: number | null
          session_id: string
          summary?: string | null
          ts?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          cost_usd?: number | null
          created_at?: string | null
          emotion?: string | null
          goals?: string[] | null
          intents?: string[] | null
          model?: string | null
          msg_idx?: number
          pain_points?: string[] | null
          role?: string
          sentiment?: number | null
          session_id?: string
          summary?: string | null
          ts?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      prompts: {
        Row: {
          created_at: string
          id: string
          prompt_name: string
          questions: Json | null
          stage_label: Database["public"]["Enums"]["pathway_stage"]
          system_prompt_text: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          prompt_name: string
          questions?: Json | null
          stage_label: Database["public"]["Enums"]["pathway_stage"]
          system_prompt_text: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          prompt_name?: string
          questions?: Json | null
          stage_label?: Database["public"]["Enums"]["pathway_stage"]
          system_prompt_text?: string
          updated_at?: string
        }
        Relationships: []
      }
      rag_chunks: {
        Row: {
          age: number | null
          chunk_id: number
          country: string | null
          created_at: string | null
          email: string | null
          embedding: string | null
          lead_id: string | null
          lead_id_text: string | null
          meta: Json | null
          msg_ts: string | null
          path: string | null
          profile_id: string | null
          ref_id: string | null
          role: string | null
          source: string
          stage: string | null
          text: string
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          age?: number | null
          chunk_id?: number
          country?: string | null
          created_at?: string | null
          email?: string | null
          embedding?: string | null
          lead_id?: string | null
          lead_id_text?: string | null
          meta?: Json | null
          msg_ts?: string | null
          path?: string | null
          profile_id?: string | null
          ref_id?: string | null
          role?: string | null
          source: string
          stage?: string | null
          text: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          age?: number | null
          chunk_id?: number
          country?: string | null
          created_at?: string | null
          email?: string | null
          embedding?: string | null
          lead_id?: string | null
          lead_id_text?: string | null
          meta?: Json | null
          msg_ts?: string | null
          path?: string | null
          profile_id?: string | null
          ref_id?: string | null
          role?: string | null
          source?: string
          stage?: string | null
          text?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: []
      }
      session_analyses: {
        Row: {
          avg_sentiment: number | null
          created_at: string | null
          session_id: string
          success: boolean | null
          summary: string | null
          top_goals: string[] | null
          top_pain_points: string[] | null
          updated_at: string
        }
        Insert: {
          avg_sentiment?: number | null
          created_at?: string | null
          session_id: string
          success?: boolean | null
          summary?: string | null
          top_goals?: string[] | null
          top_pain_points?: string[] | null
          updated_at?: string
        }
        Update: {
          avg_sentiment?: number | null
          created_at?: string | null
          session_id?: string
          success?: boolean | null
          summary?: string | null
          top_goals?: string[] | null
          top_pain_points?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_analyses_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: true
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_analyses_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: true
            referencedRelation: "v_latest_session_per_email_gdl"
            referencedColumns: ["session_id"]
          },
          {
            foreignKeyName: "session_analyses_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: true
            referencedRelation: "v_message_tags"
            referencedColumns: ["session_id"]
          },
          {
            foreignKeyName: "session_analyses_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: true
            referencedRelation: "v_messages"
            referencedColumns: ["session_id"]
          },
          {
            foreignKeyName: "session_analyses_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: true
            referencedRelation: "v_session_ai_summary"
            referencedColumns: ["session_id"]
          },
          {
            foreignKeyName: "session_analyses_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: true
            referencedRelation: "v_session_details_gdl"
            referencedColumns: ["session_id"]
          },
          {
            foreignKeyName: "session_analyses_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: true
            referencedRelation: "v_sessions"
            referencedColumns: ["session_id"]
          },
          {
            foreignKeyName: "session_analyses_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: true
            referencedRelation: "v_sessions_gdl"
            referencedColumns: ["session_id"]
          },
          {
            foreignKeyName: "session_analyses_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: true
            referencedRelation: "v_sessions_to_analyze"
            referencedColumns: ["session_id"]
          },
          {
            foreignKeyName: "session_analyses_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: true
            referencedRelation: "v_user_message_enriched"
            referencedColumns: ["session_id"]
          },
          {
            foreignKeyName: "session_analyses_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: true
            referencedRelation: "v_user_messages_to_analyze"
            referencedColumns: ["session_id"]
          },
        ]
      }
      sessions: {
        Row: {
          completed: boolean | null
          conversation_log: Json | null
          created_at: string
          id: string
          pathway_stage: Database["public"]["Enums"]["pathway_stage"]
          profile_id: string | null
          updated_at: string
        }
        Insert: {
          completed?: boolean | null
          conversation_log?: Json | null
          created_at?: string
          id?: string
          pathway_stage: Database["public"]["Enums"]["pathway_stage"]
          profile_id?: string | null
          updated_at?: string
        }
        Update: {
          completed?: boolean | null
          conversation_log?: Json | null
          created_at?: string
          id?: string
          pathway_stage?: Database["public"]["Enums"]["pathway_stage"]
          profile_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "v_sessions_gdl"
            referencedColumns: ["profile_id"]
          },
        ]
      }
    }
    Views: {
      v_latest_session_per_email_gdl: {
        Row: {
          completed: boolean | null
          email: string | null
          ended_at: string | null
          msg_count: number | null
          path: string | null
          session_id: string | null
          started_at: string | null
        }
        Relationships: []
      }
      v_message_tags: {
        Row: {
          content: string | null
          msg_idx: number | null
          pathway_stage: Database["public"]["Enums"]["pathway_stage"] | null
          role: string | null
          session_id: string | null
          tags: string[] | null
          ts: string | null
          user_email: string | null
          user_id: string | null
          user_name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sessions_profile_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessions_profile_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_sessions_gdl"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      v_messages: {
        Row: {
          content: string | null
          msg_idx: number | null
          pathway_stage: Database["public"]["Enums"]["pathway_stage"] | null
          role: string | null
          session_id: string | null
          ts: string | null
          user_email: string | null
          user_id: string | null
          user_name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sessions_profile_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessions_profile_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_sessions_gdl"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      v_session_ai_summary: {
        Row: {
          avg_sentiment: number | null
          dominant_emotion: string | null
          duration_sec: number | null
          goals_union: string[] | null
          inferred_completed: boolean | null
          intents_union: string[] | null
          msg_count: number | null
          pains_union: string[] | null
          pathway_stage: Database["public"]["Enums"]["pathway_stage"] | null
          session_id: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sessions_profile_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessions_profile_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_sessions_gdl"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      v_session_details_gdl: {
        Row: {
          completed: boolean | null
          email: string | null
          ended_at: string | null
          msg_count: number | null
          path: string | null
          sa_summary: string | null
          sa_top_goals: string[] | null
          sa_top_pains: string[] | null
          session_id: string | null
          started_at: string | null
          user_quotes: string[] | null
        }
        Relationships: []
      }
      v_sessions: {
        Row: {
          asst_msg_count: number | null
          dropoff_user_msg_idx: number | null
          duration_sec: number | null
          end_ts: string | null
          inferred_completed: boolean | null
          msg_count: number | null
          pathway_stage: Database["public"]["Enums"]["pathway_stage"] | null
          session_id: string | null
          start_ts: string | null
          user_email: string | null
          user_id: string | null
          user_msg_count: number | null
          user_name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sessions_profile_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessions_profile_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_sessions_gdl"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      v_sessions_gdl: {
        Row: {
          completed: boolean | null
          conversation_log: Json | null
          email: string | null
          ended_at: string | null
          msg_count: number | null
          path: string | null
          profile_id: string | null
          session_id: string | null
          started_at: string | null
        }
        Relationships: []
      }
      v_sessions_to_analyze: {
        Row: {
          profile_id: string | null
          session_id: string | null
          start_ts: string | null
          user_messages: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "sessions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "v_sessions_gdl"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      v_stage_themes: {
        Row: {
          mentions: number | null
          pathway_stage: Database["public"]["Enums"]["pathway_stage"] | null
          tag: string | null
        }
        Relationships: []
      }
      v_user_message_enriched: {
        Row: {
          content: string | null
          emotion: string | null
          goals: string[] | null
          intents: string[] | null
          model: string | null
          msg_idx: number | null
          pain_points: string[] | null
          role: string | null
          sentiment: number | null
          session_id: string | null
          summary: string | null
          ts: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sessions_profile_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessions_profile_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_sessions_gdl"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      v_user_messages_to_analyze: {
        Row: {
          content: string | null
          msg_idx: number | null
          role: string | null
          session_id: string | null
          ts: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sessions_profile_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessions_profile_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_sessions_gdl"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      v_users: {
        Row: {
          avg_msgs_per_session: number | null
          avg_session_duration_sec: number | null
          completed_sessions: number | null
          completion_rate: number | null
          median_msgs_per_session: number | null
          median_session_duration_sec: number | null
          sessions: number | null
          user_email: string | null
          user_id: string | null
          user_name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sessions_profile_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessions_profile_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_sessions_gdl"
            referencedColumns: ["profile_id"]
          },
        ]
      }
    }
    Functions: {
      fn_user_quotes_gdl: {
        Args: { max_quotes?: number; session_id_in: string }
        Returns: string[]
      }
      rag_search: {
        Args: {
          emb: number[]
          p_email_like?: string
          p_k?: number
          p_max_age?: number
          p_min_age?: number
          p_path?: string
          p_probes?: number
          p_source?: string
          p_stage?: string
        }
        Returns: {
          age: number
          chunk_id: number
          email: string
          path: string
          ref_id: string
          score: number
          source: string
          stage: string
          text: string
        }[]
      }
    }
    Enums: {
      pathway_stage: "no_idea" | "idea_validation" | "improvement" | "scaling"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      pathway_stage: ["no_idea", "idea_validation", "improvement", "scaling"],
    },
  },
} as const
