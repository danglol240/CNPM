import React, { useEffect, useState } from "react";
import "./home.css";  
import axios from "axios";

const Home = () => {
  const [dataDepartment, setDataDepartment] = useState([]);
  const [dataDepartmentEmpty, setDataDepartmentEmpty] = useState([]);
  const [dataPeople, setDataPeople] = useState([]);
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
  }, [retryCount]); // Phụ thuộc vào retryCount để gọi lại khi cần

  return (
    <div className="home-all">
      <div className="home">
        <div className="title-home">
          <h1 className="title-home-child-header">Chung cư BlueMoon</h1>
          <p className="title-home-child">Chủ sở hữu: Nguyễn Văn A</p>
          <p className="title-home-child">
            Địa chỉ: Bách Khoa - Hai Bà Trưng - Hà Nội
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
