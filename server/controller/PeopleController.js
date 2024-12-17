import mongoose from "mongoose";
import PeopleModel from "../model/PeopleModel.js";
import DepartmentModel from "../model/DepartmentModel.js";
import FeeModel from "../model/FeeModel.js";

const PeopleController = {
  getAll: async (req, res) => {
    try {
      const data = await PeopleModel.aggregate([
        {
          $lookup: {
            from: "departments", // Bảng phòng
            localField: "roomNumber", // Liên kết bằng roomNumber
            foreignField: "roomNumber",
            as: "departments",
          },
        },
        {
          $unwind: {
            path: "$departments",
            preserveNullAndEmptyArrays: true, // Hiển thị ngay cả khi phòng không liên kết
          },
        },
        {
          $project: {
            namePeople: 1,
            phoneNumber: 1,
            cccd: 1,
            birthDate: 1,
            moveInDate: 1,
            gioitinh: 1,
            email: 1,
            "departments.roomNumber": 1, // Hiển thị roomNumber
          },
        },
      ]);
  
      res.status(200).send({ data });
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu cư dân:", error);
      res.status(500).send({ message: "Internal server error" });
    }
  },

  createPeople: async (req, res) => {
    const {
      namePeople,
      phoneNumber,
      cccd,
      birthDate,
      gioitinh,
      email,
      roomNumber,
    } = req.body;
    const moveInDate = new Date();
  
    try {
      // Tạo mới một người và lưu luôn roomNumber
      const newPeople = await PeopleModel.create({
        namePeople,
        phoneNumber,
        cccd,
        birthDate,
        gioitinh,
        email,
        moveInDate,
        roomNumber, // Thêm roomNumber để liên kết với phòng
      });
  
      // Nếu phòng chưa được thuê, cập nhật purchaser
      const room = await DepartmentModel.findOne({ roomNumber: roomNumber });
      if (!room) {
        throw new Error("Phòng không tồn tại.");
      }
  
      if (!room.purchaser) {
        room.purchaser = newPeople._id;
        room.status = "Đã thuê";
        await room.save();
      }
  
      res.status(201).send({
        message: "Thêm cư dân thành công.",
        people: newPeople,
        room: room,
      });
    } catch (error) {
      console.error("Lỗi khi thêm cư dân và cập nhật phòng:", error);
      res.status(500).send({ message: "Đã xảy ra lỗi. Vui lòng thử lại sau." });
    }
  },

  updatePeople: async (req, res) => {
    const {
      namePeople,
      phoneNumber,
      cccd,
      birthDate,
      gioitinh,
      email,
      roomNumber,
    } = req.body;
  
    const { id } = req.params; // ID của người cần cập nhật
  
    try {
      // Lấy thông tin người hiện tại để kiểm tra phòng cũ
      const existingPerson = await PeopleModel.findById(id);
      if (!existingPerson) {
        throw new Error("Người cần cập nhật không tồn tại.");
      }
  
      const currentRoomNumber = existingPerson.roomNumber; // Lấy phòng hiện tại
  
      // Cập nhật thông tin người
      const updatedPeople = await PeopleModel.findByIdAndUpdate(
        id,
        {
          namePeople,
          phoneNumber,
          cccd,
          birthDate,
          gioitinh,
          email,
          roomNumber, // Cập nhật roomNumber
        },
        { new: true } // Trả về dữ liệu sau khi cập nhật
      );
  
      let oldRoom = null;
      let newRoom = null;
  
      // Nếu người đã có phòng và phòng cũ khác phòng mới
      if (currentRoomNumber && currentRoomNumber !== roomNumber) {
        // Xóa thông tin chủ sở hữu khỏi phòng cũ
        oldRoom = await DepartmentModel.findOneAndUpdate(
          { roomNumber: currentRoomNumber, purchaser: id },
          { purchaser: null, status: "Trống" }
        );
      }
  
      // Nếu có phòng mới cần cập nhật
      if (roomNumber) {
        newRoom = await DepartmentModel.findOneAndUpdate(
          { roomNumber: roomNumber }, // Tìm phòng mới theo roomNumber
          { purchaser: id, status: "Đã thuê" }, // Cập nhật chủ sở hữu
          { new: true } // Trả về dữ liệu sau khi cập nhật
        );
  
        if (!newRoom) {
          throw new Error("Phòng mới không tồn tại hoặc đã được thuê.");
        }
      }
  
      res.status(200).send({
        message: "Cập nhật thông tin người và phòng thành công.",
        people: updatedPeople,
        oldRoom: oldRoom,
        newRoom: newRoom,
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin người và phòng:", error);
      res.status(500).send({ message: "Đã xảy ra lỗi. Vui lòng thử lại sau." });
    }
  },

  deletePeople: async (req, res) => {
    const { id } = req.params;

    try {
      const deletedPerson = await PeopleModel.findByIdAndDelete(id);
      if (!deletedPerson) {
        throw new Error("Person not found");
      }

      const oldRoom = await DepartmentModel.findOneAndUpdate(
        { purchaser: id },
        { purchaser: null, status: "Trống" }
      );

      res.status(200).send({
        message: "Person and associated room deleted successfully",
        person: deletedPerson,
        room: oldRoom,
      });
    } catch (error) {
      console.error(
        "Error occurred while deleting person and updating room:",
        error
      );
      res.status(500).send({ message: "Internal server error" });
    }
  },

  getRoomAddPeople: async (req, res) => {
    try {
      const roomAddPeople = await DepartmentModel.find({
        status: { $in: ["Trống", "Đã thuê"] },
      });
      const roomNumbers = roomAddPeople.map((room) => room.roomNumber);
      res.status(200).send({ message: "successfully", dataRoom: roomNumbers });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },

  getPeopleFee: async (req, res) => {
    const { id } = req.params;

    try {
      // Lấy thông tin của người và chuyển đổi sang plain JavaScript object
      const people = await PeopleModel.findById(id).lean();
      if (!people) {
        return res.status(404).json({ message: "Không tìm thấy người này." });
      }

      // Lấy danh sách các phòng mà người này đã mua
      const rooms = await DepartmentModel.find({ purchaser: id }).lean();
      const roomIds = rooms.map((room) => room._id);

      // Lấy các khoản phí liên quan đến các phòng này và chuyển đổi sang plain JavaScript object
      const feePeople = await FeeModel.find({ roomNumber: { $in: roomIds } })
        .populate("roomNumber unpaidRooms")
        .lean();

      // Kiểm tra nếu feePeople không phải là một mảng
      if (!Array.isArray(feePeople)) {
        return res.status(500).json({
          message: "Lỗi dữ liệu: Không thể lấy danh sách các khoản phí.",
        });
      }

      // Thêm namePeople và status vào từng đối tượng trong mảng feePeople
      const data = feePeople.map((fee) => {
        // Kiểm tra xem unpaidRooms có giá trị không null và không phải là undefined
        const status =
          fee.unpaidRooms &&
          fee.unpaidRooms.some(
            (room) => room && room.purchaser && room.purchaser.equals(id)
          )
            ? "Chưa đóng"
            : "Đã đóng";

        return {
          ...fee,
          namePeople: people.namePeople,
          status,
        };
      });

      // Trả về kết quả
      return res.status(200).json({
        data: data,
      });
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người và các khoản phí:", error);
      return res
        .status(500)
        .json({ message: "Đã xảy ra lỗi. Vui lòng thử lại sau." });
    }
  },
};

export default PeopleController;
