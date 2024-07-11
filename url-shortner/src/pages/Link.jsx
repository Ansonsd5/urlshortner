import ClickStas from "@/components/clickstats/ClickStats";
import LocationStats from "@/components/location/LocationStats";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, Card, CardTitle } from "@/components/ui/card";
import { UrlState } from "@/context";
import { deleteUrl, getClicksForUrl, getUrl } from "@/db/apiUrls";
import useApiCall from "@/hooks/useApiCall";
import { Copy, Download, LinkIcon, Trash2 } from "lucide-react";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BarLoader, BeatLoader } from "react-spinners";

const Link = () => {
  const { id } = useParams();
  const { user } = UrlState();
  const navigate = useNavigate();
  const {
    error: getUrlError,
    data: urlData,
    loading: urlLoading,
    fn: fnGetUrl,
  } = useApiCall(getUrl, { id, user_id: user?.id });

  const {
    error,
    loading,
    data,
    fn: fnGetClicksForUrl,
  } = useApiCall(getClicksForUrl, id);

  const {
    error: errorDeleteUrl,
    loading: loadingDelete,
    fn: fnDelete,
  } = useApiCall(deleteUrl, urlData?.id);

  useEffect(() => {
    fnGetUrl(), fnGetClicksForUrl();
  }, []);

  const TRIMMER = "https://trimmer/in/";

  let link = "";
  if (urlData) {
    link = urlData?.custom_url ? urlData?.custom_url : urlData?.short_url;
  }

  if (errorDeleteUrl) {
    navigate("/dashboard");
  }

  const downloadImage = () => {
    const imageUrl = urlData?.qr;
    const fileName = urlData?.title;

    const ancor = document.createElement("a");
    ancor.href = imageUrl;
    ancor.download = fileName;
    ancor.target = "_blank";

    document.body.appendChild(ancor);
    ancor.click();

    document.body.removeChild(ancor);
  };
  console.log("urlData", data);
  return (
    <>
      {(loading || urlLoading) && <BarLoader width={"100%"} color="#3bffea" />}
      <div className="grid grid-cols-2 sm:flex-row gap-8 justify-between">
        <div className="flex flex-col items-start gap-8 rounded-lg sm:w-2/5">
          <span className="text-6xl font-extrabold hover:underline cursor-pointer">
            {urlData?.title}
          </span>
          <a target="_blank" href={`${TRIMMER}${link}`} className="">
            {TRIMMER + link}
          </a>
          <a
            href={urlData?.original_url}
            target="_blank"
            className="text-3xl font-bold hover:underline cursor-pointer sm:text-4xl text-blue-400 "
          >
            {urlData?.original_url}
            <LinkIcon className="p-1" />
          </a>
          <span>{new Date(urlData?.created_at).toLocaleString()}</span>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() =>
                navigator.clipboard.writeText(
                  `https://trimmer.in/${url?.short_url}`
                )
              }
            >
              <Copy />
            </Button>
            <Button variant="ghost" onClick={downloadImage}>
              <Download />
            </Button>

            <Button variant="ghost" onClick={() => fnDelete()}>
              {loadingDelete ? (
                <BeatLoader size={5} color="white" />
              ) : (
                <Trash2 />
              )}
            </Button>
          </div>
          <img
            src={urlData?.qr}
            className=" ring ring-blue-400 p-1 object-contain"
            alt="qr code"
          />
        </div>

       
        <Card className="sm:w-3/5">
          <CardHeader><CardTitle className="text-4xl font-extrabold">
          Stats</CardTitle></CardHeader>
          {data && data.length ? (
            <CardContent>
              <Card>
          <CardHeader>
            <CardTitle>Links Created</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{data?.length}</p>
          </CardContent>
        </Card>
              <LocationStats stats={data} />
              <CardTitle>Device Info</CardTitle>
              <ClickStas stats={data} />
            </CardContent>
          ) : (
            <CardContent>
              {loading === false ? (
                "No Statistics"
              ) : (
                <BeatLoader size={20} color="#decffe" />
              )}
            </CardContent>
          )}
        </Card>
      </div>
    </>
  );
};

export default Link;
