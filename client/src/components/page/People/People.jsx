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
  const [dataPeople, setDataPeople] = useState([]);
  const [retryCount, setRetryCount] = useState(0);

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
      try {
        const response = await axios.get("http://localhost:8080/people");
        setDataPeople(response.data.data);
        setRetryCount(0); // Reset retry count on successful fetch
      } catch (err) {
        console.log("Lỗi: ", err);
        if (retryCount < 3) {
          // Giới hạn số lần thử lại
          setTimeout(() => {
            setRetryCount(retryCount + 1);
          }, 3000); // Thử lại sau 3 giây
        }
      }
    };
    fetchData();
  }, [retryCount]);
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
        <div className="people">
          <div className="depart-2">
          <div className="depart-statistical">
            <p>Tổng dân cư sinh sống : {dataPeople.length}</p>
          </div>
          </div>
        </div>
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
              <th style={{width:"5%"}}>STT</th>
              <th style={{width:"30%"}}>Tên</th>
              <th style={{width:"10%"}}>Số phòng</th>
              <th style={{width:"10%"}}>Giới tính</th>
              <th style={{width:"20%"}}>Số điện thoại</th>
              <th style={{width:"10%"}}>Ngày chuyển vào</th>
              <th style={{width:"15%"}}>Tùy chọn</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(searchData) && searchData.length > 0 ? (
              searchData.map((item, index) => (
                <tr key={item._id}>
                  <td style={{width:"5%"}}>{index + 1}</td>
                  <td style={{width:"30%"}}>{item.namePeople}</td>
                  <td style={{width:"10%"}}>{item.departments.roomNumber}</td>
                  <td style={{width:"10%"}}>{item.gioitinh}</td>
                  <td style={{width:"20%"}}>{item.phoneNumber}</td>
                  <td style={{width:"10%"}}>{formatDate(item.moveInDate)}</td>
                  <td className="btn-table-department" style={{width:"15%"}}>
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