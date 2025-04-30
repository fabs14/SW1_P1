import express from 'express';
import { exportAngularProject } from '../controllers/exportAngularController.js';

const router = express.Router();

router.post('/', exportAngularProject);

export default router;
