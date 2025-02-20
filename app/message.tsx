import React from "react";
import { View, Text, TextInput, Image, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Navbar from "../components/navbar";

const messages = [
  { name: "Stéphane CABLET", text: "Salut ✌️ t'es chaud pour qu'on aille s'entraîner mercredi ? Faut qu'on performe dimanche prochain ! tiens moi au jus 🍷", time: "1 hour ago", unread: 2 },
  { name: "Fabrice", text: "Yo frerot, t’as fait combien à la dernière compète ça m’intrigue ??", time: "1 hour ago" },
  { name: "Damien", text: "Toi : t’es chaud de covoiturer pour ce soir ??", time: "4 hours ago" },
  { name: "Yves", text: "vas-y à ce soir !", time: "yesterday" },
  { name: "Taylor", text: "nan ça m’intéresse pas dsl", time: "sunday" },
  { name: "Edouard", text: "T’es sur ? j’étais persuadé que si pourtant", time: "09 dec" },
  { name: "Donatien", text: "Ça marche on se redit ça", time: "09 dec" },
  { name: "Sabrina", text: "okkk à ce soir alors 😜", time: "05 nov" },
  { name: "Brice", text: "c’est crawl ou nage libre demain ??", time: "01 nov" },
];

const MessageScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messagerie</Text>
        <TouchableOpacity>
          <Ionicons name="person-add-outline" size={24} color="#4A90E2" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="gray" style={styles.searchIcon} />
        <TextInput placeholder="Search.." style={styles.searchInput} />
      </View>

      <ScrollView>
        {messages.map((msg, index) => (
          <TouchableOpacity key={index} style={styles.messageItem}>
            <View style={styles.leftSection}>
              <Image source={{ uri: "https://randomuser.me/api/portraits/men/45.jpg" }} style={styles.avatar} />
              {msg.unread && <View style={styles.unreadBadge}><Text style={styles.unreadText}>{msg.unread}</Text></View>}
            </View>
            <View style={styles.messageContent}>
              <Text style={styles.name}>{msg.name}</Text>
              <Text style={styles.message}>{msg.text}</Text>
            </View>
            <Text style={styles.time}>{msg.time}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Navbar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  title: { fontSize: 28, fontWeight: "bold" },
  searchBar: { flexDirection: "row", alignItems: "center", backgroundColor: "#f4f4f4", borderRadius: 8, padding: 10, marginBottom: 16 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1 },
  messageItem: { flexDirection: "row", alignItems: "center", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#E5E5E5" },
  leftSection: { position: "relative" },
  avatar: { width: 48, height: 48, borderRadius: 24, marginRight: 10 },
  unreadBadge: { position: "absolute", top: 0, right: 0, backgroundColor: "#4A90E2", borderRadius: 10, paddingHorizontal: 5, paddingVertical: 2 },
  unreadText: { color: "#fff", fontSize: 12, fontWeight: "bold" },
  messageContent: { flex: 1 },
  name: { fontWeight: "bold", fontSize: 14 },
  message: { color: "gray", fontSize: 14 },
  time: { fontSize: 12, color: "gray" },
});

export default MessageScreen;
