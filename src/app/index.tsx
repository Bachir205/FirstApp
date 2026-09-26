import { useState, useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { FlatList } from "react-native";
import { ScrollView } from "react-native";
import { TextInput, Pressable } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { CONTACTS } from "../data/contact";



const START_MESSAGES = [
  { id: "1", text: "Hi!", mine: false },
  { id: "2", text: "Hello Awa 👋", mine: true },
  { id: "3", text: "Ready for the lab?", mine: false },
];



function Bubble({ text, mine }: { text: string; mine?: boolean }) {
  return (
    <View style={[styles.bubble, mine && styles.bubbleMine]}>
      <Text style={mine && styles.textMine}>{text}</Text>
    </View>
  );
}


function ContactRow({
  contact,
  selected,
  onPress,
}: {
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



export default function Chat() {
  const [messages, setMessages] = useState(START_MESSAGES);
  const [draft, setDraft] = useState("");

  function send() {
    if (draft.trim() === "") return;             // ignore empty sends
    const next = {
      id: String(Date.now()),                    // a good-enough unique id
      text: draft.trim(),
      mine: true,
    };
    setMessages([...messages, next]);            // new array — never push
    setDraft("");                                // clear the input
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.screen}>

        <View style={styles.header}>
          <Image
            source="https://i.pravatar.cc/100"
            style={styles.avatar}
          />
          <Text style={styles.name}>Awa Diop</Text>
        </View>

        <FlatList
          data={messages}
          keyExtractor={(m) => m.id}
          renderItem={({ item }) => (
            <Bubble text={item.text} mine={item.mine} />
          )}

          ListEmptyComponent={
            <Text style={styles.empty}>No messages yet. Say hello.</Text>
          }
          ListHeaderComponent={
            <Text style={styles.dateLabel}>Today</Text>
          }


          style={styles.messages}
          contentContainerStyle={{ paddingVertical: 8 }}
        />


        <View style={styles.footer}>
          <TextInput
            style={styles.input}
            placeholder="Write a message…"
            value={draft}
            onChangeText={setDraft}
          />

          <Pressable style={styles.send} onPress={send}>
            <Text style={styles.sendLabel}>➤</Text>
          </Pressable>
        </View>
      </View>

    </SafeAreaView>
  );
}

export function Contacts() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      CONTACTS.filter((c) =>
        c.name.toLowerCase().includes(query.trim().toLowerCase())
      ),
    [query]
  );

  return (
    <FlatList
      data={filtered}
      keyExtractor={(c) => c.id}
      renderItem={({ item }) => (
        <ContactRow
          contact={item}
          selected={item.id === selectedId}
          onPress={() => setSelectedId(item.id)}
        />
      )}

      ListHeaderComponent={
        <View>
          <View style={styles.headerRow}>
            <Text style={styles.h1}>Contacts</Text>
            <Text style={styles.count}>({filtered.length})</Text>
          </View>
          <TextInput
            style={styles.search}
            placeholder="Search…"
            value={query}
            onChangeText={setQuery}
          />
        </View>
      }
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListEmptyComponent={
        <Text style={styles.empty}>No contact matches "{query}".</Text>
      }
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ padding: 16 }}
    />
  );
}



const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  header: {
    height: 60,
    backgroundColor: "#dbeafe",
    flexDirection: "row",       // side by side
    alignItems: "center",       // centred on the cross axis (vertical, in a row)
    paddingHorizontal: 12,
    gap: 10,                    // space between photo and name
  },
  //avatar: { width: 40, height: 40, borderRadius: 20 },
  //name: { fontSize: 17, fontWeight: "bold" },

  messages: { flex: 1, backgroundColor: "#f4f4f4" },
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


  footer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,                    // take all width the button leaves
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 14,
    height: 40,
  },
  send: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1a5276",
    justifyContent: "center",
    alignItems: "center",
  },
  sendLabel: { color: "#fff", fontSize: 16 },

  //empty: { textAlign: "center", color: "#888", paddingVertical: 32 },
  dateLabel: { textAlign: "center", color: "#888", fontSize: 12, paddingBottom: 8 },

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
