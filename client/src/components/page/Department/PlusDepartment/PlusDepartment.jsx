import React, { useState } from "react";
import "./PlusDepartment.css";
import { Input, Button, message, Select, Modal } from "antd";
import axios from "axios";
import { v4 as uuidv4 } from "uuid"; // Import uuid
const { Option } = Select;
const PlusDepartment = ({ onClickPlus }) => {
  const [value, setValue] = useState({
    floor: "",
    roomNumber: "",
    acreage: "",
    purchaser: "",
    status: "",
  });

  const onChangeValue = (item) => (e) => {
    setValue({ ...value, [item]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    const newDepartment = {
      ...value,
      id: uuidv4(), // Sử dụng uuid để tạo ID duy nhất
    };
    try {
      await axios.post("http://localhost:8080/department", newDepartment);
      message.success("Thêm phòng thành công");
      // Có thể thêm logic để đóng form sau khi thêm thành công
    } catch (error) {
      message.error("Lỗi, xin vui lòng thử lại");
    }
    setValue({
      floor: "",
      roomNumber: "",
      acreage: "",
      purchaser: "",
      status: "",
    });
    onClickPlus();
  };
  const handleInnerClick = (e) => {
    e.stopPropagation();
  };
  const onChangeStatus = (status) => {
    setValue({ ...value, status: status });
  };
  return (
    <div className="plus-department" onClick={onClickPlus}>
      <div className="plus-department-child" onClick={handleInnerClick}>
        <form className="form-plus-department" onSubmit={submit}>
          <h2>Thêm phòng mới</h2>
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
              value={value.purchaser}
              onChange={onChangeValue("purchaser")}
              disabled
            />
          </div>
          <div className="title-input-plus-department">
            <label>Trạng thái</label>
            <Select
              value={value.status}
              onChange={onChangeStatus}
              style={{ width: 120 }}
            >
              <Option value="Trống">Trống</Option>
              {value.purchaser && <Option value="Đã thuê">Đã thuê</Option>}
            </Select>
          </div>
          <div className="btn-plus-department-all">
            <Button
              className="btn-plus-child-1"
              type="primary"
              htmlType="submit"
            >
              Thêm
            </Button>
            <Button
              className="btn-plus-child-2"
              type="primary"
              onClick={onClickPlus}
            >
              Hủy
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlusDepartment;
