import { useContext } from "react";
import { Stack, Form, Col, Row, Button, Alert } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";



const Login = () => {
     const {
        updateLoginInfo,
        loginUser,
        loginError,
        isLoginloading,
        loginInfo
    } = useContext(AuthContext);
    return (<>
        <Form onSubmit={loginUser}>
            <Row style={
                {
                    height: "100vh",
                    justifyContent: "center",
                    paddingTop: "10%"
                }
            }>
                <Col xs={4}>
                    <h2 className="text-light">Login</h2>
                    <Stack gap={3}>

                        <Form.Control type="email" placeholder="Email" onChange={(e)=>updateLoginInfo({...loginInfo , email:e.target.value })} />
                        <Form.Control type="password" placeholder="Password" onChange={(e)=>updateLoginInfo({...loginInfo , password:e.target.value })}/>
                        <Button variant="dark" type="submit">
                            {isLoginloading?"Getting You In.....":"Login"}
                        </Button>
                        {
                            loginError?.error && (
                            <>
                                <Alert variant="danger" >
                            {loginError?.message}
                        </Alert>

                            </>)
                        }
                        
                    </Stack>
                </Col>
            </Row>
        </Form>
    </>);
}

export default Login;