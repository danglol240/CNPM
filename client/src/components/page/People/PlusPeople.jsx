import React, { useState, useEffect } from "react"; // Import useEffect
import { Input, Button, message, Select } from "antd";
import axios from "axios";
const { Option } = Select;

const PlusPeople = ({ onClickPlus }) => {
  const [value, setValue] = useState({
    namePeople: "",
    roomNumber: "",
    phoneNumber: "",
    cccd: "",
    birthDate: "",
    gioitinh: "",
    email: "",
  });

  const onChangeValue = (item) => (e) => {
    setValue({ ...value, [item]: e.target.value });
  };

  const [availableRooms, setAvailableRooms] = useState([]);

  useEffect(() => {
    const getDataRoom = async () => {
      try {
        const response = await axios.get("http://localhost:8080/peopleAddRoom");
        if (response.status === 200) {
          setAvailableRooms(response.data.dataRoom);
        }
      } catch (error) {
        console.log("Error fetching room data:", error);
      }
    };
    getDataRoom();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const newDepartment = {
      ...value,
      moveInDate: `${day}-${month}-${year}`,
    };
    try {
      await axios.post("http://localhost:8080/people", newDepartment);
      message.success("Thêm cư dân thành công");
      // Có thể thêm logic để đóng form sau khi thêm thành công
    } catch (error) {
      console.error(error);
      message.error("Lỗi, xin vui lòng thử lại");
    }
    setValue({
      namePeople: "",
      roomNumber: "",
      phoneNumber: "",
      cccd: "",
      birthDate: "",
      gioitinh: "",
      email: "",
    });
    onClickPlus();
  };
  const handleInnerClick = (e) => {
    e.stopPropagation();
  };
  const onChangeGioiTinh = (status) => {
    setValue({ ...value, gioitinh: status });
  };
  const onChangeRoomNumber = (status) => {
    setValue({ ...value, roomNumber: status });
  };
  return (
    <div className="plus-department" onClick={onClickPlus}>
      <div className="plus-department-child" onClick={handleInnerClick}>
        <form className="form-plus-department-2" onSubmit={submit}>
          <h2>Thêm cư dân</h2>
          <div className="title-input-plus-department">
            <label>Tên</label>
            <Input
              value={value.namePeople}
              onChange={onChangeValue("namePeople")}
            />
          </div>
          <div className="title-input-plus-department">
            <label>Số phòng</label>
            <Select
              value={value.roomNumber}
              onChange={onChangeRoomNumber}
              style={{ width: 110, marginLeft: 20 }}
            >
              {availableRooms.map((room) => (
                <Option key={room} value={room}>
                  Phòng {room}
                </Option>
              ))}
            </Select>
          </div>
          <div className="title-input-plus-department">
            <label>Số điện thoại</label>
            <Input
              value={value.phoneNumber}
              onChange={onChangeValue("phoneNumber")}
            />
          </div>
          <div className="title-input-plus-department">
            <label>Căn cước công dân</label>
            <Input value={value.cccd} onChange={onChangeValue("cccd")} />
          </div>
          <div className="title-input-plus-department">
            <label>Ngày sinh</label>
            <Input
              type="date"
              value={value.birthDate}
              onChange={onChangeValue("birthDate")}
            />
          </div>
          <div className="title-input-plus-department">
            <label>Giới tính</label>
            <Select
              value={value.gioitinh}
              onChange={onChangeGioiTinh}
              style={{
                width: 120,
                marginLeft: 20,
              }}
            >
              <Option value="Nam">Nam</Option>
              <Option value="Nữ">Nữ</Option>
            </Select>
          </div>
          <div className="title-input-plus-department">
            <label>Email</label>
            <Input value={value.email} onChange={onChangeValue("email")} />
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

export default PlusPeople;