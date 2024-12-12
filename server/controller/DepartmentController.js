import DepartmentModel from "../model/DepartmentModel.js";

const DepartmentController = {
  getAllDepartments: async (req, res) => {
    try {
      const departments = await DepartmentModel.find().populate("purchaser");
      const data = departments.map((department) => ({
        ...department.toObject(),
        purchaser: department.purchaser
          ? department.purchaser.namePeople
          : null,
      }));
      res.status(200).send({
        data,
      });
    } catch (err) {
      res.status(500).send({
        message: err.message,
      });
    }
  },

  createDepartment: async (req, res) => {
    try {
      const { floor, roomNumber, acreage, status } = req.body;
      await DepartmentModel.create({
        floor: floor,
        roomNumber: roomNumber,
        acreage: acreage,
        purchaser: null,
        status: status,
      });
      res.status(200).send({
        message: "create department successfully",
      });
    } catch (err) {
      res.status(500).send({
        message: err.message,
      });
    }
  },

  deleteDepartment: async (req, res) => {
    try {
      const { id } = req.params;
      const deleteData = await DepartmentModel.findById(id);
      if (deleteData.purchaser) {
        res.status(404).send({
          message: "Bạn chỉ có thể xóa phòng không ai ở",
        });
      } else {
        await DepartmentModel.findByIdAndDelete(id);
        res.status(200).send({
          message: "delete department successfully",
        });
      }
    } catch (err) {
      res.status(500).send({
        message: err.message,
      });
    }
  },

  updateDepartment: async (req, res) => {
    try {
      const { floor, roomNumber, acreage, status } = req.body;
      const { id } = req.params;
      await DepartmentModel.findByIdAndUpdate(id, {
        floor: floor,
        roomNumber: roomNumber,
        acreage: acreage,
        status: status,
      });
      res.status(200).send({
        message: "update department successfully",
      });
    } catch (err) {
      res.status(500).send({
        message: err.message,
      });
    }
  },
};

export default DepartmentController;
