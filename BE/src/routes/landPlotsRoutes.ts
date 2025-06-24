import express from 'express';
import {
  getAllLandPlots,
  getLandPlotById,
  createLandPlot,
  updateLandPlots,
  deleteLandPlot,
} from '../controllers/landPlotsController';

const router = express.Router();

router.get('/', getAllLandPlots);
router.get('/:id', getLandPlotById);
router.post('/', createLandPlot);
router.put('/:id', updateLandPlots);
router.delete('/:id', deleteLandPlot);

export default router;
