const PORT = 8000;
const cors = require('cors');
const express = require('express');
const app = express();
app.use(cors());
app.use(express.json());
require('dotenv').config(); /////////////
const fs = require('fs');   /////////////
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');


const genAI = new GoogleGenerativeAI(process.env.KEY); 

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploded-images');
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage: storage }).single('file');

let fileroute; 


app.post('/upload', (req, res) => {
    console.log("uploading data...");
    upload(req, res, (err) => {
        if (err) {
            return res.status(500).json(err);
        }
        fileroute = req.file.path; 
    });
});

app.post('/delete' ,async(req,res)=>{
    console.log("deleting data...");
    fs.unlink(fileroute, (err) => {
        if (err) {
          console.log("deleted the uploaded image")
        }})
})

app.post('/Analyse' , async(req,res)=>{
    console.log("Analysing data...");
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' }); 
        const prompt = req.body.message;
        const result = await model.generateContent([prompt, fileToGenerativePart(fileroute, "image/jpeg")]);
        const response = await result.response;
        const text = response.text();
        res.send(text);
        console.log(prompt, text);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message }); // Send an error response
    }
});

function fileToGenerativePart(path, mimeType) {
    const fileData = fs.readFileSync(path);
    const base64Data = fileData.toString('base64');
    return {
        inlineData: {
            data: base64Data,
            mimeType 
        }
    };
};


app.listen(PORT,()=>{
    console.log("server running at port:" , PORT)
});