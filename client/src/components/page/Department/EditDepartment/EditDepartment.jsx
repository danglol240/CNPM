import React, { useState, useEffect } from "react";
import { Input, Button, message, Select } from "antd";
import axios from "axios";
import "./EditPeople.css";

const { Option } = Select;

const EditPeople = ({ onClickCloseEdit, editData }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [value, setValue] = useState({
    namePeople: editData.namePeople,
    roomNumber: editData.roomNumber,
    phoneNumber: editData.phoneNumber,
    cccd: editData.cccd,
    birthDate: formatDate(editData.birthDate),
    moveInDate: formatDate(editData.moveInDate),
    gioitinh: editData.gioitinh,
    email: editData.email,
  });

  const [dataFee, setDataFee] = useState([]);

  const onChangeValue = (item) => (e) => {
    setValue({ ...value, [item]: e.target ? e.target.value : e });
  };

  const [availableRooms, setAvailableRooms] = useState([]);

  useEffect(() => {
    const getDataRoom = async () => {
      try {
        const response = await axios.get("http://localhost:8080/peopleAddRoom");
        const { data } = await axios.get(
          `http://localhost:8080/getPeopleFee/${editData._id}`
        );
        setDataFee(data.data);
        if (response.status === 200) {
          setAvailableRooms(response.data.dataRoom);
        }
      } catch (error) {
        console.log("Error fetching room data:", error);
      }
    };
    getDataRoom();
  }, []);

  const formatDateString = (dateString) => {
    if (!dateString) return "";
    const formattedDate = dateString.slice(0, 10);
    return formattedDate;
  };

  const submit = async (e) => {
    e.preventDefault();
    const newDepartment = { ...value };
    try {
      await axios.put(
        `http://localhost:8080/people/${editData._id}`,
        newDepartment
      );
      message.success("Sửa thông tin cư dân thành công");
    } catch (error) {
      console.log(error);
      message.error(
        "Không thể thay đổi số phòng khi người này chưa thanh toán hết các khoản phí"
      );
    }
    onClickCloseEdit();
  };

  const handleInnerClick = (e) => {
    e.stopPropagation();
  };

  const checkPrice = (item) => {
    const roomNumberFee = item.roomNumber.find(
      (e) => e.purchaser === editData._id
    );
    if (
      item.typeFee.trim() === "Phí phòng" &&
      roomNumberFee &&
      roomNumberFee.acreage
    ) {
      return item.price * roomNumberFee.acreage;
    } else {
      return item.price;
    }
  };

  const getStatusStyle = (status) => {
    return status === "Đã đóng"
      ? { color: "green", fontWeight: "bold" }
      : { color: "red", fontWeight: "bold" };
  };

  return (
    <div className="plus-department" onClick={onClickCloseEdit}>
      <div className="edit-people-child" onClick={handleInnerClick}>
        <h2>Thông tin cư dân</h2>
        <form className="form-edit-people" onSubmit={submit}>
          <div className="form-edit-people-child">
            <div className="title-edit-people">
              <label>Tên</label>
              <Input
                value={value.namePeople}
                onChange={onChangeValue("namePeople")}
              />
            </div>
            <div className="title-edit-people">
              <label>Số phòng</label>
              <Select
                value={value.roomNumber}
                onChange={onChangeValue("roomNumber")}
                style={{ width: 110, marginLeft: 20 }}
              >
                {availableRooms.map((room) => (
                  <Option key={room} value={room}>
                    Phòng {room}
                  </Option>
                ))}
              </Select>
            </div>
            <div className="title-edit-people">
              <label>Số điện thoại</label>
              <Input
                value={value.phoneNumber}
                onChange={onChangeValue("phoneNumber")}
              />
            </div>
            <div className="title-edit-people">
              <label>Căn cước công dân</label>
              <Input value={value.cccd} onChange={onChangeValue("cccd")} />
            </div>
            <div className="title-edit-people">
              <label>Ngày sinh</label>
              <Input
                type="date"
                value={value.birthDate}
                onChange={onChangeValue("birthDate")}
              />
            </div>
            <div className="title-edit-people">
              <label>Ngày chuyển đến</label>
              <Input
                type="date"
                value={value.moveInDate}
                onChange={onChangeValue("moveInDate")}
              />
            </div>
            <div className="title-edit-people">
              <label>Giới tính</label>
              <Select
                value={value.gioitinh}
                onChange={onChangeValue("gioitinh")}
                style={{
                  width: 120,
                  marginLeft: 20,
                }}
              >
                <Option value="Nam">Nam</Option>
                <Option value="Nữ">Nữ</Option>
              </Select>
            </div>
            <div className="title-edit-people">
              <label>Email</label>
              <Input value={value.email} onChange={onChangeValue("email")} />
            </div>
            <div className="btn-plus-department-all">
              <Button
                className="btn-plus-child-1"
                type="primary"
                htmlType="submit"
              >
                Update
              </Button>
              <Button
                className="btn-plus-child-2"
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

export default EditPeople;
