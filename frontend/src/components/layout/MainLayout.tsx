import NavBar from "./NavBar.tsx";

import {Outlet} from "react-router-dom";


export default function MainLayout() {
    return(
        <div>
            <NavBar/>
            <div >
                <div >
                    <Outlet/>
                </div>
            </div>
        </div>
    )
}