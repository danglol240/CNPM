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
            from: "departments",
            localField: "_id",
            foreignField: "purchaser",
            as: "departments",
          },
        },
        {
          $unwind: {
            path: "$departments",
            preserveNullAndEmptyArrays: true,
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
            "departments.roomNumber": 1,
          },
        },
      ]);

      res.status(200).send({ data });
    } catch (error) {
      console.error("Error occurred while fetching people with rooms:", error);
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
      // Tạo mới một người
      const newPeople = await PeopleModel.create([
        {
          namePeople,
          phoneNumber,
          cccd,
          birthDate,
          gioitinh,
          email,
          moveInDate,
        },
      ]);

      // Cập nhật phòng với thông tin chủ sở hữu mới
      const updatedRoom = await DepartmentModel.findOneAndUpdate(
        { roomNumber: roomNumber },
        { purchaser: newPeople[0]._id, status: "Đã thuê" }
      );

      if (!updatedRoom) {
        throw new Error("Room not found or already rented");
      }

      // Commit transaction

      res.status(201).send({
        message: "Person created and room updated successfully",
        people: newPeople[0],
        room: updatedRoom,
      });
    } catch (error) {
      // Nếu có lỗi, rollback transaction
      await session.abortTransaction();
      session.endSession();
      console.error(
        "Error occurred while creating person and updating room:",
        error
      );
      res.status(500).send({ message: "Internal server error" });
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
      moveInDate,
    } = req.body;

    const { id } = req.params;

    try {
      // Cập nhật thông tin người
      const updatedPeople = await PeopleModel.findByIdAndUpdate(id, {
        namePeople,
        phoneNumber,
        cccd,
        birthDate,
        gioitinh,
        email,
        moveInDate,
      });

      if (!updatedPeople) {
        throw new Error("Person not found");
      }

      let oldRoom = null;
      let updatedRoom = null;

      if (roomNumber) {
        // Xóa thông tin chủ sở hữu ở phòng cũ
        oldRoom = await DepartmentModel.findOneAndUpdate(
          { purchaser: id },
          { purchaser: null, status: "Trống" }
        );

        // Cập nhật phòng với thông tin chủ sở hữu mới
        updatedRoom = await DepartmentModel.findOneAndUpdate(
          { roomNumber: roomNumber },
          { purchaser: id, status: "Đã thuê" }
        );

        if (!updatedRoom) {
          throw new Error("Room not found or already rented");
        }
      }

      res.status(200).send({
        message: "Person updated and room updated successfully",
        people: updatedPeople,
        oldRoom: oldRoom,
        newRoom: updatedRoom,
      });
    } catch (error) {
      console.error(
        "Error occurred while updating person and updating room:",
        error
      );
      res.status(500).send({ message: "Internal server error" });
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
      const roomAddPeople = await DepartmentModel.find({ status: "Trống" });
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