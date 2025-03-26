import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import QRCode from "react-native-qrcode-svg";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import Navbar from "../components/navbar";

const API_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL;

type Training = {
  id: number;
  title: string;
  date: string;
  duration: string;
  intensity: string;
  category: string;
  description?: string;
};

const QRScreen = () => {
  const [userFirstName, setUserFirstName] = useState<string | null>("Utilisateur");
  const [groupId, setGroupId] = useState<number | null>(null);
  const [training, setTraining] = useState<Training | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setIsLoading(true);
    const token = await AsyncStorage.getItem("authToken");
    if (!token || !API_URL) {
      Alert.alert("Erreur", "Utilisateur non authentifié.");
      setIsLoading(false);
      return;
    }

    try {
      const userResponse = await fetch(`${API_URL}/api/swimmer/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error("Erreur lors de la récupération des données utilisateur.");
      }

      const userData = await userResponse.json();
      setUserFirstName(userData.nom || "Utilisateur"); 
      setGroupId(userData.groupId);

      if (!userData.groupId) {
        throw new Error("Aucun groupe associé à l'utilisateur.");
      }

      const currentMonth = new Date().toISOString().slice(0, 7);
      const trainingResponse = await fetch(
        `${API_URL}/api/group/${userData.groupId}/trainings?month=${currentMonth}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      if (!trainingResponse.ok) {
        const trainingError = await trainingResponse.json();
        throw new Error(trainingError.error || "Erreur lors de la récupération des entraînements.");
      }

      const trainingData = await trainingResponse.json();
      const trainings: Training[] = trainingData.trainings || [];

      if (trainings.length === 0) {
        Alert.alert("Information", "Aucun entraînement prévu ce mois-ci.");
        return;
      }

      const now = new Date();
      const nextTraining = trainings
        .filter((t) => new Date(t.date) > now)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

      if (nextTraining) {
        setTraining(nextTraining);
      } else {
        Alert.alert("Information", "Aucun entraînement futur trouvé ce mois-ci.");
      }
    } catch (error) {
        if (error instanceof Error) {
          console.error("Erreur chargement données:", error);
          Alert.alert("Erreur", error.message || "Impossible de charger les données.");
        } else {
          console.error("Erreur inconnue:", error);
          Alert.alert("Erreur", "Une erreur inconnue est survenue.");
        }
      } finally {
        setIsLoading(false);
      }
  };

  const refreshQRCode = () => {
    setTraining(null);
    fetchUserData();
  };

  if (isLoading) {
    return (
      <LinearGradient colors={["#1E3A8A", "#3B82F6"]} style={styles.container}>
        <Text style={styles.loadingText}>Chargement en cours...</Text>
      </LinearGradient>
    );
  }

  if (!training) {
    return (
      <LinearGradient colors={["#1E3A8A", "#3B82F6"]} style={styles.container}>
        <Text style={styles.errorText}>Aucun entraînement futur disponible.</Text>
        <TouchableOpacity style={styles.resetButton} onPress={refreshQRCode}>
          <LinearGradient colors={["#60A5FA", "#3B82F6"]} style={styles.resetGradient}>
            <Text style={styles.resetText}>Réessayer</Text>
          </LinearGradient>
        </TouchableOpacity>
        <Navbar />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#1E3A8A", "#3B82F6"]} style={styles.container}>
      <Animated.View entering={FadeInDown.duration(600)} style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>
            Votre QR Code,{" "}
            <Text style={styles.username}>{userFirstName}</Text>
          </Text>
          <Ionicons name="qr-code-outline" size={40} color="#fff" />
        </View>

        <View style={styles.qrContainer}>
          <QRCode
            value={training.id.toString()} 
            size={300}
            color="#1E3A8A"
            backgroundColor="white"
          />
        </View>

        <View style={styles.trainingInfo}>
          <Text style={styles.trainingTitle}>{training.title}</Text>
          <Text style={styles.trainingDate}>
            {new Date(training.date).toLocaleString("fr-FR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>

        <Text style={styles.instructions}>
          Présentez ce QR code à la piscine pour marquer votre présence.
        </Text>

        <TouchableOpacity style={styles.resetButton} onPress={refreshQRCode}>
          <LinearGradient colors={["#60A5FA", "#3B82F6"]} style={styles.resetGradient}>
            <Text style={styles.resetText}>Rafraîchir le QR Code</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
      <Navbar />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 80, 
    width: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 6,
  },
  username: {
    color: "#E0F2FE",
    opacity: 0.9,
  },
  qrContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    marginBottom: 24,
  },
  trainingInfo: {
    alignItems: "center",
    marginBottom: 20,
  },
  trainingTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  trainingDate: {
    fontSize: 16,
    color: "#E0F2FE",
    opacity: 0.9,
    fontWeight: "500",
  },
  instructions: {
    fontSize: 18,
    color: "#E0F2FE",
    textAlign: "center",
    fontWeight: "500",
    opacity: 0.9,
    marginBottom: 20,
  },
  resetButton: {
    borderRadius: 24,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  resetGradient: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  resetText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  loadingText: {
    fontSize: 20,
    color: "#fff",
    textAlign: "center",
  },
  errorText: {
    fontSize: 20,
    color: "#FBBF24",
    textAlign: "center",
    marginBottom: 20,
  },
});

export default QRScreen;