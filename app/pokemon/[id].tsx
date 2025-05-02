import { Card } from "@/components/Card";
import { PokemonSpec } from "@/components/pokemon/PokemonSpec";
import { PokemonStat } from "@/components/pokemon/PokemonStat";
import { PokemonType } from "@/components/pokemon/PokemonType";
import { RootView } from "@/components/RootView";
import { Row } from "@/components/Row";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { formatSize, formatWeight, getPokemonArtwork } from "@/functions/pokemon";
import { useFetchQuery } from "@/hooks/useFetchQuery";
import { useThemeColors } from "@/hooks/useThemeColors";
import { router, useLocalSearchParams } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useState } from "react";



export default function Pokemon() {
    const colors = useThemeColors();
    const params = useLocalSearchParams() as { id: string };
    const currentId = parseInt(params.id);
    const prevId = currentId > 1 ? currentId - 1 : null;
    const nextId = currentId + 1;
    const { data: pokemon } = useFetchQuery("/pokemon/[id]", { id: params.id });
    const { data: species } = useFetchQuery("/pokemon-species/[id]/", { id: params.id })
    const mainType = pokemon?.types?.[0].type.name;
    const colorType = mainType ? Colors.type[mainType] : colors.tint;
    const types = pokemon?.types ?? [];
    const bio = species?.flavor_text_entries
        ?.find(({ language }) => language.name == "en")
        ?.flavor_text.replaceAll("\n", " ");
    return (
        <RootView style={{ backgroundColor: colorType }}>
            <View>
                <Image
                    style={styles.pokeball}
                    source={require("@/assets/images/pokeball_big.png")}
                    width={208}
                    height={208}
                />
                <Row style={styles.header}>
                    <Row gap={8}>
                        <Pressable onPress={router.back}>
                            <Image
                                source={require("@/assets/images/back.png")}
                                width={32}
                                height={32}
                            />
                        </Pressable>
                        
                        {/* Titre */}
                        <ThemedText
                            color={colors.grayWhite}
                            variant="headline"
                            style={{ textTransform: "capitalize" }}
                        >
                            { pokemon?.name }
                        </ThemedText>
                    </Row>
                    {/* Numéro */}
                    <ThemedText color={colors.grayWhite} variant="subtitle2">
                        #{ params.id.padStart(3, "0") }
                    </ThemedText>
                </Row>
                <View style={styles.body}>
                    <Image
                        style={styles.artwork}
                        source={{
                            uri: getPokemonArtwork(params.id)
                        }}
                        width={200}
                        height={200}
                    />
                <Row style={styles.navButtons}>
                    {prevId && (
                        <Pressable onPress={() => router.push(`/pokemon/${prevId}`)}>
                            <Image source={require("@/assets/images/precedent.png")} style={styles.navIconWhite} />
                        </Pressable>
                    )}
                    <View style={{ flex:1 }} />
                    <Pressable onPress={() => router.push(`/pokemon/${nextId}`)}>
                        <Image source={require("@/assets/images/suivant.png")} style={styles.navIconWhite} />

                    </Pressable>
                </Row>    
                    <Card style={styles.card}>
                        <Row gap={16}>
                            {types.map((type) => (
                                <PokemonType name={type.type.name} key={type.type.name} />
                            ))}
                        </Row>
                        {/* About */}
                        <ThemedText variant="subtitle1" color={ colorType }>
                            About
                        </ThemedText>
                        <Row>
                            <PokemonSpec
                                style={{
                                    borderStyle: "solid",
                                    borderRightWidth: 1,
                                    borderColor: colors.grayLight,
                                }}
                                title={formatWeight(pokemon?.weight)}
                                description="Weight"
                                image={require("@/assets/images/weight.png")}
                            />
                            <PokemonSpec
                                style={{
                                    borderStyle: "solid",
                                    borderRightWidth: 1,
                                    borderColor: colors.grayLight,
                                }}
                                title={formatSize(pokemon?.height)}
                                description="Height"
                                image={require("@/assets/images/size.png")}
                            />
                            <PokemonSpec
                                title={pokemon?.moves
                                    .slice(0, 2)
                                    .map((m) => m.move.name)
                                    .join("\n")}
                                description="Moves"
                            />
                        </Row>
                        <ThemedText>{bio}</ThemedText>
                        
                        {/* Base stats */}
                        <ThemedText variant="subtitle1" color={ colorType }>
                            Base stats
                        </ThemedText>

                        <View style={{ alignSelf: "stretch" }}>
                            {pokemon?.stats.map((stat) => (
                                <PokemonStat
                                    key={stat.stat.name}
                                    name={stat.stat.name}
                                    value={stat.base_stat}
                                    color={colorType}
                                />
                            ))}
                        </View>
                    </Card>
                </View>
            </View>
        </RootView>
    );
}

const styles = StyleSheet.create({
    header: {
        margin: 20,
        justifyContent: "space-between",
    },
    pokeball: {
        opacity: 0.1,
        position: "absolute",
        right: 8,
        top: 8,
        zIndex: -1,
    },
    artwork: {
        position: "absolute",
        top: -140,
        alignSelf: "center",
        zIndex: 2,
    },
    body: {
        marginTop: 144,
    },
    card: {
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
        gap: 16,
        alignItems: "center",
    },
    navButtons: {
        marginTop: 100,
        marginBottom: 20,
        paddingHorizontal: 20,
        flexDirection: "row",
        alignItems: "center",
         
    },
    navIconWhite: {
        width:40,
        height: 40, tintColor: '#FFF',
        
    }
});