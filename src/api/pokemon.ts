import type { Pokemon, PokemonPage } from '../types/pokemon';
import { POKEAPI_BASE_URL } from '../constants/pokemon';

type PokemonListItem = {
  name: string;
  url: string;
};

type PokemonListResponse = {
  next: string | null;
  results: PokemonListItem[];
};

type PokemonDetailsResponse = {
  id: number;
  name: string;
  sprites: {
    front_default: string | null;
    other?: {
      'official-artwork'?: {
        front_default: string | null;
      };
    };
  };
  types: {
    type: {
      name: string;
    };
  }[];
};

export async function fetchPokemonPage(
  offset: number,
  limit: number
): Promise<PokemonPage> {
  const listResponse = await fetch(
    `${POKEAPI_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`
  );

  const listPayload = (await listResponse.json()) as PokemonListResponse;

  const items = await Promise.all(
    listPayload.results.map(async ({ url }) => {
      const detailsResponse = await fetch(url);
      const detailsPayload =
        (await detailsResponse.json()) as PokemonDetailsResponse;

      return {
        id: detailsPayload.id,
        name: detailsPayload.name,
        image:
          detailsPayload.sprites.other?.['official-artwork']?.front_default ??
          detailsPayload.sprites.front_default ??
          '',
        types: detailsPayload.types.map((entry) => entry.type.name),
      } satisfies Pokemon;
    })
  );

  return {
    items,
    hasMore: Boolean(listPayload.next),
    nextOffset: offset + limit,
  };
}
