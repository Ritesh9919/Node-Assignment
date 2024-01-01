
import express from 'express';
import cors from 'cors';

import userRouter from './routes/user.routes.js';
import adminRouter from './routes/admin.routes.js';



const app = express()


app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static('./public'));


app.get('/', (req, res)=> {
    res.send('Hello World');
})


app.use('/api/users', userRouter);
app.use('/api/admin', adminRouter);



export {app}



