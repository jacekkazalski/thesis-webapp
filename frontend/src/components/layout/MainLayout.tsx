import NavBar from "./NavBar.tsx";
import Sidebar from "./Sidebar.tsx";
import {Outlet} from "react-router-dom";
import styles from './Layout.module.css'


export default function MainLayout() {
    return(
        <div className={styles.layout}>
            <NavBar/>
            <div className={styles.content}>
                {/* <Sidebar/> */}
                <div className={styles.children}>
                    <Outlet/>
                </div>
            </div>
        </div>
    )
}