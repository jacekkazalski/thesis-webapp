import NavBar from "./NavBar.tsx";
import {Outlet} from "react-router-dom";
import styles from './Layout.module.css'

export default function NavbarOnlyLayout() {
    return(
        <div className={styles.layout}>
            <NavBar/>
            <div className={styles.children}>
                <Outlet/>
            </div>
        </div>
    )
}