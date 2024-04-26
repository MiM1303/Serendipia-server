const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// mmiddleware
app.use(cors());
app.use(express.json());



app.get('/', (req, res)=>{
    res.send("Serendipia server is running")
})

app.listen(port, ()=>{
    console.log(`Serendipia server is running on port: ${port}`)
})