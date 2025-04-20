import axios from "axios"

const instance = axios.create({
  baseURL: import.meta.env.BACKEND_SERVER_BASE_URL || "http://localhost:3000/api/v1/",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  }
})

const apiCall = async (route, payload, method) => {
  try {
    let response = undefined
    switch(method){
      case 'GET':
        response = await instance.get(route, payload)
        break
      case 'POST':
        response = await instance.post(route, payload)
        break
      case 'PATCH':
          response = await instance.patch(route, payload)
          break
      case 'DELETE':
          response = await instance.delete(route, payload)
          break
      default:
        return { error: "Unsupported request method" };
    
    }
    console.log(response)
    /*
config: {transitional: {…}, adapter: Array(3), transformRequest: Array(1), transformResponse: Array(1), timeout: 0, …}
data: {statusCode: 201, data: {…}, message: 'User Registered Successfully', success: true}
headers: AxiosHeaders {content-length: '115', content-type: 'application/json; charset=utf-8'}
request: XMLHttpRequest {onreadystatechange: null, readyState: 4, timeout: 0, withCredentials: true, upload: XMLHttpRequestUpload, …}
status: 201
    */
    const { success, data, message } = response.data

    if (success) {
      return data
    }else if(data.status){

    } else {
      return { error: message || "Unknown API error" };
    }
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message ||
      error?.response?.data?.data?.message ||
      error?.message ||
      "Unknown request error";

    return { error: errorMessage };
  }
}


export default apiCall