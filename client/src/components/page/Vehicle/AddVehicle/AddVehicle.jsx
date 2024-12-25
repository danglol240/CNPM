import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select, Button, message, Radio } from "antd";
import axios from "axios";

const { Option } = Select;

const AddVehicle = ({ onClickPlus }) => {
  const [vehicleType, setVehicleType] = useState("");
  const [licensePlates, setLicensePlates] = useState([""]);
  const [roomNumber, setRoomNumber] = useState("");
  const [rooms, setRooms] = useState([]);
  const [inputRoomType, setInputRoomType] = useState("select");
  const [motorbikes, setMotorbikes] = useState([]);
  const [cars, setCars] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get("http://localhost:8080/vehicalsAddRoom");
        if (response.status === 200) {
          setRooms(response.data.dataRoom);
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };
    fetchRooms();
  }, []);

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
    try {
      const response = await axios.post("http://localhost:8080/vehicals", {
        roomNumber,
        motorbikes,
        cars,
      });
      message.success("Xác nhận thành công!");
      onClickPlus(); // Đóng modal sau khi gửi dữ liệu thành công
    } catch (error) {
      console.error("Error submitting vehicles:", error);
      message.error("Xác nhận thất bại!");
    }
  };

  const handleRoomInputChange = (e) => {
    setRoomNumber(e.target.value);
  };

  const handleRoomSelectChange = (roomNumber) => {
    setRoomNumber(roomNumber);
  };

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

  return (
    <Modal title="Thêm xe" visible={true} onCancel={onClickPlus} footer={null}>
      <Form layout="vertical">
        <Form.Item label="Phòng">
          <Radio.Group
            onChange={(e) => setInputRoomType(e.target.value)}
            value={inputRoomType}
            style={{ marginBottom: "10px" }}
          >
            <Radio value="select">Chọn số phòng</Radio>
            <Radio value="input">Nhập số phòng</Radio>
          </Radio.Group>

          {inputRoomType === "select" ? (
            <Select
              placeholder="Chọn phòng"
              value={roomNumber}
              onChange={handleRoomSelectChange}
              style={{ width: "100%" }}
            >
              {rooms.map((room) => (
                <Option key={room} value={room}>
                  Phòng {room}
                </Option>
              ))}
            </Select>
          ) : (
            <Input
              type="number"
              placeholder="Nhập số phòng"
              value={roomNumber}
              onChange={handleRoomInputChange}
              style={{ width: "100%" }}
            />
          )}
        </Form.Item>
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
          <Button type="primary" onClick={handleSubmit}>
            Xác nhận
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

export default AddVehicle;
