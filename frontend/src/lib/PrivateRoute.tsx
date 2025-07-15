import {Navigate} from "react-router-dom";
import { Outlet, useLocation } from "react-router";
import type { PropsWithChildren } from "react";

interface ProtectRouteProps {

}
export default function ProtectRoute({children} :PropsWithChildren <ProtectRouteProps>){
    const userStr = localStorage.getItem("token");
    let user: null | { access_token?: string } = null;

    try {user = userStr ? JSON.parse(userStr) : null} 
    catch (e) {user = null;}

    let path = useLocation();
    return user?.access_token ? <Outlet/> : <Navigate to = {`/login?next=${path.pathname}`} replace = {true}/>
}