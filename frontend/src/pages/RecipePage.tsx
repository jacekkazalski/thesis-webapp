import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import placeholderImg from "../assets/placeholder.png";
import axios from "../api/axios";
import { Recipe } from "../utils/types";
import useAxiosCustom from "../hooks/useAxiosCustom";
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Rating,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import {
  Favorite,
  FavoriteBorder,
  Edit,
  Delete,
  PersonOutlineOutlined,
} from "@mui/icons-material";
import useAuth from "../hooks/useAuth";
import { NavButton } from "../components/layout/NavBar";

export default function RecipePage() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const { recipeId } = useParams<{ recipeId: string }>();
  const [isFavourite, setIsFavourite] = useState(false);
  const [isAuthor, setIsAuthor] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { auth } = useAuth();

  const navigate = useNavigate();
  const axiosCustom = useAxiosCustom();

  const handleFavourite = async () => {
    if (!auth.accessToken) {
      setIsModalOpen(true);
      return;
    }
    try {
      const response = await axiosCustom.post(
        `/favourites/toggle`,
        JSON.stringify({ id_recipe: recipeId }),
      );
      setIsFavourite(response.data.isFavourite);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Czy na pewno chcesz usunąć ten przepis?");
    if (!confirmed) return;

    try {
      await axiosCustom.delete(`/recipes/delete/`, {
        params: { id_recipe: recipeId },
      });

      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };
  const handleRatingChange = async (newValue: number) => {
    if (!auth.accessToken) {
      setIsModalOpen(true);
      return;
    }

    try {
      await axiosCustom.post(
        `/ratings/add`,
        JSON.stringify({ id_recipe: recipeId, value: newValue }),
      );
    } catch (err) {
      console.log(err);
    }
    setUserRating(newValue);
  };

  useEffect(() => {
    const checkIfFavourite = async () => {
      try {
        const response = await axiosCustom.get("/favourites/check", {
          params: { id_recipe: recipeId },
        });
        setIsFavourite(response.data.isFavourite);
      } catch (err) {
        console.log(err);
      }
    };
    const checkIfAuthor = async () => {
      try {
        const response = await axiosCustom.get("/recipes/author/check", {
          params: { id_recipe: recipeId },
        });
        setIsAuthor(response.data.isAuthor);
      } catch (err) {
        console.log(err);
      }
    };
    const fetchRecipe = async () => {
      const response = await axios.get("/recipes/recipe", {
        params: {
          id_recipe: recipeId,
        },
      });
      setRecipe(response.data);
    };
    const checkUserRating = async () => {
      const response = await axiosCustom.get(
        `/ratings/user?id_recipe=${recipeId}`,
      );
      setUserRating(response.data.rating);
    };
    fetchRecipe();
    checkIfFavourite();
    checkIfAuthor();
    checkUserRating();
  }, [recipeId, axiosCustom]);
  return (
    <Box sx={{ width: "80%", p: 2, alignContent: "center", mx: "auto" }}>
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <DialogTitle>Musisz się zalogować</DialogTitle>
        <DialogContent>
          <Typography>
            Ta akcja jest dostępna tylko dla zalogowanych użytkowników.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalOpen(false)}>Anuluj</Button>
          <Button
            onClick={() =>
              navigate("/login", { state: { from: `/recipe/${recipeId}` } })
            }
          >
            Zaloguj się
          </Button>
        </DialogActions>
      </Dialog>
      <Paper elevation={3} sx={{ overflow: "hidden", mb: 2 }}>
        <Box
          component="img"
          src={recipe?.image_url || placeholderImg}
          alt="recipe photo"
          sx={{
            width: "100%",
            objectFit: "cover",
            height: { xs: 200, md: 300 },
          }}
        />
        <Box sx={{ p: 2 }}>
          <Typography variant="h4" sx={{ flexGrow: 1, mb: 1 }}>
            {recipe?.name}
          </Typography>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            // justifyContent="space-between"
            sx={{
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Stack direction="row">
              {/*<Typography variant="caption">Autor</Typography>*/}
              <NavButton
                icon={PersonOutlineOutlined}
                text={recipe?.author?.username || ""}
                onClick={() => navigate(`/user/${recipe?.author?.id_user}`)}
              />
              <Tooltip
                title={
                  isFavourite ? "Usuń z ulubionych" : "Dodaj do ulubionych"
                }
              >
                <IconButton onClick={handleFavourite}>
                  {isFavourite ? (
                    <Favorite color="secondary" />
                  ) : (
                    <FavoriteBorder />
                  )}
                </IconButton>
              </Tooltip>
              {isAuthor && (
                <>
                  <Tooltip title="Usuń przepis">
                    <IconButton onClick={handleDelete}>
                      <Delete color="error" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edytuj przepis">
                    <IconButton
                      onClick={() => navigate(`/recipes/edit/${recipeId}`)}
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                </>
              )}
            </Stack>

            <Stack>
              <Typography variant="overline">
                Twoja ocena {userRating ?? "Brak"}
              </Typography>
              <Rating
                name="recipe-rating"
                value={userRating ?? 0}
                onChange={(_event, newValue) => {
                  handleRatingChange(newValue || 0);
                }}
              />
            </Stack>
            <Stack>
              <Typography variant="overline">Średnia ocen</Typography>
              <Rating readOnly value={recipe?.rating} />
            </Stack>
          </Stack>
        </Box>
      </Paper>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        sx={{ width: "100%" }}
      >
        <Paper elevation={2} sx={{ flex: 1, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Składniki
          </Typography>
          <List>
            {recipe?.ingredients.map((ingredient) => (
              <ListItem key={ingredient.id_ingredient}>
                <ListItemText
                  primary={ingredient.name}
                  secondary={ingredient.quantity}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
        <Paper elevation={2} sx={{ flex: 2, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Instrukcje
          </Typography>
          <Typography sx={{ whiteSpace: "pre-line" }}>
            {recipe?.instructions}
          </Typography>
        </Paper>
      </Stack>
    </Box>
  );
}
