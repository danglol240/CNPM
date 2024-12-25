import VehicalModel from "../model/VehicalModel.js";
import DepartmentModel from "../model/DepartmentModel.js";
const VehicalController = {
    createVehical: async (req, res) => {
        const { roomNumber, motorbikes, cars } = req.body;
    
        try {
          const newVehical = await VehicalModel.create({
            roomNumber,
            motorbikes,
            cars,
          });
          res.status(200).send({
            message: "Vehical created successfully",
            vehical: newVehical,
          });
        } catch (error) {
          console.error("Error creating vehical:", error);
          res.status(500).send({ message: "Internal server error" });
        }
      },

      updateVehical: async (req, res) => {
        const { id } = req.params;
        const { roomNumber, motorbikes, cars } = req.body;
    
        try {
          const updatedVehical = await VehicalModel.findByIdAndUpdate(
            id,
            { roomNumber, motorbikes, cars },
            { new: true }
          );
          if (!updatedVehical) {
            throw new Error("Vehical not found");
          }
          res.status(200).send({
            message: "Vehical updated successfully",
            vehical: updatedVehical,
          });
        } catch (error) {
          console.error("Error updating vehical:", error);
          res.status(500).send({ message: "Internal server error" });
        }
      },
    
      deleteVehical: async (req, res) => {
        const { id } = req.params;
    
        try {
          const deletedVehical = await VehicalModel.findByIdAndDelete(id);
          if (!deletedVehical) {
            throw new Error("Vehical not found");
          }
          res.status(200).send({
            message: "Vehical deleted successfully",
            vehical: deletedVehical,
          });
        } catch (error) {
          console.error("Error deleting vehical:", error);
          res.status(500).send({ message: "Internal server error" });
        }
      },
  getAllVehical: async (req, res) => {
    try {
      const vehicals = await VehicalModel.find();
      res.status(200).send({
        message: "Get all vehicals successfully",
        vehicals,
      });
    } catch (error) {
      console.error("Error getting vehicals:", error);
      res.status(500).send({ message: "Internal server error" });
    }
  },
  getRoomAddVehical: async (req, res) => {
    try {
      const roomAddPeople = await DepartmentModel.find({
        status: { $in: ["Đã thuê"] },
      });
      const roomNumbers = roomAddPeople.map((room) => room.roomNumber);
      res.status(200).send({ message: "successfully", dataRoom: roomNumbers });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },

};


export default VehicalController;
