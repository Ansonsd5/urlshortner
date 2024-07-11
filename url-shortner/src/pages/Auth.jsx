import React, { useContext, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Login from "@/components/login/Login";
import SignUp from "@/components/signup/Signup";
import UrlProvider, { UrlState } from "@/context";


const Auth = () => {
  const [searchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");
  const navigate = useNavigate();
  // const {isAuthenticated} = useContext(UrlProvider);

  const {isAuthenticated ,loading}=UrlState();
  console.log("test",isAuthenticated,loading)

  useEffect(()=>{
    if(isAuthenticated && !loading){
      console.log("its vcom");
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ''}`);
      
    }
  },[isAuthenticated,loading])

  return (
    <div className="mt-20 flex text-center items-center flex-col gap-10">
      <h2 className="text-5xl  font-extrabold">
        {longLink
          ? "Hold up!! lets login first"
          : "Login / Signup"}
      </h2>
      <Tabs defaultValue="login" className="w-[400px]">
  <TabsList className='grid w-full grid-cols-2'>
    <TabsTrigger value="login">Login</TabsTrigger>
    <TabsTrigger value="signup">Signup</TabsTrigger>
  </TabsList>
  <TabsContent value="login"><Login/></TabsContent>
  <TabsContent value="signup"><SignUp /></TabsContent>
</Tabs>

    </div>
  );
};

export default Auth;
