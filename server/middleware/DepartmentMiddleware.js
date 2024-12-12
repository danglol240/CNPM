const DepartmentMiddleware = {
    createDepartment: (req, res, next) => {
      try {
        const { floor, roomNumber, acreage, status } = req.body;
        if (!roomNumber || !floor || !acreage || !status)
          throw new Error("Vui lòng điền đầy đủ thông tin");
        next();
      } catch (err) {
        res.status(400).send({
          message: err.message,
        });
      }
    },
  };
  
  export default DepartmentMiddleware;