import DepartmentModel from "../model/DepartmentModel.js";
import FeeModel from "../model/FeeModel.js";

const PeopleMiddleware = {
  createPeople: (req, res, next) => {
    try {
      const {
        namePeople,
        phoneNumber,
        cccd,
        birthDate,
        gioitinh,
        email,
        roomNumber,
      } = req.body;
      if (
        !namePeople ||
        !phoneNumber ||
        !cccd ||
        !birthDate ||
        !gioitinh ||
        !email ||
        !roomNumber
      ) {
        return res.status(400).send({
          message: "Vui lòng nhập đầy đủ thông tin",
        });
      }
      next();
    } catch (err) {
      res.status(500).send({
        message: err.message,
      });
    }
  },

  updatePeople: async (req, res, next) => {
    const { id } = req.params;
    try {
      const {
        namePeople,
        phoneNumber,
        cccd,
        birthDate,
        gioitinh,
        email,
        moveInDate,
        roomNumber,
      } = req.body;
      if (
        !namePeople ||
        !phoneNumber ||
        !cccd ||
        !birthDate ||
        !gioitinh ||
        !email ||
        !moveInDate
      ) {
        return res.status(400).send({
          message: "Vui lòng nhập đầy đủ thông tin",
        });
      }
      if (roomNumber) {
        // Find all rooms associated with the user
        const rooms = await DepartmentModel.find({ purchaser: id }).lean();
        const roomIds = rooms.map((room) => room._id);

        // Find any fees with unpaid rooms that match the user's room IDs
        const unpaidFees = await FeeModel.find({
          unpaidRooms: { $in: roomIds },
        }).lean();

        // If there are any unpaid fees, send an error response
        if (unpaidFees.length > 0) {
          return res.status(400).json({
            message:
              "Không thể thay số phòng người này khi họ chưa thanh toán hết các khoản phí",
          });
        }
      }
      next();
    } catch (err) {
      next(err);
    }
  },

  deletePeople: async (req, res, next) => {
    const { id } = req.params; // Assuming you pass the user ID as a URL parameter
    try {
      // Find all rooms associated with the user
      const rooms = await DepartmentModel.find({ purchaser: id }).lean();
      const roomIds = rooms.map((room) => room._id);

      // Find any fees with unpaid rooms that match the user's room IDs
      const unpaidFees = await FeeModel.find({
        unpaidRooms: { $in: roomIds },
      }).lean();

      // If there are any unpaid fees, send an error response
      if (unpaidFees.length > 0) {
        return res.status(400).json({
          message:
            "Không thể xóa người này khi họ chưa thanh toán hết các khoản phí",
        });
      }

      // If there are no unpaid fees, continue to the next middleware or route handler
      next();
    } catch (err) {
      next(err);
    }
  },
};

export default PeopleMiddleware;
