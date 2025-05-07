
import { supabase } from "@/integrations/supabase/client";
import { Reservation, Room } from "@/types/reservation";

export const reservationService = {
  // Get all reservations for the current user
  async getUserReservations(): Promise<Reservation[]> {
    const { data: reservations, error } = await supabase
      .from('reservations')
      .select(`
        *,
        rooms:room_id (
          name,
          type,
          price
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reservations:', error);
      throw error;
    }

    // Transform the data to match our Reservation interface
    return reservations.map((res: any) => ({
      id: res.id,
      user_id: res.user_id,
      room_id: res.room_id,
      roomType: res.rooms?.type || 'Unknown Room',
      check_in_date: res.check_in_date,
      check_out_date: res.check_out_date,
      number_of_guests: res.number_of_guests,
      status: res.status,
      payment_status: res.payment_status || 'unpaid',
      total_amount: res.total_amount,
      created_at: res.created_at,
      special_requests: res.special_requests
    }));
  },

  // Create a new reservation
  async createReservation(reservationData: Partial<Reservation>): Promise<Reservation> {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User must be logged in to make a reservation');
    }

    const { data, error } = await supabase
      .from('reservations')
      .insert({
        ...reservationData,
        user_id: user.user.id,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating reservation:', error);
      throw error;
    }

    return data as Reservation;
  },

  // Update an existing reservation
  async updateReservation(id: string, updates: Partial<Reservation>): Promise<Reservation> {
    const { data, error } = await supabase
      .from('reservations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating reservation:', error);
      throw error;
    }

    return data as Reservation;
  },

  // Cancel a reservation
  async cancelReservation(id: string, reason?: string): Promise<Reservation> {
    return this.updateReservation(id, {
      status: 'cancelled',
      special_requests: reason ? `Cancelled: ${reason}` : undefined
    });
  },

  // Mark a reservation as no-show
  async markAsNoShow(id: string): Promise<Reservation> {
    return this.updateReservation(id, {
      status: 'no-show', 
      payment_status: 'charged'
    });
  },

  // Check room availability
  async checkRoomAvailability(checkIn: string, checkOut: string): Promise<Room[]> {
    const { data, error } = await supabase
      .rpc('check_room_availability', {
        check_in: checkIn,
        check_out: checkOut
      });

    if (error) {
      console.error('Error checking room availability:', error);
      throw error;
    }

    return data as Room[];
  },

  // Calculate reservation price
  async calculatePrice(roomId: string, checkIn: string, checkOut: string): Promise<number> {
    const { data, error } = await supabase
      .rpc('calculate_reservation_price', {
        room_id: roomId,
        check_in_date: checkIn,
        check_out_date: checkOut
      });

    if (error) {
      console.error('Error calculating price:', error);
      throw error;
    }

    return data as number;
  }
};
