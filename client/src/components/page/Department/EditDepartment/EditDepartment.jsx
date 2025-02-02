import React, { useState ,useEffect} from "react";
import axios from "axios";
import "./EditDepartment.css";
import { Input, Button, Select, message } from "antd";

const { Option } = Select;

const EditDepartment = ({ onClickCloseEdit, editData }) => {
  const [value, setValue] = useState({
    floor: editData.floor,
    roomNumber: editData.roomNumber,
    acreage: editData.acreage,
    purchaser: editData.purchaser,
    status: editData.status,
  });

  const [dataPeople, setDataPeople] = useState([]);

  useEffect(() => {
    const fetchDataPeople = async () => {
      try {
        const { data } = await axios.get("http://localhost:8080/people");
        setDataPeople(data.data); // Lưu danh sách người
      } catch (error) {
        console.error("Error fetching people data:", error);
      }
    };
    fetchDataPeople();
  }, []);


  console.log(editData.purchaser);
 
  
  const onChangeValue = (item) => (e) => {
    setValue({ ...value, [item]: e.target.value });
  };

  const onChangeStatus = (status) => {
    setValue({ ...value, status: status });
  };

  const submit = async (e) => {
    e.preventDefault();
    const newDepartment = {
      ...value,
    };
    try {
      await axios.put(
        `http://localhost:8080/department/${editData._id}`,
        newDepartment
      );
      message.success("Sửa phòng thành công");
      // Có thể thêm logic để đóng form sau khi thêm thành công
    } catch (error) {
      console.error(error);
      message.error("Lỗi, xin vui lòng thử lại");
    }
    setValue({
      floor: "",
      roomNumber: "",
      acreage: "",
      purchaser: "",
      status: "",
    });
    onClickCloseEdit();
  };

  const handleInnerClick = (e) => {
    e.stopPropagation();
  };

  const [dataFee, setDataFee] = useState([]);
  useEffect(() => {
    const getDataRoom = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8080/getPeopleFee/${editData.purchaser}`
        );
        setDataFee(data.data);
      } catch (error) {
        console.log("Error fetching room data:", error);
      }
    };
    getDataRoom();
  }, []);

  const countPeopleInRoom = (roomNumber) => {
    return dataPeople.filter((person) => person.departments.roomNumber === roomNumber).length;
  };
  
  const [roomVehicleCounts, setRoomVehicleCounts] = useState({});

useEffect(() => {
  const fetchVehicals = async () => {
    try {
      const { data } = await axios.get("http://localhost:8080/vehicals");
      const vehicals = data.vehicals;

      // Biến lưu trữ số lượng xe theo số phòng
      const roomVehicleCounts = {};

      vehicals.forEach((vehical) => {
        const roomNumber = vehical.roomNumber;

        // Nếu chưa có số phòng trong đối tượng, khởi tạo
        if (!roomVehicleCounts[roomNumber]) {
          roomVehicleCounts[roomNumber] = { motorbikeCount: 0, carCount: 0 };
        }

        // Cộng số xe máy và ô tô vào số phòng tương ứng
        roomVehicleCounts[roomNumber].motorbikeCount += vehical.motorbikes.length;
        roomVehicleCounts[roomNumber].carCount += vehical.cars.length;
      });

      // Cập nhật trạng thái tổng xe
      setRoomVehicleCounts(roomVehicleCounts);

      // Thêm console.log để kiểm tra dữ liệu
      console.log("Room Vehicle Counts:", roomVehicleCounts);
    } catch (error) {
      console.error("Error fetching vehicals data:", error);
    }
  };

  fetchVehicals();
}, []);

const checkPrice = (item) => {
  const roomNumberFee = item.roomNumber.find(
    (e) => e.purchaser === editData.purchaser
  );
  if (
    item.typeFee.trim() === "Phí phòng" &&
    roomNumberFee &&
    roomNumberFee.acreage
  ) {
    return item.price * roomNumberFee.acreage;
  } else if (
    item.typeFee.trim() === "Phí tính theo người" &&
    roomNumberFee
  ) {
    return item.price * countPeopleInRoom(roomNumberFee.roomNumber);
  } else if (
    item.typeFee.trim() === "Phí phương tiện" &&
    roomNumberFee
  ) {
    const vehicleCounts = roomVehicleCounts[roomNumberFee.roomNumber] || { motorbikeCount: 0, carCount: 0 };
    return item.price * vehicleCounts.motorbikeCount * 1/5 + item.price * vehicleCounts.carCount;
  } else {
    return item.price;
  }
};
  



  const getStatusStyle = (status) => {
    return status === "Đã đóng"
      ? { color: "green", fontWeight: "bold" }
      : { color: "red", fontWeight: "bold" };
  };
  
  const formatDateString = (dateString) => {
    if (!dateString) return "";
    const formattedDate = dateString.slice(0, 10);
    return formattedDate;
  };


  return (
    <div className="plus-department" onClick={onClickCloseEdit}>
      <div className="plus-department-child" onClick={handleInnerClick}>
        <form className="form-plus-department" onSubmit={submit}>
          <h2>Sửa thông tin phòng {editData.roomNumber}</h2>
          <div className="title-input-plus-department">
            <label>Tầng</label>
            <Input value={value.floor} onChange={onChangeValue("floor")} />
          </div>
          <div className="title-input-plus-department">
            <label>Số phòng</label>
            <Input
              value={value.roomNumber}
              onChange={onChangeValue("roomNumber")}
            />
          </div>
          <div className="title-input-plus-department">
            <label>Diện tích</label>
            <Input value={value.acreage} onChange={onChangeValue("acreage")} />
          </div>
          <div className="title-input-plus-department">
            <label>Chủ sở hữu</label>
            <Input
              value={
                dataPeople.find((person) => person._id === value.purchaser)?.namePeople ||
                "Không xác định"
              }
              disabled
            />
          </div>
          <div className="title-input-plus-department">
            <label>Trạng thái</label>
            <Select
              value={value.status}
              onChange={onChangeStatus}
              style={{ width: 120 }}
              disabled
            >
              <Option value="Trống">Trống</Option>
              <Option value="Đã thuê">Đã thuê</Option>
            </Select>
          </div>
          <h3>Các khoản phí căn hộ</h3>
          <table className="table-container table-edit-people">
            <thead>
              <tr>
                <th style={{width: "10%"}}>STT</th>
                <th style={{width: "30%"}}>Tên khoản phí</th>
                <th style={{width: "20%"}}>Số tiền</th>
                <th style={{width: "20%"}}>Ngày hết hạn</th>
                <th style={{width: "20%"}}>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(dataFee) && dataFee.length > 0 ? (
                dataFee.map((item, index) => (
                  <tr key={item._id}>
                    <td  style={{width: "10%"}}>{index + 1}</td>
                    <td  style={{width: "30%"}}>{item.nameFee}</td>
                    <td  style={{width: "20%"}}>
                      {checkPrice(item)
                        ? checkPrice(item).toLocaleString("vi-VN") + "đ"
                        : ""}
                    </td>
                    <td  style={{width: "20%"}}>{formatDateString(item.endDate)}</td>
                    <td style={{...getStatusStyle(item.status), width:"20%"}} >{item.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">Không có khoản phí nào cho căn hộ này</td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="btn-plus-department-all">
            <Button
              className="btn-plus-child-1"
              type="primary"
              htmlType="submit"
            >
              Cập nhật
            </Button>
            <Button
              className="btn-plus-child-2"
              type="primary"
              onClick={onClickCloseEdit}
            >
              Hủy
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDepartment;
