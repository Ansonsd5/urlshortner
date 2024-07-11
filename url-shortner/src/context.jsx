import { createContext, useContext, useEffect } from "react";
import { getCurrentUser } from "./db/apiAuth";
import useApiCall from "./hooks/useApiCall";

const UrlContext = createContext();

const UrlProvider = ({ children }) => {

  const {data : user ,loading,fn:fetchUser} = useApiCall(getCurrentUser);
  const isAuthenticated = user?.role === "authenticated";



  useEffect(()=>{fetchUser()},[])
  return <UrlContext.Provider value={{user,fetchUser,isAuthenticated,loading}}>{children}</UrlContext.Provider>;

};
export const UrlState = () => useContext(UrlContext);

export default UrlProvider;

