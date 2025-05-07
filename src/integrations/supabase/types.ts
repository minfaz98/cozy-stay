export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      amenities: {
        Row: {
          created_at: string | null
          description: string | null
          icon_url: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon_url?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon_url?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      billing: {
        Row: {
          check_in: string
          check_out: string
          created_at: string | null
          customer_name: string
          id: string
          payment_mode: string | null
          room_charge: number
          room_type: string
          service_charge: number | null
          total_amount: number | null
        }
        Insert: {
          check_in: string
          check_out: string
          created_at?: string | null
          customer_name: string
          id?: string
          payment_mode?: string | null
          room_charge: number
          room_type: string
          service_charge?: number | null
          total_amount?: number | null
        }
        Update: {
          check_in?: string
          check_out?: string
          created_at?: string | null
          customer_name?: string
          id?: string
          payment_mode?: string | null
          room_charge?: number
          room_type?: string
          service_charge?: number | null
          total_amount?: number | null
        }
        Relationships: []
      }
      bookings: {
        Row: {
          check_in_date: string
          check_out_date: string
          created_at: string | null
          id: string
          num_guests: number | null
          payment_status: string | null
          room_id: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          check_in_date: string
          check_out_date: string
          created_at?: string | null
          id?: string
          num_guests?: number | null
          payment_status?: string | null
          room_id?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          check_in_date?: string
          check_out_date?: string
          created_at?: string | null
          id?: string
          num_guests?: number | null
          payment_status?: string | null
          room_id?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      guest_experiences: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          image_url: string | null
          title: string
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          title: string
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          title?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          content: Json | null
          generated_at: string | null
          generated_by: string | null
          id: string
          report_type: string
        }
        Insert: {
          content?: Json | null
          generated_at?: string | null
          generated_by?: string | null
          id?: string
          report_type: string
        }
        Update: {
          content?: Json | null
          generated_at?: string | null
          generated_by?: string | null
          id?: string
          report_type?: string
        }
        Relationships: []
      }
      reservations: {
        Row: {
          check_in_date: string
          check_out_date: string
          created_at: string | null
          id: string
          number_of_guests: number
          payment_status: Database["public"]["Enums"]["payment_status"] | null
          room_id: string | null
          special_requests: string | null
          status: string | null
          total_amount: number | null
          user_id: string | null
        }
        Insert: {
          check_in_date: string
          check_out_date: string
          created_at?: string | null
          id?: string
          number_of_guests: number
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          room_id?: string | null
          special_requests?: string | null
          status?: string | null
          total_amount?: number | null
          user_id?: string | null
        }
        Update: {
          check_in_date?: string
          check_out_date?: string
          created_at?: string | null
          id?: string
          number_of_guests?: number
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          room_id?: string | null
          special_requests?: string | null
          status?: string | null
          total_amount?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reservations_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      rooms: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          is_available: boolean | null
          name: string
          price: number
          type: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          name: string
          price: number
          type: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          name?: string
          price?: number
          type?: string
        }
        Relationships: []
      }
      suite_bookings: {
        Row: {
          created_at: string
          email: string
          enddate: string
          guests: number
          id: string
          name: string
          ratetype: string
          startdate: string
          suitetype: string
        }
        Insert: {
          created_at?: string
          email: string
          enddate: string
          guests: number
          id?: string
          name: string
          ratetype: string
          startdate: string
          suitetype: string
        }
        Update: {
          created_at?: string
          email?: string
          enddate?: string
          guests?: number
          id?: string
          name?: string
          ratetype?: string
          startdate?: string
          suitetype?: string
        }
        Relationships: []
      }
      travel_bookings: {
        Row: {
          check_in_date: string
          check_out_date: string
          company_name: string
          contact_email: string
          contact_person: string
          created_at: string | null
          id: string
          room_id: string | null
          type: string | null
        }
        Insert: {
          check_in_date: string
          check_out_date: string
          company_name: string
          contact_email: string
          contact_person: string
          created_at?: string | null
          id?: string
          room_id?: string | null
          type?: string | null
        }
        Update: {
          check_in_date?: string
          check_out_date?: string
          company_name?: string
          contact_email?: string
          contact_person?: string
          created_at?: string | null
          id?: string
          room_id?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "travel_bookings_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      users_meta: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string
          role: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_reservation_price: {
        Args: { room_id: string; check_in_date: string; check_out_date: string }
        Returns: number
      }
      check_room_availability: {
        Args: { check_in: string; check_out: string }
        Returns: {
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          is_available: boolean | null
          name: string
          price: number
          type: string
        }[]
      }
    }
    Enums: {
      payment_status: "paid" | "unpaid" | "refunded" | "charged"
      reservation_status:
        | "confirmed"
        | "pending"
        | "cancelled"
        | "no-show"
        | "completed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      payment_status: ["paid", "unpaid", "refunded", "charged"],
      reservation_status: [
        "confirmed",
        "pending",
        "cancelled",
        "no-show",
        "completed",
      ],
    },
  },
} as const
