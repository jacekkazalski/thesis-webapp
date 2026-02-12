import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IngredientMultiSelect } from '../components/IngredientMultiSelect';
import useAxiosCustom from '../hooks/useAxiosCustom';
import { Ingredient } from '../utils/types';

export default function SettingsPage() {
  const [allIngredients, setAllIngredients] = useState<Ingredient[]>([]);
  const [pantryIngredients, setPantryIngredients] = useState<Ingredient[]>([]);
  const [excludedIngredients, setExcludedIngredients] = useState<Ingredient[]>([]);
  const [availableDiets, setAvailableDiets] = useState<Array<{ id_diet: number; name: string }>>(
    [],
  );
  const [selectedDietId, setSelectedDietId] = useState<number | ''>('');
  const [initialSelectedDietId, setInitialSelectedDietId] = useState<number | ''>('');
  const [initialPantryIds, setInitialPantryIds] = useState<Set<number>>(new Set());
  const [initialDietIds, setInitialDietIds] = useState<Set<number>>(new Set());
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  const axiosPrivate = useAxiosCustom();
  const navigate = useNavigate();

  const pantryIds = new Set(pantryIngredients.map((ing) => ing.id_ingredient));
  const dietIds = new Set(excludedIngredients.map((ing) => ing.id_ingredient));
  const overlappingIds = Array.from(pantryIds).filter((id) => dietIds.has(id));
  const overlappingNames = pantryIngredients
    .filter((ing) => overlappingIds.includes(ing.id_ingredient))
    .map((ing) => ing.name);
  const hasOverlap = overlappingIds.length > 0;
  const overlapErrorMsg = hasOverlap
    ? `Składniki: "${overlappingNames.join(', ')}" nie mogą być jednocześnie w spiżarni i na liście wykluczonych.`
    : '';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ingredientsRes, userIngRes, dietsRes, userDietRes] = await Promise.all([
          axiosPrivate.get('/ingredients'),
          axiosPrivate.get('users/ingredients'),
          axiosPrivate.get('/diets'),
          axiosPrivate.get('/diets/user'),
        ]);
        const allIngs = ingredientsRes.data.data;
        setAllIngredients(allIngs);
        const pantryIds = userIngRes.data.data.pantry_ingredients.map(
          (i: { id_ingredient: number }) => i.id_ingredient,
        );
        const dietIds = userIngRes.data.data.diet_ingredients.map(
          (i: { id_ingredient: number }) => i.id_ingredient,
        );
        const pantry = allIngs.filter((ing: { id_ingredient: number }) =>
          pantryIds.includes(ing.id_ingredient),
        );
        const diet = allIngs.filter((ing: { id_ingredient: number }) =>
          dietIds.includes(ing.id_ingredient),
        );
        setPantryIngredients(pantry);
        setExcludedIngredients(diet);
        setInitialPantryIds(new Set(pantryIds));
        setInitialDietIds(new Set(dietIds));
        setAvailableDiets(dietsRes.data.data || []);
        const currentDietId = userDietRes.data?.data?.diet_id ?? '';
        setSelectedDietId(currentDietId);
        setInitialSelectedDietId(currentDietId);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [axiosPrivate]);

  const handleSave = async () => {
    setErrorMsg('');
    setSuccessMsg('');

    if (hasOverlap) {
      setErrorMsg(overlapErrorMsg);
      return;
    }

    setIsSaving(true);
    try {
      const pantryIdsArray = Array.from(pantryIds);
      const dietIdsArray = Array.from(dietIds);

      const pantryToAdd = pantryIdsArray.filter((id) => !initialPantryIds.has(id));

      const pantryToRemove = Array.from(initialPantryIds).filter((id) => !pantryIds.has(id));

      const dietToAdd = dietIdsArray.filter((id) => !initialDietIds.has(id));

      const dietToRemove = Array.from(initialDietIds).filter((id) => !dietIds.has(id));

      if (pantryToRemove.length > 0) {
        await axiosPrivate.delete('/users/ingredients', {
          params: {
            ingredient: pantryToRemove,
          },
        });
      }

      if (dietToRemove.length > 0) {
        await axiosPrivate.delete('/users/ingredients', {
          params: {
            ingredient: dietToRemove,
          },
        });
      }

      if (pantryToAdd.length > 0) {
        await axiosPrivate.post(
          '/users/ingredients',
          {},
          {
            params: {
              ingredient: pantryToAdd,
              is_excluded: false,
            },
          },
        );
      }

      if (dietToAdd.length > 0) {
        await axiosPrivate.post(
          '/users/ingredients',
          {},
          {
            params: {
              ingredient: dietToAdd,
              is_excluded: true,
            },
          },
        );
      }

      if (selectedDietId !== initialSelectedDietId) {
        if (selectedDietId === '') {
          await axiosPrivate.delete('/users/diet');
        } else {
          await axiosPrivate.post('/users/diet', { diet_id: selectedDietId });
        }
        setInitialSelectedDietId(selectedDietId);
      }

      setInitialPantryIds(new Set(pantryIdsArray));
      setInitialDietIds(new Set(dietIdsArray));

      setSuccessMsg('Ustawienia zostały zapisane');
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        setErrorMsg(error.response?.data?.message || 'Błąd podczas zapisywania');
      } else {
        setErrorMsg('Błąd podczas zapisywania ustawień');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Wszystkie pola są wymagane');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Nowe hasła się nie zgadzają');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('Hasło musi zawierać co najmniej 8 znaków');
      return;
    }

    try {
      await axiosPrivate.post('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      setSuccessMsg('Hasło zostało zmienione');
      setChangePasswordOpen(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        setPasswordError(error.response?.data?.message || 'Błąd podczas zmiany hasła');
      } else {
        setPasswordError('Błąd podczas zmiany hasła');
      }
    }
  };

  const handleDeleteAccount = async () => {
    setErrorMsg('');

    if (deleteConfirmation !== 'USUŃ MOJE KONTO') {
      setErrorMsg("Wpisz 'USUŃ MOJE KONTO' aby potwierdzić");
      return;
    }

    try {
      await axiosPrivate.delete('/users');
      navigate('/');
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        setErrorMsg(error.response?.data?.message || 'Błąd podczas usuwania konta');
      } else {
        setErrorMsg('Błąd podczas usuwania konta');
      }
    }
  };

  return (
    <>
      <Paper elevation={3} sx={{ maxWidth: 900, mx: 'auto' }}>
        <Typography variant="h3" p={2}>
          {' '}
          Ustawienia{' '}
        </Typography>
        <Stack direction="column" spacing={4} p={2}>
          {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
          {successMsg && <Alert severity="success">{successMsg}</Alert>}

          <Typography variant="h5"> Składniki w spiżarni </Typography>
          <Typography variant="body1">
            Wybierz składniki, które zawsze masz w domu. Będą one automatycznie zawarte w każdym
            wyszukiwaniu.
          </Typography>
          <IngredientMultiSelect
            options={allIngredients}
            value={pantryIngredients}
            onChange={setPantryIngredients}
          />
          <Typography variant="h5">Wykluczone składniki i dieta </Typography>
          <Typography variant="body1">
            Wybierz składniki, których nie możesz lub nie chcesz uwzględniać w swoich
            wyszukiwaniach. Możesz też wybrać jedną z poniższych opcji.
          </Typography>
          <FormControl sx={{ width: '80%' }}>
            <InputLabel id="diet-select-label">Wybierz dietę</InputLabel>
            <Select
              labelId="diet-select-label"
              label="Wybierz dietę"
              value={selectedDietId}
              onChange={(e) => setSelectedDietId(e.target.value as number | '')}
            >
              <MenuItem value={''}>Brak</MenuItem>
              {availableDiets.map((diet) => (
                <MenuItem key={diet.id_diet} value={diet.id_diet}>
                  {diet.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <IngredientMultiSelect
            options={allIngredients}
            value={excludedIngredients}
            onChange={setExcludedIngredients}
          />
          {hasOverlap && <Alert severity="warning">{overlapErrorMsg}</Alert>}
          <Button
            variant="contained"
            color="success"
            onClick={handleSave}
            disabled={isSaving || hasOverlap}
            size="large"
          >
            {isSaving ? 'Zapisywanie...' : 'Zapisz'}
          </Button>

          <Typography variant="h5" sx={{ mt: 4 }}>
            Bezpieczeństwo
          </Typography>

          <Button variant="outlined" onClick={() => setChangePasswordOpen(true)} size="large">
            Zmień hasło
          </Button>

          <Button
            variant="outlined"
            color="error"
            onClick={() => setDeleteAccountOpen(true)}
            size="large"
          >
            Usuń konto
          </Button>
        </Stack>

        {/* Change Password Dialog */}
        <Dialog
          open={changePasswordOpen}
          onClose={() => setChangePasswordOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Zmień hasło</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              {passwordError && <Alert severity="error">{passwordError}</Alert>}
              <TextField
                label="Obecne hasło"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                fullWidth
              />
              <TextField
                label="Nowe hasło"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                fullWidth
              />
              <TextField
                label="Potwierdź nowe hasło"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                fullWidth
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setChangePasswordOpen(false)}>Anuluj</Button>
            <Button onClick={handleChangePassword} variant="contained" color="success">
              Zmień hasło
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Account Dialog */}
        <Dialog
          open={deleteAccountOpen}
          onClose={() => setDeleteAccountOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Usuń konto</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Alert severity="error">
                Ta akcja jest nieodwracalna. Wszystkie Twoje dane, przepisy i ustawienia zostaną
                usunięte.
              </Alert>
              <Typography>
                Aby potwierdzić, wpisz poniżej: <strong>USUŃ MOJE KONTO</strong>
              </Typography>
              <TextField
                label="Wpisz potwierdzenie"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                fullWidth
                placeholder="USUŃ MOJE KONTO"
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setDeleteAccountOpen(false);
                setDeleteConfirmation('');
              }}
            >
              Anuluj
            </Button>
            <Button
              onClick={handleDeleteAccount}
              variant="contained"
              color="error"
              disabled={deleteConfirmation !== 'USUŃ MOJE KONTO'}
            >
              Usuń konto
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </>
  );
}
