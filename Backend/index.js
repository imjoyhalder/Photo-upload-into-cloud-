import express from "express"
import multer from 'multer'
import dotenv from "dotenv"
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from 'cloudinary'

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDNAME,
    api_key: process.env.APIKEY,
    api_secret: process.env.APISECRET
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: '24th-Dec-2025',
        format: async (req, file) => 'png', // supports promises as well
        public_id: (req, file) => file.fieldname + '-' + Date.now(),
    },
});

const uploads = multer({ storage: storage, limits: { fileSize: 50 * 1024 * 1024 } })

app.get('/', (req, res) => {
    res.status(200).send({
        success: true,
        message: 'server running successfully',
        path: req.path
    })
})

app.post('/upload', uploads.single('file'), (req, res)=>{
    console.log(req.file);
    res.send({success: true, message: 'file uploaded successfully', data: req?.file})
} )

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});