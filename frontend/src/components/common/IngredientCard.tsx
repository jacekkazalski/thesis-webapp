import Button from "./Button.tsx";
interface Props{
    text: string;
}
export default function IngredientCard({text}: Props) {
    return(
        <Button variant={"primary"} text={text} type={"button"}/>
    )
}