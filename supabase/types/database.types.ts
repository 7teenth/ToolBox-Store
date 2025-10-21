export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      attribute: {
        Row: {
          attribute_filter_ui_type_id: string | null
          attribute_type_id: string
          created_at: string
          id: string
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          attribute_filter_ui_type_id?: string | null
          attribute_type_id: string
          created_at?: string
          id?: string
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          attribute_filter_ui_type_id?: string | null
          attribute_type_id?: string
          created_at?: string
          id?: string
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attribute_attribute_filter_ui_type_id_fkey"
            columns: ["attribute_filter_ui_type_id"]
            isOneToOne: false
            referencedRelation: "attribute_filter_ui_type"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attribute_attribute_type_id_fkey"
            columns: ["attribute_type_id"]
            isOneToOne: false
            referencedRelation: "attribute_type"
            referencedColumns: ["id"]
          },
        ]
      }
      attribute_filter_ui_type: {
        Row: {
          created_at: string
          id: string
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      attribute_type: {
        Row: {
          created_at: string
          id: string
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      brand: {
        Row: {
          created_at: string
          id: string
          image_url: string | null
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      category: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          parent_id: string | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          parent_id?: string | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          parent_id?: string | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      customer: {
        Row: {
          created_at: string
          email: string
          first_name: string
          id: string
          isDeleted: boolean
          last_name: string
          middle_name: string | null
          password: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          id?: string
          isDeleted?: boolean
          last_name: string
          middle_name?: string | null
          password: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          isDeleted?: boolean
          last_name?: string
          middle_name?: string | null
          password?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      customer_address: {
        Row: {
          address: string
          city: string
          created_at: string
          customer_id: string
          id: string
          phone: string
          postal_code: string
          region: string
          updated_at: string | null
        }
        Insert: {
          address: string
          city: string
          created_at?: string
          customer_id: string
          id?: string
          phone: string
          postal_code: string
          region: string
          updated_at?: string | null
        }
        Update: {
          address?: string
          city?: string
          created_at?: string
          customer_id?: string
          id?: string
          phone?: string
          postal_code?: string
          region?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_address_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer"
            referencedColumns: ["id"]
          },
        ]
      }
      link_attribute_category: {
        Row: {
          attribute_id: string
          category_id: string
          created_at: string
          id: string
          updated_at: string | null
        }
        Insert: {
          attribute_id: string
          category_id: string
          created_at?: string
          id?: string
          updated_at?: string | null
        }
        Update: {
          attribute_id?: string
          category_id?: string
          created_at?: string
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "link_attribute_category_attribute_id_fkey"
            columns: ["attribute_id"]
            isOneToOne: false
            referencedRelation: "attribute"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "link_attribute_category_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "category"
            referencedColumns: ["id"]
          },
        ]
      }
      link_attribute_product: {
        Row: {
          attribute_id: string
          created_at: string
          id: string
          product_id: string
          updated_at: string | null
          value: string
        }
        Insert: {
          attribute_id: string
          created_at?: string
          id?: string
          product_id: string
          updated_at?: string | null
          value: string
        }
        Update: {
          attribute_id?: string
          created_at?: string
          id?: string
          product_id?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "link_attribute_product_attribute_id_fkey"
            columns: ["attribute_id"]
            isOneToOne: false
            referencedRelation: "attribute"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "link_attribute_product_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
        ]
      }
      link_product_badge_product: {
        Row: {
          created_at: string
          id: string
          product_badge_id: string | null
          product_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          product_badge_id?: string | null
          product_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          product_badge_id?: string | null
          product_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "link_product_badge_product_product_badge_id_fkey"
            columns: ["product_badge_id"]
            isOneToOne: false
            referencedRelation: "product_badge"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "link_product_badge_product_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
        ]
      }
      order: {
        Row: {
          comment: string | null
          created_at: string
          customer_address_id: string
          customer_id: string
          id: string
          isDeleted: boolean
          order_status_id: string
          total: number
          updated_at: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string
          customer_address_id: string
          customer_id: string
          id?: string
          isDeleted?: boolean
          order_status_id: string
          total: number
          updated_at?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string
          customer_address_id?: string
          customer_id?: string
          id?: string
          isDeleted?: boolean
          order_status_id?: string
          total?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_customer_address_id_fkey"
            columns: ["customer_address_id"]
            isOneToOne: false
            referencedRelation: "customer_address"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_order_status_id_fkey"
            columns: ["order_status_id"]
            isOneToOne: false
            referencedRelation: "order_status"
            referencedColumns: ["id"]
          },
        ]
      }
      order_item: {
        Row: {
          created_at: string
          discount: number | null
          id: string
          order_id: string
          price: number
          product_id: string
          quantity: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          discount?: number | null
          id?: string
          order_id: string
          price: number
          product_id: string
          quantity: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          discount?: number | null
          id?: string
          order_id?: string
          price?: number
          product_id?: string
          quantity?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_item_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_item_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
        ]
      }
      order_status: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      payment: {
        Row: {
          amount: number
          created_at: string
          customer_id: string
          id: string
          isDeleted: boolean
          order_id: string
          payment_status_id: string
          provider: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          customer_id: string
          id?: string
          isDeleted?: boolean
          order_id: string
          payment_status_id: string
          provider: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          customer_id?: string
          id?: string
          isDeleted?: boolean
          order_id?: string
          payment_status_id?: string
          provider?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_payment_status_id_fkey"
            columns: ["payment_status_id"]
            isOneToOne: false
            referencedRelation: "payment_status"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_status: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      product: {
        Row: {
          brand_id: string
          category_id: string
          created_at: string
          description: string | null
          discont: number | null
          id: string
          isDeleted: boolean
          name: string
          price: number
          product_status_id: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          brand_id: string
          category_id: string
          created_at?: string
          description?: string | null
          discont?: number | null
          id?: string
          isDeleted?: boolean
          name: string
          price: number
          product_status_id: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          brand_id?: string
          category_id?: string
          created_at?: string
          description?: string | null
          discont?: number | null
          id?: string
          isDeleted?: boolean
          name?: string
          price?: number
          product_status_id?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brand"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "category"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_product_status_id_fkey"
            columns: ["product_status_id"]
            isOneToOne: false
            referencedRelation: "product_status"
            referencedColumns: ["id"]
          },
        ]
      }
      product_badge: {
        Row: {
          color: string
          created_at: string
          id: string
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          color?: string
          created_at?: string
          id?: string
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          color?: string
          created_at?: string
          id?: string
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      product_image: {
        Row: {
          created_at: string
          id: string
          order: number
          product_id: string
          updated_at: string | null
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          order?: number
          product_id: string
          updated_at?: string | null
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          order?: number
          product_id?: string
          updated_at?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_image_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
        ]
      }
      product_status: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      review: {
        Row: {
          comment: string | null
          created_at: string
          customer_id: string
          id: string
          product_id: string
          rating: number
          updated_at: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string
          customer_id: string
          id?: string
          product_id: string
          rating: number
          updated_at?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string
          customer_id?: string
          id?: string
          product_id?: string
          rating?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "review_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

