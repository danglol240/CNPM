import React, { useState, useEffect } from "react";
import { Modal, Input, Select, Button, message, Tag } from "antd";
import axios from "axios";
import styles from "./FeeDetailsModal.module.css";

const { Option } = Select;

const FeeDetailsModal = ({ visible, onClose, fee, updateFee }) => {
  const [editedFee, setEditedFee] = useState({
    ...fee,
    roomNumber: fee.roomNumber || [],
    unpaidRooms: fee.unpaidRooms || [],
  });

  const [availableRooms, setAvailableRooms] = useState([]);
  const [newRoom, setNewRoom] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/feeAddRoom");
        if (response.status === 200) {
          setAvailableRooms(
            response.data.dataRoom.filter(
              (room) => !fee.roomNumber.includes(room)
            )
          );
        }
      } catch (error) {
        console.log("Error fetching room data:", error);
      }
    };
    fetchData();
  }, [fee]);

  const handleChange = (key, value) => {
    setEditedFee((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleRoomChange = (value) => {
    handleChange("unpaidRooms", value);
  };

  const handleAddRoom = () => {
    if (newRoom && !editedFee.roomNumber.includes(newRoom)) {
      setEditedFee((prev) => ({
        ...prev,
        roomNumber: [...prev.roomNumber, newRoom],
        unpaidRooms: [...prev.unpaidRooms, newRoom],
      }));
      setNewRoom("");
    } else {
      message.error("Số phòng đã tồn tại hoặc không hợp lệ!");
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8080/fee/${fee._id}`,
        editedFee
      );
      if (response.status === 200) {
        updateFee(response.data);
        message.success("Cập nhật thành công!");
        onClose();
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      message.error("Cập nhật thất bại!");
      console.error("Error updating the fee:", error);
    }
  };

  return (
    <Modal
      title="Chi Tiết Phí"
      visible={visible}
      onCancel={onClose}
      onOk={handleUpdate}
      okText="Cập nhật"
      cancelText="Hủy"
      className={styles.modalContent}
    >
      <div className={styles.detailsContainer}>
        <div className={styles.leftColumn}>
          <div className={styles.inputGroup}>
            <Input
              className={styles.inputField}
              value={editedFee.nameFee}
              onChange={(e) => handleChange("nameFee", e.target.value)}
              placeholder="Nhập tên phí"
            />
            <Select
              className={`${styles.inputField} ${styles.customSelect}`}
              value={editedFee.typeFee}
              onChange={(value) => handleChange("typeFee", value)}
              placeholder="Chọn loại phí"
              style={{ padding: "0px", borderRadius: "8px" }}
            >
              <Option value="Phí dịch vụ">Phí Dịch Vụ</Option>
            <Option value="Phí phòng">Phí Phòng</Option>
            <Option value="Phí phương tiện">Phí Phương Tiện</Option>
            <Option value="Phí tính theo người">Phí Tính Theo Người</Option>
            </Select>

            <Input
              className={styles.inputField}
              value={editedFee.price}
              onChange={(e) => handleChange("price", e.target.value)}
              placeholder="Nhập giá tiền"
            />
            <Input
              className={styles.inputField}
              value={editedFee.startDate}
              onChange={(e) => handleChange("startDate", e.target.value)}
              placeholder="Nhập ngày bắt đầu"
            />
            <Input
              className={styles.inputField}
              value={editedFee.endDate}
              onChange={(e) => handleChange("endDate", e.target.value)}
              placeholder="Nhập ngày kết thúc"
            />
          </div>
        </div>
        <div className={styles.rightColumn}>
          <div>
            <Select
              className={styles.selectField}
              placeholder="Chọn số phòng mới"
              value={newRoom}
              onChange={(value) => setNewRoom(value)}
              style={{ padding: "0px", borderRadius: "8px" }}
            >
              {availableRooms.map((room) => (
                <Option key={room} value={room}>
                  Phòng {room}
                </Option>
              ))}
            </Select>
            <Button
              onClick={handleAddRoom}
              type="primary"
              style={{ marginBottom: "10px", marginTop: "10px" }}
            >
              Thêm Phòng
            </Button>
          </div>
          <div className={styles.inputGroup}>
            <Select
              mode="multiple"
              className={styles.selectField}
              placeholder="Chọn phòng chưa đóng phí"
              value={editedFee.unpaidRooms}
              onChange={handleRoomChange}
              popupMatchSelectWidth={false}
            >
              {editedFee.roomNumber.map((room) => (
                <Option key={room} value={room}>
                  {room}
                </Option>
              ))}
            </Select>
          </div>
          <div>
            <h3>Phòng Đã Đóng Phí:</h3>
            <div className={styles.roomTags}>
              {editedFee.roomNumber
                .filter((room) => !editedFee.unpaidRooms.includes(room))
                .map((room) => (
                  <Tag key={room}>{room}</Tag>
                ))}
            </div>
            <h3>Phòng Chưa Đóng Phí:</h3>
            <div className={styles.roomTags}>
              {editedFee.unpaidRooms.map((room) => (
                <Tag key={room}>{room}</Tag>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default FeeDetailsModal;