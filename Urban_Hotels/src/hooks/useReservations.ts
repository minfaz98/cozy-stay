import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateReservationDTO, Reservation } from "@/types/reservation";
import { useToast } from "./use-toast";
import { reservationsAPI } from "@/services/api";

export function useReservations() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Get all user reservations
  const { 
    data: reservations,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['reservations'],
    queryFn: async () => {
      
      const  response = await reservationsAPI.getUserReservations();

      return response.data.data;
    },
  });

  // Create reservation mutation
  const createReservationMutation = useMutation({
    mutationFn: (newReservation: CreateReservationDTO) => 
      reservationsAPI.createReservation(newReservation),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      toast({
        title: "Reservation created",
        description: "Your reservation has been successfully created.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error creating reservation",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    },
  });

  // Update reservation mutation
  const updateReservationMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Reservation> }) =>
      reservationsAPI.updateReservation(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      toast({
        title: "Reservation updated",
        description: "Your reservation has been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating reservation",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    },
  });

  // Cancel reservation mutation
  const cancelReservationMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      reservationsAPI.cancelReservation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      toast({
        title: "Reservation cancelled",
        description: "Your reservation has been cancelled.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error cancelling reservation",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    },
  });

  // Mark as no-show mutation
  const markNoShowMutation = useMutation({
    mutationFn: (id: string) => reservationsAPI.markAsNoShow(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      toast({
        title: "No-show processed",
        description: "The reservation has been marked as no-show and the customer has been charged.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error processing no-show",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    },
  });

  return {
    reservations,
    isLoading,
    isError,
    error,
    refetch,
    createReservation: createReservationMutation.mutate,
    updateReservation: updateReservationMutation.mutate,
    cancelReservation: cancelReservationMutation.mutate,
    markAsNoShow: markNoShowMutation.mutate,
    createReservationLoading: createReservationMutation.isPending,
    updateReservationLoading: updateReservationMutation.isPending,
    cancelReservationLoading: cancelReservationMutation.isPending,
    markNoShowLoading: markNoShowMutation.isPending,
  };
}
