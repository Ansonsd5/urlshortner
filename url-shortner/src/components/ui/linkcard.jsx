import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./button";
import { Copy, Trash2, Download } from "lucide-react";
import useApiCall from "@/hooks/useApiCall";
import { deleteUrl } from "@/db/apiUrls";
import { BeatLoader } from "react-spinners";

const LinkCard = ({ url, fetchUrls }) => {
  const downloadImage = () => {
    const imageUrl = url?.qr;
    const fileName = url?.title;

    const ancor = document.createElement("a");
    ancor.href = imageUrl;
    ancor.download = fileName;
    ancor.target = "_blank";

    document.body.appendChild(ancor);
    ancor.click();

    document.body.removeChild(ancor);
  };

 const {error,loading :loadingDelete,data, fn :fnDelete} = useApiCall(deleteUrl,url?.id);

  return (
    <div className="flex my-4 flex-col md:flex-row p-4 gap-5 border bg-gray-900 rounded-lg">
      <img
        className="h-32 ring ring-gray-900 object-contain self-start"
        src={url?.qr}
        alt="qr code"
      />
      <Link to={`/link/${url.id}`} className="flex flex-col flex-1">
        <span className="text-2xl sm:text-3xl font-extrabold hover:underline cursor-pointer">
          {url.title}
        </span>
        <span className="text-xl text-wrap sm:text-2xlfont-bold hover:underline text-purple-500 cursor-pointer">
        https://trimitnow.netlify.app/{url?.custom_url ? url?.custom_url : url?.s}
        </span>
        <span className="flex items-center hover:underline gap-1 cursor-pointer">
          {url?.original_url}
        </span>
        <span className="flex items-end font-extralight text-sm flex-1">
          {new Date(url?.created_at).toLocaleString()}
        </span>
      </Link>
      <div>
        <Button
          variant="ghost"
          onClick={() =>
            navigator.clipboard.writeText(
              `https://trimitnow.netlify.app/${url?.short_url}`
            )
          }
        >
          <Copy />
        </Button>
        <Button variant="ghost" onClick={downloadImage}>
          <Download />
        </Button>

        <Button variant="ghost" onClick={()=>fnDelete().then(() =>fetchUrls())}>
          {loadingDelete ? <BeatLoader size={5} color="white" /> :<Trash2 />}
        </Button>
      </div>
    </div>
  );
};

export default LinkCard;
