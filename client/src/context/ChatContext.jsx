import { createContext, useState, useEffect, useCallback } from "react";
import { baseUrl, getReq, postReq } from "../utils/service";
import { io } from "socket.io-client";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
    const [userChats, setUserChats] = useState(null);
    const [isUserChatLoading, setIsUserChatLoading] = useState(false);
    const [userChatsError, setUserChatsError] = useState(null);
    const [potentialChats, setPotentialChats] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]); // Initialize as an empty array
    const [isMessagesLoading, setIsMessagesLoading] = useState(false);
    const [messagesError, setMessagesError] = useState(null);
    const [sendTextMessageError, setSendTextMessageError] = useState(null);
    const [newMessage, setNewMessage] = useState(null);
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [allUsers, setAllUsers] = useState([]);

    // Initialize socket

    console.log("notifications: ", notifications);
     

    // 1

    useEffect(() => {
        const newSocket = io("http://localhost:3000");
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [user]);

    //  2   Manage online users
    useEffect(() => {
        if (socket === null) return;
        socket.emit("addNewUser", user?._id);
        socket.on("getOnlineUsers", (res) => {
            setOnlineUsers(res);
        });

        return () => {
            socket.off("getOnlineUsers");
        };
    }, [socket, user]);

    // 3  Send message
    useEffect(() => {
        if (socket === null) return;
        const recipientId = currentChat?.members?.find((id) => id !== user?._id);
        if (newMessage) { // Added a check to ensure newMessage is not null
            socket.emit("sendMessage", { ...newMessage, recipientId });
        }
    }, [newMessage, socket, currentChat, user]); // Added newMessage to dependency array

    // 4 Receive message and notification 
    useEffect(() => {
        if (socket === null) return;
        socket.on("getMessage", (res) => {
            if (currentChat?._id !== res.chatId) return;
            setMessages((prev) => [...prev, res]);
        });
        socket.on("getNotification", (res) => {
            const isChatOpen = currentChat?.members.some(id => id === res.senderId);
            if (isChatOpen) {
                setNotifications(prev => [{ ...res, isRead: true }, ...prev])
            } else {
                setNotifications(prev => [res, ...prev]);
            }
        })
        return () => {
            socket.off("getMessage"); // Corrected event name from "getMessages" to "getMessage"
            socket.off("getNotification");
        };
    }, [socket, currentChat]);

    // 5 Fetch all users and determine potential chats
    useEffect(() => {
        const getUsers = async () => {
            const response = await getReq(`${baseUrl}/users`);
            if (response.error) {
                return console.log("Error fetching users", response);
            }
            const pChats = response.filter((u) => {
                let isChatCreated = false;
                if (user?._id === u?._id) return false;
                if (userChats) {
                    isChatCreated = userChats.some((chat) => {
                        return chat.members.includes(u?._id);
                    });
                }
                return !isChatCreated;
            });
            setPotentialChats(pChats);
            setAllUsers(response)
        };
        getUsers();
    }, [userChats, user]); // Added 'user' to dependency array

    // 6 Fetch user chats
    useEffect(() => {
        const getUserChats = async () => {
            if (user?._id) {
                setIsUserChatLoading(true);
                setUserChatsError(null);

                const response = await getReq(`${baseUrl}/chats/${user._id}`);
                setIsUserChatLoading(false);

                if (response.error) {
                    return setUserChatsError(response);
                }
                setUserChats(response);
            }
        };
        getUserChats();
    }, [user,notifications]);

    // 7 Fetch messages for the current chat
    useEffect(() => {
        const getMessages = async () => {
            if (currentChat?._id) {
                setIsMessagesLoading(true);
                setMessagesError(null);

                const response = await getReq(`${baseUrl}/messages/${currentChat._id}`);
                setIsMessagesLoading(false);

                if (response.error) {
                    return setMessagesError(response);
                }
                setMessages(response);
            }
        };
        getMessages();
    }, [currentChat]);

    //  8 
    const sendTextMessage = useCallback(async (textMessage, sender, currentChatId, setTextMessage) => {
        if (!textMessage) return;

        const response = await postReq(`${baseUrl}/messages`, JSON.stringify({
            chatId: currentChatId,
            senderId: sender._id,
            text: textMessage
        }));

        if (response.error) {
            return setSendTextMessageError(response);
        }
        setNewMessage(response);
        setMessages((prev) => [...prev, response]);
        setTextMessage("");
    }, []);

    const updateCurrentChat = useCallback((chat) => {
        setCurrentChat(chat);
    }, []);


    //   9 
    const createChat = useCallback(async (firstId, secondId) => {
        const response = await postReq(`${baseUrl}/chats`, JSON.stringify({
            firstId, secondId,
        }));
        if (response.error) {
            return console.log("Error Creating User", response);
        }
        setUserChats((prev) => [...prev, response]);
    }, []);

    const markAllNotificationsAsRead = useCallback((notifications) => {
        const mNotifications = notifications.map((n) => {
            return { ...n, isRead: true };
        });
        setNotifications(mNotifications);
    }, [])


    //  10
    const markNotificationsAsRead = useCallback((n, userChats, user, notifications) => {
        const desireChat = userChats.find(chat => {
            const chatMembers = [user._id, n.senderId];
            const isDesireChat = chat?.members.every((member) => {
                return chatMembers.includes(member);
            });
            return isDesireChat;
        });


        // 11 mark notification as read
        const mNotifications = notifications.map(el => {
            if (n.senderId === el.senderId) {
                return { ...n, isRead: true }
            } else {
                return el;
            }
        })
        updateCurrentChat(desireChat)
        setNotifications(mNotifications);
    },[])

    const markThisUserNotificationsAsRead = useCallback((thisUserNotifications , notifications) => {

        const mNotifications = notifications.map(el => {
            let notification;
        
        thisUserNotifications.forEach(n=>{
            if(n.senderId === el.senderId){
                notification = {...n,isRead:true};
            }else{
                notification = el;
            }
        });
        return notification;
        });
        setNotifications(mNotifications);

    },[])
    
    return (
        <ChatContext.Provider value={{
            currentChat,
            userChats,
            isUserChatLoading,
            userChatsError,
            potentialChats,
            createChat,
            updateCurrentChat,
            messages,
            messagesError,
            isMessagesLoading,
            sendTextMessage,
            onlineUsers,
            notifications,
            allUsers,
            markNotificationsAsRead,
            markAllNotificationsAsRead,
            markThisUserNotificationsAsRead,
        }}>
            {children}
        </ChatContext.Provider>
    );
};
