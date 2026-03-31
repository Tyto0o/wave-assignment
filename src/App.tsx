import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Container,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import pokeBall from './assets/poke-ball.png';
import { fetchPokemonPage } from './api/pokemon';
import { PokemonDetailsModal } from './components/PokemonDetailsModal';
import { PokemonGrid } from './components/PokemonGrid';
import { POKEMON_PAGE_SIZE } from './constants/pokemon';
import { POKEMON_TYPES, TYPE_COLORS } from './theme/colors';
import type { Pokemon } from './types/pokemon';

function App() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [query, setQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPokemonName, setSelectedPokemonName] = useState<string | null>(
    null
  );

  const toggleType = (type: string) => {
    const normalizedType = type.toLowerCase();

    setSelectedTypes((prev) => {
      const alreadySelected = prev.includes(normalizedType);

      if (alreadySelected) {
        return prev.filter((item) => item !== normalizedType);
      }

      return [...prev, normalizedType];
    });
  };

  const loadPokemonPage = useCallback(
    async (nextOffset: number, append: boolean) => {
      if (append) {
        setIsLoading(true);
      }

      try {
        const page = await fetchPokemonPage(nextOffset, POKEMON_PAGE_SIZE);

        if (append) {
          setPokemons((prev) => [...prev, ...page.items]);
        } else {
          setPokemons(page.items);
        }

        setOffset(page.nextOffset);
        setHasMore(page.hasMore);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    void loadPokemonPage(0, false);
  }, [loadPokemonPage]);

  const filteredPokemons = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const selectedTypeSet = new Set(selectedTypes);

    return pokemons.filter((pokemon) => {
      const byText = pokemon.name.toLowerCase().includes(normalizedQuery);

      const pokemonTypes = pokemon.types.map((type) => type.toLowerCase());
      const byType =
        selectedTypeSet.size === 0 ||
        pokemonTypes.some((type) => selectedTypeSet.has(type));

      return byText && byType;
    });
  }, [pokemons, query, selectedTypes]);

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      void loadPokemonPage(offset, true);
    }
  };

  const handleOpenModal = (pokemon: Pokemon) => {
    setSelectedPokemonName(pokemon.name);
  };

  const handleCloseModal = () => {
    setSelectedPokemonName(null);
  };

  return (
    <Container maxWidth={false} sx={{ py: 5 }}>
      <Stack spacing={3.5}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant="h3"
            component="h1"
            fontWeight={800}
            sx={{
              mt: 5,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              fontSize: '2.2rem',
              background: `linear-gradient(270deg, ${TYPE_COLORS.fire} 10%, ${TYPE_COLORS.fighting} 100%)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              WebkitTextFillColor: 'transparent',
            }}
          >
            <Box
              component="img"
              src={pokeBall}
              alt="pokeball icon"
              aria-hidden="true"
              sx={{
                fontSize: '1em',
                width: '1em',
                height: '1em',
                flex: '0 0 auto',
                display: 'block',
                objectFit: 'contain',
              }}
            />
            Pokémon Explorer
          </Typography>
        </Box>

        <TextField
          placeholder="Search Pokémon..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          sx={{
            width: '100%',
            maxWidth: 500,
            borderRadius: 12,
            p: 0,
            alignSelf: 'center',
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'rgba(131, 131, 131, 0.12)',
              borderRadius: 12,
            },
            '& .MuiOutlinedInput-input': {
              color: '#808080',
              fontSize: '1rem',
              py: 1,
            },
            '& .MuiOutlinedInput-input::placeholder': {
              color: 'rgba(131, 131, 131, 0.75)',
              opacity: 1,
            },
          }}
        />

        <Stack
          direction="row"
          spacing={1}
          useFlexGap
          flexWrap="wrap"
          justifyContent="center"
        >
          {POKEMON_TYPES.map((type) => (
            <Chip
              key={type}
              label={type}
              onClick={() => toggleType(type)}
              sx={{
                backgroundColor: TYPE_COLORS[type],
                color: '#f8fafc',
                fontWeight: 700,
                border: selectedTypes.includes(type)
                  ? '2px solid #e2e8f0'
                  : '2px solid transparent',
                boxShadow: selectedTypes.includes(type)
                  ? '0 0 0 1px rgba(248, 250, 252, 0.65)'
                  : '0 0 0 0 rgba(248, 250, 252, 0)',
                textTransform: 'capitalize',
                transition:
                  'transform 220ms ease, border-color 300ms ease, box-shadow 300ms ease, filter 220ms ease',
                '&:hover': {
                  backgroundColor: TYPE_COLORS[type],
                  transform: 'scale(1.05)',
                  filter: 'brightness(1.06)',
                },
              }}
            />
          ))}
        </Stack>

        <PokemonGrid
          pokemons={filteredPokemons}
          onPokemonClick={handleOpenModal}
        />

        <Stack direction="row" justifyContent="center" pt={1}>
          <Button
            variant="contained"
            onClick={handleLoadMore}
            disabled={!hasMore || isLoading}
            sx={{
              textDecoration: 'none',
              textTransform: 'none',
              borderRadius: 6,
              backgroundColor: '#1468ee',
              fontWeight: 700,
              fontSize: '1rem',
              px: 3,

              '&:hover': { backgroundColor: '#0f57c0' },
            }}
          >
            Load More
          </Button>
        </Stack>
      </Stack>

      <PokemonDetailsModal
        name={selectedPokemonName}
        open={Boolean(selectedPokemonName)}
        onClose={handleCloseModal}
      />
    </Container>
  );
}

export default App;
