import express from 'express';
import {
  getAllCommercial_NonResidentialBuildings,
  getCommercial_NonResidentialBuildingById,
  createCommercial_NonResidentialBuildings,
  updateCommercial_NonResidentialBuildings,
  deleteCommercial_NonResidentialBuilding,
} from '../controllers/commercial_NonResidentialBuildingsController';
import { protectObjectRoutes } from '../middleware/adminRouteMiddleware';
const router = express.Router();

router.get('/', getAllCommercial_NonResidentialBuildings);
router.get('/:id', getCommercial_NonResidentialBuildingById);
router.post('/', protectObjectRoutes, createCommercial_NonResidentialBuildings);
router.put(
  '/:id',
  protectObjectRoutes,
  updateCommercial_NonResidentialBuildings,
);
router.delete(
  '/:id',
  protectObjectRoutes,
  deleteCommercial_NonResidentialBuilding,
);

export default router;
