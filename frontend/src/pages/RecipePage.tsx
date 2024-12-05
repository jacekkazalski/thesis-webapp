import examplePhoto from '../assets/spaghetti.jpg'
import styles from './RecipePage.module.css'
import Button from "../components/common/Button.tsx";

export default function RecipePage() {
    return(
        <div className={styles.content}>
            <img className={styles.banner} src={examplePhoto} alt="example photo" />
            <div className={styles.info}>
                <h1>Recipe name</h1>
                <Button text={"Autor"} type={"button"} variant={"hyperlink"}/>
                <div> Ocena 5/5</div>
                <Button text={"FAV"} type={"button"} variant={"primary"}/>
                <Button text={"TR"} type={"button"} variant={"primary"}/>
                <Button text={"ED"} type={"button"} variant={"primary"}/>
            </div>
            <div className={styles.steps}>
                1. blalallblvbllbblbllblbl.
                2.lblblblblglglglgl
                3.gfalallsldslsdlsdl
                4.sadasodkoaskdoaskdoaskdoaksd
            </div>
            <div className={styles.ingredients}>
                INGREDIENTS
            </div>
        </div>
    )
}