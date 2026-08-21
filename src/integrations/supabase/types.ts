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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      akademi_jadwal: {
        Row: {
          created_at: string
          id: string
          judul: string
          pemateri: string
          tanggal: string
          tipe: string
          updated_at: string
          urutan: number
        }
        Insert: {
          created_at?: string
          id?: string
          judul: string
          pemateri?: string
          tanggal?: string
          tipe?: string
          updated_at?: string
          urutan?: number
        }
        Update: {
          created_at?: string
          id?: string
          judul?: string
          pemateri?: string
          tanggal?: string
          tipe?: string
          updated_at?: string
          urutan?: number
        }
        Relationships: []
      }
      akademi_materi: {
        Row: {
          created_at: string
          durasi: string
          id: string
          judul: string
          kategori: Database["public"]["Enums"]["kategori_materi"]
          pemateri: string
          progres: number
          updated_at: string
          urutan: number
        }
        Insert: {
          created_at?: string
          durasi?: string
          id?: string
          judul: string
          kategori?: Database["public"]["Enums"]["kategori_materi"]
          pemateri?: string
          progres?: number
          updated_at?: string
          urutan?: number
        }
        Update: {
          created_at?: string
          durasi?: string
          id?: string
          judul?: string
          kategori?: Database["public"]["Enums"]["kategori_materi"]
          pemateri?: string
          progres?: number
          updated_at?: string
          urutan?: number
        }
        Relationships: []
      }
      akademi_sertifikasi: {
        Row: {
          created_at: string
          id: string
          nama: string
          progres: number
          status: Database["public"]["Enums"]["status_sertifikasi"]
          updated_at: string
          urutan: number
        }
        Insert: {
          created_at?: string
          id?: string
          nama: string
          progres?: number
          status?: Database["public"]["Enums"]["status_sertifikasi"]
          updated_at?: string
          urutan?: number
        }
        Update: {
          created_at?: string
          id?: string
          nama?: string
          progres?: number
          status?: Database["public"]["Enums"]["status_sertifikasi"]
          updated_at?: string
          urutan?: number
        }
        Relationships: []
      }
      jamaah: {
        Row: {
          catatan: string
          created_at: string
          id: string
          kota: string
          mitra: string
          nama: string
          nilai: number
          paket: string
          status: Database["public"]["Enums"]["status_jamaah"]
          sumber: string
          telepon: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          catatan?: string
          created_at?: string
          id?: string
          kota?: string
          mitra?: string
          nama: string
          nilai?: number
          paket?: string
          status?: Database["public"]["Enums"]["status_jamaah"]
          sumber?: string
          telepon?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          catatan?: string
          created_at?: string
          id?: string
          kota?: string
          mitra?: string
          nama?: string
          nilai?: number
          paket?: string
          status?: Database["public"]["Enums"]["status_jamaah"]
          sumber?: string
          telepon?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          kota: string
          nama: string
          telepon: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          kota?: string
          nama?: string
          telepon?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          kota?: string
          nama?: string
          telepon?: string
          updated_at?: string
        }
        Relationships: []
      }
      teritori: {
        Row: {
          catatan: string
          created_at: string
          dihubungi: number
          id: string
          kabupaten: string
          kecamatan: string
          leads_aktif: number
          lost: number
          pemilik: string | null
          pending: number
          populasi: number
          potensi_pasar: number
          status: Database["public"]["Enums"]["status_teritori"]
          updated_at: string
        }
        Insert: {
          catatan?: string
          created_at?: string
          dihubungi?: number
          id?: string
          kabupaten: string
          kecamatan: string
          leads_aktif?: number
          lost?: number
          pemilik?: string | null
          pending?: number
          populasi?: number
          potensi_pasar?: number
          status?: Database["public"]["Enums"]["status_teritori"]
          updated_at?: string
        }
        Update: {
          catatan?: string
          created_at?: string
          dihubungi?: number
          id?: string
          kabupaten?: string
          kecamatan?: string
          leads_aktif?: number
          lost?: number
          pemilik?: string | null
          pending?: number
          populasi?: number
          potensi_pasar?: number
          status?: Database["public"]["Enums"]["status_teritori"]
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "mitra"
      kategori_materi: "Product Knowledge" | "Skill Marketing" | "Fikih Umrah"
      status_jamaah:
        | "Prospek"
        | "Tanya-tanya"
        | "DP"
        | "Pemberkasan"
        | "Lunas"
        | "Berangkat"
        | "Batal"
      status_sertifikasi: "Selesai" | "Berjalan" | "Terkunci"
      status_teritori:
        | "Aktif"
        | "Tersedia"
        | "Perencanaan"
        | "Retargeting"
        | "Blacklist"
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
      app_role: ["admin", "mitra"],
      kategori_materi: ["Product Knowledge", "Skill Marketing", "Fikih Umrah"],
      status_jamaah: [
        "Prospek",
        "Tanya-tanya",
        "DP",
        "Pemberkasan",
        "Lunas",
        "Berangkat",
        "Batal",
      ],
      status_sertifikasi: ["Selesai", "Berjalan", "Terkunci"],
      status_teritori: [
        "Aktif",
        "Tersedia",
        "Perencanaan",
        "Retargeting",
        "Blacklist",
      ],
    },
  },
} as const
