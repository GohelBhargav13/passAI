class ApiClient {

    // make a enhanced fetch function that automatically adds the base URL and handles errors
    BASE_URL = "https://passai-nrmh.onrender.com/api/v1";
    
    async apiFetch(endpoint,method='GET',data=null,isForm=false){
        const headers = {}

        if (!isForm && data) {
            headers["Content-Type"] = "application/json";
        }

        // options for the fetch request
       const options ={
            method:method,
            body:isForm ? data : ( data ? JSON.stringify(data) : null),
            headers: headers
        }

        const response = await fetch(`${this.BASE_URL}${endpoint}`,options)

        return response.json();
    }

    // define the API methods
    async uploadFile(file){
        return this.apiFetch('/paper/upload-pdf', 'POST', file,true);
    }

    // find the user history api call
    async findUserHistory(useremail){
        return this.apiFetch(`/user/history`,'POST',{ user_email:useremail })
    }

    // find the user history api call
    async findPaperResponseById(historyId){
        return this.apiFetch(`/user/history/details/${historyId}`)
    }

    // save the user response to the database
    async saveUserResponse(data){
        return this.apiFetch('/user/history/save-response', 'POST', data)
    }

    // verify otp 
    async verifyOtpFunc(user_otp){
        return this.apiFetch("/user/verify-otp",'POST',{ user_otp:user_otp })
    }

    // save a paper analysis in the database
    async saveUserPaperAnalysis(data){
        return this.apiFetch("/user/save/user-response",'POST',data)
    }

    // user resend otp handler
    async userResendOtp(useremail){
        return this.apiFetch("/user/resend-otp","POST",{ useremail })
    }
}

const apiClient = new ApiClient();
export default apiClient;