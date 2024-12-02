import NavBar from "./NavBar.tsx";
import {Outlet} from "react-router-dom";

export default function NavbarOnlyLayout() {
    return(
        <div>
            <NavBar/>
            <div>
                <Outlet/>
            </div>
        </div>
    )
}