
import { getLongUrl } from "@/db/apiUrls";
import { storeClicks } from "@/db/apiClicks";
import useApiCall from "@/hooks/useApiCall";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { BarLoader, BeatLoader } from "react-spinners";

const RedirectLink = () => {
  const { id } = useParams();
  const { error, data, loading, fn: GetLongUrl } = useApiCall(getLongUrl, id);
  const { data: statsData,loading :statsLoading, fn: fnStats } = useApiCall(storeClicks, {
    id: data?.id,
    originalUrl: data?.original_url,
  });

  useEffect(() => {
    GetLongUrl();
  }, []);

  useEffect(() => {
   
    if (!loading && data) {
     
      fnStats();
    }
  }, [loading]);

  if(loading || statsLoading){
    return <><BarLoader width={"100%"} color="#3bffea" /> <br/> Redirecting.........</>
  }


  return null;

};

export default RedirectLink;
