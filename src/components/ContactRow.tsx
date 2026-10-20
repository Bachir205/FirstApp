import { View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { Pressable } from "react-native";
import { CONTACTS } from "@/data/contact";

export function ContactRow({ contact,
  selected,
  onPress, }: {
    contact: (typeof CONTACTS)[number];
    selected: boolean;
    onPress: () => void;
  }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.row, selected && styles.rowSelected]}
    >
      <View style={styles.row}>
        <Image
          source={`https://i.pravatar.cc/100?u=${contact.id}`}
          style={styles.avatar}
        />
        <View style={styles.rowText}>
          <Text style={styles.name}>{contact.name}</Text>
          <Text style={styles.program}>{contact.program}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({ 
  row: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 10 },
  avatar: { width: 44, height: 44, borderRadius: 22 },
  rowText: { flex: 1 },
  name: { fontSize: 16, fontWeight: "600" },
  program: { fontSize: 13, color: "#666" },

  headerRow: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", paddingBottom: 8
  },
  h1: { fontSize: 22, fontWeight: "bold", color: "#1a5276" },
  count: { color: "#888" },
  separator: { height: 1, backgroundColor: "#e5e5e5" },
  empty: { textAlign: "center", color: "#888", paddingVertical: 32 },

  search: {
    height: 40, borderWidth: 1, borderColor: "#ccc", borderRadius: 20,
    paddingHorizontal: 14, marginBottom: 12
  },
  rowSelected: { backgroundColor: "#dbeafe", borderRadius: 8, paddingHorizontal: 8 },

 });