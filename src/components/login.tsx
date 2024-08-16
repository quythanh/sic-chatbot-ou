'use client'
import IUser from "@/models/user"
import Link from "next/link"
import { Button } from "react-bootstrap"
import {Image} from "react-bootstrap"
import {Row} from "react-bootstrap"
import {Col} from "react-bootstrap"
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';


interface loginProp{
    user:IUser|undefined
}
function Login({user}:loginProp){
    const img = user && user.img?user.img:"https://th.bing.com/th/id/OIP.MxwWv4AAMqOlkqjNzjPk3QHaEo?w=301&h=188&c=7&r=0&o=5&dpr=1.3&pid=1.7"
    const username = user && user.username? user.username:''

    return(
        <>
        <Dropdown data-bs-theme="dark" drop="up"  >
        <Dropdown.Toggle id="dropdown-button-dark" variant="primary" style={{width:'100%'}} >
        <Row >
            <div style={{textAlign:'start', marginLeft:'10px', width:"50px" ,height:"50px"}} >
            <img  width="50px" height="50px" src={img} ></img>
            </div>
           <Col style={{width:'100%',display: "flex", justifyContent:"center",  alignItems:"center" }} className="">
            <span style={{}} className="align-middle"> {username}</span>
          
           
           </Col>
           
            </Row>
           
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item href="https://ou.edu.vn/" active>
            Web Đại học mở
          </Dropdown.Item>
          <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
          <Dropdown.Item href="/login">Đăng xuất</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item href="#/action-4">Separated link</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>


   
   
        </>
    )
}
export default Login
