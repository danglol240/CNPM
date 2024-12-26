import React, { useState, useEffect } from "react";
import { Input, Button, message, Select } from "antd";
import axios from "axios";
import "./EditVehicle.css";

const { Option } = Select;

const EditVehicle = ({ onClickCloseEdit, editData }) => {
  const [vehicleType, setVehicleType] = useState(editData.vehicleType || "");
  const [licensePlates, setLicensePlates] = useState(editData.licensePlates || []);
  const [roomNumber, setRoomNumber] = useState(editData.roomNumber || "");
  const [availableRooms, setAvailableRooms] = useState([]); // Khởi tạo là một mảng rỗng

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get("http://localhost:8080/vehicalsAddRoom");
        if (response.status === 200) {
          setAvailableRooms(response.data.dataRoom || []); // Đảm bảo dữ liệu là một mảng
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };
    fetchRooms();
  }, []);

  const handleLicensePlateChange = (index, value) => {
    const newLicensePlates = [...licensePlates];
    newLicensePlates[index] = value;
    setLicensePlates(newLicensePlates);
  };

  const addLicensePlateField = () => {
    setLicensePlates([...licensePlates, ""]);
  };

  const removeLicensePlateField = (index) => {
    const newLicensePlates = licensePlates.filter((_, i) => i !== index);
    setLicensePlates(newLicensePlates);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedVehicle = {
      roomNumber,
      vehicleType,
      licensePlates,
    };
    try {
      await axios.put(`http://localhost:8080/vehicals/${editData._id}`, updatedVehicle);
      message.success("Sửa thông tin phương tiện thành công");
      onClickCloseEdit();
    } catch (error) {
      console.error("Error updating vehicle:", error);
      message.error("Sửa thông tin phương tiện thất bại");
    }
  };

  const handleInnerClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="edit-vehicle" onClick={onClickCloseEdit}>
      <div className="edit-vehicle-child" onClick={handleInnerClick}>
        <h2>Chỉnh sửa thông tin phương tiện</h2>
        <form className="form-edit-vehicle" onSubmit={handleSubmit}>
          <div className="form-edit-vehicle-child">
            <div className="title-edit-vehicle">
              <label>Số phòng</label>
              <Select
                value={roomNumber}
                onChange={setRoomNumber}
                style={{ width: 110, marginLeft: 20 }}
              >
                {availableRooms.map((room) => (
                  <Option key={room} value={room}>
                    Phòng {room}
                  </Option>
                ))}
              </Select>
            </div>
            <div className="title-edit-vehicle">
              <label>Loại xe</label>
              <Select
                value={vehicleType}
                onChange={setVehicleType}
                style={{ width: 120, marginLeft: 20 }}
              >
                <Option value="Xe máy">Xe máy</Option>
                <Option value="Ô tô">Ô tô</Option>
              </Select>
            </div>
            <div className="title-edit-vehicle">
              <label>Biển số</label>
              {licensePlates.map((plate, index) => (
                <div key={index} style={{ display: "flex", marginBottom: "10px" }}>
                  <Input
                    placeholder="Nhập biển số"
                    value={plate}
                    onChange={(e) => handleLicensePlateChange(index, e.target.value)}
                    style={{ marginRight: "10px" }}
                  />
                  <Button type="danger" onClick={() => removeLicensePlateField(index)}>
                    Xóa
                  </Button>
                </div>
              ))}
              <Button type="dashed" onClick={addLicensePlateField}>
                Thêm biển số
              </Button>
            </div>
            <div className="btn-edit-vehicle-all">
              <Button
                className="btn-edit-child-1"
                type="primary"
                htmlType="submit"
              >
                Cập nhật
              </Button>
              <Button
                className="btn-edit-child-2"
                type="primary"
                onClick={onClickCloseEdit}
              >
                Hủy
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditVehicle;