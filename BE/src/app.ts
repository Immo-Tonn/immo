import express, { Application, Request, Response, NextFunction } from "express";
import "dotenv/config";
import cors from "cors";
import connectDb from "./config/db";
import realEstateRoutes from "./routes/realEstateObjactsRoutes";
import imagesRoutes from "./routes/imagesRoutes";
import apartmentRoutes from "./routes/apartmentsRoutes";
import commercial_NonResidentialBuildingsRoutes from "./routes/commercial_NonResidentialBuildingsRoutes";
import landPlotRoutes from "./routes/landPlotsRoutes";
import residentialHousesRoutes from "./routes/residentialHousesRoutes";

const app: Application = express();
app.use(express.json());
app.use(cors());

app.use("/api/objects", realEstateRoutes);
app.use("/api/images", imagesRoutes);
app.use("/api/apartments", apartmentRoutes);
app.use(
  "/api/commercial_NonResidentialBuildings",
  commercial_NonResidentialBuildingsRoutes
);
app.use("/api/landPlots", landPlotRoutes);
app.use("/api/residentialHouses", residentialHousesRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Server error:", err.message);
  res.status(500).json({ message: "Serverfehler", error: err.message });
});

connectDb();

const PORT: number | string = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
