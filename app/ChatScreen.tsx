import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { SafeAreaView } from "react-native-safe-area-context";

const API_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL;
const IS_DEBUG = false; 
type Message = {
  id: number;
  senderId: number;
  content: string;
  timestamp: string;
  isMine: boolean;
};

const ChatScreen = () => {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const { userId, userName, userAvatar } = useLocalSearchParams();
  const interlocutorId = Number(userId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = await AsyncStorage.getItem("authToken");
      if (!token || !API_URL) {
        Alert.alert("Erreur", "Token ou URL de l'API manquant");
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/swimmer/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Erreur lors de la récupération de l'utilisateur");
        const userData = await response.json();
        setCurrentUserId(userData.id);
      } catch (error) {
        console.error("Erreur fetchUserInfo:", error);
        Alert.alert("Erreur", "Impossible de récupérer les informations utilisateur");
      }
    };

    fetchUserInfo();
  }, []);

  const fetchMessages = async () => {
    if (!currentUserId || !interlocutorId) return;

    setIsLoading(true);
    const token = await AsyncStorage.getItem("authToken");
    if (!token || !API_URL) {
      Alert.alert("Erreur", "Token ou URL de l'API manquant");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/messages/conversation/${interlocutorId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la récupération des messages");
      }

      const data = await response.json();
      if (IS_DEBUG) console.log("Données brutes de l'API:", data);

      const messageArray = Array.isArray(data) ? data.flat() : [];
      const allMessages = messageArray
        .filter((msg: any) => {
          if (!msg || !msg.sender || !msg.receiver) {
            if (IS_DEBUG) console.warn("Message invalide ignoré:", msg);
            return false;
          }
          return true;
        })
        .map((msg: any) => ({
          id: msg.id,
          senderId: msg.sender.id,
          content: msg.content,
          timestamp: msg.createdAt,
          isMine: msg.sender.id === currentUserId,
        }));

      setMessages(allMessages);
    } catch (error) {
      console.error("Erreur fetchMessages:", error);
      Alert.alert("Erreur", (error as Error).message || "Impossible de charger les messages");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUserId && interlocutorId) {
      fetchMessages(); 
      const interval = setInterval(fetchMessages, 30000);
      return () => clearInterval(interval);
    }
  }, [currentUserId, interlocutorId]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentUserId || !interlocutorId) {
      Alert.alert("Erreur", "Message vide ou utilisateur invalide");
      return;
    }

    const token = await AsyncStorage.getItem("authToken");
    if (!token || !API_URL) {
      Alert.alert("Erreur", "Token ou URL de l'API manquant");
      return;
    }

    try {
      const messageData = {
        receiverId: interlocutorId,
        content: newMessage.trim(),
        subject: "",
      };

      const response = await fetch(`${API_URL}/api/messages/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(messageData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de l'envoi du message");
      }

      const newMsg = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          id: newMsg.id,
          senderId: newMsg.sender.id,
          content: newMsg.content,
          timestamp: newMsg.createdAt,
          isMine: true,
        },
      ]);
      setNewMessage("");
      scrollViewRef.current?.scrollToEnd({ animated: true });
      fetchMessages();
    } catch (error) {
      console.error("Erreur sendMessage:", error);
      Alert.alert("Erreur", (error as Error).message || "Impossible d'envoyer le message");
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const refreshMessages = () => {
    fetchMessages();
  };

  return (
    <LinearGradient colors={["#1E3A8A", "#3B82F6"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <AntDesign name="left" size={styles.backButtonIcon.fontSize} color="#fff" />
            </TouchableOpacity>
            <Image style={styles.avatar} source={{ uri: userAvatar as string || "/assets/icons/Avatar03.png" }} />
            <Text style={styles.headerTitle}>{userName || "Utilisateur"}</Text>
            <TouchableOpacity onPress={refreshMessages} style={styles.refreshButton}>
              <Ionicons name="refresh" size={22} color="#fff" />
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Chargement...</Text>
            </View>
          ) : (
            <ScrollView
              ref={scrollViewRef}
              contentContainerStyle={styles.messagesContainer}
              showsVerticalScrollIndicator={false}
            >
              {messages.length === 0 ? (
                <Text style={styles.noMessages}>Aucun message pour l'instant.</Text>
              ) : (
                messages.map((message, index) => (
                  <Animated.View
                    key={message.id}
                    entering={FadeInDown.duration(400).delay(index * 50)}
                    style={[styles.messageItem, message.isMine ? styles.myMessage : styles.otherMessage]}
                  >
                    <Text
                      style={[
                        styles.messageText,
                        message.isMine ? styles.myMessageText : styles.otherMessageText,
                      ]}
                    >
                      {message.content}
                    </Text>
                    <Text style={styles.time}>
                      {new Date(message.timestamp).toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </Animated.View>
                ))
              )}
            </ScrollView>
          )}

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Tape ton message..."
              placeholderTextColor="#93C5FD"
              multiline
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <LinearGradient colors={["#60A5FA", "#3B82F6"]} style={styles.sendGradient}>
                <Ionicons name="send" size={styles.sendIcon.fontSize} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  keyboardAvoidingView: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
  },
  backButton: {
    padding: 8,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginRight: 12,
  },
  backButtonIcon: { fontSize: 22 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    borderWidth: 2,
    borderColor: "#fff",
  },
  headerTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  refreshButton: {
    padding: 8,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginLeft: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#E0F2FE",
    fontSize: 16,
    opacity: 0.8,
  },
  messagesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexGrow: 1,
  },
  messageItem: {
    padding: 12,
    borderRadius: 16,
    marginVertical: 6,
    maxWidth: "75%",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  myMessage: {
    backgroundColor: "#60A5FA",
    alignSelf: "flex-end",
  },
  otherMessage: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    alignSelf: "flex-start",
  },
  messageText: { fontSize: 16 },
  myMessageText: { color: "#fff" },
  otherMessageText: { color: "#1E3A8A" },
  time: {
    fontSize: 12,
    color: "#fff",
    textAlign: "right",
    marginTop: 4,
    opacity: 0.8,
  },
  noMessages: {
    textAlign: "center",
    color: "#E0F2FE",
    fontSize: 16,
    padding: 20,
    opacity: 0.8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.2)",
  },
  input: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    color: "#fff",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    fontSize: 16,
  },
  sendButton: { borderRadius: 24, overflow: "hidden" },
  sendGradient: {
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  sendIcon: { fontSize: 20 },
});

export default ChatScreen;