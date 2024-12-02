import NavBar from "./NavBar.tsx";
import Sidebar from "./Sidebar.tsx";
import {Outlet} from "react-router-dom";


export default function MainLayout() {
    return(
        <div>
            <NavBar/>
            <div>
                <Sidebar/>
                <div>
                    <Outlet/>
                </div>
            </div>
        </div>
    )
}