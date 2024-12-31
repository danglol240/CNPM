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
  
// Kiểm tra nếu số lượng người trong phòng lớn hơn 1 và id là purchaser id thì không thể update phòng
if (currentRoomNumber && currentRoomNumber !== roomNumber) {
  const currentRoom = await DepartmentModel.findOne({ roomNumber: currentRoomNumber });
  if (currentRoom && currentRoom.purchaser.toString() === id) {
    const occupants = await PeopleModel.countDocuments({ roomNumber: currentRoomNumber });
    if (occupants > 1) {
      return res.status(400).send({
        message: "Không thể cập nhật phòng nếu số lượng người trong phòng lớn hơn 1 và người này là chủ sở hữu.",
      });
    }
  }
}

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
  
      // Nếu người đã có phòng và phòng cũ khác phòng mới và không còn ai ở phòng cũ
      if (currentRoomNumber && currentRoomNumber !== roomNumber) {
        const occupants = await PeopleModel.countDocuments({ roomNumber: currentRoomNumber });
        if (occupants === 0) {
          // Xóa thông tin chủ sở hữu khỏi phòng cũ
          oldRoom = await DepartmentModel.findOneAndUpdate(
        { roomNumber: currentRoomNumber, purchaser: id },
        { purchaser: null, status: "Trống" }
          );
        }
      }
      
  
      if (roomNumber) {
        const newRoom = await DepartmentModel.findOne({ roomNumber });
        if (newRoom) {
          if (!newRoom.purchaser) {
        newRoom.purchaser = id;
        newRoom.status = "Đã thuê";
        await newRoom.save();
          }
        } else {
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
      // Kiểm tra xem người này có phải là chủ sở hữu phòng không
      const currentPerson = await PeopleModel.findById(id);
      if (!currentPerson) {
        return res.status(404).send({ message: "Người dùng không tồn tại" });
      }
  
      // Tìm phòng hiện tại của người này
      const currentRoom = await DepartmentModel.findOne({ purchaser: id });
      if (currentRoom) {
        // Đếm số lượng người đang sống trong phòng
        const occupants = await PeopleModel.countDocuments({
          roomNumber: currentRoom.roomNumber,
        });
        
        // Nếu phòng có hơn 1 người, không cho phép xóa chủ sở hữu
        if (occupants > 1) {
          return res.status(400).send({
            message: "Không thể xóa chủ sở hữu nếu phòng còn hơn 1 người",
          });
        }
  
        // Cập nhật phòng về trạng thái "Trống" nếu chủ sở hữu bị xóa
        await DepartmentModel.findByIdAndUpdate(currentRoom._id, {
          purchaser: null,
          status: "Trống",
        });
      }
  
      // Xóa người dùng
      const deletedPerson = await PeopleModel.findByIdAndDelete(id);
      if (!deletedPerson) {
        throw new Error("Người dùng không tồn tại");
      }
  
      res.status(200).send({
        message: "Người dùng và thông tin phòng liên quan đã được xóa thành công",
        person: deletedPerson,
        room: currentRoom || null,
      });
    } catch (error) {
      console.error(
        "Lỗi khi xóa người dùng và cập nhật phòng:",
        error
      );
      res.status(500).send({ message: "Lỗi hệ thống" });
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
