import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: { email: string; password: string; name: string; role?: string }) => {
    return api.post('/auth/register', data);
  },
  login: (data: { email: string; password: string }) => {
    return api.post('/auth/login', data);
  },
  getCurrentUser: () => {
    return api.get('/auth/me');
  }
};

// Rooms API
export const roomsAPI = {
  listRooms: () => {
    return api.get('/rooms');
  },
  getRoom: (id: string) => {
    return api.get(`/rooms/${id}`);
  },
  createRoom: (data: any) => {
    return api.post('/rooms', data);
  },
  updateRoom: (id: string, data: any) => {
    return api.put(`/rooms/${id}`, data);
  },
  deleteRoom: (id: string) => {
    return api.delete(`/rooms/${id}`);
  },
  calculatePrice: (id: string, data: { checkIn: string; checkOut: string }) => {
    return api.post(`/rooms/${id}/calculate-price`, data);
  }
};

// Reservations API
export const reservationsAPI = {
  listReservations: () => api.get('/reservations'),
  getReservation: (id: string) => api.get(`/reservations/${id}`),
  updateReservation: (id: string, data: any) => api.patch(`/reservations/${id}`, data),
  deleteReservation: (id: string) => api.delete(`/reservations/${id}`),
  createReservation: (data: any) => api.post('/reservations', data),
  getReservationStats: () => api.get('/reservations/stats'),
  getUserReservations: () => {
    return api.get('/reservations/user');
  },
  createBulkReservation: (data: {
    roomType: 'SINGLE' | 'DOUBLE' | 'FAMILY' | 'DELUXE' | 'SUITE';
    numberOfRooms: number;
    checkIn: string;
    checkOut: string;
    discountRate: number;
    specialRequests?: string;
  }) => {
    return api.post('/reservations/bulk', data);
  },
  cancelReservation: async (id: string) => {
    const response = await api.post(`/reservations/${id}/cancel`);
    return response.data;
  },
  markAsNoShow: (id: string) => {
    return api.post(`/reservations/${id}/no-show`);
  },
  getReservationsByRoom: (roomId: string) => {
    return api.get(`/reservations/room/${roomId}`);
  },
  calculatePrice: (roomId: string, data: { checkIn: string; checkOut: string }) => {
    return api.get(`/rooms/${roomId}/calculate-price`, { params: data });
  }
};

// Reports API
export const reportsAPI = {
  getRevenueReport: (startDate?: string, endDate?: string) =>
    api.get('/reports/revenue', { params: { startDate, endDate } }),

  getOccupancyReport: (startDate?: string, endDate?: string) =>
    api.get('/reports/occupancy', { params: { startDate, endDate } }),

  getProjectionsReport: (startDate?: string, endDate?: string) =>
    api.get('/reports/projections', { params: { startDate, endDate } }),

  getFinancialReport: (startDate?: string, endDate?: string) =>
    api.get('/reports/financial', { params: { startDate, endDate } }),

  getRevenueByRoomTypeReport: (startDate?: string, endDate?: string) =>
    api.get('/reports/revenue/by-room-type', { params: { startDate, endDate } }),
};

// Billing API
export const billingAPI = {
  getInvoicesForUser: () => api.get('/billing/user/invoices'),
  getPaymentHistoryForUser: () => api.get('/billing/user/payments'),
  generateInvoice: (reservationId: string) => {
    return api.get(`/billing/invoice/${reservationId}`);
  },
  recordPayment: (data: any) => {
    return api.post('/billing/payment', data);
  },
  getPaymentHistory: (reservationId: string) => {
    return api.get(`/billing/history/${reservationId}`);
  },
  addOptionalCharge: (data: { reservationId: string; description: string; amount: number }) => {
 return api.post('/billing/optional-charge', data);
  },
 refundPayment: (paymentId: string, reason: string) => {
 return api.post(`/billing/refund/${paymentId}`, { reason });
  }
};

export default api; 