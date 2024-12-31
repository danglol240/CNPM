import React, { useState } from "react";
import { Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Đảm bảo đường dẫn đúng với AuthContext

const Login = () => {
  const navigate = useNavigate();
  const { login, changePassword } = useAuth(); // Lấy hàm từ useAuth
  const [value, setValue] = useState({
    userName: "",
    password: "",
  });
  const [passwordFields, setPasswordFields] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorLogin, setErrorLogin] = useState(false);
  const [touched, setTouched] = useState({});

  const onBlurField = (field) => () => {
    setTouched({ ...touched, [field]: true });
  };

  const onChangeValue = (field) => (e) => {
    setValue({ ...value, [field]: e.target.value });
    setErrorLogin(false);
  };

  const onChangePasswordField = (field) => (e) => {
    setPasswordFields({ ...passwordFields, [field]: e.target.value });
  };

  const check = (field) => {
    if (!touched[field]) return true;
    if (!value[field]) return false;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    setTimeout(() => {
      const isSuccess = login(value.userName, value.password); // Sử dụng login từ AuthContext
      console.log("Mật khẩu đăng nhập:", value.password);
      if (isSuccess) {
        message.success("Đăng nhập thành công");
        navigate("/");
      } else {
        setErrorLogin(true);
      }
      setLoading(false);
    }, 1500);
  };
  

  

  const handlePasswordChange = async () => {
    const { oldPassword, newPassword, confirmNewPassword } = passwordFields;

    if (newPassword !== confirmNewPassword) {
      message.error("Mật khẩu mới và xác nhận mật khẩu không khớp.");
      return;
    }

    try {
      await changePassword(oldPassword, newPassword);
      message.success("Mật khẩu đã được cập nhật thành công.");
      setPasswordFields({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      setIsChangingPassword(false);
    } catch (error) {
      message.error(error.message || "Đổi mật khẩu thất bại.");
    }
  };

  return (
    <div className="background-login">
      <div className="login-background-child">
        <div className="login-all">
          <div className="form-login-all">
            <h3>QUẢN LÝ CHUNG CƯ BLUEMOON</h3>

            {!isChangingPassword ? (
              // Form Đăng nhập
              <form className="form-login" onSubmit={handleSubmit}>
                <Input
                  value={value.userName}
                  onChange={onChangeValue("userName")}
                  type="email"
                  className="input-login"
                  placeholder="Tên đăng nhập"
                  onBlur={onBlurField("userName")}
                />
                {!check("userName") && (
                  <p className="error-login">Xin vui lòng nhập tên đăng nhập</p>
                )}
                {errorLogin && (
                  <p className="error-login">
                    Thông tin tài khoản hoặc mật khẩu không chính xác
                  </p>
                )}
                <Input
                  value={value.password}
                  onChange={onChangeValue("password")}
                  type="password"
                  className="input-login"
                  placeholder="Mật khẩu"
                  onBlur={onBlurField("password")}
                />
                {!check("password") && (
                  <p className="error-login">Xin vui lòng nhập mật khẩu</p>
                )}
                <Button
                  className="btn-login"
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                >
                  Đăng nhập
                </Button>
                <Button
                  type="link"
                  onClick={() => setIsChangingPassword(true)}
                >
                  Đổi mật khẩu
                </Button>
              </form>
            ) : (
              // Form Đổi mật khẩu
              <div className="form-login">
                <Input
                  value={passwordFields.oldPassword}
                  onChange={onChangePasswordField("oldPassword")}
                  type="password"
                  className="input-login"
                  placeholder="Mật khẩu cũ"
                />
                <Input
                  value={passwordFields.newPassword}
                  onChange={onChangePasswordField("newPassword")}
                  type="password"
                  className="input-login"
                  placeholder="Mật khẩu mới"
                />
                <Input
                  value={passwordFields.confirmNewPassword}
                  onChange={onChangePasswordField("confirmNewPassword")}
                  type="password"
                  className="input-login"
                  placeholder="Xác nhận mật khẩu mới"
                />
                <Button
                  className="btn-login"
                  type="primary"
                  onClick={handlePasswordChange}
                  loading={loading}
                >
                  Đổi mật khẩu
                </Button>
                <Button
                  type="link"
                  onClick={() => setIsChangingPassword(false)}
                >
                  Quay lại đăng nhập
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
