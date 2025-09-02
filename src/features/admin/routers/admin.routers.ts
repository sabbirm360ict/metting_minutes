import multer from 'multer';
import AbstractRouter from '../../../abstract/abstract.router';
import AdminControllers from '../controllers/admin.controllers';
import path from 'path';
import fs from 'fs';

const uploadPath = path.resolve('uploads');
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

class AdminRouter extends AbstractRouter {
  private controllers = new AdminControllers();
  constructor() {
    super();
    this.callRouter();
  }

  private callRouter() {
    this.router.post(
      '/process-audio',
      upload.single('file'),
      this.controllers.processAudio
    );
  }
}
export default AdminRouter;
