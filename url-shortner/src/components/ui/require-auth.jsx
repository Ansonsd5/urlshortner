import React, { useEffect } from "react";
import { UrlState } from "@/context";
import { useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";

function RequiredAuth({ children }) {
  const { isAuthenticated, loading } = UrlState();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated && loading === false) navigate("/auth");
  }, [isAuthenticated, loading]);
  if (loading) return <BarLoader width={"100%"} color="#3bffea" />;
  if (isAuthenticated) return children;
}

export default RequiredAuth;
