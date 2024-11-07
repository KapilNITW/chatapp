import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { baseUrl, getReq } from "../utils/service";

const UseFetchLatestMessage = (chat) => {
    const {newMessage , notifications} = useContext(ChatContext);
const [latestMessage , setLatestMessage] = useState(null);
    useEffect ( ()=>{
        const getMessages = async () => {
            const response = await getReq(`${baseUrl}/messages/${chat?._id}`);

            if(response.error){
                return console.log("Error getting Message...",error);
            }
            const lastMessage = response[response?.length-1];
            setLatestMessage(lastMessage);
        };
        getMessages();

    },[newMessage,notifications]);
     
    return {latestMessage};

    }
 
export default UseFetchLatestMessage;