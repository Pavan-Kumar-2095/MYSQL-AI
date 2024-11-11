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

const axios = require('axios');
const imageToBase64 = require('image-to-base64');

const cloudinary = require('cloudinary').v2;
cloudinary.config({ 
    cloud_name: 'drxhp8vhx', 
    api_key: '341522599126842', 
    api_secret: '-1LqPTfukFg0WnRQFnWAfufLiYQ' // Click 'View API Keys' above to copy your API secret
});


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
let cloudinary_Generated_Url_of_Image; 


app.post('/upload', async (req, res) => {
    console.log("Uploading data...");
  
    // Use multer to handle the upload
    upload(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
  
      // Path of the uploaded file
      const fileroute = req.file.path;
  
      try {
        // Upload to Cloudinary and get URL
        const cloudinaryUrl = await getfile_url(fileroute);
        res.json({ imageUrl: cloudinaryUrl }); // Return the Cloudinary image URL as a response
      } catch (uploadError) {
        console.error('Error uploading to Cloudinary:', uploadError);
        return res.status(500).json({ error: 'Error uploading image to Cloudinary' });
      }

      fs.unlink(fileroute, (deleteErr) => {
        if (deleteErr) {
          console.error('Error deleting local file:', deleteErr);
        } else {
          console.log('Local file deleted successfully');
        }
    })


    });

});
  
  // Helper function to upload image to Cloudinary and get URL
  async function getfile_url(fileroute) {
    try {
      const result = await cloudinary.uploader.upload(fileroute);
      console.log('Uploaded image URL:', result.secure_url); // Log the URL of the uploaded image
      cloudinary_Generated_Url_of_Image = result.secure_url;
      return result.secure_url; // Return the secure URL from Cloudinary
    } catch (error) {
      throw new Error('Error uploading image to Cloudinary');
    }
  }

app.post('/delete' ,async(req,res)=>{
    console.log("deleting data...");
    fs.unlink(fileroute, (err) => {
        if (err) {
          console.log("deleted the uploaded image")
        }})
})

app.post('/Analyse', async (req, res) => {
    console.log("Analysing data...");
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
        const prompt = req.body.message;
        
        // Call the function to fetch the image, convert it to Base64
        const result = await model.generateContent([
            prompt, 
            await fileToGenerativePart(cloudinary_Generated_Url_of_Image , "image/jpeg")
        ]);
        
        const responseText = await result.response.text();
        res.send(responseText);
        console.log(prompt, responseText);
    } catch (err) {
        console.error("Error in Analyse endpoint:", err);
        res.status(500).json({ error: err.message });
    }
});


async function fileToGenerativePart(imageUrl, mimeType) {
    try {
        
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });

        console.log("Image fetched successfully, response status:", response.status);
        console.log("Image size (in bytes):", response.data.length);

       
        const base64Data = Buffer.from(response.data, 'binary').toString('base64');
        console.log("Base64 Image Data:", base64Data);

        
        return {
            inlineData: {
                data: base64Data,
                mimeType: mimeType
            }
        };
    } catch (error) {
        console.error("Error fetching image from URL:", error);
        throw error; 
    }
};


app.listen(PORT,()=>{
    console.log("server running at port:" , PORT)
});
