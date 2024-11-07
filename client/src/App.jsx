import { Route, Routes,Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import NavBar from "./components/Navbar";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container} from "react-bootstrap";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { ChatContextProvider } from "./context/ChatContext";
function App() {
 const {user} = useContext(AuthContext);
  return (
    <ChatContextProvider user ={user}>
   <NavBar/>
    <Container className="text-success">  
      <Routes>
       <Route path="/" element={user ? <Chat/> : <Login/>}></Route> 
       <Route path="/register" element={user ? <Chat/> :<Register/>}></Route> 
       <Route path="/login" element={user ? <Chat/> :<Login/>}></Route> 
       <Route path="/" element={<Navigate to="/" />}></Route>
      </Routes>
     </Container>
     </ChatContextProvider>
    
  )
}

export default App
