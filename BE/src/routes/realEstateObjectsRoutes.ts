import { Router } from "express";
import {
  getAllObjects,
  getObjectById,
  createObject,
  updateObject,
  deleteObject,
} from "../controllers/realEstateObjectsController";
import { protectObjectRoutes } from "../middleware/adminRouteMiddleware";

const router = Router();

// Get all objects
router.get("/", getAllObjects);

// Get object by ID
router.get("/:id", getObjectById);

// Create a new object
router.post("/", protectObjectRoutes, createObject);

// Update object by ID
router.put("/:id", protectObjectRoutes, updateObject);

// Delete object by ID
router.delete("/:id", protectObjectRoutes, deleteObject);

export default router;
