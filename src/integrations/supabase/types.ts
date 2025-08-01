export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      contact_history: {
        Row: {
          contact_date: string
          contact_type: string
          created_at: string
          domain_id: string
          id: string
          notes: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          contact_date?: string
          contact_type: string
          created_at?: string
          domain_id: string
          id?: string
          notes?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          contact_date?: string
          contact_type?: string
          created_at?: string
          domain_id?: string
          id?: string
          notes?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_history_domain_id_fkey"
            columns: ["domain_id"]
            isOneToOne: false
            referencedRelation: "domains"
            referencedColumns: ["id"]
          },
        ]
      }
      dns_info: {
        Row: {
          aaaa_records: string[] | null
          cname_records: Json | null
          created_at: string
          domain_id: string
          id: string
          ip: string | null
          mx_records: Json | null
          ns: string[] | null
          ns_status: string | null
          txt_records: string[] | null
          updated_at: string
          user_id: string | null
          verified: boolean
          verified_at: string | null
        }
        Insert: {
          aaaa_records?: string[] | null
          cname_records?: Json | null
          created_at?: string
          domain_id: string
          id?: string
          ip?: string | null
          mx_records?: Json | null
          ns?: string[] | null
          ns_status?: string | null
          txt_records?: string[] | null
          updated_at?: string
          user_id?: string | null
          verified?: boolean
          verified_at?: string | null
        }
        Update: {
          aaaa_records?: string[] | null
          cname_records?: Json | null
          created_at?: string
          domain_id?: string
          id?: string
          ip?: string | null
          mx_records?: Json | null
          ns?: string[] | null
          ns_status?: string | null
          txt_records?: string[] | null
          updated_at?: string
          user_id?: string | null
          verified?: boolean
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dns_info_domain_id_fkey"
            columns: ["domain_id"]
            isOneToOne: true
            referencedRelation: "domains"
            referencedColumns: ["id"]
          },
        ]
      }
      domain_analysis: {
        Row: {
          analyzed_at: string
          business_type: string | null
          created_at: string
          domain_id: string
          estimated_value: number | null
          id: string
          is_active: boolean | null
          screenshot_url: string | null
          seo_score: number | null
          technology_detected: string[] | null
          traffic_estimate: number | null
          updated_at: string
        }
        Insert: {
          analyzed_at?: string
          business_type?: string | null
          created_at?: string
          domain_id: string
          estimated_value?: number | null
          id?: string
          is_active?: boolean | null
          screenshot_url?: string | null
          seo_score?: number | null
          technology_detected?: string[] | null
          traffic_estimate?: number | null
          updated_at?: string
        }
        Update: {
          analyzed_at?: string
          business_type?: string | null
          created_at?: string
          domain_id?: string
          estimated_value?: number | null
          id?: string
          is_active?: boolean | null
          screenshot_url?: string | null
          seo_score?: number | null
          technology_detected?: string[] | null
          traffic_estimate?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      domain_categories: {
        Row: {
          category: string
          confidence_score: number | null
          created_at: string
          detected_at: string
          domain_id: string
          id: string
          keywords: string[] | null
          subcategory: string | null
          updated_at: string
        }
        Insert: {
          category: string
          confidence_score?: number | null
          created_at?: string
          detected_at?: string
          domain_id: string
          id?: string
          keywords?: string[] | null
          subcategory?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          confidence_score?: number | null
          created_at?: string
          detected_at?: string
          domain_id?: string
          id?: string
          keywords?: string[] | null
          subcategory?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      domain_trends: {
        Row: {
          count: number | null
          created_at: string
          id: string
          keyword: string
          trend_date: string
          updated_at: string
        }
        Insert: {
          count?: number | null
          created_at?: string
          id?: string
          keyword: string
          trend_date?: string
          updated_at?: string
        }
        Update: {
          count?: number | null
          created_at?: string
          id?: string
          keyword?: string
          trend_date?: string
          updated_at?: string
        }
        Relationships: []
      }
      domains: {
        Row: {
          contacted: boolean
          created_at: string
          domain: string
          extraction_method: string | null
          id: string
          source: string | null
          timestamp: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          contacted?: boolean
          created_at?: string
          domain: string
          extraction_method?: string | null
          id?: string
          source?: string | null
          timestamp?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          contacted?: boolean
          created_at?: string
          domain?: string
          extraction_method?: string | null
          id?: string
          source?: string | null
          timestamp?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      performance_metrics: {
        Row: {
          created_at: string | null
          cumulative_layout_shift: number | null
          domain_id: string
          first_contentful_paint_ms: number | null
          id: string
          largest_contentful_paint_ms: number | null
          load_time_ms: number | null
          measured_at: string | null
          page_size_kb: number | null
          pagespeed_score: number | null
        }
        Insert: {
          created_at?: string | null
          cumulative_layout_shift?: number | null
          domain_id: string
          first_contentful_paint_ms?: number | null
          id?: string
          largest_contentful_paint_ms?: number | null
          load_time_ms?: number | null
          measured_at?: string | null
          page_size_kb?: number | null
          pagespeed_score?: number | null
        }
        Update: {
          created_at?: string | null
          cumulative_layout_shift?: number | null
          domain_id?: string
          first_contentful_paint_ms?: number | null
          id?: string
          largest_contentful_paint_ms?: number | null
          load_time_ms?: number | null
          measured_at?: string | null
          page_size_kb?: number | null
          pagespeed_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "performance_metrics_domain_id_fkey"
            columns: ["domain_id"]
            isOneToOne: true
            referencedRelation: "domains"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      ssl_info: {
        Row: {
          created_at: string | null
          domain_id: string
          https_redirect: boolean | null
          id: string
          security_headers: Json | null
          ssl_enabled: boolean | null
          ssl_expires_date: string | null
          ssl_grade: string | null
          ssl_issuer: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          domain_id: string
          https_redirect?: boolean | null
          id?: string
          security_headers?: Json | null
          ssl_enabled?: boolean | null
          ssl_expires_date?: string | null
          ssl_grade?: string | null
          ssl_issuer?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          domain_id?: string
          https_redirect?: boolean | null
          id?: string
          security_headers?: Json | null
          ssl_enabled?: boolean | null
          ssl_expires_date?: string | null
          ssl_grade?: string | null
          ssl_issuer?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ssl_info_domain_id_fkey"
            columns: ["domain_id"]
            isOneToOne: true
            referencedRelation: "domains"
            referencedColumns: ["id"]
          },
        ]
      }
      tech_stack: {
        Row: {
          analytics_tools: string[] | null
          cdn_provider: string | null
          cms_detected: string | null
          country_location: string | null
          created_at: string | null
          database_type: string | null
          detected_at: string | null
          domain_id: string
          framework_detected: string | null
          hosting_provider: string | null
          id: string
          programming_language: string | null
          server_software: string | null
        }
        Insert: {
          analytics_tools?: string[] | null
          cdn_provider?: string | null
          cms_detected?: string | null
          country_location?: string | null
          created_at?: string | null
          database_type?: string | null
          detected_at?: string | null
          domain_id: string
          framework_detected?: string | null
          hosting_provider?: string | null
          id?: string
          programming_language?: string | null
          server_software?: string | null
        }
        Update: {
          analytics_tools?: string[] | null
          cdn_provider?: string | null
          cms_detected?: string | null
          country_location?: string | null
          created_at?: string | null
          database_type?: string | null
          detected_at?: string | null
          domain_id?: string
          framework_detected?: string | null
          hosting_provider?: string | null
          id?: string
          programming_language?: string | null
          server_software?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tech_stack_domain_id_fkey"
            columns: ["domain_id"]
            isOneToOne: true
            referencedRelation: "domains"
            referencedColumns: ["id"]
          },
        ]
      }
      whois_info: {
        Row: {
          address: string | null
          cached_at: string | null
          created_at: string
          created_date: string | null
          dnssec_status: string | null
          domain_id: string
          email: string | null
          expires_date: string | null
          id: string
          name_servers: string[] | null
          organization: string | null
          owner_name: string | null
          phone: string | null
          registrar: string | null
          registry_lock: boolean | null
          status: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address?: string | null
          cached_at?: string | null
          created_at?: string
          created_date?: string | null
          dnssec_status?: string | null
          domain_id: string
          email?: string | null
          expires_date?: string | null
          id?: string
          name_servers?: string[] | null
          organization?: string | null
          owner_name?: string | null
          phone?: string | null
          registrar?: string | null
          registry_lock?: boolean | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address?: string | null
          cached_at?: string | null
          created_at?: string
          created_date?: string | null
          dnssec_status?: string | null
          domain_id?: string
          email?: string | null
          expires_date?: string | null
          id?: string
          name_servers?: string[] | null
          organization?: string | null
          owner_name?: string | null
          phone?: string | null
          registrar?: string | null
          registry_lock?: boolean | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "whois_info_domain_id_fkey"
            columns: ["domain_id"]
            isOneToOne: true
            referencedRelation: "domains"
            referencedColumns: ["id"]
          },
        ]
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
    Enums: {},
  },
} as const
