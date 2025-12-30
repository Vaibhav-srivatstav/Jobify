import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import path from 'path'
import helmet from 'helmet'
import { fileURLToPath } from 'url'

import { connectDB } from './config/db.js';
// import analysis from './routes/analysisroutes.js';
// import application from  './routes/applicationroutes.js';
// import ats from './routes/atsroutes.js';
// import job from './routes/joboutes.js';
// import resume from './routes/resumeroutes.js';

const app = express();
const PORT = 5000;
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB();

app.use(cors());
app.use(
    helmet({
        crossOriginResourcePolicy:{ policy: 'cross-origin'},
    })
)
app.use(express.json());//new day
app.use(express.urlencoded({ extended: true }))


app.use(
    '/uploads',(req, res, next )=>{
        res.setHeader('Access-Control-Allow-Origin', '*')
        next(); 
    },
    express.static(path.join(process.cwd() ,'uploads',))
)

// app.use('/api/resume',resume);
// app.use('/api/application',application);
// app.use('/api/job',job);
// app.use('/api/ats',ats);
// app.use('/api/analysis',analysis);

app.get('/api/ping', (req, res) => res.json({
    ok: true,
    time: Date.now()
}))

//listen
app.get('/', (req, res) => {
    res.send('Vaibhav and Prateek company')
    
})

app.listen(PORT, () => {
    console.log(`sever started on https://localhost:${PORT}`)
})