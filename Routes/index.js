import express from 'express'
import productRouter from './productRoute.js';



const Router = express.Router();

Router.use("/product", productRouter);



export default Router;


