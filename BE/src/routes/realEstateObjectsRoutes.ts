import { Router } from 'express';
import {
  getAllObjects,
  getObjectById,
  createObject,
  updateObject,
  deleteObject,
} from '../controllers/realEstateObjectsController';

const router = Router();

router.get('/', getAllObjects);
router.get('/:id', getObjectById);
router.post('/', createObject);
router.put('/:id', updateObject);
router.delete('/:id', deleteObject);

export default router;
