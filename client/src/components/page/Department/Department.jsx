import React, { useEffect, useState } from "react";
import "./Department.css";
import { Button, Input, Modal, message } from "antd";
import { FaPlusCircle } from "react-icons/fa";
import { TiArrowUnsorted } from "react-icons/ti";
import axios from "axios";
import PlusDepartment from "./PlusDepartment/PlusDepartment";
import EditDepartment from "./EditDepartment/EditDepartment";

const Department = () => {
  const [dataDepartment, setDataDepartment] = useState([]);
  const [valuesearchData, setValuesearchData] = useState("");
  const [selectedOption, setSelectedOption] = useState("Lựa chọn tìm kiếm");
  const [isOpen, setIsOpen] = useState(false);
  const [openPlus, setOpenPlus] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get("http://localhost:8080/department");
        setDataDepartment(data.data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchData();
  }, []);

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
    case "Tầng":
      return dataDepartment.filter((item) => item.floor == value);
    case "Số phòng":
      return dataDepartment.filter((item) => item.roomNumber == value);
    case "Diện tích":
      return dataDepartment.filter((item) => item.acreage == value);
    case "Chủ sở hữu":
      return dataDepartment
        .map((item) => {
          const person = dataPeople.find((p) => p._id === item.purchaser);
          return {
            ...item,
            purchaser: person ? person.namePeople : "", // Thay đổi purchaser thành tên
          };
        })
        .filter((item) =>
          item.purchaser.toLowerCase().includes(value.toLowerCase())
        ); // Lọc theo tên
    case "Trạng thái":
      return dataDepartment.filter((item) =>
        item.status.toLowerCase().includes(value.toLowerCase())
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
      title: "Bạn có chắc chắn muốn xóa phòng này?",
      content: `Phòng: ${item.roomNumber}, Tầng: ${item.floor}`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy bỏ",
      async onOk() {
        try {
          const response = await axios.delete(
            `http://localhost:8080/department/${item._id}`
          );
          if (response.status === 200) {
            setDataDepartment((prevData) =>
              prevData.filter((x) => x._id !== item._id)
            );
            message.success("Xóa phòng thành công!");
          } else if (response.status === 404) {
            message.error("Bạn chỉ có thể xóa phòng không ai ở");
          } else {
            throw new Error("Failed to delete");
          }
        } catch (error) {
          console.error("Error deleting the item:", error);
          message.error("Xóa phòng thất bại!");
        }
      },
      onCancel() {
        console.log("Cancel delete");
      },
    });
  };

  const [dataDepartmentEmpty, setDataDepartmentEmpty] = useState([]);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get("http://localhost:8080/department");
        setDataDepartment(data.data);
        setDataDepartmentEmpty(
          data.data.filter((item) => item.status === "Trống")
        );
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


  return (
    <div className="department-all">
      {openPlus && <PlusDepartment onClickPlus={onClickPlus} />}
      {openEdit && (
        <EditDepartment
          onClickCloseEdit={onClickCloseEdit}
          editData={editData}
        />
      )}
      <div className="department">
        <h2>Căn hộ</h2>
        <div className="depart-2">
        <div className="depart-statistical">
          <p>Tổng số căn hộ : {dataDepartment.length}</p>
        </div>
        <div className="depart-statistical">
          <p>Số căn hộ còn trống : {dataDepartmentEmpty.length}</p>
        </div>
      </div>
        <Button
          className="btn-plus-department"
          type="primary"
          onClick={onClickPlus}
        >
          <FaPlusCircle className="icon-btn-plus-department" size={20} />
          Thêm phòng mới
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
                  "Tầng",
                  "Số phòng",
                  "Diện tích",
                  "Chủ sở hữu",
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
              <th style={{width:"5%"}}>STT</th>
              <th style={{width:"12.5%"}}>Tầng</th>
              <th style={{width:"12.5%"}}>Số phòng</th>
              <th style={{width:"10%"}}>Diện tích</th>
              <th style={{width:"30%"}}>Chủ sở hữu</th>
              <th style={{width:"15%"}}>Trạng thái</th>
              <th style={{width:"15%"}}>Tùy chọn</th>
            </tr>
          </thead>
          {/* <thead> */}
          <tbody>
            {Array.isArray(searchData) && searchData.length === 0 ? (
              <tr>
                <td colSpan="7">Không tìm thấy kết quả phù hợp</td>
              </tr>
            ) : (
              searchData.map((item, index) => {
               const person = dataPeople.find((p) => p._id === item.purchaser); // Tìm người theo ID
               const purchaserName = person ? person.namePeople : "Không xác định"; // Lấy tên hoặc hiển thị giá trị mặc định
               return  (
                <tr key={item._id}>
                  <td style={{width:"5%"}}>{index + 1}</td>
                  <td style={{width:"12.5%"}}>{item.floor}</td>
                  <td style={{width:"12.5%"}}>{item.roomNumber}</td>
                  <td style={{width:"10%"}}>{item.acreage}</td>
                  <td style={{width:"30%"}}>{purchaserName}</td>
                  <td style={{width:"15%"}}>{item.status}</td>
                  <td className="btn-table-department" style={{width:"15%"}}>
                    <Button type="primary" onClick={() => onClickEdit(item)}>
                      Chỉnh sửa
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
              );
              })
            )}
          </tbody>
          {/* </thead> */}
        </table>
      </div>
    </div>
  );
};

export default Department;
