import styles from "./Checkbox.module.css"
import {useState} from "react";

interface Props{
    text: string
}

export default function Checkbox({text} : Props){
    const [state, setState] = useState<"checked" | "unchecked">("unchecked");
    const toggleState = () => {
        setState((prevState) => (prevState == "checked" ? "unchecked" : "checked"));
    }
    return(
        <div className={styles.checkbox}>
            <div
                className={`${styles.rectangle} ${styles[state]}`}
                onClick={toggleState}
            />
            <div className={styles.text}>{text}</div>
        </div>
    )
}