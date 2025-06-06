import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/error.js';
import { authenticate } from './middleware/auth.js';
import * as AuthCtrl from './modules/auth/auth.controller.js';
import * as RoomCtrl from './modules/rooms/rooms.controller.js';
import * as ReportCtrl from './modules/reports/reports.controller.js';
import * as BillingCtrl from './modules/billing/billing.controller.js';
import './jobs/autoCancel.js';
import './jobs/nightlyReport.js';
import reservationsRouter from './modules/reservations/reservations.routes.js';

const app = express();
app.use(cors());
app.use(express.json());

// Auth
app.post('/auth/register', AuthCtrl.register);
app.post('/auth/login', AuthCtrl.login);
app.get('/auth/me', authenticate(), AuthCtrl.getCurrentUser);

// Rooms
app.get('/rooms', RoomCtrl.listRooms);
app.post('/rooms', authenticate(['MANAGER']), RoomCtrl.createRoom);
app.put('/rooms/:id', authenticate(['MANAGER']), RoomCtrl.updateRoom);
app.delete('/rooms/:id', authenticate(['MANAGER']), RoomCtrl.deleteRoom);

// Reservations
app.use('/reservations', reservationsRouter);

// Reports
app.get('/reports/occupancy', authenticate(['MANAGER']), ReportCtrl.getOccupancyReport);
app.get('/reports/revenue', authenticate(['MANAGER']), ReportCtrl.getRevenueReport);

// Billing
app.get('/billing/invoice/:reservationId', authenticate(['MANAGER', 'STAFF']), BillingCtrl.generateInvoice);
app.post('/billing/payment', authenticate(['MANAGER', 'STAFF']), BillingCtrl.recordPayment);
app.get('/billing/history/:reservationId', authenticate(['MANAGER', 'STAFF']), BillingCtrl.getPaymentHistory);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`)); 

// Health check route
app.get('/health', (req, res) => {
    res.status(200).send('Server is healthy');
  });
  