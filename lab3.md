# Lab 3

Until now the project has been a sequence of single screens, each replacing the last. 

This exercise assembles them into one application with real navigation: a tab bar, a contact detail page reached from the list, the conversation screen opened from that page, and a modal.

```text
                    app/_layout.tsx  (Stack)
                              │
        ┌─────────────────────┴──────────────────────┐
        │                                            │
   (tabs)/_layout.tsx  (Tabs)                  new-message.tsx
        │                                        (modal)
   ┌────┴─────────────┐
   │                  │
 index.tsx      contacts/  (Stack)
  Home            │
                  ├── index.tsx      the list
                  ├── [id].tsx       one contact
                  └── chat.tsx       the conversation
```

The starting point is the project as it stands after the two previous exercises: a conversation screen and a contacts screen, each living alone in `app/index.tsx` at different times.

Rules: type every step, run after each one, read any red screen before fixing it. Each step ends with a **Checkpoint**. Total time: about 60 minutes.

---

# Part A — Structure

---

## Step 1 — Move Non-Screens Out of `app/`

A file in `app/` becomes a route, intended or not. Before adding navigation, the project is tidied.

Create two folders **beside** `app/`, not inside it, and move the existing components and data:

```text
components/
├── ContactRow.tsx
└── Bubble.tsx
data/
└── contacts.ts
```

Each component file exports its component:

```tsx
// components/ContactRow.tsx
import { View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";

export function ContactRow({ contact }) {
  /* …the component from the previous exercise… */
}

const styles = StyleSheet.create({ /* …its own styles… */ });
```

Update the imports in the screens that use them. The Expo template configures the `@/` alias for the project root, which avoids counting `../` as files move between folders — and they will move twice in this exercise:

```tsx
import { ContactRow } from "@/components/ContactRow";
import { CONTACTS } from "@/data/contacts";
```

The alias is declared in `tsconfig.json`; relative paths still work, but they break on every move.

**Checkpoint 1** — the project runs exactly as before. Nothing about the interface has changed; only the file locations have.

---

## Step 2 — The Root Layout

```tsx
// app/_layout.tsx
import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack />;
}
```

This declares the outermost navigator. Every screen added from here sits inside this stack.

**Checkpoint 2** — the application still opens on its first screen, now with a header bar supplied by the stack.

---

## Step 3 — Two Tabs

Create the group folder and its layout:

```tsx
// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index"    options={{ title: "Home" }} />
      <Tabs.Screen name="contacts" options={{ title: "Contacts" }} />
    </Tabs>
  );
}
```

Then create a minimal home screen and move the contacts list:

```text
app/
├── _layout.tsx
└── (tabs)/
    ├── _layout.tsx
    ├── index.tsx              ← a simple welcome screen
    └── contacts/
        └── index.tsx          ← the list from the previous exercise
```

```tsx
// app/(tabs)/index.tsx
import { View, Text } from "react-native";

export default function Home() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>DAUST Messenger</Text>
    </View>
  );
}
```

The parentheses around `tabs` keep the folder out of the addresses: the home screen is `/`, not `/(tabs)`.

**Checkpoint 3** — a tab bar at the bottom with Home and Contacts; switching tabs works; the contacts list appears under its tab.

---

## Step 4 — Remove the Doubled Header

Two headers are now visible on the contacts screen: one from the root stack, one from the tabs.

```tsx
// app/_layout.tsx
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
```

The root stack no longer draws a header around the tab group; the tabs manage their own.

**Checkpoint 4** — one header per screen. A doubled header is always a sign that two navigators are both drawing one.

Commit:

```bash
git add . && git commit -m "Expo Router: root stack with a tab group"
```

---

# Part B — The Detail Route

---

## Step 5 — A Stack Inside the Tab

A detail screen should slide over the list and keep the tab bar visible underneath. That requires a stack **inside** the contacts folder:

```tsx
// app/(tabs)/contacts/_layout.tsx
import { Stack } from "expo-router";

export default function ContactsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Contacts" }} />
    </Stack>
  );
}
```

**Checkpoint 5** — the contacts list shows a header titled "Contacts". Nothing else has changed yet.

---

## Step 6 — The Dynamic Route

Create `app/(tabs)/contacts/[id].tsx`:

```tsx
import { View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, Stack } from "expo-router";
import { CONTACTS } from "@/data/contacts";

export default function ContactDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const contact = CONTACTS.find((c) => c.id === id);

  if (!contact) {
    return (
      <View style={styles.screen}>
        <Text style={styles.missing}>Contact not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ title: contact.name }} />

      <Image
        source={`https://i.pravatar.cc/200?u=${contact.id}`}
        style={styles.avatar}
      />
      <Text style={styles.name}>{contact.name}</Text>
      <Text style={styles.program}>{contact.program}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen:  { flex: 1, alignItems: "center", paddingTop: 32, gap: 8 },
  avatar:  { width: 120, height: 120, borderRadius: 60 },
  name:    { fontSize: 22, fontWeight: "bold" },
  program: { fontSize: 15, color: "#666" },
  missing: { color: "#888", paddingTop: 32 },
});
```

Three points while typing:

- the file name's brackets create the parameter; `useLocalSearchParams` reads it
- `<Stack.Screen options={{ title: contact.name }} />` sets the header **from inside the screen**, because only the screen knows the contact's name
- the not-found branch comes first: an identifier that no longer exists is a normal situation, not an exceptional one

**Checkpoint 6** — the route cannot be reached yet from the interface. Test it by temporarily adding a link on the home screen: `<Link href="/contacts/c3"><Text>Test</Text></Link>`. The screen should show Fatou Ndiaye and her name in the header. Remove the test link afterwards.

---

## Step 7 — Opening It From the List

In the contacts list, the row's press handler is replaced by a link carrying the identifier:

```tsx
import { Link } from "expo-router";

