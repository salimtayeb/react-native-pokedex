import { useState, useEffect } from "react";
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View } from "react-native";

import { Card } from "@/components/Card";
import { PokemonCard } from "@/components/pokemon/PokemonCard";
import { RootView } from "@/components/RootView";
import { Row } from "@/components/Row";
import { SearchBar } from "@/components/SearchBar";
import { SortButton } from "@/components/SortButton";
import { FilterButton } from "@/components/FilterButton";

import { ThemedText } from "@/components/ThemedText";
import { getPokemonId } from "@/functions/pokemon";
import { useInfiniteFetchQuery } from "@/hooks/useFetchQuery";
import { useThemeColors } from "@/hooks/useThemeColors";

// Fonction pour récupérer les types d'un Pokémon en utilisant son URL
const getPokemonDetails = async (url: string) => {
  const response = await fetch(url);
  const data = await response.json();
  return data.types.map((t: any) => t.type.name);
};

export default function Index() {
  const colors = useThemeColors();
  const { data, isFetching, fetchNextPage } = useInfiniteFetchQuery('/pokemon?limit=21');

  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<"id" | "id-decreasing" | "name" | "name-decreasing">("id");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedGeneration, setSelectedGeneration] = useState<number | null>(null);
  const [pokemonDetails, setPokemonDetails] = useState<any[]>([]);

  const pokemons = data?.pages.flatMap(page =>
    page.results.map(r => ({
      name: r.name,
      id: getPokemonId(r.url),
      url: r.url,
    }))
  ) ?? [];

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      const details = await Promise.all(
        pokemons.map(async (pokemon) => {
          const types = await getPokemonDetails(pokemon.url);
          return { ...pokemon, types };
        })
      );
      setPokemonDetails(details);
    };

    if (pokemons.length > 0) {
      fetchPokemonDetails();
    }
  }, [pokemons]);

  const filteredPokemons = [
    ...(search
      ? pokemonDetails.filter(
          (p) =>
            p.name.includes(search.toLowerCase()) ||
            p.id.toString() === search
        )
      : pokemonDetails
    )
  ]
    .filter(p => {
      if (selectedTypes.length === 0) return true;
      return p.types?.some((t: string) => selectedTypes.includes(t));
    })
    .filter(p => {
      if (!selectedGeneration) return true;
      const genRanges: Record<number, [number, number]> = {
        1: [1, 151],
        2: [152, 251],
        3: [252, 386],
        4: [387, 493],
        5: [494, 649],
        6: [650, 721],
        7: [722, 809],
        8: [810, 905],
        9: [906, 1010],
      };
      const [min, max] = genRanges[selectedGeneration];
      return p.id >= min && p.id <= max;
    })
    .sort((a, b) => {
      if (sortKey === "id") return a.id - b.id;
      if (sortKey === "id-decreasing") return b.id - a.id;
      if (sortKey === "name") return a.name.localeCompare(b.name);
      if (sortKey === "name-decreasing") return b.name.localeCompare(a.name);
      return 0;
    });

  return (
    <RootView>
      <Row style={styles.header} gap={16}>
        <Image source={require('@/assets/images/pokeball.png')} />
        <ThemedText variant="headline" color={colors.grayWhite}>Pokédex</ThemedText>
      </Row>

      <Row gap={16} style={styles.form}>
        <SearchBar value={search} onChange={setSearch} />
        <SortButton value={sortKey} onChange={setSortKey} />
        <FilterButton
          onFilterChange={(types, generation) => {
            setSelectedTypes(types);
            setSelectedGeneration(generation);
          }}
        />
      </Row>

      <Card style={styles.body}>
        <FlatList
          data={filteredPokemons}
          numColumns={3}
          contentContainerStyle={[styles.gridGap, styles.list]}
          columnWrapperStyle={styles.gridGap}
          ListFooterComponent={isFetching ? <ActivityIndicator color={colors.tint} /> : null}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', color: colors.gray, marginTop: 20 }}>
              Aucun Pokémon ne correspond à ce filtre.
            </Text>
          }
          onEndReached={search ? undefined : () => fetchNextPage()}
          renderItem={({ item }) => (
            <PokemonCard
              id={item.id}
              name={item.name}
              style={{ flex: 1 / 3 }}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      </Card>
    </RootView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  body: {
    flex: 1,
    marginTop: 16,
  },
  gridGap: {
    gap: 8
  },
  list: {
    padding: 12,
  },
  form: {
    paddingHorizontal: 12,
  }
});
