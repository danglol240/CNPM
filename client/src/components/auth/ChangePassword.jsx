import React, { useState } from "react";
import { Button, Input, Form, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./ChangePassword.css";

const ChangePassword = () => {
  const { auth, updatePassword } = useAuth(); // Lấy auth và updatePassword từ context
  const navigate = useNavigate();
  const [changePassword, setChangePassword] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const onChangePasswordField = (field) => (e) => {
    setChangePassword({ ...changePassword, [field]: e.target.value });
  };

  const handleChangePassword = () => {
    const { oldPassword, newPassword, confirmNewPassword } = changePassword;
  
    if (newPassword !== confirmNewPassword) {
      message.error("Mật khẩu mới và xác nhận mật khẩu không khớp.");
      return;
    }
  
    if (oldPassword !== auth.defaultPassword) {
      message.error("Mật khẩu cũ không đúng.");
      console.log("Mật khẩu cũ không đúng:", auth.defaultPassword);
      return;
    }
  
    updatePassword(newPassword); // Cập nhật mật khẩu trong AuthContext
    console.log("Mật khẩu mới đã được cập nhật:", newPassword);
  
    setChangePassword({ oldPassword: "", newPassword: "", confirmNewPassword: "" });
    message.success("Mật khẩu đã được cập nhật thành công.");
    navigate("/login"); // Quay lại trang đăng nhập
  };
  

  return (
    <div className="change-password-container">
      <h2>Đổi Mật Khẩu</h2>
      <Form>
        <Form.Item>
          <Input.Password
            placeholder="Mật khẩu cũ"
            value={changePassword.oldPassword}
            onChange={onChangePasswordField("oldPassword")}
          />
        </Form.Item>
        <Form.Item>
          <Input.Password
            placeholder="Mật khẩu mới"
            value={changePassword.newPassword}
            onChange={onChangePasswordField("newPassword")}
          />
        </Form.Item>
        <Form.Item>
          <Input.Password
            placeholder="Xác nhận mật khẩu mới"
            value={changePassword.confirmNewPassword}
            onChange={onChangePasswordField("confirmNewPassword")}
          />
        </Form.Item>
        <Button type="primary" onClick={handleChangePassword}>
          Xác nhận
        </Button>
      </Form>
    </div>
  );
};

export default ChangePassword;
