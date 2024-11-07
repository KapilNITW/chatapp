export const baseUrl = "http://localhost:5000/api";


export const postReq = async (url, body) => {
    
    console.log(body);
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: body,
    });
    
    
    console.log(response);


    const data = await response.json();

    console.log(data);
    if (!response.ok) {
        let message;
        if (data?.message) {
            message = data.message;
        } else {
            message = data;
        }
        return { error: true, message };
    }
    return data;
};

export const getReq = async(url) =>{
   const response= await fetch(url);
    const data = await response.json();

    if(!response.ok){
       let message ="An Error Occured..."

       if(data?.message){
        message =data.message;
       }
       return {error:true , message};
    }
    return data;
}