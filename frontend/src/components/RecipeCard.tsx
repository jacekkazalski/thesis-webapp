import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Rating,
  Stack,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import placeholderImg from '../assets/placeholder.png';
import { Recipe } from '../utils/types';
interface Props {
  recipe: Recipe;
}
export default function RecipeCard({ recipe }: Props) {
  const navigate = useNavigate();
  const imageSrc = recipe.image_url || placeholderImg;
  const ratingValue = recipe.rating || 0;
  const matchedIngredients = recipe.matched_ingredients || 0;
  const totalIngredients = recipe.total_ingredients || 0;
  return (
    <Box>
      <Card variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <CardActionArea onClick={() => navigate(`/recipe/${recipe.id_recipe}`)}>
          <CardContent sx={{ py: 1, px: 1.25 }}>
            <Stack spacing={0.5}>
              <CardMedia component="img" height={132} image={imageSrc} alt={recipe.name} />
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 700,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
                title={recipe.name}
              >
                {recipe.name}
              </Typography>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Rating value={ratingValue} readOnly size="small" precision={0.5} />
                {recipe.total_ingredients && (
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {matchedIngredients || 0}/{totalIngredients} składników
                  </Typography>
                )}
              </Stack>
            </Stack>
          </CardContent>
        </CardActionArea>
      </Card>
    </Box>
  );
}
