import express from 'express';
import {
  getAllResidentialHouses,
  getResidentialHousById,
  createResidentialHous,
  updateResidentialHous,
  deleteResidentialHous,
} from '../controllers/residentialHousesController';
import { protectObjectRoutes } from '../middleware/adminRouteMiddleware';
const router = express.Router();

router.get('/', getAllResidentialHouses);
router.get('/:id', getResidentialHousById);
router.post('/', protectObjectRoutes, createResidentialHous);
router.put('/:id', protectObjectRoutes, updateResidentialHous);
router.delete('/:id', protectObjectRoutes, deleteResidentialHous);

export default router;
