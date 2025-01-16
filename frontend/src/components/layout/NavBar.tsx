import TextInput from "../common/TextInput.tsx";
import Button from "../common/Button.tsx";
import styles from "./NavBar.module.css";
import {useNavigate} from "react-router-dom";
import {
    faArrowRightFromBracket,
    faArrowRightToBracket,
    faCookieBite,
    faUserPen
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import useAuth from "../../hooks/useAuth.tsx";
import {axiosCustom} from "../../api/axios.ts";
import {faUser} from "@fortawesome/free-regular-svg-icons";

export default function NavBar(){
    const navigate = useNavigate();
    const {auth, setAuth} = useAuth();
    const isAuthenticated = !!auth.accessToken;
    const handleLogout = async () => {
        try {
            await axiosCustom.get("/auth/logout");
            setAuth({});
            // Timeout to avoid redirect to login page
            setTimeout(() => navigate('/'), 0);
            console.log(auth)
        } catch (error) {
            console.log(error)
        }
    }
    return(
        <div className={styles.navbar}>
            <div className={styles.logo}>
                <h2 onClick={() => navigate("/")}><FontAwesomeIcon icon={faCookieBite}/> Co w lodówce</h2>
            </div>
            <div className={styles.searchbar}>
                <TextInput label={""} type={"text"} placeholder={"Szukaj..."}/>
            </div>
            {isAuthenticated ? (
                <div className={styles.buttons}>
                    <Button
                        variant={"primary"}
                        text={""+auth.username}
                        icon={faUser}
                        type={"button"}
                        onClick={() => navigate('/user/')}/>
                    <Button
                        variant={"primary"}
                        text={"Wyloguj"}
                        icon={faArrowRightFromBracket}
                        type={"button"}
                        onClick={handleLogout}
                        />

                </div>
            ) : (
                <div className={styles.buttons}>
                    <Button
                        variant={"primary"}
                        text={"Logowanie"}
                        icon={faArrowRightToBracket}
                        type={"button"}
                        onClick={() => navigate('/login')}/>
                    <Button
                        variant={"primary"}
                        text={"Rejestracja"}
                        icon={faUserPen}
                        type={"button"}
                        onClick={() => navigate('/register')}/>
                </div>
            )}

        </div>
    )
}