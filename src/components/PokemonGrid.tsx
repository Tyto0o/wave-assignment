import { Grid } from '@mui/material';
import type { Pokemon } from '../types/pokemon';
import { PokemonCard } from './PokemonCard';

type PokemonGridProps = {
  pokemons: Pokemon[];
  onPokemonClick?: (pokemon: Pokemon) => void;
};

export function PokemonGrid({ pokemons, onPokemonClick }: PokemonGridProps) {
  return (
    <Grid container spacing={3}>
      {pokemons.map((pokemon) => (
        <Grid key={pokemon.id} size={{ xs: 12, sm: 6, md: 4 }}>
          <PokemonCard pokemon={pokemon} onClick={onPokemonClick} />
        </Grid>
      ))}
    </Grid>
  );
}
