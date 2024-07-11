import Shape from "@/components/shape/Shape";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Array } from "@/lib/utils";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [longUrl, setLongUrl] = useState("");
  const navigate = useNavigate();

  const handleShortner= (e)=>{
e.preventDefault();
if(longUrl) navigate(`/auth?createNew=${longUrl}`)
  }
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-3xl sm:text-6xl md:text-7xl text-center my-6 sm:my-8 md:my-10 tracking-tight font-extrabold capitalize ">
        Now you can Shorten you long url in no time
      </h2>
      <form onSubmit={(e)=>handleShortner(e)} className="sm:h-14 flex sm:flex-row flex-col w-full md:w-2/4 gap-2 ">
        <Input
          type="url"
          className="h-full p-4 flex-1"
          value={longUrl}
          placeholder='Enter your long url here'
          onChange={(e) => setLongUrl(e.target.value)}
        />
        <Button className="px-4 bg-purple-500 h-full" type="submit">
          Shorten
        </Button>
      </form>
      <div className="my-auto">
<Shape data={Array}/>
        
      </div>
    </div>
  );
};

export default Home;
