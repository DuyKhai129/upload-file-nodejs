const express = require("express");
const path = require("path");
const crypto = require("crypto");
const multer = require('multer');
const mongoose = require('mongoose');
const {GridFsStorage} = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.set("view engine","ejs");

//Mongo URI

const mongoURI = 'mongodb+srv://henry:duykhai99@cluster0.yo9wflm.mongodb.net/?retryWrites=true&w=majority';
const conn = mongoose.createConnection(mongoURI);
// init gfs
let gfs;
conn.once("open", () => {
  // init stream
  gfs = Grid(conn.db,mongoose.mongo);
  gfs.collection("uploads");
});

// Storage
const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString("hex") + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: "uploads"
          };
          resolve(fileInfo);
        });
      });
    }
  });
  
  const upload = multer({ storage });

app.get("/",(req,res)=>{
    res.render("index");
}) 
app.post("/upload",upload.single("file"),(req,res)=>{
    res.json({file : req.file})
})
const port = 5000;
app.listen(port,()=> console.log(`server started on port ${port}`));