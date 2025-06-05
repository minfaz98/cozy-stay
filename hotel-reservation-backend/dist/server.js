import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { errorHandler } from './middleware/error';
import { authenticate } from './middleware/auth';
import * as AuthCtrl from './modules/auth/auth.controller.js';
import * as RoomCtrl from './modules/rooms/rooms.controller.js';
import * as ResCtrl from './modules/reservations/reservations.controller.js';
import * as ReportCtrl from './modules/reports/reports.controller.js';
import './jobs/autoCancel';
import './jobs/nightlyReport';
const app = express();
app.use(cors());
app.use(express.json());
// Auth
app.post('/auth/register', AuthCtrl.register);
app.post('/auth/login', AuthCtrl.login);
// Rooms
app.get('/rooms', RoomCtrl.listRooms);
app.post('/rooms', authenticate(['MANAGER']), RoomCtrl.createRoom);
app.put('/rooms/:id', authenticate(['MANAGER']), RoomCtrl.updateRoom);
app.delete('/rooms/:id', authenticate(['MANAGER']), RoomCtrl.deleteRoom);
// Reservations
app.post('/reservations', authenticate(), ResCtrl.createReservation);
app.delete('/reservations/:id', authenticate(), ResCtrl.cancelReservation);
// Reports
app.get('/reports/occupancy', authenticate(['MANAGER']), ReportCtrl.occupancyReport);
// Error handler
app.use(errorHandler);
app.listen(env.PORT, () => console.log(`API running on port ${env.PORT}`));
