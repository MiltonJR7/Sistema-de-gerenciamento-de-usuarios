
import express from 'express';
import DashboardController from '../controllers/dashboardController.js';
import authAdmin from "../middleware/middlewareAdmin.js";

const controller = new DashboardController;
const route = express.Router();

route.get('/', authAdmin, controller.dashboardView);
route.get('/endereco', authAdmin, controller.dashboardEnderecoView);
route.post('/delete', authAdmin, controller.deleteUsers);
route.post('/endereco/delete', authAdmin, controller.deleteAddress);
export default route;