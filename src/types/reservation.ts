
export type ReservationStatus = 'confirmed' | 'pending' | 'cancelled' | 'no-show' | 'completed';
export type PaymentStatus = 'paid' | 'unpaid' | 'refunded' | 'charged';

export interface Reservation {
  id: string;
  user_id: string;
  room_id: string;
  roomType?: string;
  check_in_date: string;
  check_out_date: string;
  number_of_guests: number;
  status: ReservationStatus;
  payment_status: PaymentStatus;
  total_amount?: number;
  created_at: string;
  special_requests?: string;
}

export interface NoShowReport {
  id: string;
  date: string;
  totalReservations: number;
  noShowCount: number;
  revenue: string;
}

export interface Room {
  id: string;
  name: string;
  type: string;
  description?: string;
  image_url?: string;
  price: number;
  is_available: boolean;
  created_at?: string;
}
