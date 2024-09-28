import React from "react"
import styles from "./TextInput.module.css"

interface Props {
    label: string;
    type: string;
    placeholder: string;
}
export default function TextInput({placeholder,type, label}: Props) {
    return(
        <div className={styles.content}>
            <label>{label}</label>
            <input
                className={styles.input}
                type={type}
                placeholder={placeholder}
            />
        </div>

    );
}