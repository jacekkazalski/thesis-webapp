import Button from "../components/common/Button.tsx";
import useAxiosPrivate from "../hooks/useAxiosPrivate.tsx";
import {useLocation, useNavigate} from "react-router-dom";


export default function AddRecipePage() {
    const axiosPrivate = useAxiosPrivate()
    const navigate = useNavigate()
    const location = useLocation()
    const handleSubmit = async () => {
        try{
            const response = await axiosPrivate.post("/recipes/create")
            console.log(response)
        } catch(error){
            // If refresh token expired navigate to login and replace from location to get back
            console.log('ref exp')
            console.log(error)
            if(error.response.status === 403){
                navigate('/login', {state: {from: location}, replace: true})
            }

        }
    }
    return(
        <div>
            <Button text={"Add recipe"} type={"button"} variant={"primary"} onClick={handleSubmit}/>
        </div>
    )
}