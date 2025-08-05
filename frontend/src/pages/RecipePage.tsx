import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import placeholderImg from "../assets/placeholder.png"
import axios from '../api/axios.ts'
import { Ingredient } from "../utils/types.ts";
import useAxiosCustom from "../hooks/useAxiosCustom.tsx";
import { Box, Typography, IconButton, Paper, Button, Stack, Avatar, Tooltip, Rating, List, ListItem, ListItemText } from "@mui/material";
import { Favorite, FavoriteBorder, Edit, Delete, Person } from "@mui/icons-material";

export default function RecipePage() {
    const [name, setName] = useState("");
    const [instructions, setInstructions] = useState("");
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [author, setAuthor] = useState<{ username: string, id_user: number }>()
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const { recipeId } = useParams<{ recipeId: string }>();
    const [isFavourite, setIsFavourite] = useState(false);
    const [isAuthor, setIsAuthor] = useState(false);

    const navigate = useNavigate();
    const axiosCustom = useAxiosCustom();

    const handleFavourite = async () => {
        try {
            const response = await axiosCustom.post(`/favourites/toggle`,
                JSON.stringify({ id_recipe: recipeId }))
            setIsFavourite(response.data.isFavourite)
        } catch (err) {
            console.log(err)
        }
    }

    const handleDelete = async () => {

        const confirmed = window.confirm("Czy na pewno chcesz usunąć ten przepis?")
        if (!confirmed) return;

        try {
            await axiosCustom.delete(`/recipes/delete/`, { params: { id_recipe: recipeId } })

            navigate("/")
        } catch (err) {
            console.log(err)
        }
    }


    useEffect(() => {
        const checkIfFavourite = async () => {
            try {
                const response = await axiosCustom.get('/favourites/check', { params: { id_recipe: recipeId } })
                setIsFavourite(response.data.isFavourite)
            } catch (err) {
                console.log(err)
            }
        }
        const checkIfAuthor = async () => {
            try {
                const response = await axiosCustom.get('/recipes/author/check', { params: { id_recipe: recipeId } })
                setIsAuthor(response.data.isAuthor)
            } catch (err) {
                console.log(err)
            }
        }
        const fetchRecipe = async () => {
            const response = await axios.get("/recipes/recipe", {
                params: {
                    id_recipe: recipeId,
                }
            })

            setName(response.data.name);
            setInstructions(response.data.instructions);
            setIngredients(response.data.ingredients);
            setAuthor(response.data.author)
            setImageUrl(response.data.image_url)
        }
        fetchRecipe();
        checkIfFavourite();
        checkIfAuthor();

    }, [recipeId]);
    return (
        <Box sx={{ width: '80%', p: 2, alignContent: 'center', mx: 'auto' }}>
            <Paper elevation={3} sx={{ overflow: 'hidden', mb: 2 }}>
                <Box
                    component="img"
                    src={imageUrl || placeholderImg}
                    alt="recipe photo"
                    sx={{
                        width: '100%',
                        objectFit: 'cover',
                        height: { xs: 200, md: 300 }
                    }}
                />
                <Box sx={{ p: 2 }}>
                    <Typography variant='h4' sx={{ flexGrow: 1, mb: 1 }}>
                        {name}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Avatar/>
                        <Rating
                            name="recipe-rating"
                        // TODO: implement rating
                        />
                        <Tooltip title={isFavourite ? "Usuń z ulubionych" : "Dodaj do ulubionych"}>
                            {/* TODO: fav colors */}
                            <IconButton onClick={handleFavourite}>

                                {isFavourite ? <Favorite /> : <FavoriteBorder />}
                            </IconButton>
                        </Tooltip>
                        {isAuthor && (
                            <>
                                <Tooltip title="Usuń przepis">
                                    <IconButton onClick={handleDelete}>
                                        <Delete />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Edytuj przepis">
                                    <IconButton onClick={() => navigate(`/recipes/edit/${recipeId}`)}>
                                        <Edit />
                                    </IconButton>
                                </Tooltip>
                            </>
                        )}
                    </Stack>
                </Box>
            </Paper>
            <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={2}
                sx={{ width: '100%' }}
            >
                <Paper elevation={2} sx={{flex: 1, p:2}}>
                    <Typography variant="h6" gutterBottom>
                        Składniki
                    </Typography>
                    <List >
                        {ingredients.map((ingredient) => (
                            <ListItem key={ingredient.id_ingredient}>
                                <ListItemText primary={ingredient.name} secondary={ingredient.quantity} />
                            </ListItem>
                        ))}
                    </List>
                </Paper>
                <Paper elevation={2} sx={{flex: 2, p:2}}>
                    <Typography variant="h6" gutterBottom>
                        Instrukcje
                    </Typography>
                    <Typography sx={{ whiteSpace: 'pre-line' }}>{instructions}</Typography>
                </Paper>
            </Stack>


        </Box>
    )
}