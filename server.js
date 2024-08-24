import express from "express";
import colors from "colors";
import dotenv from 'dotenv'
import morgan from "morgan";
import connectdb from "./config/db.js";
import authRoutes from './routes/authRoute.js'
import categoryRoutees from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRouters.js"
import cors from 'cors';
import path from "path";
import { fileURLToPath } from 'url';

dotenv.config();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//database configar

connectdb();

const app = express();

//middeleware
app.use(cors());
app.use(express.json())
app.use(morgan('dev'))
//app.use(express.static(path.join(__dirname,"./client/build")))

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
  
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
//   });
//routes

app.use('/api/v1/auth',authRoutes);

app.use('/api/v1/category',categoryRoutees);

//product routes
app.use('/api/v1/product',productRoutes);


//rest api

// app.use(`*`,function(req,res){
//     res.sendFile(path.join(__dirname,'./client/build/index.html'))
// })

app.get('/',(req,res)=>{
    res.send('<h1>Welcome to the e-commerce app<h1>');
});

const PORT = process.env.PORT || 8080;


app.listen(PORT ,() =>{
    console.log(`Server Runnning on ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan.white);
});