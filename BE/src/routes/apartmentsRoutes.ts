import express from 'express';
import {
  getAllApartments,
  getApartmentsById,
  createApartment,
  updateApartment,
  deleteApartment,
} from '../controllers/apartmentsController';

const router = express.Router();

router.get('/', getAllApartments);
router.get('/:id', getApartmentsById);
router.post('/', createApartment);
router.put('/:id', updateApartment);
router.delete('/:id', deleteApartment);

export default router;
