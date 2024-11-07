
import { useContext } from "react";
import { Alert, Button, Form, Row, Col, Stack } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext.jsx";

const Register = () => {

    // const { user } = useContext(AuthContext);

    const { registerInfo, updateRegistrationInfo, registerUser, registerError, isRegisterloading } = useContext(AuthContext);
    return (
        <>
            <Form onSubmit={registerUser}>
                <Row style={
                    {
                        height: "100vh",
                        justifyContent: "center",
                        paddingTop: "10%"
                    }
                }>
                    <Col xs={4}>
                        <h2 className="text-light">Register</h2>

                        <Stack gap={3} style={{alignContent:"center"}}>

                            {/* <h2 className="text-light">{user.name}</h2> */}
                            <Form.Control type="text" placeholder="Name" onChange={(e) => updateRegistrationInfo({ ...registerInfo, name: e.target.value })} />
                            <Form.Control type="email" placeholder="Email" onChange={(e) => updateRegistrationInfo({ ...registerInfo, email: e.target.value })} />
                            <Form.Control type="password" placeholder="Password" onChange={(e) => updateRegistrationInfo({ ...registerInfo, password: e.target.value })} />
                            <Button variant="dark" type="submit">
                                {isRegisterloading ? "Creating Your Account" : "Register"}
                            </Button>

                            {
                                registerError?.error && <Alert variant="danger">
                                    {registerError}
                                </Alert>
                            }


                        </Stack>
                    </Col>
                </Row>
            </Form>
        </>
    );
}

export default Register;