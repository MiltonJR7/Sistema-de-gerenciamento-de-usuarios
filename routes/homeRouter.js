
import express from 'express';
import HomeController from '../controllers/homeController.js';
import UserController from '../controllers/userController.js';
import authPublic from "../middleware/middlewarePublic.js";
import auth from "../middleware/middlewareRoutes.js";
import upload from '../middleware/middlewareMulter.js';

const controller = new HomeController;
const controllerUser = new UserController;
const route = express.Router();

route.get('/', authPublic, controller.homeView);
route.get('/logout', auth, controllerUser.logout);
route.get('/shopProduct/:id', authPublic, controller.shopProductView);
route.get('/checkout', auth, controller.checkoutView);

route.get('/profile/:id', auth, controller.perfilView);
route.put('/profile/:id', auth, upload.single('imagem'), controller.perfilAlterarDados);
route.put('/profile/address/:id', auth, controller.perfilAddress);

route.delete('/profile/:id', auth, controller.profileDeleteAddress);
export default route;