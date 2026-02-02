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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      asn_data_cache: {
        Row: {
          asn: number
          cached_at: string | null
          country_code: string | null
          created_at: string | null
          description: string | null
          expires_at: string | null
          ipv4_prefixes: Json | null
          ipv6_prefixes: Json | null
          name: string | null
          peers: Json | null
          peers_count: number | null
          prefixes_count: number | null
          rir_allocation: string | null
          website: string | null
        }
        Insert: {
          asn: number
          cached_at?: string | null
          country_code?: string | null
          created_at?: string | null
          description?: string | null
          expires_at?: string | null
          ipv4_prefixes?: Json | null
          ipv6_prefixes?: Json | null
          name?: string | null
          peers?: Json | null
          peers_count?: number | null
          prefixes_count?: number | null
          rir_allocation?: string | null
          website?: string | null
        }
        Update: {
          asn?: number
          cached_at?: string | null
          country_code?: string | null
          created_at?: string | null
          description?: string | null
          expires_at?: string | null
          ipv4_prefixes?: Json | null
          ipv6_prefixes?: Json | null
          name?: string | null
          peers?: Json | null
          peers_count?: number | null
          prefixes_count?: number | null
          rir_allocation?: string | null
          website?: string | null
        }
        Relationships: []
      }
      asn_search_cache: {
        Row: {
          cached_at: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          results: Json
          search_term: string
        }
        Insert: {
          cached_at?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          results: Json
          search_term: string
        }
        Update: {
          cached_at?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          results?: Json
          search_term?: string
        }
        Relationships: []
      }
      certification_categories: {
        Row: {
          badge_image_url: string | null
          created_at: string | null
          criteria: Json | null
          description: string | null
          display_order: number | null
          free_tier_features: Json | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          premium_features: Json | null
          premium_price_clp: number | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          badge_image_url?: string | null
          created_at?: string | null
          criteria?: Json | null
          description?: string | null
          display_order?: number | null
          free_tier_features?: Json | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          premium_features?: Json | null
          premium_price_clp?: number | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          badge_image_url?: string | null
          created_at?: string | null
          criteria?: Json | null
          description?: string | null
          display_order?: number | null
          free_tier_features?: Json | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          premium_features?: Json | null
          premium_price_clp?: number | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      company_certifications: {
        Row: {
          category_id: string
          company_id: string
          created_at: string | null
          display_order: number | null
          expires_at: string | null
          granted_at: string | null
          granted_by: string | null
          id: string
          link_back_verified: boolean | null
          link_back_verified_at: string | null
          payment_amount: number | null
          payment_date: string | null
          payment_reference: string | null
          payment_status: string | null
          position: number | null
          requires_link_back: boolean | null
          status: Database["public"]["Enums"]["certification_status"] | null
          tier: Database["public"]["Enums"]["certification_tier"] | null
          updated_at: string | null
        }
        Insert: {
          category_id: string
          company_id: string
          created_at?: string | null
          display_order?: number | null
          expires_at?: string | null
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          link_back_verified?: boolean | null
          link_back_verified_at?: string | null
          payment_amount?: number | null
          payment_date?: string | null
          payment_reference?: string | null
          payment_status?: string | null
          position?: number | null
          requires_link_back?: boolean | null
          status?: Database["public"]["Enums"]["certification_status"] | null
          tier?: Database["public"]["Enums"]["certification_tier"] | null
          updated_at?: string | null
        }
        Update: {
          category_id?: string
          company_id?: string
          created_at?: string | null
          display_order?: number | null
          expires_at?: string | null
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          link_back_verified?: boolean | null
          link_back_verified_at?: string | null
          payment_amount?: number | null
          payment_date?: string | null
          payment_reference?: string | null
          payment_status?: string | null
          position?: number | null
          requires_link_back?: boolean | null
          status?: Database["public"]["Enums"]["certification_status"] | null
          tier?: Database["public"]["Enums"]["certification_tier"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_certifications_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "certification_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_certifications_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "hosting_companies"
            referencedColumns: ["id"]
          },
        ]
      }
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
        Relationships: [
          {
            foreignKeyName: "domain_analysis_domain_id_fkey"
            columns: ["domain_id"]
            isOneToOne: false
            referencedRelation: "domains"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "domain_categories_domain_id_fkey"
            columns: ["domain_id"]
            isOneToOne: false
            referencedRelation: "domains"
            referencedColumns: ["id"]
          },
        ]
      }
      domain_inquiries: {
        Row: {
          created_at: string | null
          domain_id: string
          email: string
          id: string
          message: string | null
          name: string | null
          offer_amount: number | null
          phone: string | null
          status: Database["public"]["Enums"]["inquiry_status"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          domain_id: string
          email: string
          id?: string
          message?: string | null
          name?: string | null
          offer_amount?: number | null
          phone?: string | null
          status?: Database["public"]["Enums"]["inquiry_status"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          domain_id?: string
          email?: string
          id?: string
          message?: string | null
          name?: string | null
          offer_amount?: number | null
          phone?: string | null
          status?: Database["public"]["Enums"]["inquiry_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "domain_inquiries_domain_id_fkey"
            columns: ["domain_id"]
            isOneToOne: false
            referencedRelation: "my_domain_portfolio"
            referencedColumns: ["id"]
          },
        ]
      }
      domain_opportunities: {
        Row: {
          ai_category: string | null
          ai_rationale: string | null
          ai_score: number | null
          analyzed_at: string | null
          created_at: string | null
          detected_at: string | null
          domain_name: string
          estimated_value: number | null
          expiration_date: string | null
          id: string
          source: string | null
          source_url: string | null
          status:
            | Database["public"]["Enums"]["domain_opportunity_status"]
            | null
          tld: string | null
          updated_at: string | null
        }
        Insert: {
          ai_category?: string | null
          ai_rationale?: string | null
          ai_score?: number | null
          analyzed_at?: string | null
          created_at?: string | null
          detected_at?: string | null
          domain_name: string
          estimated_value?: number | null
          expiration_date?: string | null
          id?: string
          source?: string | null
          source_url?: string | null
          status?:
            | Database["public"]["Enums"]["domain_opportunity_status"]
            | null
          tld?: string | null
          updated_at?: string | null
        }
        Update: {
          ai_category?: string | null
          ai_rationale?: string | null
          ai_score?: number | null
          analyzed_at?: string | null
          created_at?: string | null
          detected_at?: string | null
          domain_name?: string
          estimated_value?: number | null
          expiration_date?: string | null
          id?: string
          source?: string | null
          source_url?: string | null
          status?:
            | Database["public"]["Enums"]["domain_opportunity_status"]
            | null
          tld?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      domain_sniper_settings: {
        Row: {
          auto_sniper_enabled: boolean | null
          daily_budget: number | null
          id: string
          max_domain_price: number | null
          min_score_auto_buy: number | null
          notify_email: string | null
          updated_at: string | null
        }
        Insert: {
          auto_sniper_enabled?: boolean | null
          daily_budget?: number | null
          id?: string
          max_domain_price?: number | null
          min_score_auto_buy?: number | null
          notify_email?: string | null
          updated_at?: string | null
        }
        Update: {
          auto_sniper_enabled?: boolean | null
          daily_budget?: number | null
          id?: string
          max_domain_price?: number | null
          min_score_auto_buy?: number | null
          notify_email?: string | null
          updated_at?: string | null
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
      hosting_companies: {
        Row: {
          claimed_at: string | null
          claimed_by: string | null
          contact_address: string | null
          contact_email: string | null
          contact_hours: string | null
          contact_phone: string | null
          created_at: string | null
          datacenter_location: string | null
          description: string | null
          id: string
          is_featured: boolean | null
          is_verified: boolean | null
          logo_url: string | null
          name: string
          overall_rating: number | null
          price_rating: number | null
          slug: string
          social_media: Json | null
          speed_rating: number | null
          support_rating: number | null
          technologies: string[] | null
          total_reviews: number | null
          updated_at: string | null
          verified_reviews: number | null
          website: string | null
          year_founded: number | null
        }
        Insert: {
          claimed_at?: string | null
          claimed_by?: string | null
          contact_address?: string | null
          contact_email?: string | null
          contact_hours?: string | null
          contact_phone?: string | null
          created_at?: string | null
          datacenter_location?: string | null
          description?: string | null
          id?: string
          is_featured?: boolean | null
          is_verified?: boolean | null
          logo_url?: string | null
          name: string
          overall_rating?: number | null
          price_rating?: number | null
          slug: string
          social_media?: Json | null
          speed_rating?: number | null
          support_rating?: number | null
          technologies?: string[] | null
          total_reviews?: number | null
          updated_at?: string | null
          verified_reviews?: number | null
          website?: string | null
          year_founded?: number | null
        }
        Update: {
          claimed_at?: string | null
          claimed_by?: string | null
          contact_address?: string | null
          contact_email?: string | null
          contact_hours?: string | null
          contact_phone?: string | null
          created_at?: string | null
          datacenter_location?: string | null
          description?: string | null
          id?: string
          is_featured?: boolean | null
          is_verified?: boolean | null
          logo_url?: string | null
          name?: string
          overall_rating?: number | null
          price_rating?: number | null
          slug?: string
          social_media?: Json | null
          speed_rating?: number | null
          support_rating?: number | null
          technologies?: string[] | null
          total_reviews?: number | null
          updated_at?: string | null
          verified_reviews?: number | null
          website?: string | null
          year_founded?: number | null
        }
        Relationships: []
      }
      hosting_plans: {
        Row: {
          bandwidth: string | null
          company_id: string
          created_at: string | null
          display_order: number | null
          domains_allowed: number | null
          features: Json | null
          id: string
          is_active: boolean | null
          name: string
          price_monthly: number | null
          storage_gb: number | null
          updated_at: string | null
        }
        Insert: {
          bandwidth?: string | null
          company_id: string
          created_at?: string | null
          display_order?: number | null
          domains_allowed?: number | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          name: string
          price_monthly?: number | null
          storage_gb?: number | null
          updated_at?: string | null
        }
        Update: {
          bandwidth?: string | null
          company_id?: string
          created_at?: string | null
          display_order?: number | null
          domains_allowed?: number | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          name?: string
          price_monthly?: number | null
          storage_gb?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hosting_plans_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "hosting_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      hosting_reviews: {
        Row: {
          comment: string
          company_id: string
          cons: string[] | null
          created_at: string | null
          customer_duration: string | null
          helpful_count: number | null
          id: string
          is_verified_customer: boolean | null
          moderated_at: string | null
          moderated_by: string | null
          moderation_notes: string | null
          overall_rating: number
          price_rating: number | null
          pros: string[] | null
          speed_rating: number | null
          status: Database["public"]["Enums"]["review_status"] | null
          support_rating: number | null
          title: string | null
          updated_at: string | null
          user_id: string
          verification_email: string | null
          verification_method: string | null
          verification_proof_url: string | null
          would_recommend: boolean | null
        }
        Insert: {
          comment: string
          company_id: string
          cons?: string[] | null
          created_at?: string | null
          customer_duration?: string | null
          helpful_count?: number | null
          id?: string
          is_verified_customer?: boolean | null
          moderated_at?: string | null
          moderated_by?: string | null
          moderation_notes?: string | null
          overall_rating: number
          price_rating?: number | null
          pros?: string[] | null
          speed_rating?: number | null
          status?: Database["public"]["Enums"]["review_status"] | null
          support_rating?: number | null
          title?: string | null
          updated_at?: string | null
          user_id: string
          verification_email?: string | null
          verification_method?: string | null
          verification_proof_url?: string | null
          would_recommend?: boolean | null
        }
        Update: {
          comment?: string
          company_id?: string
          cons?: string[] | null
          created_at?: string | null
          customer_duration?: string | null
          helpful_count?: number | null
          id?: string
          is_verified_customer?: boolean | null
          moderated_at?: string | null
          moderated_by?: string | null
          moderation_notes?: string | null
          overall_rating?: number
          price_rating?: number | null
          pros?: string[] | null
          speed_rating?: number | null
          status?: Database["public"]["Enums"]["review_status"] | null
          support_rating?: number | null
          title?: string | null
          updated_at?: string | null
          user_id?: string
          verification_email?: string | null
          verification_method?: string | null
          verification_proof_url?: string | null
          would_recommend?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "hosting_reviews_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "hosting_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      job_boards_data: {
        Row: {
          created_at: string | null
          domain_id: string
          id: string
          platforms_searched: string[] | null
          platforms_with_presence: number | null
          results: Json | null
          scraped_at: string | null
          search_term: string | null
          total_jobs_found: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          domain_id: string
          id?: string
          platforms_searched?: string[] | null
          platforms_with_presence?: number | null
          results?: Json | null
          scraped_at?: string | null
          search_term?: string | null
          total_jobs_found?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          domain_id?: string
          id?: string
          platforms_searched?: string[] | null
          platforms_with_presence?: number | null
          results?: Json | null
          scraped_at?: string | null
          search_term?: string | null
          total_jobs_found?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_boards_data_domain_id_fkey"
            columns: ["domain_id"]
            isOneToOne: true
            referencedRelation: "domains"
            referencedColumns: ["id"]
          },
        ]
      }
      my_domain_portfolio: {
        Row: {
          annual_cost: number | null
          created_at: string | null
          domain_name: string
          id: string
          inquiries_count: number | null
          is_for_sale: boolean | null
          listing_price: number | null
          notes: string | null
          page_views: number | null
          purchase_date: string | null
          purchase_price: number | null
          purchase_reference: string | null
          purchase_source: string | null
          renewal_date: string | null
          sale_status: Database["public"]["Enums"]["domain_sale_status"] | null
          tld: string | null
          updated_at: string | null
        }
        Insert: {
          annual_cost?: number | null
          created_at?: string | null
          domain_name: string
          id?: string
          inquiries_count?: number | null
          is_for_sale?: boolean | null
          listing_price?: number | null
          notes?: string | null
          page_views?: number | null
          purchase_date?: string | null
          purchase_price?: number | null
          purchase_reference?: string | null
          purchase_source?: string | null
          renewal_date?: string | null
          sale_status?: Database["public"]["Enums"]["domain_sale_status"] | null
          tld?: string | null
          updated_at?: string | null
        }
        Update: {
          annual_cost?: number | null
          created_at?: string | null
          domain_name?: string
          id?: string
          inquiries_count?: number | null
          is_for_sale?: boolean | null
          listing_price?: number | null
          notes?: string | null
          page_views?: number | null
          purchase_date?: string | null
          purchase_price?: number | null
          purchase_reference?: string | null
          purchase_source?: string | null
          renewal_date?: string | null
          sale_status?: Database["public"]["Enums"]["domain_sale_status"] | null
          tld?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      news_articles: {
        Row: {
          category: string | null
          created_at: string | null
          excerpt: string | null
          id: string
          image_url: string | null
          indexed: boolean | null
          original_source: string | null
          original_url: string | null
          published_at: string | null
          rewritten_content: string
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          image_url?: string | null
          indexed?: boolean | null
          original_source?: string | null
          original_url?: string | null
          published_at?: string | null
          rewritten_content: string
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          image_url?: string | null
          indexed?: boolean | null
          original_source?: string | null
          original_url?: string | null
          published_at?: string | null
          rewritten_content?: string
          slug?: string
          title?: string
          updated_at?: string | null
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
      reverse_ip_cache: {
        Row: {
          cached_at: string | null
          created_at: string | null
          domain_count: number | null
          domains: Json
          expires_at: string | null
          id: string
          ip_prefix: string
        }
        Insert: {
          cached_at?: string | null
          created_at?: string | null
          domain_count?: number | null
          domains?: Json
          expires_at?: string | null
          id?: string
          ip_prefix: string
        }
        Update: {
          cached_at?: string | null
          created_at?: string | null
          domain_count?: number | null
          domains?: Json
          expires_at?: string | null
          id?: string
          ip_prefix?: string
        }
        Relationships: []
      }
      review_helpful_votes: {
        Row: {
          created_at: string | null
          id: string
          ip_address: unknown
          review_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          ip_address?: unknown
          review_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          ip_address?: unknown
          review_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "review_helpful_votes_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "hosting_reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      review_responses: {
        Row: {
          company_id: string
          created_at: string | null
          id: string
          responded_by: string
          response_text: string
          review_id: string
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          id?: string
          responded_by: string
          response_text: string
          review_id: string
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          id?: string
          responded_by?: string
          response_text?: string
          review_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "review_responses_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "hosting_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_responses_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: true
            referencedRelation: "hosting_reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      sii_data: {
        Row: {
          business_activity: string | null
          company_name: string | null
          created_at: string | null
          domain_id: string
          found_in_sii: boolean | null
          id: string
          rut_found: string | null
          scraped_at: string | null
          search_details: Json | null
          search_method: string | null
          search_term: string | null
          updated_at: string | null
        }
        Insert: {
          business_activity?: string | null
          company_name?: string | null
          created_at?: string | null
          domain_id: string
          found_in_sii?: boolean | null
          id?: string
          rut_found?: string | null
          scraped_at?: string | null
          search_details?: Json | null
          search_method?: string | null
          search_term?: string | null
          updated_at?: string | null
        }
        Update: {
          business_activity?: string | null
          company_name?: string | null
          created_at?: string | null
          domain_id?: string
          found_in_sii?: boolean | null
          id?: string
          rut_found?: string | null
          scraped_at?: string | null
          search_details?: Json | null
          search_method?: string | null
          search_term?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sii_data_domain_id_fkey"
            columns: ["domain_id"]
            isOneToOne: true
            referencedRelation: "domains"
            referencedColumns: ["id"]
          },
        ]
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
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
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
      get_public_domains: {
        Args: never
        Returns: {
          analyzed_at: string
          business_type: string
          cms_detected: string
          country_location: string
          domain: string
          framework_detected: string
          hosting_provider: string
          is_active: boolean
          source: string
          timestamp: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "hosting_provider" | "user"
      certification_status: "pending" | "active" | "expired" | "revoked"
      certification_tier: "free" | "premium"
      domain_opportunity_status:
        | "pending_analysis"
        | "analyzed"
        | "discarded"
        | "queued_for_buy"
        | "purchased"
        | "failed"
      domain_sale_status: "available" | "negotiating" | "sold" | "not_for_sale"
      inquiry_status:
        | "new"
        | "contacted"
        | "negotiating"
        | "closed"
        | "rejected"
      review_status: "pending" | "approved" | "rejected" | "flagged"
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
      app_role: ["admin", "hosting_provider", "user"],
      certification_status: ["pending", "active", "expired", "revoked"],
      certification_tier: ["free", "premium"],
      domain_opportunity_status: [
        "pending_analysis",
        "analyzed",
        "discarded",
        "queued_for_buy",
        "purchased",
        "failed",
      ],
      domain_sale_status: ["available", "negotiating", "sold", "not_for_sale"],
      inquiry_status: ["new", "contacted", "negotiating", "closed", "rejected"],
      review_status: ["pending", "approved", "rejected", "flagged"],
    },
  },
} as const
