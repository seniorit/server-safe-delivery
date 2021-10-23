const express= require('express');
const multer = require('multer');
const upload = multer({dest: '../uploads/'});

const app = express();
app.post('api/bynary',upload.single('avatar'),(red, res)=>{
  
});