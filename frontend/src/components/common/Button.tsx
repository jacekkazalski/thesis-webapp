import styles from "./Button.module.css"
import {IconDefinition} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

interface Props{
    text?:string
    type: "submit" | "reset" | "button" | undefined
    variant: "primary" | "ingredient" | "hyperlink"
    onClick?: () => void
    className?: string
    icon?: IconDefinition
}
export default function Button({variant, text, type, onClick, className, icon}: Props){
    const variantClass = styles[variant] || styles.primary;
    return (
        <div >
            <button
                className={`${styles.button} ${variantClass} ${className}`}
                type={type}
                onClick={onClick}
            >
                {icon && <FontAwesomeIcon icon={icon}/>}{text}
            </button>
        </div>)
}