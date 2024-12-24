import mongoose from "mongoose";

const VehicleSchema = new mongoose.Schema({
  roomNumber: Number,
  motorbikes: [{ type: String }],
  cars: [{ type: String }]
});

const VehicleModel = mongoose.model("vehicles", VehicleSchema);

export default VehicleModel;
