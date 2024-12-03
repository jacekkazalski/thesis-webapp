import RecipeCard from "../components/common/RecipeCard.tsx";


export default function MainPage(){
    return(
        <div>
            <Gallery/>
        </div>
    )
}
function Gallery(){
    return(
        <div>
            <RecipeCard/>
            <RecipeCard/>
            <RecipeCard/>
            <RecipeCard/>
            <RecipeCard/>
            <RecipeCard/>
        </div>
    )
}