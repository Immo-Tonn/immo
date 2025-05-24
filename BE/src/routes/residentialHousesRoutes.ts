import express from 'express';
import {
  getAllResidentialHouses,
  getResidentialHousById,
  createResidentialHous,
  updateResidentialHous,
  deleteResidentialHous,
} from '../controllers/residentialHousesController';

const router = express.Router();

router.get('/', getAllResidentialHouses);
router.get('/:id', getResidentialHousById);
router.post('/', createResidentialHous);
router.put('/:id', updateResidentialHous);
router.delete('/:id', deleteResidentialHous);

export default router;
