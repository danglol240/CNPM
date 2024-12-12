import FeeModel from "../model/FeeModel.js";
import DepartmentModel from "../model/DepartmentModel.js";

const FeeController = {
  createFee: async (req, res) => {
    const { nameFee, typeFee, price, startDate, endDate, roomNumber } =
      req.body;
    try {
      // Find department documents based on room numbers
      const departments = await DepartmentModel.find({
        roomNumber: { $in: roomNumber },
      });

      // Extract ObjectId of departments
      const roomIds = departments.map((department) => department._id);

      // Create new fee with roomIds
      const newFee = await FeeModel.create({
        nameFee,
        typeFee,
        price,
        startDate,
        endDate,
        roomNumber: roomIds,
        unpaidRooms: roomIds,
      });

      res.status(201).send({ message: "Fee created successfully", newFee });
    } catch (error) {
      console.error("Error creating fee:", error);
      res.status(500).send({ error: "Could not create fee" });
    }
  },

  getAll: async (req, res) => {
    try {
      const fees = await FeeModel.find().populate("roomNumber unpaidRooms");
      const data = fees.map((fee) => {
        const roomNumbers = fee.roomNumber.map((room) => room.roomNumber);
        const unpaidRoom = fee.unpaidRooms.map((room) => room.roomNumber);
        return {
          ...fee._doc,
          roomNumber: roomNumbers,
          unpaidRooms: unpaidRoom, // Nếu cần
        };
      });
      res.status(200).send({
        message: "get data successfully",
        data: data,
      });
    } catch (error) {
      res.status(500).send({ message: error });
    }
  },

  deleteFee: async (req, res) => {
    const { id } = req.params;
    try {
      await FeeModel.findByIdAndDelete(id);
      res.status(200).send({ message: "delete fee successfully" });
    } catch (error) {
      res.status(500).send({
        message: error,
      });
    }
  },

  updateFee: async (req, res) => {
    const {
      nameFee,
      typeFee,
      price,
      startDate,
      endDate,
      roomNumber,
      unpaidRooms,
    } = req.body;
    const { id } = req.params;
    try {
      // Find department documents based on room numbers
      const departments = await DepartmentModel.find({
        roomNumber: { $in: roomNumber },
      });
      const departmentUnpaid = await DepartmentModel.find({
        roomNumber: { $in: unpaidRooms },
      });

      // Extract ObjectId of departments
      const roomIds = departments.map((department) => department._id);
      const roomIdsUnpaid = departmentUnpaid.map(
        (department) => department._id
      );

      // Create new fee with roomIds
      const updateFee = await FeeModel.findByIdAndUpdate(id, {
        nameFee: nameFee,
        typeFee: typeFee,
        price: price,
        startDate: startDate,
        endDate: endDate,
        roomNumber: roomIds,
        unpaidRooms: roomIdsUnpaid,
      });

      res.status(200).send({ message: "Fee updated successfully", updateFee });
    } catch (error) {
      console.error("Error creating fee:", error);
      res.status(500).send({ error: "Could not create fee" });
    }
  },

  getRoomAddFee: async (req, res) => {
    try {
      const roomAddFee = await DepartmentModel.find({ status: "Đã thuê" });
      const roomNumbers = roomAddFee.map((room) => room.roomNumber);
      res.status(200).send({ message: "successfully", dataRoom: roomNumbers });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },
};

export default FeeController;