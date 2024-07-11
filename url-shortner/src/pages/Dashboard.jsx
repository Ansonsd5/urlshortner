import React, { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Filter } from "lucide-react";
import Error from "@/components/error/Error";
import { UrlState } from "@/context";
import useApiCall from "@/hooks/useApiCall";
import { getUrls } from "@/db/apiUrls";
import { getClicks } from "@/db/apiClicks";
import LinkCard from "@/components/ui/linkcard";
import CreateLink from "@/components/ui/create-link";

const Dashboard = () => {
  const { user } = UrlState();
  const [searchQuery, setSearchQuery] = useState("");

  console.log("user", user.id);
  const {
    error,
    data: urls,
    loading,
    fn: fnUrls,
  } = useApiCall(getUrls, user.id);

  const {
    data: clickData,
    loading: clickLoading,
    error: clicksError,
    fn: fnClick,
  } = useApiCall(
    getClicks,
    urls?.map((url) => url.id)
  );
  console.log(
    "urls",
    urls?.map((url) => url.id)
  );

  useEffect(() => {
    fnUrls();
  }, []);

  useEffect(() => {
    if (urls?.length) fnClick();
  }, [urls?.length]);

  console.log("filtered before", urls);
  const filteredUrls = urls?.filter((url) => {
    console.log(
      "insider ",
      url.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return url.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div>
      {(clickLoading || loading) && (
        <BarLoader width={"100%"} color="#3bffea" />
      )}
      <div className="grid grid-cols-2 gap-2">
        <Card>
          <CardHeader>
            <CardTitle>Links Created</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{urls?.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Clicks </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{clickData?.length}</p>
          </CardContent>
        </Card>
      </div>
      <div className="flex justify-between">
        <h1 className="font-bold text-2xl">My Links</h1>
        <CreateLink />
      </div>
      <div className="relative">
        <Input
          type="text"
          placeholder="Find the links......"
          onChange={(e) => setSearchQuery(e.target.value)}
          value={searchQuery}
        />
        <Filter className="absolute top-2 right-2 p-1" />
      </div>
      {error && <Error message={error?.message} />}

      {(filteredUrls || []).map((url, index) => {
        return <LinkCard key={index} url={url} fetchUrls={fnUrls} />;
      })}
    </div>
  );
};

export default Dashboard;
