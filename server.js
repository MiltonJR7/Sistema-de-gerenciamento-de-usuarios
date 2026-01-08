
import express from 'express';
import UserRoute from './routes/userRoute.js';

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(express.json());

app.use("/", UserRoute);

const port = 5000;
app.listen(port, ()=> { console.log(`Servidor em execução na porta: ${port}.`); })