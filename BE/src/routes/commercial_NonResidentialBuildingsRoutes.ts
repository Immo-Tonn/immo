import express from 'express';
import {
  getAllCommercial_NonResidentialBuildings,
  getCommercial_NonResidentialBuildingById,
  createCommercial_NonResidentialBuildings,
  updateCommercial_NonResidentialBuildings,
  deleteCommercial_NonResidentialBuilding,
} from '../controllers/commercial_NonResidentialBuildingsController';

const router = express.Router();

router.get('/', getAllCommercial_NonResidentialBuildings);
router.get('/:id', getCommercial_NonResidentialBuildingById);
router.post('/', createCommercial_NonResidentialBuildings);
router.put('/:id', updateCommercial_NonResidentialBuildings);
router.delete('/:id', deleteCommercial_NonResidentialBuilding);

export default router;
