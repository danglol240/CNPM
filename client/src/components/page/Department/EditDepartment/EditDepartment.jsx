import React, { useState } from "react";
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
              disabled
            >
              <Option value="Trống">Trống</Option>
              <Option value="Đã thuê">Đã thuê</Option>
            </Select>
          </div>
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
