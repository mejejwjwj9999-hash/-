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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      academic_departments: {
        Row: {
          background_color: string
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          department_key: string
          description_ar: string | null
          description_en: string | null
          display_order: number
          featured_image: string | null
          head_of_department_ar: string | null
          head_of_department_en: string | null
          icon_color: string
          icon_name: string
          id: string
          is_active: boolean
          metadata: Json | null
          name_ar: string
          name_en: string | null
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          background_color?: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          department_key: string
          description_ar?: string | null
          description_en?: string | null
          display_order?: number
          featured_image?: string | null
          head_of_department_ar?: string | null
          head_of_department_en?: string | null
          icon_color?: string
          icon_name?: string
          id?: string
          is_active?: boolean
          metadata?: Json | null
          name_ar: string
          name_en?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          background_color?: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          department_key?: string
          description_ar?: string | null
          description_en?: string | null
          display_order?: number
          featured_image?: string | null
          head_of_department_ar?: string | null
          head_of_department_en?: string | null
          icon_color?: string
          icon_name?: string
          id?: string
          is_active?: boolean
          metadata?: Json | null
          name_ar?: string
          name_en?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      activity_registrations: {
        Row: {
          activity_id: string
          confirmation_date: string | null
          created_at: string | null
          id: string
          participant_email: string
          participant_name: string
          participant_phone: string | null
          participant_type: string | null
          registration_date: string | null
          special_requirements: string | null
          status: string
          student_id: string | null
          updated_at: string | null
        }
        Insert: {
          activity_id: string
          confirmation_date?: string | null
          created_at?: string | null
          id?: string
          participant_email: string
          participant_name: string
          participant_phone?: string | null
          participant_type?: string | null
          registration_date?: string | null
          special_requirements?: string | null
          status?: string
          student_id?: string | null
          updated_at?: string | null
        }
        Update: {
          activity_id?: string
          confirmation_date?: string | null
          created_at?: string | null
          id?: string
          participant_email?: string
          participant_name?: string
          participant_phone?: string | null
          participant_type?: string | null
          registration_date?: string | null
          special_requirements?: string | null
          status?: string
          student_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_registrations_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "student_activities"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_academic_programs: {
        Row: {
          admission_requirements_ar: string | null
          admission_requirements_en: string | null
          career_opportunities_ar: string | null
          career_opportunities_en: string | null
          created_at: string | null
          created_by: string | null
          credit_hours: number | null
          curriculum: Json | null
          degree_type: string | null
          department_ar: string
          department_en: string | null
          description_ar: string | null
          description_en: string | null
          display_order: number | null
          duration_years: number | null
          id: string
          images: Json | null
          is_featured: boolean | null
          name_ar: string
          name_en: string | null
          program_code: string
          status: Database["public"]["Enums"]["content_status"] | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          admission_requirements_ar?: string | null
          admission_requirements_en?: string | null
          career_opportunities_ar?: string | null
          career_opportunities_en?: string | null
          created_at?: string | null
          created_by?: string | null
          credit_hours?: number | null
          curriculum?: Json | null
          degree_type?: string | null
          department_ar: string
          department_en?: string | null
          description_ar?: string | null
          description_en?: string | null
          display_order?: number | null
          duration_years?: number | null
          id?: string
          images?: Json | null
          is_featured?: boolean | null
          name_ar: string
          name_en?: string | null
          program_code: string
          status?: Database["public"]["Enums"]["content_status"] | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          admission_requirements_ar?: string | null
          admission_requirements_en?: string | null
          career_opportunities_ar?: string | null
          career_opportunities_en?: string | null
          created_at?: string | null
          created_by?: string | null
          credit_hours?: number | null
          curriculum?: Json | null
          degree_type?: string | null
          department_ar?: string
          department_en?: string | null
          description_ar?: string | null
          description_en?: string | null
          display_order?: number | null
          duration_years?: number | null
          id?: string
          images?: Json | null
          is_featured?: boolean | null
          name_ar?: string
          name_en?: string | null
          program_code?: string
          status?: Database["public"]["Enums"]["content_status"] | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      admin_audit_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: string | null
          new_data: Json | null
          old_data: Json | null
          request_id: string | null
          resource_id: string | null
          resource_type: string
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          request_id?: string | null
          resource_id?: string | null
          resource_type: string
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          request_id?: string | null
          resource_id?: string | null
          resource_type?: string
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      admin_content_elements: {
        Row: {
          content_ar: string | null
          content_en: string | null
          created_at: string | null
          created_by: string | null
          css_classes: string | null
          custom_styles: Json | null
          display_order: number | null
          element_key: string
          element_type: string
          id: string
          is_active: boolean | null
          is_required: boolean | null
          metadata: Json | null
          page_id: string | null
          parent_element_id: string | null
          published_at: string | null
          sort_order: number | null
          status: string | null
          updated_at: string | null
          updated_by: string | null
          validation_rules: Json | null
        }
        Insert: {
          content_ar?: string | null
          content_en?: string | null
          created_at?: string | null
          created_by?: string | null
          css_classes?: string | null
          custom_styles?: Json | null
          display_order?: number | null
          element_key: string
          element_type: string
          id?: string
          is_active?: boolean | null
          is_required?: boolean | null
          metadata?: Json | null
          page_id?: string | null
          parent_element_id?: string | null
          published_at?: string | null
          sort_order?: number | null
          status?: string | null
          updated_at?: string | null
          updated_by?: string | null
          validation_rules?: Json | null
        }
        Update: {
          content_ar?: string | null
          content_en?: string | null
          created_at?: string | null
          created_by?: string | null
          css_classes?: string | null
          custom_styles?: Json | null
          display_order?: number | null
          element_key?: string
          element_type?: string
          id?: string
          is_active?: boolean | null
          is_required?: boolean | null
          metadata?: Json | null
          page_id?: string | null
          parent_element_id?: string | null
          published_at?: string | null
          sort_order?: number | null
          status?: string | null
          updated_at?: string | null
          updated_by?: string | null
          validation_rules?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_content_elements_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "admin_content_pages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_content_elements_parent_element_id_fkey"
            columns: ["parent_element_id"]
            isOneToOne: false
            referencedRelation: "admin_content_elements"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_content_pages: {
        Row: {
          created_at: string | null
          custom_css: string | null
          custom_js: string | null
          description_ar: string | null
          description_en: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          is_homepage: boolean | null
          meta_description_ar: string | null
          meta_description_en: string | null
          meta_title_ar: string | null
          meta_title_en: string | null
          page_key: string
          page_name_ar: string
          page_name_en: string | null
          seo_settings: Json | null
          slug: string | null
          template_name: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          custom_css?: string | null
          custom_js?: string | null
          description_ar?: string | null
          description_en?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          is_homepage?: boolean | null
          meta_description_ar?: string | null
          meta_description_en?: string | null
          meta_title_ar?: string | null
          meta_title_en?: string | null
          page_key: string
          page_name_ar: string
          page_name_en?: string | null
          seo_settings?: Json | null
          slug?: string | null
          template_name?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          custom_css?: string | null
          custom_js?: string | null
          description_ar?: string | null
          description_en?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          is_homepage?: boolean | null
          meta_description_ar?: string | null
          meta_description_en?: string | null
          meta_title_ar?: string | null
          meta_title_en?: string | null
          page_key?: string
          page_name_ar?: string
          page_name_en?: string | null
          seo_settings?: Json | null
          slug?: string | null
          template_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      admin_content_revisions: {
        Row: {
          change_summary: string | null
          content_ar: string | null
          content_en: string | null
          created_at: string | null
          created_by: string | null
          element_id: string | null
          id: string
          metadata: Json | null
          revision_number: number
        }
        Insert: {
          change_summary?: string | null
          content_ar?: string | null
          content_en?: string | null
          created_at?: string | null
          created_by?: string | null
          element_id?: string | null
          id?: string
          metadata?: Json | null
          revision_number: number
        }
        Update: {
          change_summary?: string | null
          content_ar?: string | null
          content_en?: string | null
          created_at?: string | null
          created_by?: string | null
          element_id?: string | null
          id?: string
          metadata?: Json | null
          revision_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "admin_content_revisions_element_id_fkey"
            columns: ["element_id"]
            isOneToOne: false
            referencedRelation: "admin_content_elements"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_content_sections: {
        Row: {
          content_ar: string | null
          content_en: string | null
          created_at: string | null
          created_by: string | null
          display_order: number | null
          id: string
          images: Json | null
          is_published: boolean | null
          metadata: Json | null
          published_at: string | null
          section_key: string
          status: Database["public"]["Enums"]["content_status"] | null
          title_ar: string
          title_en: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          content_ar?: string | null
          content_en?: string | null
          created_at?: string | null
          created_by?: string | null
          display_order?: number | null
          id?: string
          images?: Json | null
          is_published?: boolean | null
          metadata?: Json | null
          published_at?: string | null
          section_key: string
          status?: Database["public"]["Enums"]["content_status"] | null
          title_ar: string
          title_en?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          content_ar?: string | null
          content_en?: string | null
          created_at?: string | null
          created_by?: string | null
          display_order?: number | null
          id?: string
          images?: Json | null
          is_published?: boolean | null
          metadata?: Json | null
          published_at?: string | null
          section_key?: string
          status?: Database["public"]["Enums"]["content_status"] | null
          title_ar?: string
          title_en?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      admin_content_statuses: {
        Row: {
          color: string | null
          description_ar: string | null
          description_en: string | null
          display_order: number | null
          id: string
          is_published: boolean | null
          name_ar: string
          name_en: string | null
          status_key: string
        }
        Insert: {
          color?: string | null
          description_ar?: string | null
          description_en?: string | null
          display_order?: number | null
          id?: string
          is_published?: boolean | null
          name_ar: string
          name_en?: string | null
          status_key: string
        }
        Update: {
          color?: string | null
          description_ar?: string | null
          description_en?: string | null
          display_order?: number | null
          id?: string
          is_published?: boolean | null
          name_ar?: string
          name_en?: string | null
          status_key?: string
        }
        Relationships: []
      }
      admin_content_types: {
        Row: {
          created_at: string | null
          description_ar: string | null
          description_en: string | null
          fields_schema: Json | null
          icon: string | null
          id: string
          is_active: boolean | null
          is_system: boolean | null
          name_ar: string
          name_en: string | null
          type_key: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description_ar?: string | null
          description_en?: string | null
          fields_schema?: Json | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          is_system?: boolean | null
          name_ar: string
          name_en?: string | null
          type_key: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description_ar?: string | null
          description_en?: string | null
          fields_schema?: Json | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          is_system?: boolean | null
          name_ar?: string
          name_en?: string | null
          type_key?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      admin_digital_library_resources: {
        Row: {
          access_level: string
          author_ar: string | null
          author_en: string | null
          category: string
          created_at: string
          created_by: string | null
          description_ar: string | null
          description_en: string | null
          doi: string | null
          downloads_count: number | null
          file_size: number | null
          file_type: string | null
          file_url: string | null
          id: string
          is_featured: boolean | null
          isbn: string | null
          language: string
          media_id: string | null
          metadata: Json | null
          publication_year: number | null
          published_at: string | null
          resource_type: string
          status: Database["public"]["Enums"]["content_status"]
          subject_area: string | null
          tags: string[] | null
          thumbnail_url: string | null
          title_ar: string
          title_en: string | null
          updated_at: string
          updated_by: string | null
          views_count: number | null
        }
        Insert: {
          access_level?: string
          author_ar?: string | null
          author_en?: string | null
          category: string
          created_at?: string
          created_by?: string | null
          description_ar?: string | null
          description_en?: string | null
          doi?: string | null
          downloads_count?: number | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          is_featured?: boolean | null
          isbn?: string | null
          language?: string
          media_id?: string | null
          metadata?: Json | null
          publication_year?: number | null
          published_at?: string | null
          resource_type: string
          status?: Database["public"]["Enums"]["content_status"]
          subject_area?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title_ar: string
          title_en?: string | null
          updated_at?: string
          updated_by?: string | null
          views_count?: number | null
        }
        Update: {
          access_level?: string
          author_ar?: string | null
          author_en?: string | null
          category?: string
          created_at?: string
          created_by?: string | null
          description_ar?: string | null
          description_en?: string | null
          doi?: string | null
          downloads_count?: number | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          is_featured?: boolean | null
          isbn?: string | null
          language?: string
          media_id?: string | null
          metadata?: Json | null
          publication_year?: number | null
          published_at?: string | null
          resource_type?: string
          status?: Database["public"]["Enums"]["content_status"]
          subject_area?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title_ar?: string
          title_en?: string | null
          updated_at?: string
          updated_by?: string | null
          views_count?: number | null
        }
        Relationships: []
      }
      admin_media_library: {
        Row: {
          alt_text_ar: string | null
          alt_text_en: string | null
          created_at: string | null
          description_ar: string | null
          description_en: string | null
          dimensions: Json | null
          file_name: string
          file_path: string
          file_size: number
          id: string
          last_used_at: string | null
          media_type: Database["public"]["Enums"]["media_type"]
          mime_type: string
          original_name: string
          tags: string[] | null
          updated_at: string | null
          uploaded_by: string | null
          usage_count: number | null
        }
        Insert: {
          alt_text_ar?: string | null
          alt_text_en?: string | null
          created_at?: string | null
          description_ar?: string | null
          description_en?: string | null
          dimensions?: Json | null
          file_name: string
          file_path: string
          file_size: number
          id?: string
          last_used_at?: string | null
          media_type: Database["public"]["Enums"]["media_type"]
          mime_type: string
          original_name: string
          tags?: string[] | null
          updated_at?: string | null
          uploaded_by?: string | null
          usage_count?: number | null
        }
        Update: {
          alt_text_ar?: string | null
          alt_text_en?: string | null
          created_at?: string | null
          description_ar?: string | null
          description_en?: string | null
          dimensions?: Json | null
          file_name?: string
          file_path?: string
          file_size?: number
          id?: string
          last_used_at?: string | null
          media_type?: Database["public"]["Enums"]["media_type"]
          mime_type?: string
          original_name?: string
          tags?: string[] | null
          updated_at?: string | null
          uploaded_by?: string | null
          usage_count?: number | null
        }
        Relationships: []
      }
      admin_navigation_items: {
        Row: {
          created_at: string | null
          created_by: string | null
          css_classes: string | null
          display_order: number | null
          icon: string | null
          id: string
          is_active: boolean | null
          is_external: boolean | null
          label_ar: string
          label_en: string | null
          menu_id: string | null
          parent_id: string | null
          target_blank: boolean | null
          updated_at: string | null
          updated_by: string | null
          url: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          css_classes?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          is_external?: boolean | null
          label_ar: string
          label_en?: string | null
          menu_id?: string | null
          parent_id?: string | null
          target_blank?: boolean | null
          updated_at?: string | null
          updated_by?: string | null
          url?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          css_classes?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          is_external?: boolean | null
          label_ar?: string
          label_en?: string | null
          menu_id?: string | null
          parent_id?: string | null
          target_blank?: boolean | null
          updated_at?: string | null
          updated_by?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_navigation_items_menu_id_fkey"
            columns: ["menu_id"]
            isOneToOne: false
            referencedRelation: "admin_navigation_menus"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_navigation_items_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "admin_navigation_items"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_navigation_menus: {
        Row: {
          created_at: string | null
          created_by: string | null
          description_ar: string | null
          description_en: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          menu_key: string
          name_ar: string
          name_en: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description_ar?: string | null
          description_en?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          menu_key: string
          name_ar: string
          name_en?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description_ar?: string | null
          description_en?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          menu_key?: string
          name_ar?: string
          name_en?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      admin_news_events: {
        Row: {
          content_ar: string | null
          content_en: string | null
          created_at: string | null
          created_by: string | null
          event_date: string | null
          event_location_ar: string | null
          event_location_en: string | null
          featured_image: string | null
          id: string
          images: Json | null
          is_breaking: boolean | null
          is_featured: boolean | null
          published_at: string | null
          status: Database["public"]["Enums"]["content_status"] | null
          summary_ar: string | null
          summary_en: string | null
          tags: string[] | null
          title_ar: string
          title_en: string | null
          type: string
          updated_at: string | null
          updated_by: string | null
          views_count: number | null
        }
        Insert: {
          content_ar?: string | null
          content_en?: string | null
          created_at?: string | null
          created_by?: string | null
          event_date?: string | null
          event_location_ar?: string | null
          event_location_en?: string | null
          featured_image?: string | null
          id?: string
          images?: Json | null
          is_breaking?: boolean | null
          is_featured?: boolean | null
          published_at?: string | null
          status?: Database["public"]["Enums"]["content_status"] | null
          summary_ar?: string | null
          summary_en?: string | null
          tags?: string[] | null
          title_ar: string
          title_en?: string | null
          type: string
          updated_at?: string | null
          updated_by?: string | null
          views_count?: number | null
        }
        Update: {
          content_ar?: string | null
          content_en?: string | null
          created_at?: string | null
          created_by?: string | null
          event_date?: string | null
          event_location_ar?: string | null
          event_location_en?: string | null
          featured_image?: string | null
          id?: string
          images?: Json | null
          is_breaking?: boolean | null
          is_featured?: boolean | null
          published_at?: string | null
          status?: Database["public"]["Enums"]["content_status"] | null
          summary_ar?: string | null
          summary_en?: string | null
          tags?: string[] | null
          title_ar?: string
          title_en?: string | null
          type?: string
          updated_at?: string | null
          updated_by?: string | null
          views_count?: number | null
        }
        Relationships: []
      }
      admin_site_configurations: {
        Row: {
          category: string
          config_key: string
          config_value: Json
          created_at: string | null
          created_by: string | null
          description_ar: string | null
          description_en: string | null
          id: string
          is_editable: boolean | null
          is_public: boolean | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          category?: string
          config_key: string
          config_value: Json
          created_at?: string | null
          created_by?: string | null
          description_ar?: string | null
          description_en?: string | null
          id?: string
          is_editable?: boolean | null
          is_public?: boolean | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          category?: string
          config_key?: string
          config_value?: Json
          created_at?: string | null
          created_by?: string | null
          description_ar?: string | null
          description_en?: string | null
          id?: string
          is_editable?: boolean | null
          is_public?: boolean | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      admin_site_settings: {
        Row: {
          category: string
          created_at: string | null
          description_ar: string | null
          description_en: string | null
          id: string
          is_public: boolean | null
          setting_key: string
          setting_value: Json
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          category?: string
          created_at?: string | null
          description_ar?: string | null
          description_en?: string | null
          id?: string
          is_public?: boolean | null
          setting_key: string
          setting_value: Json
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description_ar?: string | null
          description_en?: string | null
          id?: string
          is_public?: boolean | null
          setting_key?: string
          setting_value?: Json
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      admin_user_roles: {
        Row: {
          created_at: string | null
          granted_at: string | null
          granted_by: string | null
          id: string
          is_active: boolean | null
          role: Database["public"]["Enums"]["admin_role"]
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          is_active?: boolean | null
          role: Database["public"]["Enums"]["admin_role"]
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          is_active?: boolean | null
          role?: Database["public"]["Enums"]["admin_role"]
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      appointments: {
        Row: {
          appointment_date: string
          appointment_type: string
          created_at: string
          description: string | null
          duration_minutes: number | null
          id: string
          location: string | null
          notes: string | null
          staff_member: string | null
          status: string | null
          student_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          appointment_date: string
          appointment_type: string
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          location?: string | null
          notes?: string | null
          staff_member?: string | null
          status?: string | null
          student_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          appointment_date?: string
          appointment_type?: string
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          location?: string | null
          notes?: string | null
          staff_member?: string | null
          status?: string | null
          student_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_appointments_student"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      assignment_submissions: {
        Row: {
          assignment_id: string
          created_at: string
          feedback: string | null
          file_name: string | null
          file_path: string | null
          grade: number | null
          id: string
          status: string
          student_id: string
          submission_text: string | null
          submitted_at: string
          updated_at: string
        }
        Insert: {
          assignment_id: string
          created_at?: string
          feedback?: string | null
          file_name?: string | null
          file_path?: string | null
          grade?: number | null
          id?: string
          status?: string
          student_id: string
          submission_text?: string | null
          submitted_at?: string
          updated_at?: string
        }
        Update: {
          assignment_id?: string
          created_at?: string
          feedback?: string | null
          file_name?: string | null
          file_path?: string | null
          grade?: number | null
          id?: string
          status?: string
          student_id?: string
          submission_text?: string | null
          submitted_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignment_submissions_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
        ]
      }
      assignments: {
        Row: {
          course_id: string | null
          created_at: string
          created_by: string | null
          description: string | null
          due_date: string
          id: string
          instructions: string | null
          max_grade: number | null
          status: string
          submission_type: string | null
          title: string
          updated_at: string
        }
        Insert: {
          course_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date: string
          id?: string
          instructions?: string | null
          max_grade?: number | null
          status?: string
          submission_type?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          course_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string
          id?: string
          instructions?: string | null
          max_grade?: number | null
          status?: string
          submission_type?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance_records: {
        Row: {
          attendance_date: string
          created_at: string
          created_by: string
          id: string
          notes: string | null
          session_time: string | null
          status: string
          student_id: string
          teacher_course_id: string
          updated_at: string
        }
        Insert: {
          attendance_date: string
          created_at?: string
          created_by: string
          id?: string
          notes?: string | null
          session_time?: string | null
          status?: string
          student_id: string
          teacher_course_id: string
          updated_at?: string
        }
        Update: {
          attendance_date?: string
          created_at?: string
          created_by?: string
          id?: string
          notes?: string | null
          session_time?: string | null
          status?: string
          student_id?: string
          teacher_course_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_records_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "teacher_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_records_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_records_teacher_course_id_fkey"
            columns: ["teacher_course_id"]
            isOneToOne: false
            referencedRelation: "teacher_courses"
            referencedColumns: ["id"]
          },
        ]
      }
      class_schedule: {
        Row: {
          academic_year: string
          classroom: string
          course_id: string | null
          created_at: string
          day_of_week: number
          end_time: string
          id: string
          instructor_name: string
          semester: string
          specialization: string | null
          start_time: string
        }
        Insert: {
          academic_year: string
          classroom: string
          course_id?: string | null
          created_at?: string
          day_of_week: number
          end_time: string
          id?: string
          instructor_name: string
          semester: string
          specialization?: string | null
          start_time: string
        }
        Update: {
          academic_year?: string
          classroom?: string
          course_id?: string | null
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: string
          instructor_name?: string
          semester?: string
          specialization?: string | null
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_schedule_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_class_schedule_course"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      club_join_requests: {
        Row: {
          admin_notes: string | null
          club_id: string
          created_at: string | null
          id: string
          motivation_letter: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          student_email: string
          student_id: string
          student_name: string
          student_phone: string | null
          updated_at: string | null
        }
        Insert: {
          admin_notes?: string | null
          club_id: string
          created_at?: string | null
          id?: string
          motivation_letter?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          student_email: string
          student_id: string
          student_name: string
          student_phone?: string | null
          updated_at?: string | null
        }
        Update: {
          admin_notes?: string | null
          club_id?: string
          created_at?: string | null
          id?: string
          motivation_letter?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          student_email?: string
          student_id?: string
          student_name?: string
          student_phone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "club_join_requests_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "student_clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_messages: {
        Row: {
          admin_notes: string | null
          created_at: string
          email: string
          id: string
          is_read: boolean
          message: string
          name: string
          phone: string | null
          replied_at: string | null
          replied_by: string | null
          status: string
          subject: string | null
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          email: string
          id?: string
          is_read?: boolean
          message: string
          name: string
          phone?: string | null
          replied_at?: string | null
          replied_by?: string | null
          status?: string
          subject?: string | null
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          email?: string
          id?: string
          is_read?: boolean
          message?: string
          name?: string
          phone?: string | null
          replied_at?: string | null
          replied_by?: string | null
          status?: string
          subject?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      content_change_log: {
        Row: {
          action: string
          changes: Json | null
          created_at: string | null
          id: string
          ip_address: string | null
          new_data: Json | null
          old_data: Json | null
          resource_id: string
          resource_type: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          changes?: Json | null
          created_at?: string | null
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          resource_id: string
          resource_type: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          changes?: Json | null
          created_at?: string | null
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          resource_id?: string
          resource_type?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      course_files: {
        Row: {
          category: string | null
          course_id: string | null
          created_at: string
          description: string | null
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string
          id: string
          is_public: boolean | null
          updated_at: string
          uploaded_by: string | null
        }
        Insert: {
          category?: string | null
          course_id?: string | null
          created_at?: string
          description?: string | null
          file_name: string
          file_path: string
          file_size?: number | null
          file_type: string
          id?: string
          is_public?: boolean | null
          updated_at?: string
          uploaded_by?: string | null
        }
        Update: {
          category?: string | null
          course_id?: string | null
          created_at?: string
          description?: string | null
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string
          id?: string
          is_public?: boolean | null
          updated_at?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_files_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          academic_year: number | null
          college: string
          course_code: string
          course_name_ar: string
          course_name_en: string | null
          created_at: string
          credit_hours: number
          department: string
          department_id: string | null
          description: string | null
          id: string
          instructor_name: string | null
          prerequisites: string[] | null
          program_id: string | null
          semester: number | null
          specialization: string | null
        }
        Insert: {
          academic_year?: number | null
          college: string
          course_code: string
          course_name_ar: string
          course_name_en?: string | null
          created_at?: string
          credit_hours: number
          department: string
          department_id?: string | null
          description?: string | null
          id?: string
          instructor_name?: string | null
          prerequisites?: string[] | null
          program_id?: string | null
          semester?: number | null
          specialization?: string | null
        }
        Update: {
          academic_year?: number | null
          college?: string
          course_code?: string
          course_name_ar?: string
          course_name_en?: string | null
          created_at?: string
          credit_hours?: number
          department?: string
          department_id?: string | null
          description?: string | null
          id?: string
          instructor_name?: string | null
          prerequisites?: string[] | null
          program_id?: string | null
          semester?: number | null
          specialization?: string | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          created_at: string
          document_name: string
          document_type: string
          expiry_date: string | null
          file_path: string
          file_size: number | null
          id: string
          is_official: boolean | null
          issued_date: string | null
          mime_type: string | null
          status: string | null
          student_id: string | null
          verification_code: string | null
        }
        Insert: {
          created_at?: string
          document_name: string
          document_type: string
          expiry_date?: string | null
          file_path: string
          file_size?: number | null
          id?: string
          is_official?: boolean | null
          issued_date?: string | null
          mime_type?: string | null
          status?: string | null
          student_id?: string | null
          verification_code?: string | null
        }
        Update: {
          created_at?: string
          document_name?: string
          document_type?: string
          expiry_date?: string | null
          file_path?: string
          file_size?: number | null
          id?: string
          is_official?: boolean | null
          issued_date?: string | null
          mime_type?: string | null
          status?: string | null
          student_id?: string | null
          verification_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_documents_student"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      dynamic_academic_programs: {
        Row: {
          academic_requirements: Json
          admission_requirements_ar: string | null
          admission_requirements_en: string | null
          background_color: string | null
          benchmark_programs: Json | null
          career_opportunities_ar: string | null
          career_opportunities_en: string | null
          career_opportunities_list: Json
          college_ar: string | null
          college_en: string | null
          contact_info: Json | null
          created_at: string | null
          created_by: string | null
          credit_hours: number | null
          curriculum: Json | null
          degree_type: string | null
          department_ar: string | null
          department_en: string | null
          department_id: string | null
          description_ar: string | null
          description_en: string | null
          display_order: number | null
          duration_years: number | null
          faculty_members: Json
          featured_image: string | null
          gallery: Json | null
          general_requirements: Json
          graduate_specifications: Json | null
          has_page: boolean | null
          icon_color: string | null
          icon_name: string | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          job_opportunities: Json | null
          learning_outcomes: Json | null
          metadata: Json | null
          page_template: string | null
          program_key: string
          program_mission_ar: string | null
          program_mission_en: string | null
          program_objectives: Json | null
          program_overview_ar: string | null
          program_overview_en: string | null
          program_references: Json | null
          program_statistics: Json
          program_vision_ar: string | null
          program_vision_en: string | null
          published_at: string | null
          seo_settings: Json | null
          student_count: number
          summary_ar: string | null
          summary_en: string | null
          title_ar: string
          title_en: string | null
          updated_at: string | null
          updated_by: string | null
          yearly_curriculum: Json
        }
        Insert: {
          academic_requirements?: Json
          admission_requirements_ar?: string | null
          admission_requirements_en?: string | null
          background_color?: string | null
          benchmark_programs?: Json | null
          career_opportunities_ar?: string | null
          career_opportunities_en?: string | null
          career_opportunities_list?: Json
          college_ar?: string | null
          college_en?: string | null
          contact_info?: Json | null
          created_at?: string | null
          created_by?: string | null
          credit_hours?: number | null
          curriculum?: Json | null
          degree_type?: string | null
          department_ar?: string | null
          department_en?: string | null
          department_id?: string | null
          description_ar?: string | null
          description_en?: string | null
          display_order?: number | null
          duration_years?: number | null
          faculty_members?: Json
          featured_image?: string | null
          gallery?: Json | null
          general_requirements?: Json
          graduate_specifications?: Json | null
          has_page?: boolean | null
          icon_color?: string | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          job_opportunities?: Json | null
          learning_outcomes?: Json | null
          metadata?: Json | null
          page_template?: string | null
          program_key: string
          program_mission_ar?: string | null
          program_mission_en?: string | null
          program_objectives?: Json | null
          program_overview_ar?: string | null
          program_overview_en?: string | null
          program_references?: Json | null
          program_statistics?: Json
          program_vision_ar?: string | null
          program_vision_en?: string | null
          published_at?: string | null
          seo_settings?: Json | null
          student_count?: number
          summary_ar?: string | null
          summary_en?: string | null
          title_ar: string
          title_en?: string | null
          updated_at?: string | null
          updated_by?: string | null
          yearly_curriculum?: Json
        }
        Update: {
          academic_requirements?: Json
          admission_requirements_ar?: string | null
          admission_requirements_en?: string | null
          background_color?: string | null
          benchmark_programs?: Json | null
          career_opportunities_ar?: string | null
          career_opportunities_en?: string | null
          career_opportunities_list?: Json
          college_ar?: string | null
          college_en?: string | null
          contact_info?: Json | null
          created_at?: string | null
          created_by?: string | null
          credit_hours?: number | null
          curriculum?: Json | null
          degree_type?: string | null
          department_ar?: string | null
          department_en?: string | null
          department_id?: string | null
          description_ar?: string | null
          description_en?: string | null
          display_order?: number | null
          duration_years?: number | null
          faculty_members?: Json
          featured_image?: string | null
          gallery?: Json | null
          general_requirements?: Json
          graduate_specifications?: Json | null
          has_page?: boolean | null
          icon_color?: string | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          job_opportunities?: Json | null
          learning_outcomes?: Json | null
          metadata?: Json | null
          page_template?: string | null
          program_key?: string
          program_mission_ar?: string | null
          program_mission_en?: string | null
          program_objectives?: Json | null
          program_overview_ar?: string | null
          program_overview_en?: string | null
          program_references?: Json | null
          program_statistics?: Json
          program_vision_ar?: string | null
          program_vision_en?: string | null
          published_at?: string | null
          seo_settings?: Json | null
          student_count?: number
          summary_ar?: string | null
          summary_en?: string | null
          title_ar?: string
          title_en?: string | null
          updated_at?: string | null
          updated_by?: string | null
          yearly_curriculum?: Json
        }
        Relationships: [
          {
            foreignKeyName: "dynamic_academic_programs_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "academic_departments"
            referencedColumns: ["id"]
          },
        ]
      }
      event_registrations: {
        Row: {
          created_at: string
          email: string
          event_id: string
          id: string
          name: string
          notes: string | null
          phone: string | null
          registration_date: string
          status: string
          student_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          event_id: string
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          registration_date?: string
          status?: string
          student_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          event_id?: string
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          registration_date?: string
          status?: string
          student_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_event_registrations_event_id"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "admin_news_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_event_registrations_student_id"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      grade_details: {
        Row: {
          assessment_date: string | null
          assessment_title: string
          assessment_type: string
          created_at: string
          created_by: string
          feedback: string | null
          id: string
          max_score: number
          score: number | null
          student_id: string
          teacher_course_id: string
          updated_at: string
          weight: number | null
        }
        Insert: {
          assessment_date?: string | null
          assessment_title: string
          assessment_type: string
          created_at?: string
          created_by: string
          feedback?: string | null
          id?: string
          max_score?: number
          score?: number | null
          student_id: string
          teacher_course_id: string
          updated_at?: string
          weight?: number | null
        }
        Update: {
          assessment_date?: string | null
          assessment_title?: string
          assessment_type?: string
          created_at?: string
          created_by?: string
          feedback?: string | null
          id?: string
          max_score?: number
          score?: number | null
          student_id?: string
          teacher_course_id?: string
          updated_at?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "grade_details_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "teacher_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grade_details_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grade_details_teacher_course_id_fkey"
            columns: ["teacher_course_id"]
            isOneToOne: false
            referencedRelation: "teacher_courses"
            referencedColumns: ["id"]
          },
        ]
      }
      grades: {
        Row: {
          academic_year: string
          course_id: string | null
          coursework_grade: number | null
          created_at: string
          final_grade: number | null
          gpa_points: number | null
          id: string
          letter_grade: string | null
          midterm_grade: number | null
          semester: string
          status: string | null
          student_id: string | null
          total_grade: number | null
          updated_at: string
        }
        Insert: {
          academic_year: string
          course_id?: string | null
          coursework_grade?: number | null
          created_at?: string
          final_grade?: number | null
          gpa_points?: number | null
          id?: string
          letter_grade?: string | null
          midterm_grade?: number | null
          semester: string
          status?: string | null
          student_id?: string | null
          total_grade?: number | null
          updated_at?: string
        }
        Update: {
          academic_year?: string
          course_id?: string | null
          coursework_grade?: number | null
          created_at?: string
          final_grade?: number | null
          gpa_points?: number | null
          id?: string
          letter_grade?: string | null
          midterm_grade?: number | null
          semester?: string
          status?: string | null
          student_id?: string | null
          total_grade?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_grades_course"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_grades_student"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grades_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grades_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          category: string | null
          created_at: string
          expires_at: string | null
          id: string
          is_read: boolean | null
          message: string
          priority: string | null
          student_id: string | null
          title: string
          type: string
        }
        Insert: {
          action_url?: string | null
          category?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          priority?: string | null
          student_id?: string | null
          title: string
          type: string
        }
        Update: {
          action_url?: string | null
          category?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          priority?: string | null
          student_id?: string | null
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_notifications_student"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      page_templates: {
        Row: {
          created_at: string | null
          description_ar: string | null
          description_en: string | null
          id: string
          is_active: boolean | null
          is_default: boolean | null
          name_ar: string
          name_en: string | null
          preview_image: string | null
          template_config: Json
          template_key: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description_ar?: string | null
          description_en?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          name_ar: string
          name_en?: string | null
          preview_image?: string | null
          template_config?: Json
          template_key: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description_ar?: string | null
          description_en?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          name_ar?: string
          name_en?: string | null
          preview_image?: string | null
          template_config?: Json
          template_key?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          academic_year: string | null
          amount: number
          created_at: string
          currency: string | null
          description: string | null
          due_date: string | null
          id: string
          invoice_number: string | null
          notes: string | null
          payment_date: string | null
          payment_method: string | null
          payment_status: string | null
          payment_type: string
          program_id: string | null
          receipt_url: string | null
          reference_number: string | null
          semester: string | null
          student_id: string | null
          updated_at: string
        }
        Insert: {
          academic_year?: string | null
          amount: number
          created_at?: string
          currency?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          invoice_number?: string | null
          notes?: string | null
          payment_date?: string | null
          payment_method?: string | null
          payment_status?: string | null
          payment_type: string
          program_id?: string | null
          receipt_url?: string | null
          reference_number?: string | null
          semester?: string | null
          student_id?: string | null
          updated_at?: string
        }
        Update: {
          academic_year?: string | null
          amount?: number
          created_at?: string
          currency?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          invoice_number?: string | null
          notes?: string | null
          payment_date?: string | null
          payment_method?: string | null
          payment_status?: string | null
          payment_type?: string
          program_id?: string | null
          receipt_url?: string | null
          reference_number?: string | null
          semester?: string | null
          student_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_payments_student"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          action: string
          created_at: string | null
          description_ar: string | null
          description_en: string | null
          display_name_ar: string
          display_name_en: string | null
          id: string
          is_system: boolean | null
          metadata: Json | null
          module: string
          name: string
          resource: string | null
          updated_at: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          description_ar?: string | null
          description_en?: string | null
          display_name_ar: string
          display_name_en?: string | null
          id?: string
          is_system?: boolean | null
          metadata?: Json | null
          module: string
          name: string
          resource?: string | null
          updated_at?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          description_ar?: string | null
          description_en?: string | null
          display_name_ar?: string
          display_name_en?: string | null
          id?: string
          is_system?: boolean | null
          metadata?: Json | null
          module?: string
          name?: string
          resource?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      program_fees: {
        Row: {
          academic_year: number
          base_fee: number
          created_at: string
          currency: string
          exam_fee: number
          id: string
          is_active: boolean
          lab_fee: number
          library_fee: number
          program_id: string
          registration_fee: number
          semester: number
          updated_at: string
        }
        Insert: {
          academic_year: number
          base_fee?: number
          created_at?: string
          currency?: string
          exam_fee?: number
          id?: string
          is_active?: boolean
          lab_fee?: number
          library_fee?: number
          program_id: string
          registration_fee?: number
          semester: number
          updated_at?: string
        }
        Update: {
          academic_year?: number
          base_fee?: number
          created_at?: string
          currency?: string
          exam_fee?: number
          id?: string
          is_active?: boolean
          lab_fee?: number
          library_fee?: number
          program_id?: string
          registration_fee?: number
          semester?: number
          updated_at?: string
        }
        Relationships: []
      }
      program_pages: {
        Row: {
          created_at: string | null
          created_by: string | null
          custom_css: string | null
          custom_js: string | null
          custom_sections: Json | null
          id: string
          is_published: boolean | null
          meta_description_ar: string | null
          meta_description_en: string | null
          meta_title_ar: string | null
          meta_title_en: string | null
          og_image: string | null
          page_key: string
          program_id: string | null
          published_at: string | null
          slug: string
          template_name: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          custom_css?: string | null
          custom_js?: string | null
          custom_sections?: Json | null
          id?: string
          is_published?: boolean | null
          meta_description_ar?: string | null
          meta_description_en?: string | null
          meta_title_ar?: string | null
          meta_title_en?: string | null
          og_image?: string | null
          page_key: string
          program_id?: string | null
          published_at?: string | null
          slug: string
          template_name?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          custom_css?: string | null
          custom_js?: string | null
          custom_sections?: Json | null
          id?: string
          is_published?: boolean | null
          meta_description_ar?: string | null
          meta_description_en?: string | null
          meta_title_ar?: string | null
          meta_title_en?: string | null
          og_image?: string | null
          page_key?: string
          program_id?: string | null
          published_at?: string | null
          slug?: string
          template_name?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "program_pages_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "dynamic_academic_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      quick_services: {
        Row: {
          background_color: string | null
          category_id: string | null
          created_at: string | null
          created_by: string | null
          description_ar: string | null
          description_en: string | null
          display_order: number | null
          icon_color: string | null
          icon_name: string
          id: string
          is_active: boolean | null
          is_external: boolean | null
          metadata: Json | null
          requires_auth: boolean | null
          title_ar: string
          title_en: string | null
          updated_at: string | null
          updated_by: string | null
          url: string | null
        }
        Insert: {
          background_color?: string | null
          category_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description_ar?: string | null
          description_en?: string | null
          display_order?: number | null
          icon_color?: string | null
          icon_name?: string
          id?: string
          is_active?: boolean | null
          is_external?: boolean | null
          metadata?: Json | null
          requires_auth?: boolean | null
          title_ar: string
          title_en?: string | null
          updated_at?: string | null
          updated_by?: string | null
          url?: string | null
        }
        Update: {
          background_color?: string | null
          category_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description_ar?: string | null
          description_en?: string | null
          display_order?: number | null
          icon_color?: string | null
          icon_name?: string
          id?: string
          is_active?: boolean | null
          is_external?: boolean | null
          metadata?: Json | null
          requires_auth?: boolean | null
          title_ar?: string
          title_en?: string | null
          updated_at?: string | null
          updated_by?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quick_services_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          granted_at: string | null
          granted_by: string | null
          id: string
          permission_id: string
          role_id: string
        }
        Insert: {
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          permission_id: string
          role_id: string
        }
        Update: {
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          permission_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string | null
          created_by: string | null
          description_ar: string | null
          description_en: string | null
          display_name_ar: string
          display_name_en: string | null
          id: string
          is_active: boolean | null
          is_system: boolean | null
          metadata: Json | null
          name: string
          parent_role_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description_ar?: string | null
          description_en?: string | null
          display_name_ar: string
          display_name_en?: string | null
          id?: string
          is_active?: boolean | null
          is_system?: boolean | null
          metadata?: Json | null
          name: string
          parent_role_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description_ar?: string | null
          description_en?: string | null
          display_name_ar?: string
          display_name_en?: string | null
          id?: string
          is_active?: boolean | null
          is_system?: boolean | null
          metadata?: Json | null
          name?: string
          parent_role_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "roles_parent_role_id_fkey"
            columns: ["parent_role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles_audit_log: {
        Row: {
          action: string
          created_at: string | null
          entity_id: string
          entity_type: string
          id: string
          ip_address: string | null
          new_data: Json | null
          old_data: Json | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          entity_id: string
          entity_type: string
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      service_categories: {
        Row: {
          color: string | null
          created_at: string | null
          created_by: string | null
          description_ar: string | null
          description_en: string | null
          display_order: number | null
          icon: string | null
          id: string
          is_active: boolean | null
          name_ar: string
          name_en: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          created_by?: string | null
          description_ar?: string | null
          description_en?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name_ar: string
          name_en?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          created_by?: string | null
          description_ar?: string | null
          description_en?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name_ar?: string
          name_en?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      service_requests: {
        Row: {
          assigned_to: string | null
          completed_at: string | null
          created_at: string
          description: string | null
          documents: Json | null
          due_date: string | null
          id: string
          priority: string | null
          response: string | null
          service_type: string
          status: string | null
          student_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          documents?: Json | null
          due_date?: string | null
          id?: string
          priority?: string | null
          response?: string | null
          service_type: string
          status?: string | null
          student_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          documents?: Json | null
          due_date?: string | null
          id?: string
          priority?: string | null
          response?: string | null
          service_type?: string
          status?: string | null
          student_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_service_requests_student"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_requests_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      student_activities: {
        Row: {
          agenda: Json | null
          category: string
          created_at: string | null
          created_by: string | null
          current_participants: number | null
          description_ar: string | null
          description_en: string | null
          end_date: string | null
          fee_amount: number | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          location: string | null
          max_participants: number | null
          metadata: Json | null
          organizer_contact: string | null
          organizer_name: string | null
          registration_deadline: string | null
          requirements: Json | null
          start_date: string | null
          status: string
          title_ar: string
          title_en: string | null
          type: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          agenda?: Json | null
          category?: string
          created_at?: string | null
          created_by?: string | null
          current_participants?: number | null
          description_ar?: string | null
          description_en?: string | null
          end_date?: string | null
          fee_amount?: number | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          location?: string | null
          max_participants?: number | null
          metadata?: Json | null
          organizer_contact?: string | null
          organizer_name?: string | null
          registration_deadline?: string | null
          requirements?: Json | null
          start_date?: string | null
          status?: string
          title_ar: string
          title_en?: string | null
          type?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          agenda?: Json | null
          category?: string
          created_at?: string | null
          created_by?: string | null
          current_participants?: number | null
          description_ar?: string | null
          description_en?: string | null
          end_date?: string | null
          fee_amount?: number | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          location?: string | null
          max_participants?: number | null
          metadata?: Json | null
          organizer_contact?: string | null
          organizer_name?: string | null
          registration_deadline?: string | null
          requirements?: Json | null
          start_date?: string | null
          status?: string
          title_ar?: string
          title_en?: string | null
          type?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      student_affairs_services: {
        Row: {
          category: string
          created_at: string | null
          created_by: string | null
          description_ar: string | null
          description_en: string | null
          display_order: number | null
          fee_amount: number | null
          icon: string
          id: string
          is_featured: boolean | null
          metadata: Json | null
          processing_time: string | null
          required_documents: Json | null
          status: string
          title_ar: string
          title_en: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          category?: string
          created_at?: string | null
          created_by?: string | null
          description_ar?: string | null
          description_en?: string | null
          display_order?: number | null
          fee_amount?: number | null
          icon?: string
          id?: string
          is_featured?: boolean | null
          metadata?: Json | null
          processing_time?: string | null
          required_documents?: Json | null
          status?: string
          title_ar: string
          title_en?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          created_by?: string | null
          description_ar?: string | null
          description_en?: string | null
          display_order?: number | null
          fee_amount?: number | null
          icon?: string
          id?: string
          is_featured?: boolean | null
          metadata?: Json | null
          processing_time?: string | null
          required_documents?: Json | null
          status?: string
          title_ar?: string
          title_en?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      student_clubs: {
        Row: {
          activities: Json | null
          banner_url: string | null
          category: string
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          created_by: string | null
          current_members: number | null
          description_ar: string | null
          description_en: string | null
          id: string
          is_featured: boolean | null
          location: string | null
          logo_url: string | null
          max_members: number | null
          meeting_schedule: string | null
          metadata: Json | null
          name_ar: string
          name_en: string | null
          requirements: Json | null
          status: string
          supervisor_name: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          activities?: Json | null
          banner_url?: string | null
          category?: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          created_by?: string | null
          current_members?: number | null
          description_ar?: string | null
          description_en?: string | null
          id?: string
          is_featured?: boolean | null
          location?: string | null
          logo_url?: string | null
          max_members?: number | null
          meeting_schedule?: string | null
          metadata?: Json | null
          name_ar: string
          name_en?: string | null
          requirements?: Json | null
          status?: string
          supervisor_name?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          activities?: Json | null
          banner_url?: string | null
          category?: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          created_by?: string | null
          current_members?: number | null
          description_ar?: string | null
          description_en?: string | null
          id?: string
          is_featured?: boolean | null
          location?: string | null
          logo_url?: string | null
          max_members?: number | null
          meeting_schedule?: string | null
          metadata?: Json | null
          name_ar?: string
          name_en?: string | null
          requirements?: Json | null
          status?: string
          supervisor_name?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      student_enrollments: {
        Row: {
          academic_year: number
          course_id: string
          created_at: string
          enrollment_date: string
          id: string
          semester: number
          status: string | null
          student_id: string
          updated_at: string
        }
        Insert: {
          academic_year: number
          course_id: string
          created_at?: string
          enrollment_date?: string
          id?: string
          semester: number
          status?: string | null
          student_id: string
          updated_at?: string
        }
        Update: {
          academic_year?: number
          course_id?: string
          created_at?: string
          enrollment_date?: string
          id?: string
          semester?: number
          status?: string | null
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_student_enrollments_courses"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_student_enrollments_student_profiles"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      student_profiles: {
        Row: {
          academic_year: number
          account_status: string | null
          address: string | null
          admission_date: string
          college: string
          created_at: string
          department: string
          department_id: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          phone: string | null
          program_id: string | null
          semester: number
          specialization: string | null
          status: string | null
          student_id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          academic_year: number
          account_status?: string | null
          address?: string | null
          admission_date: string
          college: string
          created_at?: string
          department: string
          department_id?: string | null
          email: string
          first_name: string
          id?: string
          last_name: string
          phone?: string | null
          program_id?: string | null
          semester: number
          specialization?: string | null
          status?: string | null
          student_id: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          academic_year?: number
          account_status?: string | null
          address?: string | null
          admission_date?: string
          college?: string
          created_at?: string
          department?: string
          department_id?: string | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          phone?: string | null
          program_id?: string | null
          semester?: number
          specialization?: string | null
          status?: string | null
          student_id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      student_registration_requests: {
        Row: {
          academic_year: number | null
          address: string
          admin_notes: string | null
          college: string
          created_at: string | null
          department: string
          department_id: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          password_hash: string
          phone: string
          program_id: string | null
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          semester: number | null
          specialization: string
          status: string | null
          student_id: string
          updated_at: string | null
        }
        Insert: {
          academic_year?: number | null
          address: string
          admin_notes?: string | null
          college: string
          created_at?: string | null
          department: string
          department_id?: string | null
          email: string
          first_name: string
          id?: string
          last_name: string
          password_hash: string
          phone: string
          program_id?: string | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          semester?: number | null
          specialization: string
          status?: string | null
          student_id: string
          updated_at?: string | null
        }
        Update: {
          academic_year?: number | null
          address?: string
          admin_notes?: string | null
          college?: string
          created_at?: string | null
          department?: string
          department_id?: string | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          password_hash?: string
          phone?: string
          program_id?: string | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          semester?: number | null
          specialization?: string
          status?: string | null
          student_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          setting_key: string
          setting_value: Json
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string
        }
        Relationships: []
      }
      teacher_announcements: {
        Row: {
          announcement_type: string
          content: string
          course_id: string | null
          created_at: string
          expire_date: string | null
          id: string
          is_published: boolean
          priority: string
          publish_date: string
          target_audience: string
          teacher_id: string
          title: string
          updated_at: string
        }
        Insert: {
          announcement_type?: string
          content: string
          course_id?: string | null
          created_at?: string
          expire_date?: string | null
          id?: string
          is_published?: boolean
          priority?: string
          publish_date?: string
          target_audience?: string
          teacher_id: string
          title: string
          updated_at?: string
        }
        Update: {
          announcement_type?: string
          content?: string
          course_id?: string | null
          created_at?: string
          expire_date?: string | null
          id?: string
          is_published?: boolean
          priority?: string
          publish_date?: string
          target_audience?: string
          teacher_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "teacher_announcements_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teacher_announcements_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teacher_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      teacher_course_materials: {
        Row: {
          created_at: string
          description: string | null
          download_count: number | null
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string
          id: string
          is_public: boolean | null
          is_required: boolean | null
          material_type: string
          teacher_course_id: string
          title: string
          updated_at: string
          uploaded_by: string
          week_number: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          download_count?: number | null
          file_name: string
          file_path: string
          file_size?: number | null
          file_type: string
          id?: string
          is_public?: boolean | null
          is_required?: boolean | null
          material_type?: string
          teacher_course_id: string
          title: string
          updated_at?: string
          uploaded_by: string
          week_number?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          download_count?: number | null
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string
          id?: string
          is_public?: boolean | null
          is_required?: boolean | null
          material_type?: string
          teacher_course_id?: string
          title?: string
          updated_at?: string
          uploaded_by?: string
          week_number?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "teacher_course_materials_teacher_course_id_fkey"
            columns: ["teacher_course_id"]
            isOneToOne: false
            referencedRelation: "teacher_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teacher_course_materials_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "teacher_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      teacher_courses: {
        Row: {
          academic_year: string
          classroom: string | null
          course_id: string
          created_at: string
          id: string
          is_active: boolean
          max_students: number | null
          schedule_times: Json | null
          section: string | null
          semester: string
          teacher_id: string
          updated_at: string
        }
        Insert: {
          academic_year: string
          classroom?: string | null
          course_id: string
          created_at?: string
          id?: string
          is_active?: boolean
          max_students?: number | null
          schedule_times?: Json | null
          section?: string | null
          semester: string
          teacher_id: string
          updated_at?: string
        }
        Update: {
          academic_year?: string
          classroom?: string | null
          course_id?: string
          created_at?: string
          id?: string
          is_active?: boolean
          max_students?: number | null
          schedule_times?: Json | null
          section?: string | null
          semester?: string
          teacher_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_teacher_courses_courses"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_teacher_courses_teacher_profiles"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teacher_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teacher_courses_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teacher_courses_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teacher_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      teacher_profiles: {
        Row: {
          bio: string | null
          created_at: string
          cv_file_name: string | null
          cv_file_url: string | null
          cv_uploaded_at: string | null
          department_id: string | null
          email: string
          first_name: string
          hire_date: string | null
          id: string
          is_active: boolean
          last_name: string
          office_hours: string | null
          office_location: string | null
          phone: string | null
          position: string | null
          profile_image_url: string | null
          qualifications: string | null
          specialization: string | null
          teacher_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          cv_file_name?: string | null
          cv_file_url?: string | null
          cv_uploaded_at?: string | null
          department_id?: string | null
          email: string
          first_name: string
          hire_date?: string | null
          id?: string
          is_active?: boolean
          last_name: string
          office_hours?: string | null
          office_location?: string | null
          phone?: string | null
          position?: string | null
          profile_image_url?: string | null
          qualifications?: string | null
          specialization?: string | null
          teacher_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          cv_file_name?: string | null
          cv_file_url?: string | null
          cv_uploaded_at?: string | null
          department_id?: string | null
          email?: string
          first_name?: string
          hire_date?: string | null
          id?: string
          is_active?: boolean
          last_name?: string
          office_hours?: string | null
          office_location?: string | null
          phone?: string | null
          position?: string | null
          profile_image_url?: string | null
          qualifications?: string | null
          specialization?: string | null
          teacher_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_role_assignments: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          role_id: string
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          role_id: string
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          role_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_role_assignments_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      approve_student_registration: {
        Args: { admin_id: string; request_id: string }
        Returns: Json
      }
      can_submit_assignment: {
        Args: { _assignment_id: string }
        Returns: boolean
      }
      get_contact_messages: {
        Args: Record<PropertyKey, never>
        Returns: {
          admin_notes: string
          created_at: string
          email: string
          id: string
          is_read: boolean
          message: string
          name: string
          phone: string
          replied_at: string
          replied_by: string
          status: string
          subject: string
          updated_at: string
        }[]
      }
      get_current_student_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_teacher_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_teacher_id_safe: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_navigation_tree: {
        Args: { menu_key_param: string }
        Returns: Json
      }
      get_or_create_teacher_course: {
        Args: { p_course_id: string; p_teacher_id?: string }
        Returns: string
      }
      get_registration_requests: {
        Args: Record<PropertyKey, never>
        Returns: {
          academic_year: number
          address: string
          admin_notes: string
          college: string
          created_at: string
          department: string
          department_id: string
          email: string
          first_name: string
          id: string
          last_name: string
          phone: string
          program_id: string
          rejection_reason: string
          reviewed_at: string
          reviewed_by: string
          semester: number
          specialization: string
          status: string
          student_id: string
          updated_at: string
        }[]
      }
      get_student_enrolled_courses: {
        Args: { _user_id: string }
        Returns: {
          course_id: string
        }[]
      }
      get_student_profile_id: {
        Args: { _user_id: string }
        Returns: string
      }
      get_teacher_courses: {
        Args: { _user_id: string }
        Returns: {
          course_id: string
          teacher_course_id: string
        }[]
      }
      get_teacher_id: {
        Args: { _user_id: string }
        Returns: string
      }
      get_teacher_profile_id: {
        Args: { _user_id: string }
        Returns: string
      }
      get_user_permissions: {
        Args: { _user_id: string }
        Returns: {
          permission_name: string
        }[]
      }
      has_admin_access: {
        Args: { _user_id: string }
        Returns: boolean
      }
      has_permission: {
        Args: { _permission_name: string; _user_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_news_views: {
        Args: { news_id: string }
        Returns: undefined
      }
      increment_resource_counter: {
        Args: { counter_type: string; resource_id: string }
        Returns: undefined
      }
      is_admin: {
        Args: { _user_id: string }
        Returns: boolean
      }
      is_admin_user: {
        Args: {
          _role: Database["public"]["Enums"]["admin_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_enrolled_in_course: {
        Args: { _course_id: string }
        Returns: boolean
      }
      is_material_visible_to_current_student: {
        Args: { _teacher_course_id: string }
        Returns: boolean
      }
      is_student: {
        Args: { _user_id: string }
        Returns: boolean
      }
      is_teacher: {
        Args: { _user_id: string }
        Returns: boolean
      }
      is_teacher_active: {
        Args: { _user_id: string }
        Returns: boolean
      }
      is_teacher_of_course: {
        Args: { _course_id: string }
        Returns: boolean
      }
      reject_student_registration: {
        Args: { admin_id: string; rejection_reason: string; request_id: string }
        Returns: Json
      }
      update_assignment_status: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      validate_department_id: {
        Args: { department_id_val: string }
        Returns: boolean
      }
      validate_program_id: {
        Args: { program_id_val: string }
        Returns: boolean
      }
    }
    Enums: {
      admin_role:
        | "super_admin"
        | "content_admin"
        | "academic_admin"
        | "news_editor"
        | "media_manager"
        | "viewer"
      app_role: "admin" | "student" | "staff"
      content_status: "draft" | "published" | "archived"
      media_type: "image" | "video" | "document" | "audio"
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
      admin_role: [
        "super_admin",
        "content_admin",
        "academic_admin",
        "news_editor",
        "media_manager",
        "viewer",
      ],
      app_role: ["admin", "student", "staff"],
      content_status: ["draft", "published", "archived"],
      media_type: ["image", "video", "document", "audio"],
    },
  },
} as const
