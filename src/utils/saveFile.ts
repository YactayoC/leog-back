import multer from "multer";

const storageSaveF = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const sanitizedFilename = file.originalname.replace(/\\/g, "/"); 
    cb(null, sanitizedFilename); 
  },
});

export default storageSaveF;