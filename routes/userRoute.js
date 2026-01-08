
import express from 'express';
import UserController from '../controllers/userController.js';

const route = express.Router();
const controller = new UserController;

route.get('/login', controller.loginView);
route.post('/login', controller.login);

route.get('/register', controller.registerView);
export default route;