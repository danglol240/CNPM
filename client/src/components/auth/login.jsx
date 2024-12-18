import React, { useState } from "react";
import { Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState({
    userName: "",
    password: "",
  });
  const [changePassword, setChangePassword] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorLogin, setErrorLogin] = useState(false);

  const onBlurField = (field) => () => {
    setTouched({ ...touched, [field]: true });
  };

  const onChangeValue = (field) => (e) => {
    setValue({ ...value, [field]: e.target.value });
    setErrorLogin(false);
  };

  const onChangePasswordField = (field) => (e) => {
    setChangePassword({ ...changePassword, [field]: e.target.value });
  };

  const check = (field) => {
    if (!touched[field]) return true;
    if (!value[field]) return false;
    return true;
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Giả lập API call đăng nhập
    setTimeout(() => {
      if (value.userName === "admin@1" && value.password === "123") {
        message.success("Đăng nhập thành công");
        sessionStorage.setItem("checkLogin", true);
        navigate("/");
      } else {
        setErrorLogin(true);
      }
      setLoading(false);
    }, 1500);
  };

  const handleChangePassword = async () => {
    const { oldPassword, newPassword, confirmNewPassword } = changePassword;

    // Kiểm tra điều kiện hợp lệ
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      return message.error("Vui lòng nhập đầy đủ các trường.");
    }
    if (newPassword !== confirmNewPassword) {
      return message.error("Mật khẩu mới và xác nhận mật khẩu không khớp.");
    }
    if (oldPassword === newPassword) {
      return message.error("Mật khẩu mới không được giống mật khẩu cũ.");
    }

    setLoading(true);

    // Gửi yêu cầu đổi mật khẩu (giả lập API call)
    setTimeout(() => {
      message.success("Đổi mật khẩu thành công!");
      setChangePassword({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      setIsChangingPassword(false);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="background-login">
      <div className="login-background-child">
        <div className="login-all">
          <div className="form-login-all">
            <h3>QUẢN LÝ CHUNG CƯ BLUEMOON</h3>

            {!isChangingPassword ? (
              // Form Đăng nhập
              <form className="form-login" onSubmit={submit}>
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
                  value={changePassword.oldPassword}
                  onChange={onChangePasswordField("oldPassword")}
                  type="password"
                  className="input-login"
                  placeholder="Mật khẩu cũ"
                />
                <Input
                  value={changePassword.newPassword}
                  onChange={onChangePasswordField("newPassword")}
                  type="password"
                  className="input-login"
                  placeholder="Mật khẩu mới"
                />
                <Input
                  value={changePassword.confirmNewPassword}
                  onChange={onChangePasswordField("confirmNewPassword")}
                  type="password"
                  className="input-login"
                  placeholder="Xác nhận mật khẩu mới"
                />
                <Button
                  className="btn-login"
                  type="primary"
                  onClick={handleChangePassword}
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
