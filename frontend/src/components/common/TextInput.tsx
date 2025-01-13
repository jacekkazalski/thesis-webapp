import  {ChangeEvent, InputHTMLAttributes} from "react"
import styles from "./TextInput.module.css"

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    type: string;
    placeholder: string;
    value?: string;
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    className?: string
}
export default function TextInput({placeholder,type, label, value, onChange, className, ...rest}: Props) {
    return(
        <div className={`${styles.content} ${className}`}>
            <label>{label}</label>
            <input
                className={styles.input}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                {...rest}
            />
        </div>

    );
}