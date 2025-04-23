
import {Router} from "express";
import {
  getAllObjects,
  getObjectById,
  createObject,
  updateObject,
  deleteObject
} from "../controllers/realEstateObjectsController"; 

const router = Router();

// Получить все объекты
router.get("/", getAllObjects);

// Получить объект по ID
router.get("/:id", getObjectById);

// Создать новый объект
router.post("/", createObject);

// Обновить объект по ID
router.put("/:id", updateObject);

// Удалить объект по ID
router.delete("/:id", deleteObject);

export default router;
