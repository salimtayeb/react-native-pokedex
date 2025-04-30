import { useState } from "react";
import { Modal, Text, TouchableOpacity, View, ScrollView, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

const allTypes = [
  "normal", "fire", "water", "grass", "electric", "ice",
  "fighting", "poison", "ground", "flying", "psychic", "bug",
  "rock", "ghost", "dragon", "dark", "steel", "fairy"
];

const generations = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export function FilterButton({
  onFilterChange,
}: {
  onFilterChange: (types: string[], generation: number | null) => void;
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedGeneration, setSelectedGeneration] = useState<number | null>(null);

  const toggleType = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const selectGeneration = (gen: number) => {
    setSelectedGeneration(prev => (prev === gen ? null : gen));
  };

  const applyFilters = () => {
    onFilterChange(selectedTypes, selectedGeneration);
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.button}>
        <Text style={styles.buttonText}>Filtrer</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide">
        <ScrollView contentContainerStyle={styles.modal}>
          <Text style={styles.title}>Types</Text>
          <View style={styles.typeGrid}>
            {allTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeBadge,
                  selectedTypes.includes(type) && styles.typeBadgeSelected,
                ]}
                onPress={() => toggleType(type)}
              >
                <Text
                  style={[
                    styles.typeText,
                    selectedTypes.includes(type) && styles.typeTextSelected,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.title}>Générations</Text>
          <View style={styles.generationRow}>
            {generations.map((gen) => (
              <TouchableOpacity
                key={gen}
                style={[
                  styles.genButton,
                  selectedGeneration === gen && styles.genButtonSelected,
                ]}
                onPress={() => selectGeneration(gen)}
              >
                <Text
                  style={[
                    styles.genText,
                    selectedGeneration === gen && styles.genTextSelected,
                  ]}
                >
                  Gen {gen}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {(selectedTypes.length > 0 || selectedGeneration !== null) && (
            <Text style={styles.warningText}>
              Si aucun Pokémon ne correspond, un message s'affichera.
            </Text>
          )}

          <TouchableOpacity onPress={applyFilters} style={styles.applyButton}>
            <Text style={styles.applyButtonText}>Appliquer</Text>
          </TouchableOpacity>
        </ScrollView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#fff",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modal: {
    padding: 20,
    backgroundColor: "#fff",
    paddingBottom: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 8,
  },
  typeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#eee",
    borderRadius: 20,
    margin: 4,
  },
  typeBadgeSelected: {
    backgroundColor: Colors.light.tint,
  },
  typeText: {
    color: "#333",
  },
  typeTextSelected: {
    color: "#fff",
  },
  generationRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  genButton: {
    backgroundColor: "#eee",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    margin: 4,
  },
  genButtonSelected: {
    backgroundColor: Colors.light.tint,
  },
  genText: {
    color: "#333",
  },
  genTextSelected: {
    color: "#fff",
  },
  warningText: {
    textAlign: "center",
    color: "#999",
    marginTop: 16,
    fontSize: 14,
  },
  applyButton: {
    marginTop: 24,
    backgroundColor: Colors.light.tint,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  applyButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
