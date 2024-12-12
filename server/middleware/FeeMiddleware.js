const FeeMiddleware = {
    createFee: (req, res, next) => {
      try {
        const { nameFee, typeFee, price, startDate, endDate, roomNumber } =
          req.body;
        if (
          !nameFee ||
          !typeFee ||
          !price ||
          !startDate ||
          !endDate ||
          !roomNumber
        )
          throw new Error("Vui lòng nhập đầy đủ thông tin");
        next();
      } catch (err) {
        res.status(500).send({
          message: err.message,
        });
      }
    },
  
    updateFee: (req, res, next) => {
      try {
        const {
          nameFee,
          typeFee,
          price,
          startDate,
          endDate,
          roomNumber,
          unpaidRooms,
        } = req.body;
        if (
          !nameFee ||
          !typeFee ||
          !price ||
          !startDate ||
          !endDate ||
          !roomNumber ||
          !unpaidRooms
        )
          throw new Error("Vui lòng nhập đầy đủ thông tin");
        next();
      } catch (err) {
        res.status(500).send({
          message: err.message,
        });
      }
    },
  };
  
  export default FeeMiddleware;