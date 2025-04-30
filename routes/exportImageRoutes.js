import express from 'express';
import multer from 'multer';
import { exportAngularFromImage } from '../controllers/exportImageController.js';

const router = express.Router();
const upload = multer({ dest: '/tmp/' });

router.post('/', upload.single('image'), exportAngularFromImage);

export default router;
