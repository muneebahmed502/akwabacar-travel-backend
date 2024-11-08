import mongoose from "mongoose";
import { MONGO_URI } from "./enviroment.mjs";
mongoose.connect(MONGO_URI);
export default  mongoose


