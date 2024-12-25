import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select, Button, message, Radio } from "antd";
import axios from "axios";

const { Option } = Select;

const AddVehicle = ({ onClickPlus }) => {
  const [vehicleType, setVehicleType] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [rooms, setRooms] = useState([]);
  const [inputRoomType, setInputRoomType] = useState("select"); // Kiểm soát cách nhập số phòng (chọn hoặc nhập)

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get("http://localhost:8080/peopleAddRoom");
        if (response.status === 200) {
          setRooms(response.data.dataRoom);
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };
    fetchRooms();
  }, []);

  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:8080/vehicals", {
        roomNumber,
        motorbikes: vehicleType === "Xe máy" ? [licensePlate] : [],
        cars: vehicleType === "Ô tô" ? [licensePlate] : [],
      });
      message.success("Thêm xe thành công");
      onClickPlus(); // Đóng modal sau khi thêm thành công
    } catch (error) {
      console.error("Error adding vehicle:", error);
      message.error("Thêm xe thất bại");
    }
  };

  const handleRoomInputChange = (e) => {
    setRoomNumber(e.target.value);
  };

  const handleRoomSelectChange = (roomNumber) => {
    setRoomNumber(roomNumber);
  };

  return (
    <Modal
      title="Thêm xe"
      visible={true}
      onCancel={onClickPlus}
      footer={null}
    >
      <Form layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Phòng">
          {/* Radio button để chọn cách nhập */}
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
          <Input
            placeholder="Nhập biển số"
            value={licensePlate}
            onChange={(e) => setLicensePlate(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Thêm xe
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddVehicle;