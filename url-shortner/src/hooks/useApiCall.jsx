import React, { useState } from "react"

const useApiCall = (cb,options={}) =>{
    const [data,setData] = useState(null);
    const [error,setError] = useState(null);
    const [loading,setLoading] = useState(null);

    const fn = async (...args) =>{
        setLoading(true);
        setError(null);
        try {
            const response = await cb(options,...args);
            setData(response);
            
        } catch (error) {
            setError(error);
        }finally{
            setLoading(false);
        }
    }
return { fn,loading,error,data}
}
export default useApiCall;