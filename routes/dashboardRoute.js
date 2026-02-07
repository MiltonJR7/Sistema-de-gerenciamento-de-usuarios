
import express from 'express';
import DashboardController from '../controllers/dashboardController.js';
import authAdmin from "../middleware/middlewareAdmin.js";
import upload from "../middleware/middlewareMulter.js";

const controller = new DashboardController;
const route = express.Router(); 

route.get('/', authAdmin, controller.dashboardView);
route.get('/address', authAdmin, controller.dashboardEnderecoView);
route.get('/products', authAdmin, controller.dashboardProductsView);
route.get('/products/add-new', authAdmin, controller.dashboardProductServicesView);

route.post('/products/add-new', authAdmin, upload.single('imagem'), controller.dashboardProductServicesNewProduct);

route.delete('/user/delete', authAdmin, controller.deleteUsers);
route.delete('/address/delete', authAdmin, controller.deleteAddress);
route.delete('/products/delete', authAdmin, controller.dashboardProductsDelete);

route.get('/user/:id', authAdmin, controller.dashboardUserServiceView);
route.put('/user/:id', authAdmin, upload.single('imagem'), controller.dashboardUserServiceAlter);
route.delete('/user/delete/:id', authAdmin, controller.dashboardUserServiceDelete);

route.get('/products/:id', authAdmin, controller.dashboardProductsAlterView);
route.put('/products/:id', authAdmin, upload.single('imagem'), controller.dashboardProductsAlter);
//route.delete('/products/delete/:id', authAdmin, controller.das)


export default route;