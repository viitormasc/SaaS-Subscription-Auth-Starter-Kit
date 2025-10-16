import multer from 'multer';
import path from 'path';

export default multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(null, false);
    }
    // let ext = path.extname(file.originalname);
    // if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
    //   cb(null, false);
    //   return;
    // }
    // cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
