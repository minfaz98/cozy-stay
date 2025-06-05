import express from "express";
import cors from "cors";
import initReservationCron from "./cron/reservationCron.js";

// ... existing middleware setup ...

// Initialize cron jobs
initReservationCron();

// ... rest of the server setup ...
