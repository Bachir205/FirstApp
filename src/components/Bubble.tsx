// components/Bubble.tsx
import { View, Text, StyleSheet } from "react-native";


export function Bubble({ text, mine }: { text: string; mine?: boolean }) {
  return (
    <View style={[styles.bubble, mine && styles.bubbleMine]}>
      <Text style={mine && styles.textMine}>{text}</Text>
    </View>
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

  bubble: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 14,
    maxWidth: "75%",            // bubbles never span the full width
    margin: 8,
  },

  bubbleMine: {
    backgroundColor: "#1a5276",
    alignSelf: "flex-end",      // this bubble moves to the right
  },
  textMine: { color: "#fff" },

 });