import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { BeatLoader } from "react-spinners";
import Error from "../error/Error";
import * as Yup from "yup";
import useApiCall from "@/hooks/useApiCall";
import { login } from "@/db/apiAuth";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UrlState } from "@/context";

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const longLink = searchParams.get('createNew');

  console.log(longLink)

  const [errors, setErrors] = useState([]);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const {fetchUser} = UrlState();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleLogin =async () => {
    setErrors([]);
    try {
      const schema = Yup.object().shape({
        email: Yup.string()
          .email("Invalid Emial")
          .required("Email is required"),
        password: Yup.string()
          .min(6, "Password can not be less than 6 character")
          .required('Password is required'),
      });
      await schema.validate(formData, {abortEarly :false});
      await fnLogin()
    } catch (e) {
      const newErrors = {};

      e?.inner?.forEach((err) =>{
        newErrors[err.path] =err.message;
      });
      setErrors(newErrors)
    }
  };

  const { data,loading,error,fn:fnLogin} = useApiCall(login,formData);

  useEffect(()=>{
    if(error === null && data){
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ''}`);
      fetchUser();
    }
console.log(data);
  },[data,error])
  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>to your account if you have one</CardDescription>
        {error && <Error message={error.message} />}
      </CardHeader>
      <CardContent classname="space-y-2">
        <div className="my-2 text-left">
          <Input
            onChange={handleInputChange}
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
          />
         {errors.email &&  <Error message={errors.email} />}
        </div>
        <div className="space-y-1 text-left">
          <Input
            onChange={handleInputChange}
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
          />
          { errors.password && <Error message={errors.password} />}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleLogin}>
          {loading ? <BeatLoader size={10} color="#3bffea" /> : "Login"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Login;
