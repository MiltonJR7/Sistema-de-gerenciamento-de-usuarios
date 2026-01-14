
import express from 'express';
import DashboardController from '../controllers/dashboardController.js';
import auth from "../middleware/middlewareRoutes.js";

const controller = new DashboardController;
const route = express.Router();

route.get('/dashboard', auth, controller.dashboardView);
export default route;