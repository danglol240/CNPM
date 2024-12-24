import React, { useEffect, useState } from "react";
import "./Vehicle.css";
import { Button, Input, Modal, message } from "antd";
import { FaPlusCircle } from "react-icons/fa";
import { TiArrowUnsorted } from "react-icons/ti";
import axios from "axios";

const Vehicle = () => {
  const [vehicalsData, setVehicalsData] = useState([]);
  const [valuesearchData, setValuesearchData] = useState("");
  const [selectedOption, setSelectedOption] = useState("Lựa chọn tìm kiếm");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchVehicals = async () => {
      try {
        const { data } = await axios.get("http://localhost:8080/vehicals");
        setVehicalsData(data.vehicals); // Gán dữ liệu phương tiện
      } catch (error) {
        console.error("Error fetching vehicals data: ", error);
      }
    };
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

  return (
    <div className="vehicals-container department-all">
      <h2>Phương Tiện</h2>
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
            <th>STT</th>
            <th>Số phòng</th>
            <th>Xe máy</th>
            <th>Ô tô</th>
            <th>Tổng số xe</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(searchData) && searchData.length === 0 ? (
            <tr>
              <td colSpan="5">Không tìm thấy kết quả phù hợp</td>
            </tr>
          ) : (
            searchData.map((item, index) => {
              const totalVehicles = item.motorbikes.length + item.cars.length;
              return (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td>{item.roomNumber}</td>
                  <td>{item.motorbikes.join(", ") || "Không có"}</td>
                  <td>{item.cars.join(", ") || "Không có"}</td>
                  <td>{totalVehicles}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Vehicle;
