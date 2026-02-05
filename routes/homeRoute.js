
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
route.get('/logout', controllerUser.logout);
route.get('/profile', auth, controller.perfilView);
route.put('/profile/address', auth, controller.perfilAddress);
route.put('/profile/allData', auth, upload.single('imagem'), controller.perfilAlterarDados);
route.delete('/profile/delete', auth, controller.profileDeleteAddress);
export default route;