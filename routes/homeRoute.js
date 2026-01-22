
import express from 'express';
import HomeController from '../controllers/homeController.js';
import UserController from '../controllers/userController.js';
import authPublic from "../middleware/middlewarePublic.js";
import auth from "../middleware/middlewareRoutes.js";

const controller = new HomeController;
const controllerUser = new UserController;
const route = express.Router();

route.get('/', authPublic, controller.homeView);
route.get('/logout', controllerUser.logout);
route.get('/perfil', auth, controller.perfilView);
route.post('/perfil', auth, controller.perfilAddress);
export default route;