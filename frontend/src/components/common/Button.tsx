import styles from "./Button.module.css"

interface Props{
    text:string
    type: "submit" | "reset" | "button" | undefined
    variant: "primary" | "ingredient" | "hyperlink"
}
export default function Button({variant, text, type}: Props){
    const variantClass = styles[variant] || styles.primary;
    return (
        <div >
            <button className={`${styles.button} ${variantClass}`} type={type}>
                {text}
            </button>
        </div>)
}