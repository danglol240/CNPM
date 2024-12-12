import React, { useState } from "react";
import { Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState({
    userName: "",
    password: "",
  });
  const [touched, setTouched] = useState({
    userName: false,
    password: false,
  });
  const [loading, setLoading] = useState(false);
  const [errorLogin, setErrorLogin] = useState(false);
  const onBlurField = (field) => () => {
    setTouched({ ...touched, [field]: true });
    setErrorLogin(false);
  };
  const onChangeValue = (item) => (e) => {
    setValue({ ...value, [item]: e.target.value });
    setErrorLogin(false);
  };
  const check = (field) => {
    if (!touched[field]) return true;
    if (!value[field]) return false;
    return true;
  };
  // const submit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   const url = "https://localhost:3000/login";
  //   try {
  //     const response = await fetch(url, {
  //       method: "POST",
  //       headers: {
  //         "Content-type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         userName: value.userName,
  //         password: value.password,
  //       }),
  //     });
  //     if (response.ok) {
  //       message.success("Đăng nhập thành công");
  //       setValue({
  //         userName: "",
  //         password: "",
  //       });
  //       setTouched({
  //         userName: false,
  //         password: false,
  //       });
  //       navigate("/");
  //     } else {
  //       setErrorLogin(true);
  //       setValue({
  //         userName: "",
  //         password: "",
  //       });
  //       setTouched({
  //         userName: false,
  //         password: false,
  //       });
  //     }
  //   } catch (error) {
  //     message.error("Lỗi mạng, xin vui lòng gửi lại");
  //     setValue({
  //       userName: "",
  //       password: "",
  //     });
  //     setTouched({
  //       userName: false,
  //       password: false,
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Giả lập API call
    setTimeout(() => {
      // Giả sử tên người dùng đúng là "admin" và mật khẩu là "admin123"
      if (
        value.userName === "danglol@gmail.com" &&
        value.password === "dang2004"
      ) {
        message.success("Đăng nhập thành công");
        sessionStorage.setItem("checkLogin", true);
        navigate("/"); // Chuyển đến trang chủ sau khi đăng nhập thành công
      } else {
        setErrorLogin(true); // Hiển thị thông báo lỗi
        setValue({
          userName: "",
          password: "",
        });
        setTouched({
          userName: false,
          password: false,
        });
      }
      setLoading(false);
    }, 1500); // Giả lập thời gian trễ là 1500 milliseconds
  };
  return (
    <div className="background-login">
      <div className="login-background-child">
        <div className="login-all">
          <div className="form-login-all">
            <h3>QUẢN LÝ CHUNG CƯ BLUEMOON </h3>
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
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
