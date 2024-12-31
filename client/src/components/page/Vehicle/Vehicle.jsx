import React, { useEffect, useState } from "react";
import "./Vehicle.css";
import { Button, Input, Modal, message } from "antd";
import { FaPlusCircle } from "react-icons/fa";
import { TiArrowUnsorted } from "react-icons/ti";
import axios from "axios";
import AddVehicle from "./AddVehicle/AddVehicle";
import EditVehicle from "./EditVehicle/EditVehicle";

const Vehicle = () => {
  const [vehicalsData, setVehicalsData] = useState([]);
  const [valuesearchData, setValuesearchData] = useState("");
  const [selectedOption, setSelectedOption] = useState("Lựa chọn tìm kiếm");
  const [isOpen, setIsOpen] = useState(false);
  const [openPlus, setOpenPlus] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState(null); // Thêm useState cho editData
  const [totalVehicles, setTotalVehicles] = useState(0);

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
    const interval = setInterval(() => {
      fetchVehicals();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const calculateTotal = (data) => {
    // Tính tổng số phương tiện từ danh sách phương tiện
    return data.reduce((total, item) => total + item.motorbikes.length + item.cars.length, 0);
  };

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

  useEffect(() => {
    setTotalVehicles(calculateTotal(vehicalsData));
  }, [vehicalsData]);

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
      case "Biển số xe máy":
        return vehicalsData.filter((item) =>
          item.motorbikes.some((plate) => plate.includes(value))
        );
      case "Biển số ô tô":
        return vehicalsData.filter((item) =>
          item.cars.some((plate) => plate.includes(value))
        );
      default:
        return vehicalsData;
    }
  };

  const onClickEdit = (item) => {
    setOpenEdit(true);
    setEditData(item);
  };

  const onClickCloseEdit = () => {
    setOpenEdit(false);
    setEditData(null);
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
      {openEdit && <EditVehicle onClickCloseEdit={onClickCloseEdit} editData={editData} />}
      <div className="vehicals-container">
        <h2>Phương Tiện</h2>
        <div className="vehicle-statistical">
          <p>Tổng số phương tiện trong căn hộ : {totalVehicles}</p>
        </div>
        <Button
          className="btn-plus-vehicle"
          type="primary"
          onClick={onClickPlus}
        >
          <FaPlusCircle className="icon-btn-plus-vehicle" size={20} />
          Thêm phương tiện
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
                {["Lựa chọn tìm kiếm", "Số phòng", "Số lượng xe","Biển số xe máy","Biển số ô tô"].map((option) => (
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
                <td colSpan="6" style={{backgroundColor:"white"}}>Không tìm thấy dữ liệu phù hợp</td>
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
                      <Button type="primary" onClick={() => onClickEdit(item)}>
                      Chỉnh sửa
                      </Button>
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
