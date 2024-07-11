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
import { signUp } from "@/db/apiAuth";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UrlState } from "@/context";

const SignUp = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");

  const [errors, setErrors] = useState([]);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    profile_pic: null,
  });

  const { fetchUser } = UrlState();
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };
  const handleSignUp = async () => {
    setErrors([]);
    try {
      const schema = Yup.object().shape({
        email: Yup.string()
          .email("Invalid Emial")
          .required("Email is required"),
        name: Yup.string()
          .min(3, "Name can not be less than 3 character")
          .required("Name is required"),
        password: Yup.string()
          .min(6, "Password can not be less than 6 character")
          .required("Password is required"),
        profile_pic: Yup.mixed().required("Display picture is required"),
      });
      await schema.validate(formData, { abortEarly: false });
      await fnSignUp();
    } catch (e) {
      const newErrors = {};

      e?.inner?.forEach((err) => {
        newErrors[err.path] = err.message;
      });

      setErrors(newErrors);
    }
  };

  const { data, loading, error, fn: fnSignUp } = useApiCall(signUp, formData);

  useEffect(() => {
    if (error === null && data) {
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
      fetchUser();
    }
  }, [loading, error]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>SignUp</CardTitle>
        <CardDescription>Create a new account</CardDescription>
        {error && <Error message={error.message} />}
      </CardHeader>
      <CardContent classname="space-y-2">
        <div className="my-2 text-left">
          <Input
            onChange={handleInputChange}
            type="name"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
          />
          {errors.name && <Error message={errors.name} />}
        </div>
        <div className="my-2 text-left">
          <Input
            onChange={handleInputChange}
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
          />
          {errors.email && <Error message={errors.email} />}
        </div>
        <div className="space-y-1 text-left">
          <Input
            onChange={handleInputChange}
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
          />
          {errors.password && <Error message={errors.password} />}
        </div>
        <div className="space-y-1 text-left my-2">
          <Input
            onChange={handleInputChange}
            type="file"
            name="profile_pic"
            accept='image/*'
          />
          {errors.profile_pic && <Error message={errors.profile_pic} />}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSignUp}>
          {loading ? <BeatLoader size={10} color="#3bffea" /> : "Create now"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SignUp;
