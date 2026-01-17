
import express from 'express';
import DashboardController from '../controllers/dashboardController.js';
import authAdmin from "../middleware/middlewareAdmin.js";

const controller = new DashboardController;
const route = express.Router();

route.get('/', authAdmin, controller.dashboardView);
route.post('/delete', authAdmin, controller.delete);


export default route;