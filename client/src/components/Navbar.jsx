import { useContext } from "react";
import { Container,Nav,Navbar,Stack } from "react-bootstrap";
import {Link} from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Notification from "./chat/Notification";



const NavBar = () => {
  const {user,logoutUser} = useContext(AuthContext);
  return <Navbar bg="dark" className = "mb-4" style={{height:"3.75rem"}}>
    <Container>
        <h2>
            <Link to="/login" className="link-light text-decoration-none">
            ChatApp
            </Link>
        </h2>
        <span className="text-warning">Welcome {user?.name}</span>
    </Container>
    <Nav>
        <Stack xs={5} direction="horizontal" gap={3} style={{alignContent:"space-around",}}>
          {
            user && (<>
            <Notification/>
            <Link onClick={()=> logoutUser()} to="/login" className="link-light text-decoration-none"> Logout</Link>
            <Container></Container>
            </>)
          }
          {!user &&
            (<>
              <Link to="/login" className="link-light text-decoration-none"> Login</Link>
            <Link to="/register" className="link-light text-decoration-none"> Register</Link>
           <Container></Container>
            </>)
          }
            
        </Stack>
    </Nav>
  </Navbar>
}
export default NavBar;