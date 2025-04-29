import express, {Application, Request, Response, NextFunction} from "express";
import "dotenv/config"
import cors from "cors"
import connectDb from "./config/db";
import realEstateRoutes from "./routes/realEstateObjactsRoutes";
import imagesRoutes from './routes/imagesRoutes'

const app: Application = express()
app.use(express.json())
app.use(cors());

app.use("/objects", realEstateRoutes);
app.use('/images', imagesRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error("Server error:", err.message);
    res.status(500).json({ message: "Ошибка сервера", error: err.message });
  });

  connectDb()

const PORT : number | string = process.env.PORT || 3333

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})

  export default app;