import multer from "multer";

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

// Limited to 5MB and only allows JPEG, PNG, WEBP, and GIF - Need to update depending on the client's info
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      
      
      
      
      cb(new Error(
        
        
        
        
        
        
        "Only JPEG, PNG, WEBP, and GIF files are allowed"));
      return;
    }



    


    
    cb(null, true);
  },
});
