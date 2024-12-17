import mongoose from "mongoose";

const PeopleSchema = new mongoose.Schema({
  namePeople: String,
  phoneNumber: String,
  cccd: String,
  birthDate: Date,
  moveInDate: Date,
  gioitinh: String,
  email: String,
  roomNumber: Number, // Thêm roomNumber để lưu thông tin phòng
});

const PeopleModel = mongoose.model("peoples", PeopleSchema);

export default PeopleModel;
