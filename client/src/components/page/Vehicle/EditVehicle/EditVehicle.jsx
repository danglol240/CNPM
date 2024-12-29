import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select, Button, message, Radio } from "antd";
import axios from "axios";

const { Option } = Select;

const EditVehicle = ({ onClickCloseEdit, editData }) => {
  const [vehicleType, setVehicleType] = useState(editData.vehicleType || "");
  const [licensePlates, setLicensePlates] = useState(editData.licensePlates || [""]);
  const [roomNumber, setRoomNumber] = useState(editData.roomNumber || "");
  const [rooms, setRooms] = useState([]);
  const [inputRoomType, setInputRoomType] = useState("select");
  const [motorbikes, setMotorbikes] = useState([]);
  const [cars, setCars] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get("http://localhost:8080/vehicalsAddRoom");
        if (response.status === 200) {
          setRooms(response.data.dataRoom || []);
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };
    fetchRooms();

    const fetchVehicles = async () => {
      try {
        const response = await axios.get("http://localhost:8080/vehicals");
        if (response.status === 200) {
          const vehicles = response.data.vehicals || [];
          const filteredRoomVehicles = vehicles.reduce(
            (acc, v) => ({
              ...acc,
              [v.roomNumber]: {
                motorbikes: v.motorbikes || [],
                cars: v.cars || [],
              },
            }),
            {}
          );
          setMotorbikes(filteredRoomVehicles[roomNumber]?.motorbikes || []);
          setCars(filteredRoomVehicles[roomNumber]?.cars || []);
        }
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };

    if (roomNumber) {
      fetchVehicles();
    }
  }, [roomNumber]);

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

  const removePlateFromList = (plate, type) => {
    if (type === "motorbike") {
      setMotorbikes(motorbikes.filter((item) => item !== plate));
    } else if (type === "car") {
      setCars(cars.filter((item) => item !== plate));
    }
  };

  const handleAddVehicle = () => {
    if (!vehicleType || !licensePlates.some((plate) => plate) || !roomNumber) {
      message.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    if (vehicleType === "Xe máy") {
      setMotorbikes([...motorbikes, ...licensePlates.filter((plate) => plate)]);
    } else if (vehicleType === "Ô tô") {
      setCars([...cars, ...licensePlates.filter((plate) => plate)]);
    }
    setLicensePlates([""]); // Reset các trường biển số
    message.success("Đã thêm xe vào danh sách!");
  };


  const handleSubmit = async () => {
    if (!roomNumber) {
      message.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
  
    const updatedVehicle = {
      roomNumber,
      motorbikes: vehicleType === "Xe máy" ? [...motorbikes, ...licensePlates.filter((plate) => plate)] : motorbikes,
      cars: vehicleType === "Ô tô" ? [...cars, ...licensePlates.filter((plate) => plate)] : cars,
    };
  
    try {
      const response = await axios.put(`http://localhost:8080/vehicals/${editData._id}`, updatedVehicle);
      message.success("Xác nhận thành công!");
      onClickCloseEdit();
    } catch (error) {
      console.error("Error submitting vehicles:", error.response?.data || error);
      message.error("Xác nhận thất bại!");
    }
  };

  return (
    <Modal
      title="Chỉnh sửa thông tin phương tiện"
      visible={true}
      onCancel={onClickCloseEdit}
      footer={null}
    >
      <Form layout="vertical">
        

        <Form.Item label="Loại xe">
          <Select
            placeholder="Chọn loại xe"
            value={vehicleType}
            onChange={setVehicleType}
            style={{ width: "100%" }}
          >
            <Option value="Xe máy">Xe máy</Option>
            <Option value="Ô tô">Ô tô</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Biển số">
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
        </Form.Item>

        <Form.Item>
        <Button type="default" onClick={handleAddVehicle} style={{ marginRight: "10px" }}>
            Thêm xe
          </Button>
          <Button type="primary" onClick={handleSubmit} style={{ marginRight: "10px" }}>
            Cập nhật
          </Button>
          <Button type="default" onClick={onClickCloseEdit}>
            Hủy
          </Button>
        </Form.Item>
      </Form>

      <div>
        <h3>Danh sách xe máy</h3>
        <ul>
          {motorbikes.map((plate, index) => (
            <li key={index} style={{ display: "flex", alignItems: "center" }}>
              {plate}
              <Button
                type="danger"
                size="small"
                style={{ marginLeft: "10px" }}
                onClick={() => removePlateFromList(plate, "motorbike")}
              >
                Xóa
              </Button>
            </li>
          ))}
        </ul>

        <h3>Danh sách ô tô</h3>
        <ul>
          {cars.map((plate, index) => (
            <li key={index} style={{ display: "flex", alignItems: "center" }}>
              {plate}
              <Button
                type="danger"
                size="small"
                style={{ marginLeft: "10px" }}
                onClick={() => removePlateFromList(plate, "car")}
              >
                Xóa
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  );
};

export default EditVehicle;
