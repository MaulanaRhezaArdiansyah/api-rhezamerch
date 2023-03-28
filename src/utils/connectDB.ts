import mongoose from "mongoose";
import CONFIG from "../config/environment";

mongoose
  .connect(`${CONFIG.db}`)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Could not connect to DB");
    console.log(error);
  });
