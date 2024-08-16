"use client";
import Card from "react-bootstrap/Card";
import { Button, Row } from "react-bootstrap";
import { Col } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Link from "next/link";
import "@/styles/main.module.css";
import * as api from "@/utils/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CustomAlert from "@/components/alert";
import Alert from "react-bootstrap/Alert";
import { error } from "console";
import Spinner from "react-bootstrap/Spinner";
import { useAppDispatch, useAppSelector } from "@/redux/store"; // Import hooks từ store.ts

import { fetchUserStart } from "@/reducer/userSlice"; // Import action từ userSlice.ts
import { fetchUser } from "@/reducer/userSlice";
import style1 from "@/styles/main.module.css";
function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(true);
  const [dataAlert, setDataAlert] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Sử dụng hook để truy cập vào Context

  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  const loading = useAppSelector((state) => state.user.loading);
  const error = useAppSelector((state) => state.user.error);

  

  
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageLoaded(true);
    };
    img.src = "images/background_login.jpg";
  }, []);
  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const handleLogin = async () => {
    setIsLoading(true);
    // console.log("l");
    if (!userName || !password) {
      console.error("Vui lòng nhập tên người dùng và mật khẩu.");
      setDataAlert("Vui lòng nhập tên người dùng và mật khẩu.");
      setShowAlert(true);

      return;
    }

    const userData = { username: userName, password: password };
    // console.log(userData);

    try {
      const r = await api.login(userData);
      // console.log("r", r);
// 
      if (!r.error) {
        const user = await api.get_user_info(r["access_token"]);
        // console.log("user", user);

        // api.saveDataToLocal("user", user);
        // api.removeDataFromLocal('token');
        // api.removeDataFromLocal('session_id');

        // api.saveDataToLocal("user", user);
 // Gọi action để fetch user khi component được mount
        dispatch(fetchUser());
        router.push("/chat-page");

        // const arrSession = await api.getAllSessionUser(user.user_id);
        // api.saveDataToLocal("session_id", arrSession[0]["session_id"]);
      } else {
        setDataAlert(r.error.message);
        setShowAlert(true);
      }
    } catch (error) {
      console.error("Đã xảy ra lỗi khi đăng nhập:", error);
    }
    setIsLoading(false);
  };

  return (
    <>
      <img
        src="images/background_login.jpg"
        style={{ display: "none" }}
        alt="preload"
      />

      <div
        style={{
          height: "100%",
          width: "100%",
          backgroundImage: "url('/images/background_login.jpg')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        {!imageLoaded && <div>Loading...</div>}
        {imageLoaded && (
          <div
            style={{ display: "grid", placeItems: "center", height: "100vh" }}
            className=""
          >
            <div
             className={`${style1.card} bg-white rounded-3 shadow p-5`}
              style={{ height: "500px" }}
            >
              <Card.Body>
                <Card.Title style={{ fontSize: "30px" }} className="mb-3">
                  Đăng nhập
                </Card.Title>

                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Tên đăng nhập </Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="name@example.com"
                      onChange={(e) => setUserName(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Mật khẩu</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Form.Group>
                  <Button
                    className="mb-3 w-100"
                    disabled={isLoading}
                    onClick={handleLogin}
                  >
                    {isLoading ? (
                      <Spinner animation="border" variant="light" />
                    ) : (
                      " Đăng nhập"
                    )}
                  </Button>
                  <Row>
                    <Col className="text-primary">
                      <Form.Check
                        style={{ opacity: "0.7" }}
                        type="checkbox"
                        label={`Lưu mật khẩu`}
                        id={`disabled-default-checkbox`}
                      />
                    </Col>
                    <Col>
                      <Link
                        style={{ color: "inherit", textDecoration: "none" }}
                        className="custom-link"
                        href={"#"}
                      >
                        Quên mật khẩu
                      </Link>
                    </Col>
                  </Row>
                  <Row className="my-3 w-80 center text-center">
                    <div className="">
                      Bạn chưa có tài khoản?{" "}
                      <Link
                        style={{ textDecoration: "none" }}
                        href={"/register"}
                      >
                        Đăng ký
                      </Link>
                    </div>
                  </Row>
                </Form>
              </Card.Body>
            </div>
          </div>
        )}
        <CustomAlert
          show={showAlert}
          onClose={handleCloseAlert}
          data={dataAlert}
        />
      </div>
    </>
  );
}
export default Login;
