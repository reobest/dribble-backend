const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const { v2: cloudinary } = require('cloudinary');
const dotenv = require('dotenv');
const app = express();
const port = 4001; 
dotenv.config();
app.use(cors({
  origin:['http://localhost:3000','https://lively-lebkuchen-d73979.netlify.app'],
  credentials:true,
  optionsSuccessStatus:200,
}))
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
  });
  const storage = multer.diskStorage({
    filename: function(req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
  const upload = multer({ storage });

  app.post('/upload', upload.single('image'), async (req, res) => {
    try {
      const result = await cloudinary.uploader.upload(req.file.path);
      res.json({ imageUrl: result.secure_url });
    } catch (error) {
      console.error('Error uploading image:', error);
      res.status(500).json({ error: 'Failed to upload image' });
    }
  });

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});