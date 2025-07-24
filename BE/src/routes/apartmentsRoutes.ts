import express from 'express';
import {
  getAllApartments,
  getApartmentsById,
  createApartment,
  updateApartment,
  deleteApartment,
} from '../controllers/apartmentsController';
import { protectObjectRoutes } from '../middleware/adminRouteMiddleware';

const router = express.Router();

router.get('/', getAllApartments);
router.get('/:id', getApartmentsById);

router.post('/', protectObjectRoutes, createApartment);
router.put('/:id', protectObjectRoutes, updateApartment);
router.delete('/:id', protectObjectRoutes, deleteApartment);

export default router;
