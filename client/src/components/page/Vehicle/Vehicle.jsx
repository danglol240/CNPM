import React, { useEffect, useState } from "react";
import "./Vehicle.css";
import { Button, Input, Modal, message } from "antd";
import { FaPlusCircle } from "react-icons/fa";
import { TiArrowUnsorted } from "react-icons/ti";
import axios from "axios";
import AddVehicle from "./AddVehicle/AddVehicle";

const Vehicle = () => {
  const [vehicalsData, setVehicalsData] = useState([]);
  const [valuesearchData, setValuesearchData] = useState("");
  const [selectedOption, setSelectedOption] = useState("Lựa chọn tìm kiếm");
  const [isOpen, setIsOpen] = useState(false);
  const [openPlus, setOpenPlus] = useState(false);

  const fetchVehicals = async () => {
    try {
      const { data } = await axios.get("http://localhost:8080/vehicals");
      setVehicalsData(data.vehicals); // Gán dữ liệu phương tiện
    } catch (error) {
      console.error("Error fetching vehicals data: ", error);
    }
  };

  useEffect(() => {
    fetchVehicals();
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  const onChange = (e) => {
    setValuesearchData(e.target.value);
  };

  const onClickPlus = () => {
    setOpenPlus(!openPlus);
    if (!openPlus) {
      fetchVehicals(); // Cập nhật danh sách xe sau khi thêm mới
    }
  };

  const filterData = (value) => {
    if (!value) return vehicalsData;
    switch (selectedOption) {
      case "Số phòng":
        return vehicalsData.filter((item) => item.roomNumber == value);
      case "Số lượng xe":
        return vehicalsData.filter(
          (item) =>
            item.motorbikes.length + item.cars.length == parseInt(value, 10)
        );
      default:
        return vehicalsData;
    }
  };

  const searchData = filterData(valuesearchData);
  const calculateTotalVehicles = (motorbikes, cars) => motorbikes.length + cars.length;

  const showDeleteConfirm = (item) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa phương tiện này?",
      content: `Phòng: ${item.roomNumber}, Xe máy: ${item.motorbikes.join(", ")}, Ô tô: ${item.cars.join(", ")}`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy bỏ",
      async onOk() {
        try {
          const response = await axios.delete(`http://localhost:8080/vehicals/${item._id}`);
          if (response.status === 200) {
            // Xóa thành công, cập nhật lại danh sách phương tiện
            setVehicalsData((prevData) => prevData.filter((x) => x._id !== item._id));
            message.success("Xóa thành công!");
          } else {
            throw new Error("Failed to delete");
          }
        } catch (error) {
          console.error("Error deleting vehicle:", error);
          message.error("Xóa thất bại!");
        }
      },
    });
  };

  return (
    <div className="vehicles-all">
      {openPlus && <AddVehicle onClickPlus={onClickPlus} />}
      <div className="vehicals-container">
        <h2>Phương Tiện</h2>
        <Button
          className="btn-plus-department"
          type="primary"
          onClick={onClickPlus}
        >
          <FaPlusCircle className="icon-btn-plus-department" size={20} />
          Thêm phòng mới
        </Button>
        <div className="search-vehicals">
          <Input
            className="input-search-vehicals"
            placeholder="Tìm kiếm"
            value={valuesearchData}
            onChange={onChange}
            disabled={selectedOption === "Lựa chọn tìm kiếm"}
          />
          <div className="dropdown-container">
            <button className="dropdown-button" onClick={toggleDropdown}>
              {selectedOption}
              <TiArrowUnsorted className="icon-search-vehicals" />
            </button>
            {isOpen && (
              <ul className="dropdown-content">
                {["Lựa chọn tìm kiếm", "Số phòng", "Số lượng xe"].map((option) => (
                  <li key={option} onClick={() => handleSelect(option)}>
                    {option}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <table className="table-container">
          <thead>
            <tr>
              <th style={{ width: "10%" }}>STT</th>
              <th style={{ width: "20%" }}>Số phòng</th>
              <th style={{ width: "20%" }}>Xe máy</th>
              <th style={{ width: "20%" }}>Ô tô</th>
              <th style={{ width: "10%" }}>Tổng số xe</th>
              <th style={{ width: "10%" }}>Tùy chọn</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(searchData) && searchData.length === 0 ? (
              <tr>
                <td colSpan="6">Không tìm thấy kết quả phù hợp</td>
              </tr>
            ) : (
              searchData.map((item, index) => {
                const totalVehicles = calculateTotalVehicles(item.motorbikes, item.cars);
                return (
                  <tr key={item._id}>
                    <td style={{ width: "10%" }}>{index + 1}</td>
                    <td style={{ width: "20%" }}>{item.roomNumber}</td>
                    <td style={{ width: "20%" }}>{item.motorbikes.join(", ") || "Không có"}</td>
                    <td style={{ width: "20%" }}>{item.cars.join(", ") || "Không có"}</td>
                    <td style={{ width: "10%" }}>{totalVehicles}</td>
                    <td className="btn-vehicle" style={{ width: "10%" }}>
                      <Button type="danger" style={{backgroundColor: "red", color: "white"}} onClick={() => showDeleteConfirm(item)}>
                        Xóa
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Vehicle;
