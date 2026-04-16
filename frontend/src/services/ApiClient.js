class ApiClient {

    // make a enhanced fetch function that automatically adds the base URL and handles errors
    BASE_URL = "http://localhost:5000/api/v1";
    
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
    async findUserHistory(uuid){
        return this.apiFetch(`/user/history/${uuid}`)
    }

    // find the user history api call
    async findPaperResponseById(historyId){
        return this.apiFetch(`/user/history/details/${historyId}`)
    }
}

const apiClient = new ApiClient();
export default apiClient;