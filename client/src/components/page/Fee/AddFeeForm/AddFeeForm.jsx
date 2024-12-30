import React, { useEffect, useState } from "react";
import { Modal, Button, Input, DatePicker, message, Select, Form } from "antd";
import "./AddFeeForm.css";
import axios from "axios";

const { RangePicker } = DatePicker;
const { Option } = Select;

const AddFeeForm = ({ visible, onClose, updateFees }) => {
  const [nameFee, setNameFee] = useState("");
  const [typeFee, setTypeFee] = useState("");
  const [price, setPrice] = useState("");
  const [dates, setDates] = useState([]);
  const [roomNumbers, setRoomNumbers] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);

  useEffect(() => {
    const getDataRoom = async () => {
      try {
        const response = await axios.get("http://localhost:8080/feeAddRoom");
        if (response.status === 200) {
          setAvailableRooms(response.data.dataRoom);
        }
      } catch (error) {
        console.log("Error fetching room data:", error);
      }
    };
    getDataRoom();
  }, []);

  const handleSelectAllRooms = (selectedItems) => {
    if (selectedItems.includes("all")) {
      if (roomNumbers.length < availableRooms.length) {
        // If not all rooms are selected, select all
        setRoomNumbers(availableRooms.map((room) => room.toString()));
      } else {
        // If all are selected, clear selection
        setRoomNumbers([]);
      }
    } else {
      setRoomNumbers(selectedItems.filter((item) => item !== "all"));
    }
  };

  const handleSubmit = async () => {
    if (dates.length !== 2) {
      message.error("Vui lòng chọn ngày bắt đầu và kết thúc.");
      return;
    }
    const [startDate, endDate] = dates;
    const rooms = roomNumbers.map((num) => parseInt(num, 10));
    const newFee = {
      nameFee,
      typeFee,
      price: parseInt(price, 10),
      startDate: startDate.format("YYYY-MM-DD"),
      endDate: endDate.format("YYYY-MM-DD"),
      roomNumber: rooms,
      unpaidRooms: rooms,
    };

    try {
      const response = await axios.post("http://localhost:8080/fee", newFee);
      if (response.status === 201) {
        message.success("Khoản phí đã được thêm thành công!");
        updateFees(newFee);
        onClose();
      } else {
        throw new Error("Failed to create fee");
      }
    } catch (error) {
      message.error("Lỗi khi thêm khoản phí mới: " + error.message);
    }
  };

  return (
    <Modal
      title="Thêm Khoản Phí Mới"
      visible={visible}
      onOk={handleSubmit}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>
          Hủy Bỏ
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Thêm Phí
        </Button>,
      ]}
    >
      <Form layout="vertical">
        <Form.Item label="Tên Phí">
          <Input
            placeholder="Nhập tên phí"
            value={nameFee}
            onChange={(e) => setNameFee(e.target.value)}
          />
        </Form.Item>
        <Form.Item label="Loại Phí">
          <Select
            placeholder="Chọn loại phí"
            value={typeFee}
            onChange={setTypeFee}
            style={{ width: "100%" }}
          >
            <Option value="Phí dịch vụ">Phí Dịch Vụ</Option>
            <Option value="Phí phòng">Phí Phòng</Option>
            <Option value="Phí phương tiện">Phí Phương Tiện</Option>
            <Option value="Phí tính theo người">Phí Tính Theo Người</Option>
            <Option value="Phí từ thiện">Phí Từ thiện</Option>
          </Select>
        </Form.Item>
        <Form.Item label="Giá Phí">
          <Input
            placeholder="Nhập giá phí"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            type="number"
          />
        </Form.Item>
        <Form.Item label="Khoảng Thời Gian">
          <RangePicker
            onChange={(dates) => setDates(dates)}
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item label="Chọn Số Phòng">
          <Select
            mode="multiple"
            placeholder="Chọn số phòng"
            value={roomNumbers}
            onChange={handleSelectAllRooms}
            style={{ width: "100%" }}
          >
            <Option key="all">Chọn Tất Cả</Option>
            {availableRooms.map((room) => (
              <Option key={room} value={room.toString()}>
                Phòng {room}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddFeeForm;
