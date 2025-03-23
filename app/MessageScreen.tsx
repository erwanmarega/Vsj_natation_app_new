import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import Navbar from "../components/navbar";

const API_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL;

type Conversation = {
  id: number;
  name: string;
  lastMessage: string;
  date: string;
  avatar: string;
};

const MessageScreen = () => {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [search, setSearch] = useState("");

  const fetchConversations = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token || !API_URL) {
        Alert.alert("Erreur", "Token ou URL manquant");
        return;
      }

      const response = await fetch(`${API_URL}/api/messages/contacts`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Impossible de récupérer les conversations.");
      }

      const data = await response.json();
      setConversations(data);
    } catch (error) {
      const err = error as Error;
      console.error("Erreur lors de la récupération des conversations:", err);
      Alert.alert("Erreur", err.message || "Une erreur est survenue.");
    }
  };

  useEffect(() => {
    fetchConversations(); 

    const interval = setInterval(fetchConversations, 60000);
    return () => clearInterval(interval); 
  }, []);

  const openChat = (conversation: Conversation) => {
    router.push(
      `/ChatScreen?userId=${conversation.id}&userName=${encodeURIComponent(
        conversation.name
      )}&userAvatar=${encodeURIComponent(conversation.avatar)}`
    );
  };

  return (
    <LinearGradient colors={["#1E3A8A", "#3B82F6"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View entering={FadeInDown.duration(600)}>
          <View style={styles.header}>
            <Text style={styles.title}>Messagerie</Text>
            <TouchableOpacity style={styles.addButton}>
              <LinearGradient
                colors={["#60A5FA", "#3B82F6"]}
                style={styles.addGradient}
              >
                <Ionicons name="person-add-outline" size={24} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#E0F2FE" style={styles.searchIcon} />
            <TextInput
              placeholder="Rechercher une conversation..."
              placeholderTextColor="#E0F2FE"
              style={styles.searchInput}
              value={search}
              onChangeText={setSearch}
            />
          </View>

          {conversations.length === 0 ? (
            <Text style={styles.noConversations}>Aucune conversation pour l'instant.</Text>
          ) : (
            conversations
              .filter((conv) => conv.name.toLowerCase().includes(search.toLowerCase()))
              .map((conversation, index) => (
                <Animated.View
                  key={conversation.id}
                  entering={FadeInDown.duration(400).delay(index * 100)}
                >
                  <TouchableOpacity
                    style={styles.messageItem}
                    onPress={() => openChat(conversation)}
                    activeOpacity={0.8}
                  >
                    <Image
                      source={{
                        uri:
                          conversation.avatar || "https://randomuser.me/api/portraits/men/45.jpg",
                      }}
                      style={styles.avatar}
                    />
                    <View style={styles.messageContent}>
                      <Text style={styles.name}>
                        {conversation.name && conversation.name.trim() !== ""
                          ? conversation.name
                          : "Utilisateur Inconnu"}
                      </Text>
                      <Text style={styles.message} numberOfLines={1}>
                        {conversation.lastMessage}
                      </Text>
                    </View>
                    <Text style={styles.time}>
                      {new Date(conversation.date).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              ))
          )}
        </Animated.View>
      </ScrollView>
      <Navbar />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 80,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 6,
  },
  addButton: {
    borderRadius: 24,
    overflow: "hidden",
  },
  addGradient: {
    padding: 12,
    borderRadius: 24,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 16,
    padding: 14,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  messageItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
    borderWidth: 3,
    borderColor: "#fff",
  },
  messageContent: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E3A8A",
    marginBottom: 6,
  },
  message: {
    fontSize: 15,
    color: "#3B82F6",
    opacity: 0.9,
  },
  time: {
    fontSize: 13,
    color: "#60A5FA",
    fontStyle: "italic",
    fontWeight: "500",
  },
  noConversations: {
    textAlign: "center",
    color: "#E0F2FE",
    fontSize: 18,
    fontWeight: "500",
    padding: 20,
    opacity: 0.8,
  },
});

export default MessageScreen;