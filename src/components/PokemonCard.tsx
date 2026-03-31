import { Box, Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import { TYPE_COLORS, type PokemonType } from '../theme/colors';
import type { Pokemon } from '../types/pokemon';

type PokemonCardProps = {
  pokemon: Pokemon;
  onClick?: (pokemon: Pokemon) => void;
};

export function PokemonCard({ pokemon, onClick }: PokemonCardProps) {
  const [firstType = 'normal', secondType = firstType] = pokemon.types;
  const primary = TYPE_COLORS[firstType as PokemonType] ?? '#64748b';
  const secondary = TYPE_COLORS[secondType as PokemonType] ?? primary;

  return (
    <Card
      variant="outlined"
      onClick={() => onClick?.(pokemon)}
      sx={{
        background: `linear-gradient(120deg, ${primary}, ${secondary})`,
        border: 'none',
        color: '#f8fafc',
        height: '100%',
        borderRadius: '16px',
        boxShadow: '0 12px 28px rgba(2, 6, 23, 0.28)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 160ms ease',
        '&:hover': {
          transform: onClick ? 'translateY(-2px)' : 'none',
        },
      }}
    >
      <CardContent>
        <Box
          component="img"
          src={pokemon.image}
          alt={pokemon.name}
          loading="lazy"
          sx={{
            display: 'block',
            width: 100,
            height: 100,
            objectFit: 'contain',
            m: '0 auto 8px',
          }}
        />
        <Typography
          variant="h5"
          fontWeight={700}
          sx={{ textTransform: 'capitalize' }}
        >
          {pokemon.name}
        </Typography>
        <Typography sx={{ color: 'white' }}>
          #{pokemon.id.toString().padStart(3, '0')}
        </Typography>
        <Stack direction="row" spacing={1} mt={1} useFlexGap flexWrap="wrap">
          {pokemon.types.map((type) => (
            <Chip
              key={`${pokemon.id}-${type}`}
              size="small"
              label={type}
              sx={{
                backgroundColor: 'rgba(248, 250, 252, 0.24)',
                color: 'white',
                fontWeight: 700,
                textTransform: 'capitalize',
              }}
            />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
