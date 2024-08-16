"use client";
import Card from "react-bootstrap/Card";
import { Button, FormText, Row } from "react-bootstrap";
import { Col } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Link from "next/link";
import "@/styles/main.module.css";
import { useState } from "react";
import * as api from "@/utils/api";
import { useRouter } from "next/navigation";
import CustomAlert from "@/components/alert";
import Spinner from "react-bootstrap/Spinner";
import style1 from "@/styles/main.module.css";
function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(true);
  const [dataAlert, setDataAlert] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const [isEmail, setIsEmail] = useState(false);
  const [isInitUserName, setIsInitUserName] = useState(false);
  const [isInitPassword, setIsInitPassword] = useState(false);
  const [isInitRePassword, setIsInitRePassword] = useState(false);
  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const handleUserName = ()=>{
    emailRegex.test(userName) ? setIsEmail(true) : setIsEmail(false)
  }
  const handleRegister = async () => {
    setIsInitUserName(true)
    setIsInitPassword(true)
    setIsInitRePassword(true)
    if (userName == "" || password == "" || rePassword == "") {
      setDataAlert("Cần nhập đầy đủ thông tin"), setShowAlert(true);
      // console.log('u',userName,'p',password,'re',rePassword)
    } 
   
    else {
      setIsLoading(true)
      const userData = { username: userName, password: password };
    // Kiểm tra xem tên tài khoản có dạng email hay không
   
      if (password === rePassword) {
        // Nếu mật khẩu và mật khẩu nhập lại khớp nhau
        const r = await api.createUser(userData);
        r.error
          ? (setDataAlert(r.error.message), setShowAlert(true))
          : (await r) && router.push("/login");
        // console.log("r", r);
      } else if(password !== rePassword && password !== "" && rePassword !== "") {
        setDataAlert("Mật khẩu cần trùng khớp"), setShowAlert(true);
        // Nếu mật khẩu và mật khẩu nhập lại không khớp nhau
        // Thực hiện các hành động khác nếu cần
      }
    }
    setIsLoading(false)
  };

  return (
    <>
      <div
        style={{ display: "grid", placeItems: "center", height: "100vh" }}
        className=""
      >
        <div
          className={`${style1.card} bg-white rounded-3 shadow p-5`}
     
          style={{  height: "500px" }}
        >
          <Card.Body>
            <Card.Title style={{ fontSize: "30px" }} className="mb-3">
              Đăng ký
            </Card.Title>

            <Form>
              <Form.Group className="mb-3 position-relative ">
                <Form.Label>Tên đăng nhập </Form.Label>
                <Form.Control
                  type="email"
                  placeholder="name@example.com"
                  onChange={(e) => {
                    setUserName(e.target.value);
                    handleUserName()
                  }}
                  required
                />
                {userName  && !isEmail ? (
                   <FormText
                   style={{ fontSize: "10px" }}
                   className="position-absolute text-danger"
                 >
                   *Tên tài khoản phải có dạng ten@gmail.com
                 </FormText>
                ):''}
                {userName || !isInitUserName === true ? (
                  ""
                ) : (
                  <FormText
                    style={{ fontSize: "10px" }}
                    className="position-absolute text-danger"
                  >
                    *Cần điền thông tin đăng nhập
                  </FormText>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Mật khẩu</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
                {password || !isInitPassword === true ? (
                  ""
                ) : (
                  <FormText
                    style={{ fontSize: "10px" }}
                    className="position-absolute text-danger"
                  >
                    *Cần điền thông tin mật khẩu
                  </FormText>
                )}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Nhập lại mật khẩu</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  onChange={(e) => {
                    setRePassword(e.target.value);
                  }}
                />
                {rePassword || !isInitRePassword === true ? (
                  ""
                ) : (
                  <FormText
                    style={{ fontSize: "10px" }}
                    className="position-absolute text-danger"
                  >
                    *Cần điền điền lại mật khẩu
                  </FormText>
                )}
              </Form.Group>
              <Button className="mb-3 w-100"  disabled={isLoading} onClick={handleRegister}>
              {isLoading? <Spinner animation="border" variant="light" />:' Đăng ký'}
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
              </Row>
              <Row className="my-3 w-80 center text-center">
                <div className="">
                  Bạn đã có tài khoản?{" "}
                  <Link style={{ textDecoration: "none" }} href={"/login"}>
                    Đăng nhập
                  </Link>
                </div>
              </Row>
            </Form>
          </Card.Body>
        </div>
      </div>
      <CustomAlert
        show={showAlert}
        onClose={handleCloseAlert}
        data={dataAlert}
      />
    </>
  );
}
export default Login;
