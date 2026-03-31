export type Pokemon = {
  id: number;
  name: string;
  image: string;
  types: string[];
};

export type PokemonPage = {
  items: Pokemon[];
  hasMore: boolean;
  nextOffset: number;
};
