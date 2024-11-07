import { useEffect, useState } from "react";
import { baseUrl, getReq } from "../utils/service";

export const useFetchRecipientUser = (chat, user) => {
    const [recipientUser, setRecipientUser] = useState(null);
    const [error, setError] = useState(null);
    const recipientId = chat?.members?.find((id) => id !== user._id);
    useEffect(() => {
        const getUser = async () => {
            if (!recipientId) {
                console.log("Recipient ID not found");
                return;  
            }

            try {
                const response = await getReq(`${baseUrl}/users/find/${recipientId}`);
                if (response.error) {
                    console.error("Error fetching recipient user:", response.error);
                    setError(response.error);
                } else {
                    setRecipientUser(response);

                }
            } catch (err) {
                setError(err);
            }
        };

        getUser();
    }, [recipientId]);

    return {recipientUser , error};
};
