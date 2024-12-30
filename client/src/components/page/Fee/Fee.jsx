import React, { useState, useEffect } from "react";
import { Button, Input, Modal, message } from "antd"; // Make sure Modal is imported
import { FaPlusCircle } from "react-icons/fa";
import { TiArrowUnsorted } from "react-icons/ti";
import axios from "axios";
import AddFeeForm from "./AddFeeForm/AddFeeForm";
import FeeDetailsModal from "./FeeDetailsModal/FeeDetailsModal";
import "./Fee.css";

const Fee = () => {
  const [dataDepartment, setDataDepartment] = useState([]);
  const [valuesearchData, setValuesearchData] = useState("");
  const [selectedOption, setSelectedOption] = useState("Lựa chọn tìm kiếm");
  const [isOpen, setIsOpen] = useState(false);
  const [openPlus, setOpenPlus] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const formattedDate = dateString.slice(0, 10);
    return formattedDate;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get("http://localhost:8080/fee");
        setDataDepartment(data.data);
        console.log(data.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const CheckFeeStatus = (unpaidRooms, returnAsJSX = true) => {
    const text = unpaidRooms && unpaidRooms.length > 0 ? "Chưa hoàn thành" : "Đã hoàn thành";
    const color = unpaidRooms && unpaidRooms.length > 0 ? "red" : "green";

    if (returnAsJSX) {
        return <span style={{ color, fontWeight: "bold" }}>{text}</span>;
    }
    return { text, color }; // Trả về text và màu sắc nếu không phải JSX
};

  const handleSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  const filterData = (value) => {
    if (!value) return dataDepartment;
    switch (selectedOption) {
      case "Tên phí":
        return dataDepartment.filter((item) =>
          item.nameFee.toLowerCase().includes(value.toLowerCase())
        );
      case "Giá phí":
        return dataDepartment.filter((item) => item.price == value);
      case "Loại phí":
        return dataDepartment.filter((item) =>
          item.typeFee.toLowerCase().includes(value.toLowerCase())
        );
      case "Ngày bắt đầu":
        return dataDepartment.filter((item) =>
          item.startDate.toLowerCase().includes(value.toLowerCase())
        );
      case "Ngày kết thúc":
        return dataDepartment.filter((item) =>
          item.endDate.toLowerCase().includes(value.toLowerCase())
        );
      case "Trạng thái": // Thêm logic kiểm tra trạng thái
        return dataDepartment.filter((item) => {
          const statusText = CheckFeeStatus(item.unpaidRooms, false).text;
          return statusText.toLowerCase().includes(value.toLowerCase());
        });
      default:
        return dataDepartment;
    }
  };

  const onChange = (e) => {
    setValuesearchData(e.target.value);
  };

  const searchData = filterData(valuesearchData);

  const showDeleteConfirm = (item) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa khoản phí này?",
      content: `Tên phí: ${item.nameFee}`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy bỏ",
      async onOk() {
        try {
          const response = await axios.delete(
            `http://localhost:8080/fee/${item._id}`
          );
          if (response.status === 200) {
            setDataDepartment((prevData) =>
              prevData.filter((x) => x._id !== item._id)
            );
            message.success("Xóa thành công!");
          } else {
            throw new Error("Failed to delete");
          }
        } catch (error) {
          console.error("Error deleting the item:", error);
          message.error("Xóa thất bại!");
        }
      },
      onCancel() {
        console.log("Cancel delete");
      },
    });
  };

  const updateFees = (newFee) => {
    setDataDepartment([...dataDepartment, newFee]);
  };

  const [selectedFee, setSelectedFee] = useState(null);

  const showFeeDetails = (fee) => {
    setSelectedFee(fee);
    setOpenEdit(true);
  };

  const updateFeeDetails = (updatedFee) => {
    setDataDepartment((prevData) =>
      prevData.map((item) => (item._id === updatedFee._id ? updatedFee : item))
    );
    setOpenEdit(false);
  };

  return (
    <div className="department-all">
      {openPlus && (
        <AddFeeForm
          visible={openPlus}
          onClose={() => setOpenPlus(false)}
          updateFees={updateFees}
        />
      )}
      {openEdit && (
        <FeeDetailsModal
          visible={openEdit}
          onClose={() => setOpenEdit(false)}
          fee={selectedFee}
          updateFee={updateFeeDetails}
        />
      )}
      <div className="department">
        <h2>Danh sách thu phí</h2>
        <Button
          className="btn-plus-department"
          type="primary"
          onClick={() => setOpenPlus(true)}
        >
          <FaPlusCircle className="icon-btn-plus-department" size={20} />
          Thêm phí mới
        </Button>
        <div className="search-department">
          <Input
            className="input-search-department"
            placeholder="Tìm kiếm"
            value={valuesearchData}
            onChange={onChange}
            disabled={selectedOption === "Lựa chọn tìm kiếm"}
          />
          <div className="dropdown-container">
            <button className="dropdown-button" onClick={toggleDropdown}>
              {selectedOption}
              <TiArrowUnsorted className="icon-search-department" />
            </button>
            {isOpen && (
              <ul className="dropdown-content">
                {[
                  "Lựa chọn tìm kiếm",
                  "Tên phí",
                  "Loại phí",
                  "Giá phí",
                  "Ngày bắt đầu",
                  "Ngày kết thúc",
                  "Trạng thái",
                ].map((option) => (
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
              <th className="th-fee" style={{ width: "5%", }}  >STT</th>
              <th className="th-fee" style={{ width: "20%" }}  >Tên phí</th>
              <th className="th-fee" style={{ width: "10%" }}  >Loại phí</th>
              <th className="th-fee" style={{ width: "15%" }}  >Giá phí</th>
              <th className="th-fee" style={{ width: "10%" }}  >Ngày bắt đầu</th>
              <th className="th-fee" style={{ width: "10%" }}  >Ngày kết thúc</th>
              <th className="th-fee" style={{ width: "15%" }}  >Tùy chọn</th>
              <th className="th-fee" style={{ width: "15%" }}  >Trạng thái</th>
            </tr>
          </thead>
          <thead>
          <tbody>
            {Array.isArray(searchData) && searchData.length > 0 ? (
              searchData.map((item, index) => (
                <tr key={item._id}>
                  <td className="th-fee" style={{ width: "5%" }} >{index + 1}</td>
                  <td className="th-fee" style={{ width: "20%" }}>{item.nameFee}</td>
                  <td className="th-fee" style={{ width: "10%" }}>{item.typeFee}</td>
                  <td className="th-fee" style={{ width: "15%" }}>
                    {item.price ? item.price.toLocaleString("vi-VN") + "đ" : ""}
                  </td>
                  <td className="th-fee" style={{ width: "10%" }}>{formatDate(item.startDate)}</td>
                  <td className="th-fee" style={{ width: "10%" }}>{formatDate(item.endDate)}</td>
                  <td className="btn-table-department th-fee" style={{width: "15%"}}>
                    <Button type="primary" onClick={() => showFeeDetails(item)} >
                      Chi tiết
                    </Button>
                    <Button
                      type="primary"
                      style={{ backgroundColor: "red" }}
                      onClick={() => showDeleteConfirm(item)}
                    >
                      Xóa
                    </Button>
                  </td>
                  <td className="th-fee" style={{width: "15%"}}>{CheckFeeStatus(item.unpaidRooms)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{backgroundColor:"white"}}>Không tìm thấy dữ liệu phù hợp</td>
              </tr>
            )}
          </tbody>
          </thead>
        </table>
      </div>
    </div>
  );
};

export default Fee;