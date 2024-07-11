import { UrlState } from "@/context";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as yup from "yup";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Error from "../error/Error";
import { Card } from "./card";
import { QRCode } from "react-qrcode-logo";
import useApiCall from "@/hooks/useApiCall";
import { createUrl } from "@/db/apiUrls";
import { BeatLoader } from "react-spinners";

const CreateLink = () => {
  const { user } = UrlState();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");
  const ref = useRef(null);
  const [error, setError] = useState({});
  const [formValues, setFormValue] = useState({
    title: "",
    longUrl: longLink ? longLink : "",
    customUrl: "",
  });

  const schema = yup.object().shape({
    title: yup.string().required("Title is required"),
    longUrl: yup
      .string()
      .url("Must be url type")
      .required("Long url is required"),
    customUrl: yup.string(),
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormValue({
      ...formValues,
      [id]: value,
    });
  };

 
  const {
    loading: createLoading,
    error: createUrlError,
    data: createUrlData,
    fn: fnCreateUrl,
  } = useApiCall(createUrl, { ...formValues, user_id: user.id });

  useEffect(()=>{

    console.log("createUrlData",createUrlData)
    if(createUrlError === null && createUrlData) navigate(`/link/${createUrlData[0]?.id}`)
      },[createUrlError,createUrlData]);
    

  const createNewLink = async () => {
    setError([]);
    try {
      await schema.validate(formValues, { abortEarly: false });

      const canvas = ref.current.canvasRef.current;

      const blob = await new Promise((resolve) => canvas.toBlob(resolve));
      await fnCreateUrl(blob);
    } catch (e) {
      const newError = {};
      e?.inner?.forEach((err) => {
        newError[err.path] = err.message;
      });
      setError(newError);
    }
  };

  return (
    <Dialog
      defaultOpen={longLink}
      onOpenChange={(res) => {
        if (!res) setSearchParams({});
      }}
    >
      <DialogTrigger>
        <Button variant="destructive">Create New Link</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-bold text-lg">Create New</DialogTitle>
        </DialogHeader>
        {formValues?.longUrl && (
          <QRCode size={250} value={formValues?.longUrl} ref={ref} />
        )}
      
        <Input
          id="title"
          placeholder="Short links title"
          onChange={handleChange}
          value={formValues.title}
        />
       {error.title &&  <Error message={error.title} />}
        <Input
          id="longUrl"
          placeholder="Enter your log url"
          onChange={handleChange}
          value={formValues.longUrl}
        />
       {error.longUrl &&  <Error message={error.longUrl} />}
       {createUrlError  && <Error message={"Unable to create new Link "} />}
        <div className="flex items-center gap-2">
          <Card className="p-2">trimmer.in</Card>/
          <Input
            id="customUrl"
            placeholder="Custom link(optional)"
            onChange={handleChange}
            value={formValues.customUrl}
          />
        </div>
        {createUrlError &&  <Error message={createUrlError.message} />}

        <DialogFooter className="md:justify-start">
          <Button
            disabled={createLoading}
            variant="destructive"
            onClick={createNewLink}
            className="bg-red-500"
          >
            {createLoading ? <BeatLoader size={10} color="white" /> : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLink;
