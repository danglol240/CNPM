import mongoose from "mongoose";

const FeeSchema = new mongoose.Schema({
  nameFee: String,
  typeFee: String,
  price: Number,
  startDate: Date,
  endDate: Date,
  roomNumber: [{ type: mongoose.Schema.Types.ObjectId, ref: "departments" }],
  unpaidRooms: [{ type: mongoose.Schema.Types.ObjectId, ref: "departments" }],
});

const FeeModel = mongoose.model("fees", FeeSchema);

export default FeeModel;
