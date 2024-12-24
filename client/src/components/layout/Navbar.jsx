import React from "react";
import "./Navbar.css";
import { Button } from "antd";
import { useNavigate, NavLink } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const check = sessionStorage.getItem("checkLogin");

  const logOut = () => {
    navigate("/login");
    sessionStorage.removeItem("checkLogin");
  };

  const logIn = () => {
    navigate("/login");
  };

  const handleNavigation = (event, path) => {
    event.preventDefault(); // ngăn hành vi mặc định của NavLink
    if (!check) {
      navigate("/login");
    } else {
      navigate(path);
    }
  };

  return (
    <div className="navbar">
      <div className="icon-nav-all">
        <img src="/pic/KienDInh.jfif" className="icon-nav" size={50}/>
        <h1>Admin</h1>
      </div>
      <ul className="option-nav">
        <NavLink
          to="/"
          onClick={(e) => handleNavigation(e, "/")}
          className={({ isActive }) => (isActive ? "active-link" : "inactive-link")}
        >
          <li>
            Home
          </li>
        </NavLink>
        <NavLink
          to="/department"
          onClick={(e) => handleNavigation(e, "/department")}
          className={({ isActive }) => (isActive ? "active-link" : "inactive-link")}
        >
          <li>
            Căn hộ
          </li>
        </NavLink>
        <NavLink
          to="/people"
          onClick={(e) => handleNavigation(e, "/people")}
          className={({ isActive }) => (isActive ? "active-link" : "inactive-link")}
        >
          <li>
            Dân cư
          </li>
        </NavLink>
        <NavLink
          to="/fee"
          onClick={(e) => handleNavigation(e, "/fee")}
          className={({ isActive }) => (isActive ? "active-link" : "inactive-link")}
        >
          <li>
            Thu phí
          </li>
        </NavLink>
      </ul>
      <NavLink
          to="/vehicle"
          onClick={(e) => handleNavigation(e, "/vehicle")}
          className={({ isActive }) => (isActive ? "active-link" : "inactive-link")}
        >
          <li className="vehicle">
            Phương Tiện
          </li>
        </NavLink>
      {check ? (
        <Button 
          onClick={logOut} 
          className="btn-nav logout" 
          type="primary"
          >
          Đăng xuất
        </Button>
      ) : (
        <Button onClick={logIn} className="btn-nav" type="primary">
          Đăng nhập
        </Button>
      )}
    </div>
  );
};

export default Navbar;

