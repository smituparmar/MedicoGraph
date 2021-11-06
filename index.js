const express = require('express');
const connectDB = require('./config/db');
const path = require("path");

const app = express();
connectDB();

//init middleware
app.use(express.json());

app.get('/', (req,res)=>res.send('API running')); 

//define routes
app.use('/api/auth',require('./routes/api/auth'));
app.use('/api/patient',require('./routes/api/patient'));
app.use('/api/record',require('./routes/api/record'));
app.use('/api/medical',require('./routes/api/patientMedical'));
app.use('/api/doctor',require('./routes/api/doctor'));

const PORT = process.env.PORT || 5000;


app.listen(PORT,()=>{
    console.log(`Server started on ${PORT}`);
});
