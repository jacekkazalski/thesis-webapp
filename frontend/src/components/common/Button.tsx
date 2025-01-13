import styles from "./Button.module.css"

interface Props{
    text:string
    type: "submit" | "reset" | "button" | undefined
    variant: "primary" | "ingredient" | "hyperlink"
    onClick?: () => void
    className?: string
}
export default function Button({variant, text, type, onClick, className}: Props){
    const variantClass = styles[variant] || styles.primary;
    return (
        <div >
            <button
                className={`${styles.button} ${variantClass} ${className}`}
                type={type}
                onClick={onClick}
            >
                {text}
            </button>
        </div>)
}