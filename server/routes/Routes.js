import express from "express";
import DepartmentController from "../controller/DepartmentController.js";
import FeeController from "../controller/FeeController.js";
import PeopleController from "../controller/PeopleController.js";
import DepartmentMiddleware from "../middleware/DepartmentMiddleware.js";
import PeopleMiddleware from "../middleware/PeopleMiddleware.js";
import FeeMiddleware from "../middleware/FeeMiddleware.js";

const routes = express.Router();

routes.get("/feeAddRoom", FeeController.getRoomAddFee);
routes.get("/fee", FeeController.getAll);
routes.post("/fee", FeeMiddleware.createFee, FeeController.createFee);
routes.put("/fee/:id", FeeMiddleware.updateFee, FeeController.updateFee);
routes.delete("/fee/:id", FeeController.deleteFee);
routes.delete("/department/:id", DepartmentController.deleteDepartment);
routes.get("/department", DepartmentController.getAllDepartments);
routes.post(
  "/department",
  DepartmentMiddleware.createDepartment,
  DepartmentController.createDepartment
);
routes.put(
  "/department/:id",
  DepartmentMiddleware.createDepartment,
  DepartmentController.updateDepartment
);
routes.delete("/fee/:id", DepartmentController.deleteDepartment);
routes.get("/peopleAddRoom", PeopleController.getRoomAddPeople);
routes.get("/people", PeopleController.getAll);
routes.get("/getPeopleFee/:id", PeopleController.getPeopleFee);
routes.post(
  "/people",
  PeopleMiddleware.createPeople,
  PeopleController.createPeople
);
routes.put(
  "/people/:id",
  PeopleMiddleware.updatePeople,
  PeopleController.updatePeople
);
routes.delete(
  "/people/:id",
  PeopleMiddleware.deletePeople,
  PeopleController.deletePeople
);

export default routes;
