
import express from 'express';
import DashboardController from '../controllers/dashboardController.js';
import authAdmin from "../middleware/middlewareAdmin.js";

const controller = new DashboardController;
const route = express.Router(); 

route.get('/', authAdmin, controller.dashboardView);
route.get('/address', authAdmin, controller.dashboardEnderecoView);
route.delete('/user/delete', authAdmin, controller.deleteUsers);
route.delete('/address/delete', authAdmin, controller.deleteAddress);

route.get('/user/:id', authAdmin, controller.dashboardUserServiceView);
route.delete('/user/delete/:id', authAdmin, controller.dashboardUserServiceDelete);
export default route;