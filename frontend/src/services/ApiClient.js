class ApiClient {

    // make a enhanced fetch function that automatically adds the base URL and handles errors
    BASE_URL = "http://localhost:5000/api/v1";
    
    async apiFetch(endpoint,method='GET',data=null){

        // Authorization token in headers
       const headers = {
            "Authorization": `Bearer ${data?.userId}`
        }

        // options for the fetch request
       const options ={
            method:method,
            body:!data ? null : data,
            headers: headers
        }

        const response = await fetch(`${this.BASE_URL}${endpoint}`,options)
        return response.json();
    }

    // define the API methods
    async uploadFile(file){
        return this.apiFetch('/upload-pdf', 'POST', file);
    }
}

const apiClient = new ApiClient();
export default apiClient;