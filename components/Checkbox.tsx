// components/Checkbox.tsx
import { View, StyleSheet } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";

type Props = {
  checked: boolean;
};

export function Checkbox({ checked }: Props) {
  const colors = useThemeColors();

  return (
    <View style={[styles.box, { borderColor: colors.tint }]}>
      {checked && <View style={[styles.inner, { backgroundColor: colors.tint }]} />}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    width: 16,
    height: 16,
    borderWidth: 2,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  inner: {
    width: 10,
    height: 10,
    borderRadius: 2,
  },
});
