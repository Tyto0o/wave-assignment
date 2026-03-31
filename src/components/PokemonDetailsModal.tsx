import { useEffect, useState } from 'react';
import {
  Box,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { POKEAPI_BASE_URL } from '../constants/pokemon';

type PokemonDetailsModalProps = {
  name: string | null;
  open: boolean;
  onClose: () => void;
};

function toLabel(value: string) {
  return value.replace(/-/g, ' ');
}

function collectEvolutionNames(node: any, acc: string[] = []): string[] {
  acc.push(node.species.name);
  node.evolves_to.forEach((next: any) => collectEvolutionNames(next, acc));
  return acc;
}

async function fetchJson(url: string) {
  const response = await fetch(url);
  return await response.json();
}

export function PokemonDetailsModal({
  name,
  open,
  onClose,
}: PokemonDetailsModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!open || !name) {
      return;
    }

    let cancelled = false;

    const load = async () => {
      setIsLoading(true);

      try {
        const details = await fetchJson(`${POKEAPI_BASE_URL}/pokemon/${name}`);
        const species = await fetchJson(details.species.url);
        const evolution = await fetchJson(species.evolution_chain.url);
        const encounters = await fetchJson(details.location_area_encounters);

        const rawSprites = [
          details.sprites.other?.['official-artwork']?.front_default,
          details.sprites.front_default,
          details.sprites.back_default,
        ].filter(Boolean);

        const gallery = Array.from(new Set(rawSprites)).slice(0, 3);
        const evolutions = Array.from(
          new Set(collectEvolutionNames(evolution.chain))
        );
        const locations = Array.from(
          new Set(encounters.map((entry: any) => entry.location_area.name))
        ).slice(0, 8);

        setData({
          id: details.id,
          name: details.name,
          types: details.types.map((entry: any) => entry.type.name),
          gallery,
          evolutions,
          locations,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [name, open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      slotProps={{
        paper: {
          sx: {
            borderRadius: 4,
            border: '1px solid rgba(148, 163, 184, 0.24)',
            backgroundColor: 'rgba(8, 12, 24, 0.9)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 20px 48px rgba(2, 6, 23, 0.55)',
            color: '#e2e8f0',
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          textTransform: 'capitalize',
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 1,
        }}
      >
        {name ? `${toLabel(name)} details` : 'Pokemon details'}
        <IconButton onClick={onClose} sx={{ color: '#cbd5e1' }}>
          <CloseRoundedIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
        {isLoading && (
          <Box sx={{ py: 8, display: 'grid', placeItems: 'center', gap: 1.5 }}>
            <CircularProgress sx={{ color: '#60a5fa' }} />
            <Typography color="rgba(226,232,240,0.8)">
              Loading details...
            </Typography>
          </Box>
        )}

        {!isLoading && data && (
          <Stack spacing={2.5}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              alignItems="center"
            >
              {data.gallery[0] && (
                <Box
                  component="img"
                  src={data.gallery[0]}
                  alt={data.name}
                  sx={{
                    width: 130,
                    height: 130,
                    objectFit: 'contain',
                    borderRadius: 3,
                    p: 1,
                    bgcolor: 'rgba(15, 23, 42, 0.86)',
                    border: '1px solid rgba(148,163,184,0.3)',
                  }}
                />
              )}

              <Stack spacing={1} sx={{ width: '100%' }}>
                <Typography
                  sx={{
                    textTransform: 'capitalize',
                    fontWeight: 800,
                    fontSize: '1.3rem',
                  }}
                >
                  #{data.id.toString().padStart(3, '0')} {toLabel(data.name)}
                </Typography>
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                  {data.types.map((type: string) => (
                    <Chip
                      key={type}
                      label={toLabel(type)}
                      size="small"
                      sx={{
                        color: '#e2e8f0',
                        bgcolor: 'rgba(59,130,246,0.22)',
                        border: '1px solid rgba(96,165,250,0.5)',
                        textTransform: 'capitalize',
                      }}
                    />
                  ))}
                </Stack>
              </Stack>
            </Stack>

            <Box
              sx={{
                p: 1.5,
                borderRadius: 3,
                bgcolor: 'rgba(15,23,42,0.7)',
                border: '1px solid rgba(148,163,184,0.22)',
              }}
            >
              <Typography sx={{ fontWeight: 700, mb: 1 }}>
                Sprite gallery
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {data.gallery.map((sprite: string) => (
                  <Box
                    key={sprite}
                    component="img"
                    src={sprite}
                    alt={data.name}
                    sx={{
                      width: 82,
                      height: 82,
                      objectFit: 'contain',
                      borderRadius: 2,
                      p: 0.5,
                      bgcolor: 'rgba(248,250,252,0.06)',
                      border: '1px solid rgba(148,163,184,0.22)',
                    }}
                  />
                ))}
              </Stack>
            </Box>

            <Box
              sx={{
                p: 1.5,
                borderRadius: 3,
                bgcolor: 'rgba(15,23,42,0.7)',
                border: '1px solid rgba(148,163,184,0.22)',
              }}
            >
              <Typography sx={{ fontWeight: 700, mb: 1 }}>
                Evolution chain
              </Typography>
              <Typography color="rgba(226,232,240,0.86)">
                {data.evolutions.map(toLabel).join(' -> ') || 'brak'}
              </Typography>
            </Box>

            <Box
              sx={{
                p: 1.5,
                borderRadius: 3,
                bgcolor: 'rgba(15,23,42,0.7)',
                border: '1px solid rgba(148,163,184,0.22)',
              }}
            >
              <Typography sx={{ fontWeight: 700, mb: 1 }}>Locations</Typography>
              <Typography color="rgba(226,232,240,0.86)">
                {data.locations.map(toLabel).join(', ') || 'brak'}
              </Typography>
            </Box>
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
}