renderItem={({ item }) => (
  <Link
    href={{ pathname: "/contacts/[id]", params: { id: item.id } }}
    asChild
  >
    <Pressable>
      <ContactRow contact={item} />
    </Pressable>
  </Link>
)}
```

The `selectedId` state and the `rowSelected` style from the previous exercise are no longer needed — highlighting a row was a stand-in for navigation, and navigation now exists. Delete them.

Note what travels: **the identifier only**. The detail screen looks the contact up itself, as it does on line 8 of Step 6.

**Checkpoint 7** — tapping any contact opens their detail screen with the correct name in the header; the back button returns to the list at the same scroll position.

---

## Step 8 — The Conversation, Reached Properly

The conversation screen becomes a route inside the same folder:

```text
app/(tabs)/contacts/chat.tsx
```

It draws its own header — avatar and name — so the stack's header must be turned off, and the screen must supply its own safe area:

```tsx
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";

export default function Chat() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen options={{ headerShown: false }} />
      {/* the header, FlatList of bubbles, and footer from before */}
    </SafeAreaView>
  );
}
```

Add a button on the detail screen that opens it:

```tsx
import { useRouter } from "expo-router";

const router = useRouter();

<Pressable style={styles.button} onPress={() => router.navigate("/contacts/chat")}>
  <Text style={styles.buttonLabel}>Send a message</Text>
</Pressable>
```

```tsx
button:      { backgroundColor: "#1a5276", paddingVertical: 12,
               paddingHorizontal: 24, borderRadius: 24, marginTop: 16 },
buttonLabel: { color: "#fff", fontWeight: "600" },
```

**Checkpoint 8** — from the list: tap a contact, then "Send a message", and the conversation opens with its own header and no stack header above it. Back twice returns to the list.

> A limitation worth noticing: the conversation screen always shows the same hard-coded name, whichever contact was opened. Fixing it is the stretch task at the end.

Commit:

```bash
git add . && git commit -m "Contact detail route and conversation screen"
```

---

# Part C — A Modal

---

## Step 9 — Declaring the Modal Route

Create `app/new-message.tsx` — at the root, **outside** the tab group, so it covers the tab bar:

```tsx
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";

export default function NewMessage() {
  const router = useRouter();
  const [text, setText] = useState("");

  return (
    <View style={styles.screen}>
      <TextInput
        style={styles.input}
        placeholder="To…"
        value={text}
        onChangeText={setText}
      />
      <Pressable style={styles.button} onPress={() => router.back()}>
        <Text style={styles.buttonLabel}>Close</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen:      { flex: 1, padding: 16, gap: 12 },
  input:       { height: 40, borderWidth: 1, borderColor: "#ccc",
                 borderRadius: 20, paddingHorizontal: 14 },
  button:      { alignSelf: "flex-start", backgroundColor: "#1a5276",
                 paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20 },
  buttonLabel: { color: "#fff", fontWeight: "600" },
});
```

Register it in the root layout with a modal presentation:

```tsx
// app/_layout.tsx
<Stack>
  <Stack.Screen name="(tabs)"      options={{ headerShown: false }} />
  <Stack.Screen name="new-message" options={{ presentation: "modal",
                                              title: "New message" }} />
</Stack>
```

**Checkpoint 9** — the file exists and the project runs; the modal is not reachable yet.

---

## Step 10 — Opening the Modal

Add a link in the contacts list header, beside the count:

```tsx
<Link href="/new-message" asChild>
  <Pressable>
    <Text style={styles.action}>New</Text>
  </Pressable>
</Link>
```

```tsx
action: { color: "#1a5276", fontWeight: "600" },
```

**Checkpoint 10** — tapping "New" slides a screen up from the bottom, over the tab bar. "Close" dismisses it, and on iOS swiping down does too. The modal differs from every other screen by one option in the layout.

---

## Step 11 — Verify the Whole Application

A checklist, run on a physical device:

| Check | Expected |
|---|---|
| Both tabs | Switch freely; each keeps its own state |
| Tap a contact | Detail opens, header shows that contact's name |
| Back from detail | Returns to the list at its previous scroll position |
| "Send a message" | Conversation opens with one header only |
| Android back gesture | Behaves as the header's back button does |
| "New" | Modal slides up over the tab bar |
| No stray routes | Nothing in `app/` that is not meant to be a screen |

**Checkpoint 11** — every line passes.

```bash
git add . && git commit -m "New message modal; navigation complete"
```

---

## What Was Used

| Step | Concept | From |
|---|---|---|
| 1 | Only screens belong in `app/` | Lecture 4, Part V |
| 2–3 | `_layout.tsx`, `Stack`, `Tabs`, route groups | Lecture 4, Parts I and IV |
| 4 | `headerShown: false` on a nested navigator | Lecture 4, Part IV |
| 5 | Nested navigators — a stack inside a tab | Lecture 4, Part IV |
| 6 | Dynamic route, `useLocalSearchParams`, per-screen options | Lecture 4, Part III |
| 7 | `Link` with `asChild`; the identifier travels, the data is looked up | Lecture 4, Part III |
| 8 | `useRouter`, `headerShown: false`, safe area | Lecture 4 + Lecture 2 |
| 9–10 | A modal is a route with a different presentation | Lecture 4, Part IV |

