import { Recipe } from "../utils/types";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Typography,
  CardActionArea,
  Avatar,
  Rating,
} from "@mui/material";
import placeholderImg from "../assets/placeholder.png";
interface Props {
  recipe: Recipe;
}
export default function RecipeCard({ recipe }: Props) {
  const navigate = useNavigate();
  //TODO: list view css
  return (
    <Box>
      <Card variant="outlined">
        <CardActionArea onClick={() => navigate(`/recipe/${recipe.id_recipe}`)}>
          <CardMedia
            component="img"
            height="140"
            image={recipe.image_url || placeholderImg}
            alt={recipe.name}
          />
          <Typography
            variant="h6"
            sx={{
              padding: 1,
              height: 50,
              overflow: "clip",
              textOverflow: "ellipsis",
              fontSize: recipe.name.length > 20 ? 18 : undefined,
            }}
          >
            {recipe.name}
          </Typography>
        </CardActionArea>
        <CardContent>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            onClick={() => navigate(`/user/${recipe.author?.id_user}`)}
            sx={{ cursor: "pointer" }}
          >
            <Avatar sx={{ bgcolor: "secondary.main", width: 24, height: 24 }} />
            <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
              {recipe.author?.username || "Nieznany autor"}
            </Typography>
            <Rating value={recipe.rating} readOnly size="small" />
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
