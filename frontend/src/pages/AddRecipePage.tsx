import useAxiosCustom from "../hooks/useAxiosCustom.tsx";
import {useLocation, useNavigate} from "react-router-dom";
import React, {ChangeEvent, useEffect, useState} from "react";
import {AxiosError} from "axios";
import {Ingredient} from "../utils/types.ts";
import {
    Box,
    Paper,
    Stack,
    TextField,
    Typography,
    Button,
    IconButton, Tooltip, Chip, Grid
} from "@mui/material";
import {Delete, UploadFile} from "@mui/icons-material";
import {IngredientMultiSelect} from "../components/IngredientMultiSelect.tsx";

export default function AddRecipePage() {
    const [name, setName] = useState("");
    const [instructions, setInstructions] = useState("");
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [allIngredients, setAllIngredients] = useState<Ingredient[]>([]);
    const [chosenIngredients, setChosenIngredients] = useState<Ingredient[]>([]);
    const [errorMsg, setErrorMsg] = useState("");

    const MAX_FILE_SIZE = 4;
    const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE * 1024 * 1024;

    const axiosPrivate = useAxiosCustom()
    const navigate = useNavigate()
    const location = useLocation()

    // Update array with quantity on input change
    const handleQuantityChange = (ingredientId: number, quantity: string) => {
        setChosenIngredients(prev => prev.map(ing =>
            ing.id_ingredient === ingredientId
                ? {...ing, quantity: quantity} : ing))

        console.log(chosenIngredients)
    }
    // Remove ingredient from chosen ingredients
    const handleRemoveIngredient = (ingredientId: number) => {
        const ingToRemove = chosenIngredients.find(ing => ing.id_ingredient == ingredientId);
        if (ingToRemove) {
            setChosenIngredients(prevIngredients =>
                prevIngredients.filter(ing => ing.id_ingredient !== ingredientId)
            )
        }
    }
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            if (file.size > MAX_FILE_SIZE_BYTES) {
                setErrorMsg(`Maksymalny rozmiar pliku to ${MAX_FILE_SIZE} MB`)
                return;
            }
            const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
            if (!allowedTypes.includes(file.type)) {
                setErrorMsg("Niedozwolony rodzaj pliku (.JPG, .PNG, .WEBP)")
                return;
            }
            setSelectedImage(event.target.files[0]);
            setErrorMsg("")
        }
    }
    const handleRemoveFile = () => {
        setErrorMsg("")
        setSelectedImage(null);
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        setErrorMsg("")
        if (chosenIngredients.length < 1) {
            setErrorMsg("Musisz wybrać przynajmniej jeden składnik")
            return;
        }

        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("instructions", instructions);
            formData.append("ingredients", JSON.stringify(chosenIngredients));
            if (selectedImage) {
                formData.append('image', selectedImage);
            }

            const response = await axiosPrivate.post("/recipes/create",
                formData,
                {
                    headers: {'Content-Type': 'multipart/form-data'}
                }
            )
            setName("")
            setInstructions("")
            setChosenIngredients([])
            setSelectedImage(null)

            const recipeId = response.data.data.id_recipe
            navigate(`/recipe/${recipeId}`)
        } catch (error) {
            // If refresh token expired navigate to log in and replace from location to get back
            console.log('ref exp')
            console.log(error)
            if (error instanceof AxiosError) {
                if (error.response?.status === 403) {
                    navigate('/login', {state: {from: location}, replace: true})
                }
            }


        }
    }
    useEffect(() => {
        try {
            axiosPrivate.get("/ingredients")
                .then(response => {
                    setAllIngredients(response.data.data)
                })
        } catch (error) {
            console.log(error)
        }
    }, []);
    return (
        <Box
            sx={{width: '80%', p: 2, alignContent: 'center', mx: 'auto'}}
        >
            <Stack
                direction={{xs: 'column', md: 'row'}}
                spacing={2}
                sx={{width: '100%'}}
            >
                <Paper elevation={2} sx={{flex: 2, p: 2}}>
                    <Stack spacing={2}>
                        <Typography variant={'h4'}>Dodaj przepis</Typography>
                        {errorMsg && <Typography color={"warning.dark"}>{errorMsg}</Typography>}
                        <TextField
                            required
                            label="Nazwa przepisu"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            fullWidth
                        />
                        <TextField
                            required
                            label="Sposób przygotowania"
                            multiline
                            rows={20}
                            value={instructions}
                            onChange={(e) => setInstructions(e.target.value)}
                        />
                    </Stack>
                    {/*<Typography variant="subtitle1" gutterBottom> Dodaj zdjęcie</Typography>*/}
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 2,
                            p: 2,
                            flexWrap: 'wrap'
                        }}
                    >
                        <Button
                            component="label"
                            variant="outlined"
                            startIcon={<UploadFile/>}
                            sx={{}}

                        >
                            Dodaj zdjęcie
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </Button>
                        {selectedImage && (
                            <Box
                                sx={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    ml: 2,
                                }}
                            >
                                <Typography
                                    sx={{
                                        maxWidth: '200px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {selectedImage.name}
                                </Typography>
                                <Tooltip title="Usuń zdjęcie"><IconButton
                                    onClick={handleRemoveFile}
                                    size="small"
                                    sx={{ml: 1}}
                                    color="error"
                                >
                                    <Delete/>
                                </IconButton></Tooltip>
                            </Box>

                        )}
                    </Box>
                    <Box p={2}>
                        <Button
                            variant="contained"
                            color="success"
                            onClick={handleSubmit}
                            size="large"
                        >
                            Zapisz
                        </Button>
                    </Box>
                </Paper>
                <Paper elevation={2} sx={{flex: 1, p: 2}}>
                    <Typography variant={"h6"}>Składniki</Typography>
                    <IngredientMultiSelect options={allIngredients} value={chosenIngredients}
                                           onChange={setChosenIngredients} hideSelectedItems={true}/>
                    {chosenIngredients.map((ingredient) =>
                        <Grid container spacing={1} alignItems="center" sx={{mb: 1}}>
                            <Grid size={6}>
                                <Chip
                                    label={ingredient.name}
                                    key={ingredient.id_ingredient}
                                    onDelete={() => handleRemoveIngredient(ingredient.id_ingredient)}
                                    color={'secondary'}
                                    size="medium"
                                />
                            </Grid>
                            <Grid size={5}>
                                <TextField
                                    variant="standard"
                                    label="Podaj ilość"
                                    value={ingredient.quantity}
                                    onChange={(e) => handleQuantityChange(ingredient.id_ingredient, e.target.value)}/>
                            </Grid>

                        </Grid>
                    )}
                </Paper>
            </Stack>
        </Box>
    )
}