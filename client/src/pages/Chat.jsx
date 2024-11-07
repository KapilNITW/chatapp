import { useContext, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";
import {Container,Stack} from "react-bootstrap";
import UserChat from "../components/chat/UserChat";
import PotentialChats from "../components/chat/PotentialChats";
import ChatBox from "../components/ChatBox";

const Chat = () => {

    const {userChats,isUserChatLoading,updateCurrentChat} = useContext(ChatContext);
    const {user} = useContext(AuthContext);

    return (<>
        <Container>
            <PotentialChats/>
            {userChats?.length < 1 ? null: (
                <Stack direction ="horizontal" gap={5} className="align-items-start">
                    <Stack className="message-box flex-grow-0 pe-3" gap={3}>
                        {isUserChatLoading && <p>Loading chats....</p>}
                        {userChats?.map((chat,index)=>{
                            return(
                                <div key={index} onClick={()=>{updateCurrentChat(chat);}}>

                                    <UserChat chat={chat} user={user}/>
                                    
                                </div>
                            );
                        })};
                    
                    </Stack>
                    <ChatBox/>
                </Stack>
            )}
        </Container>
    </>);
}

export default Chat;