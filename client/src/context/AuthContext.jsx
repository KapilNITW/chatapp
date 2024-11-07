//  here TODO is for just highlighting the comments 



import { createContext, useCallback, useEffect, useState } from "react";
import { baseUrl, postReq } from "../utils/service";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [resgisterError, setRegisterError] = useState(null);
    const [isRegisterloading, setIsRegisterloading] = useState(false);
    const [registerInfo, setRegisterInfo] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [loginError, setLoginrError] = useState(null);
    const [isLoginloading, setIsLoginloading] = useState(false);
    const [loginInfo, setLoginInfo] = useState({
        email: "",
        password: "",
    });

    console.log("loginInfo: " , loginInfo);

    // TODO: useEffect which is responsible for storing a user in a local storage
    useEffect(() => {
        const user = localStorage.getItem("User");

        setUser(JSON.parse(user));
    }, []);

    // TODO: this updates the value of registerInfo and loginInfo
    const updateRegistrationInfo = useCallback((info) => {
        setRegisterInfo(info);
    }, []);
    const updateLoginInfo = useCallback((info) => {
        setLoginInfo(info);
    }, []);

    // TODO: this is the function which is responsible for sending register info to backend which forwards details to postReq func which is in Service.js

    const registerUser = useCallback(async (e) => {
        e.preventDefault();

        setIsRegisterloading(true);
        setRegisterError(null);


        const response = await postReq(`${baseUrl}/users/register`, JSON.stringify(registerInfo));
        setIsRegisterloading(false);
        if (response.error) {
            return setRegisterError(response);
        }
        localStorage.setItem("User", JSON.stringify(response));
        setUser(response);
    }, [registerInfo]);


    // TODO: this is for login user 
    const loginUser = useCallback(async(e) => {
        e.preventDefault();

        setIsLoginloading(true);
        setLoginrError(null);
        
        const response = await postReq(`${baseUrl}/users/login`, JSON.stringify(loginInfo));
        
        setIsLoginloading(false);
        
        if (response.error) {
            return setLoginrError(response);
        }
        localStorage.setItem("User",JSON.stringify(response));
        setUser(response);
    }, [loginInfo]);


    // TODO: this is logging out
    const logoutUser = useCallback(async () => {
        localStorage.removeItem("User");
        setUser(null);
    }, []);


    // TODO: this is something which will allow that which functions and variables will be global and can be accessed through anywhere using authcontext 
    return <AuthContext.Provider value={{
        user,
        registerInfo,
        updateRegistrationInfo,
        registerUser,
        resgisterError,
        isRegisterloading,
        logoutUser,
        updateLoginInfo,
        loginUser,
        loginError,
        isLoginloading,
        loginInfo
    }}>
        {children}
    </AuthContext.Provider>
}