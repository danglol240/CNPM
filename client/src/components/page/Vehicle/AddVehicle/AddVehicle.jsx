import React, { useState } from "react";
import { Form, Input, Select, Button, Modal, message } from "antd";
import axios from "axios";

const { Option } = Select;

const AddVehicle = ({ onClickPlus }) => {
  const [roomNumber, setRoomNumber] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [licensePlate, setLicensePlate] = useState("");

  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:8080/vehicles", {
        roomNumber,
        vehicleType,
        licensePlate,
      });
      if (response.status === 200) {
        message.success("Thêm xe thành công!");
        onClickPlus(); // Đóng form sau khi thêm thành công
      } else {
        throw new Error("Failed to add vehicle");
      }
    } catch (error) {
      console.error("Error adding vehicle:", error);
      message.error("Thêm xe thất bại!");
    }
  };

  return (
    <Modal
      title="Thêm Phương Tiện Mới"
      visible={true}
      onCancel={onClickPlus}
      footer={null}
    >
      <Form layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Số phòng">
          <Input
            placeholder="Nhập số phòng"
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
          />
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