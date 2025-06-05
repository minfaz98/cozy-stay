import express from 'express';
import { authenticate } from '../../middleware/auth.js';
import {
  listReservations,
  createReservation,
  updateReservation,
  cancelReservation,
  getUserReservations,
  createBulkBooking,
  getReservationById
} from './reservations.controller.js';

const router = express.Router();

// Public routes (require authentication)
router.get('/user', authenticate(), getUserReservations);

// Protected routes (require authentication and specific roles)
router.get('/', authenticate(['MANAGER', 'STAFF']), listReservations);
router.get('/:id', authenticate(['MANAGER', 'STAFF']), getReservationById);
router.post('/', authenticate(), createReservation);
router.patch('/:id', authenticate(['MANAGER', 'STAFF']), updateReservation);
router.post('/:id/cancel', authenticate(), cancelReservation);
router.post('/bulk', authenticate(['COMPANY']), createBulkBooking);

export default router; 