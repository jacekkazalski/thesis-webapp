import  {ChangeEvent, InputHTMLAttributes} from "react"
import styles from "./TextInput.module.css"

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    type: string;
    placeholder: string;
    value?: string;
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}
export default function TextInput({placeholder,type, label, value, onChange, ...rest}: Props) {
    return(
        <div className={styles.content}>
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