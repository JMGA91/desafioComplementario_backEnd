import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "profileImage") {
      cb(null, "public/img/profiles/");
    } else if (file.fieldname === "productImage") {
      cb(null, "public/img/products/");
    } else {
      cb(null, "public/img/documents/");
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

export const uploader = multer({ storage: storage });