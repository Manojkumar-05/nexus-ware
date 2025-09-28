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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      orders: {
        Row: {
          id: string
          customer: string
          items: number
          total: number
          status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          date: string
          priority: 'high' | 'medium' | 'low'
          created_at?: string
          updated_at?: string
        }
        Insert: {
          id: string
          customer: string
          items: number
          total: number
          status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          date: string
          priority: 'high' | 'medium' | 'low'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer?: string
          items?: number
          total?: number
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          date?: string
          priority?: 'high' | 'medium' | 'low'
          created_at?: string
          updated_at?: string
        }
      }
      suppliers: {
        Row: {
          id: string
          name: string
          contact: string
          email: string
          phone: string
          address: string
          category: string
          status: 'active' | 'inactive' | 'pending'
          rating: number
          total_orders: number
          total_spent: number
          last_order: string
          reliability: 'excellent' | 'good' | 'fair' | 'poor'
          created_at?: string
          updated_at?: string
        }
        Insert: {
          id: string
          name: string
          contact: string
          email: string
          phone: string
          address: string
          category: string
          status: 'active' | 'inactive' | 'pending'
          rating: number
          total_orders: number
          total_spent: number
          last_order: string
          reliability: 'excellent' | 'good' | 'fair' | 'poor'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          contact?: string
          email?: string
          phone?: string
          address?: string
          category?: string
          status?: 'active' | 'inactive' | 'pending'
          rating?: number
          total_orders?: number
          total_spent?: number
          last_order?: string
          reliability?: 'excellent' | 'good' | 'fair' | 'poor'
          created_at?: string
          updated_at?: string
        }
      }
      inventory: {
        Row: {
          id: string
          name: string
          sku: string
          category: string
          description: string
          quantity: number
          min_quantity: number
          max_quantity: number
          unit_price: number
          supplier: string
          location: string
          status: 'in-stock' | 'low-stock' | 'out-of-stock'
          last_updated: string
          reorder_point: number
          total_value: number
          created_at?: string
          updated_at?: string
        }
        Insert: {
          id: string
          name: string
          sku: string
          category: string
          description: string
          quantity: number
          min_quantity: number
          max_quantity: number
          unit_price: number
          supplier: string
          location: string
          status: 'in-stock' | 'low-stock' | 'out-of-stock'
          last_updated: string
          reorder_point: number
          total_value: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          sku?: string
          category?: string
          description?: string
          quantity?: number
          min_quantity?: number
          max_quantity?: number
          unit_price?: number
          supplier?: string
          location?: string
          status?: 'in-stock' | 'low-stock' | 'out-of-stock'
          last_updated?: string
          reorder_point?: number
          total_value?: number
          created_at?: string
          updated_at?: string
        }
      }
      sales: {
        Row: {
          id: string
          customer: string
          customer_email: string
          customer_phone: string
          items: Json
          total: number
          status: 'completed' | 'processing' | 'shipped' | 'pending'
          date: string
          time: string
          payment_method: string
          salesperson: string
          location: string
          notes: string
          created_at?: string
          updated_at?: string
        }
        Insert: {
          id: string
          customer: string
          customer_email: string
          customer_phone: string
          items: Json
          total: number
          status: 'completed' | 'processing' | 'shipped' | 'pending'
          date: string
          time: string
          payment_method: string
          salesperson: string
          location: string
          notes: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer?: string
          customer_email?: string
          customer_phone?: string
          items?: Json
          total?: number
          status?: 'completed' | 'processing' | 'shipped' | 'pending'
          date?: string
          time?: string
          payment_method?: string
          salesperson?: string
          location?: string
          notes?: string
          created_at?: string
          updated_at?: string
        }
      }
      employees: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          position: string
          department: string
          hire_date: string
          salary: number
          status: 'active' | 'inactive'
          performance: number
          avatar: string
          address: string
          manager: string
          direct_reports: number
          skills: string[]
          achievements: string[]
          created_at?: string
          updated_at?: string
        }
        Insert: {
          id: string
          name: string
          email: string
          phone: string
          position: string
          department: string
          hire_date: string
          salary: number
          status: 'active' | 'inactive'
          performance: number
          avatar: string
          address: string
          manager: string
          direct_reports: number
          skills: string[]
          achievements: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          position?: string
          department?: string
          hire_date?: string
          salary?: number
          status?: 'active' | 'inactive'
          performance?: number
          avatar?: string
          address?: string
          manager?: string
          direct_reports?: number
          skills?: string[]
          achievements?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          company: string
          status: 'active' | 'inactive'
          tier: 'bronze' | 'silver' | 'gold' | 'platinum'
          total_orders: number
          total_spent: number
          last_order: string
          first_order: string
          avg_order_value: number
          customer_since: string
          address: string
          notes: string
          tags: string[]
          avatar: string
          created_at?: string
          updated_at?: string
        }
        Insert: {
          id: string
          name: string
          email: string
          phone: string
          company: string
          status: 'active' | 'inactive'
          tier: 'bronze' | 'silver' | 'gold' | 'platinum'
          total_orders: number
          total_spent: number
          last_order: string
          first_order: string
          avg_order_value: number
          customer_since: string
          address: string
          notes: string
          tags: string[]
          avatar: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          company?: string
          status?: 'active' | 'inactive'
          tier?: 'bronze' | 'silver' | 'gold' | 'platinum'
          total_orders?: number
          total_spent?: number
          last_order?: string
          first_order?: string
          avg_order_value?: number
          customer_since?: string
          address?: string
          notes?: string
          tags?: string[]
          avatar?: string
          created_at?: string
          updated_at?: string
        }
      }
      reports: {
        Row: {
          id: string
          name: string
          type: string
          description: string
          data: Json
          generated_at: string
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Insert: {
          id: string
          name: string
          type: string
          description: string
          data: Json
          generated_at: string
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: string
          description?: string
          data?: Json
          generated_at?: string
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      settings: {
        Row: {
          id: string
          key: string
          value: Json
          category: string
          description: string
          created_at?: string
          updated_at?: string
        }
        Insert: {
          id: string
          key: string
          value: Json
          category: string
          description: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: Json
          category?: string
          description?: string
          created_at?: string
          updated_at?: string
        }
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
