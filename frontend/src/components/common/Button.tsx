import styles from "./Button.module.css"

interface Props{
    text:string
    type: "submit" | "reset" | "button" | undefined
}
export default function Button({text, type}: Props){
    return (
        <div >
            <button className={styles.button} type={type}>
                {text}
            </button>
        </div>)
}