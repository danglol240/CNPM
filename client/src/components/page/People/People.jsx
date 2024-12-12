import React, { useState, useEffect } from "react";
import { Button, Input, Modal, message } from "antd"; // Make sure Modal is imported
import { FaPlusCircle } from "react-icons/fa";
import { TiArrowUnsorted } from "react-icons/ti";
import axios from "axios";
import PlusPeople from "./PlusPeople";
import EditPeople from "./EditPeople/EditPeople";

const People = () => {
  const [dataDepartment, setDataDepartment] = useState([]);
  const [valuesearchData, setValuesearchData] = useState("");
  const [selectedOption, setSelectedOption] = useState("Lựa chọn tìm kiếm");
  const [isOpen, setIsOpen] = useState(false);
  const [openPlus, setOpenPlus] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState([]);

  const formatDate = (dateString) => {
    // Kiểm tra nếu chuỗi rỗng hoặc không hợp lệ
    if (!dateString) return "";

    // Cắt bỏ phần giờ từ chuỗi thời gian
    const formattedDate = dateString.slice(0, 10); // Lấy 10 ký tự đầu tiên (YYYY-MM-DD)

    return formattedDate;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get("http://localhost:8080/people");
        setDataDepartment(data.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchData();
  }, []);
  console.log(dataDepartment);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  const onClickPlus = () => {
    setOpenPlus(!openPlus);
  };
  const onClickEdit = (item) => {
    setOpenEdit(!openEdit);
    setEditData(item);
  };
  const onClickCloseEdit = () => {
    setOpenEdit(false);
  };

  const filterData = (value) => {
    if (!value) return dataDepartment;
    switch (selectedOption) {
      case "Tên":
        return dataDepartment.filter((item) =>
          item.namePeople.toLowerCase().includes(value.toLowerCase())
        );
      case "Số phòng":
        return dataDepartment.filter(
          (item) => item.departments.roomNumber == value
        );
      case "Giới tính":
        return dataDepartment.filter((item) =>
          item.gioitinh.toLowerCase().includes(value.toLowerCase())
        );
      case "Ngày chuyển vào":
        return dataDepartment.filter((item) =>
          item.moveInDate.toLowerCase().includes(value.toLowerCase())
        );
      case "Số điện thoại":
        return dataDepartment.filter((item) =>
          item.phoneNumber.toLowerCase().includes(value.toLowerCase())
        );
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
      title: "Bạn có chắc chắn muốn xóa người này?",
      content: `Tên: ${item.namePeople}, Phòng: ${item.departments.roomNumber}`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy bỏ",
      async onOk() {
        try {
          const response = await axios.delete(
            `http://localhost:8080/people/${item._id}`
          );
          if (response.status === 200) {
            // Xóa thành công, cập nhật lại danh sách phòng
            setDataDepartment((prevData) =>
              prevData.filter((x) => x._id !== item._id)
            );
            message.success("Xóa thành công!");
          } else {
            throw new Error("Failed to delete");
          }
        } catch (error) {
          console.error("Error deleting the item:", error);
          message.error(
            "Không thể xóa người dùng khi họ chưa thanh toán hết các khoản phí"
          );
        }
      },
      onCancel() {
        // Người dùng hủy bỏ, chỉ cần đóng modal
        console.log("Cancel delete");
      },
    });
  };

  return (
    <div className="department-all">
      {openPlus && <PlusPeople onClickPlus={onClickPlus} />}
      {openEdit && (
        <EditPeople onClickCloseEdit={onClickCloseEdit} editData={editData} />
      )}
      <div className="department">
        <h2>Dân cư</h2>
        <Button
          className="btn-plus-department"
          type="primary"
          onClick={onClickPlus}
        >
          <FaPlusCircle className="icon-btn-plus-department" size={20} />
          Thêm người mới
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
                  "Tên",
                  "Số phòng",
                  "Giới tính",
                  "Số điện thoại",
                  "Ngày chuyển vào",
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
              <th>STT</th>
              <th>Tên</th>
              <th>Số phòng</th>
              <th>Giới tính</th>
              <th>Số điện thoại</th>
              <th>Ngày chuyển vào</th>
              <th>Tùy chọn</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(searchData) && searchData.length > 0 ? (
              searchData.map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td>{item.namePeople}</td>
                  <td>{item.departments.roomNumber}</td>
                  <td>{item.gioitinh}</td>
                  <td>{item.phoneNumber}</td>
                  <td>{formatDate(item.moveInDate)}</td>
                  <td className="btn-table-department">
                    <Button type="primary" onClick={() => onClickEdit(item)}>
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
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">Không tìm thấy dữ liệu phù hợp</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default People;