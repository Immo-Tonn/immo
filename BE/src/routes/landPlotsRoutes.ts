import express from 'express';
import {
  getAllLandPlots,
  getLandPlotById,
  createLandPlot,
  updateLandPlots,
  deleteLandPlot,
} from '../controllers/landPlotsController';
import { protectObjectRoutes } from "../middleware/adminRouteMiddleware";

const router = express.Router();

router.get("/", getAllLandPlots);
router.get("/:id", getLandPlotById);
router.post("/", protectObjectRoutes, createLandPlot);
router.put("/:id", protectObjectRoutes, updateLandPlots);
router.delete("/:id", protectObjectRoutes, deleteLandPlot);

export default router;
