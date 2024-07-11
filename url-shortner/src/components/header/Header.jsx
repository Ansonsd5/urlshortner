import React from "react";
import logo from "../../assets/images/urlhortner.jpg";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LinkIcon, LogOut } from "lucide-react";
import { UrlState } from "@/context";
import useApiCall from "@/hooks/useApiCall";
import { logout } from "@/db/apiAuth";
import { BarLoader } from "react-spinners";


const Header = () => {
    const navigate = useNavigate();
  
const {isAuthenticated,user} = UrlState();
const {error ,loading, fn: fnLogout} = useApiCall(logout);

  return (<>
    <nav className="flex  justify-between items-center py-4">
      <Link>
        <img className="h-16 w-16 rounded-full" src={logo} alt="logo-urlshortner"/>
      </Link>
      <div>
        {user ? (
         
          <DropdownMenu>
          <DropdownMenuTrigger className="w-10 rounded-full overflow-hidden"> <Avatar>
            <AvatarImage src={user?.user_metadata?.profile_pic} />
            <AvatarFallback>DP</AvatarFallback>
          </Avatar></DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>{user?.user_metadata?.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link className="flex" to={"/dashboard"}>
            <LinkIcon className="mr-2 h-4 w-4"/> My links
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className='text-red-400 '><LogOut className="mr-2 h-4 w-4" /><span onClick={() =>{fnLogout().then(()=>navigate('/')) }}>Logout</span></DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        ) : (!user &&
          <div>
            <Button onClick={() =>navigate('/auth')} className="bg-purple-500 rounded-sm px-4">Login</Button>
          </div>
        )}
      </div>
    </nav>
    {loading && <BarLoader width={"100%"} color="#3bffea" />}
    </>
  );
};

export default Header;
