import styles from "./Button.module.css"

interface Props{
    text:string
    type: "submit" | "reset" | "button" | undefined
    variant: "primary" | "ingredient" | "hyperlink"
    onClick?: () => void
}
export default function Button({variant, text, type, onClick}: Props){
    const variantClass = styles[variant] || styles.primary;
    return (
        <div >
            <button
                className={`${styles.button} ${variantClass}`}
                type={type}
                onClick={onClick}
            >
                {text}
            </button>
        </div>)
}