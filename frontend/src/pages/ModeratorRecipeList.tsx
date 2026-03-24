import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { DeleteOutline, DoneAll, VisibilityOutlined } from '@mui/icons-material';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import placeholderImg from '../assets/placeholder.png';
import useAxiosCustom from '../hooks/useAxiosCustom';
import { UncheckedRecipe } from '../utils/types';

interface DeleteDialogState {
  open: boolean;
  recipe: UncheckedRecipe | null;
  banUser: boolean;
  durationDays: number;
}

const initialDialogState: DeleteDialogState = {
  open: false,
  recipe: null,
  banUser: false,
  durationDays: 7,
};

export default function ModeratorRecipeList() {
  const axiosCustom = useAxiosCustom();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<UncheckedRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [busyRecipeId, setBusyRecipeId] = useState<number | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>(initialDialogState);

  const fetchUncheckedRecipes = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axiosCustom.get('/recipes/unchecked');
      setRecipes(response.data.data ?? []);
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message ?? 'Nie udało się pobrać przepisów do moderacji.');
      } else {
        setError('Nie udało się pobrać przepisów do moderacji.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchUncheckedRecipes();
  }, [axiosCustom]);

  const removeRecipeFromList = (recipeId: number) => {
    setRecipes((prev) => prev.filter((recipe) => recipe.id_recipe !== recipeId));
  };

  const handleApprove = async (recipeId: number) => {
    setBusyRecipeId(recipeId);
    setError('');
    setSuccess('');

    try {
      await axiosCustom.patch('/recipes/check', {}, {
        params: { id_recipe: recipeId },
      });
      removeRecipeFromList(recipeId);
      setSuccess('Przepis został zatwierdzony.');
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message ?? 'Nie udało się zatwierdzić przepisu.');
      } else {
        setError('Nie udało się zatwierdzić przepisu.');
      }
    } finally {
      setBusyRecipeId(null);
    }
  };

  const openDeleteDialog = (recipe: UncheckedRecipe) => {
    setDeleteDialog({
      open: true,
      recipe,
      banUser: false,
      durationDays: 7,
    });
    setError('');
    setSuccess('');
  };

  const closeDeleteDialog = () => {
    if (busyRecipeId !== null) {
      return;
    }
    setDeleteDialog(initialDialogState);
  };

  const handleDelete = async () => {
    if (!deleteDialog.recipe) {
      return;
    }

    const recipe = deleteDialog.recipe;
    setBusyRecipeId(recipe.id_recipe);
    setError('');
    setSuccess('');

    try {
      await axiosCustom.delete('/recipes/delete', {
        params: { id_recipe: recipe.id_recipe },
      });

      if (deleteDialog.banUser) {
        await axiosCustom.patch(
          '/users/ban',
          { durationDays: Number(deleteDialog.durationDays) },
          {
            params: { id_user: recipe.author.id_user },
          },
        );
      }

      removeRecipeFromList(recipe.id_recipe);
      setDeleteDialog(initialDialogState);
      setSuccess(
        deleteDialog.banUser
          ? 'Przepis został usunięty, a użytkownik zablokowany.'
          : 'Przepis został usunięty.',
      );
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message ?? 'Nie udało się usunąć przepisu.');
      } else {
        setError('Nie udało się usunąć przepisu.');
      }
    } finally {
      setBusyRecipeId(null);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Stack spacing={1} sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          Moderacja przepisów
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Tutaj sprawdzisz niezatwierdzone przepisy i zdecydujesz, czy je usunąć,
          albo zatwierdzić.
        </Typography>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {loading ? (
        <Stack alignItems="center" sx={{ py: 8 }}>
          <CircularProgress />
        </Stack>
      ) : recipes.length === 0 ? (
        <Alert severity="info">Brak przepisów oczekujących na sprawdzenie.</Alert>
      ) : (
        <Grid container spacing={2}>
          {recipes.map((recipe) => {
            const imageSrc = recipe.image_url || placeholderImg;
            const isBusy = busyRecipeId === recipe.id_recipe;

            return (
              <Grid size={{ xs: 12, md: 6, xl: 4 }} key={recipe.id_recipe}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia component="img" height="220" image={imageSrc} alt={recipe.name} />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Stack spacing={1}>
                      <Typography variant="h6" fontWeight={700}>
                        {recipe.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Autor:{' '}
                        <Button
                          variant="text"
                          sx={{
                            minWidth: 'auto',
                            p: 0,
                            textTransform: 'none',
                            verticalAlign: 'baseline',
                          }}
                          onClick={() => navigate(`/user/${recipe.author.id_user}`)}
                        >
                          {recipe.author.username}
                        </Button>
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Dodano:{' '}
                        {recipe.created_at
                          ? new Date(recipe.created_at).toLocaleString('pl-PL')
                          : 'brak daty'}
                      </Typography>
                    </Stack>
                  </CardContent>
                  <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} width="100%">
                      <Button
                        variant="outlined"
                        startIcon={<VisibilityOutlined />}
                        onClick={() => navigate(`/recipe/${recipe.id_recipe}`)}
                        fullWidth
                      >
                        Podgląd
                      </Button>
                      <Button
                        variant="contained"
                        color="success"
                        startIcon={<DoneAll />}
                        onClick={() => handleApprove(recipe.id_recipe)}
                        disabled={isBusy}
                        fullWidth
                      >
                        Zatwierdź
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        startIcon={<DeleteOutline />}
                        onClick={() => openDeleteDialog(recipe)}
                        disabled={isBusy}
                        fullWidth
                      >
                        Usuń
                      </Button>
                    </Stack>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      <Dialog open={deleteDialog.open} onClose={closeDeleteDialog} fullWidth maxWidth="sm">
        <DialogTitle>Usuń przepis</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Typography variant="body1">
              Czy na pewno chcesz usunąć przepis{' '}
              <strong>{deleteDialog.recipe?.name ?? ''}</strong>?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Autor: {deleteDialog.recipe?.author.username ?? ''}
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={deleteDialog.banUser}
                  onChange={(event) =>
                    setDeleteDialog((prev) => ({
                      ...prev,
                      banUser: event.target.checked,
                    }))
                  }
                />
              }
              label="Zablokuj użytkownika przy usuwaniu przepisu"
            />
            <TextField
              label="Liczba dni blokady"
              type="number"
              value={deleteDialog.durationDays}
              onChange={(event) =>
                setDeleteDialog((prev) => ({
                  ...prev,
                  durationDays: Number(event.target.value),
                }))
              }
              inputProps={{ min: 1 }}
              disabled={!deleteDialog.banUser}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} disabled={busyRecipeId !== null}>
            Anuluj
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={
              busyRecipeId !== null ||
              (deleteDialog.banUser &&
                (!Number.isInteger(deleteDialog.durationDays) ||
                  deleteDialog.durationDays <= 0))
            }
          >
            Usuń przepis
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
