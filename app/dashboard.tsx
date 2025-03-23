import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import Navbar from "../components/navbar";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const DashboardScreen = () => {
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [userFirstName, setUserFirstName] = useState<string | null>("Erwan");
  const [days, setDays] = useState<{ day: string; date: number; fullDate: Date; isTrainingDay: boolean }[]>([]);

  useEffect(() => {
    const today = new Date();
    const weekDays = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    const trainingDays = [today.getDate(), today.getDate() + 2]; 

    const newDays = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return {
        day: weekDays[date.getDay()],
        date: date.getDate(),
        fullDate: date,
        isTrainingDay: trainingDays.includes(date.getDate()),
      };
    });

    setDays(newDays);
    setSelectedDay(today.getDate());
  }, []);

  useEffect(() => {
    setUserFirstName("Erwan");
  }, []);

  const presenceData = Array(35).fill(null).map((_, i) => ({
    value: Math.random() * 10,
    active: [4, 5, 6, 10, 11, 12, 20, 21, 22, 23].includes(i),
  }));

  return (
    <LinearGradient colors={["#1E3A8A", "#3B82F6"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View entering={FadeInDown.duration(600)}>
          <View style={styles.header}>
            <Text style={styles.title}>
              Bonjour <Text style={styles.username}>{userFirstName || "Utilisateur"}</Text>
            </Text>
            <Image
              source={require('../assets/images/Logo_3D.png')}
              style={styles.icon}
            />
          </View>

          <View style={styles.calendar}>
            <Text style={styles.subtitle}>
              {days.length > 0
                ? `${new Date().toLocaleString("fr-FR", { month: "long", year: "numeric" })} - Semaine du ${days[0].date}`
                : "Chargement..."}
            </Text>
            <View style={styles.daysRow}>
              {days.map((item, index) => (
                <Animated.View
                  key={index}
                  entering={FadeInDown.duration(300).delay(index * 50)}
                >
                  <TouchableOpacity
                    onPress={() => setSelectedDay(item.date)}
                    style={[
                      styles.dayButton,
                      selectedDay === item.date && styles.selectedDay,
                      item.date === new Date().getDate() && styles.highlightedDay,
                      item.isTrainingDay && styles.trainingDay,
                    ]}
                    activeOpacity={0.8}
                  >
                    <Text style={[
                      styles.dayText,
                      selectedDay === item.date && styles.selectedText,
                      item.isTrainingDay && styles.trainingText,
                    ]}>
                      {item.day}
                    </Text>
                    <Text style={[
                      styles.dateText,
                      selectedDay === item.date && styles.selectedText,
                      item.isTrainingDay && styles.trainingText,
                    ]}>
                      {item.date}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Température Bassin n°1</Text>
              <LinearGradient
                colors={["#60A5FA", "#3B82F6"]}
                style={styles.temperatureCircle}
              >
                <Text style={styles.temperatureText}>19.8°C</Text>
              </LinearGradient>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Présence</Text>
              <View style={styles.presenceGrid}>
                {presenceData.map((item, i) => (
                  <Animated.View
                    key={i}
                    entering={FadeInDown.duration(300).delay(i * 20)}
                    style={[
                      styles.presenceDot,
                      {
                        backgroundColor: item.active
                          ? item.value > 5
                            ? "#3B82F6"
                            : "#60A5FA"
                          : "rgba(255, 255, 255, 0.2)",
                      },
                    ]}
                  />
                ))}
              </View>
            </View>
          </View>

          <View style={styles.messagesContainer}>
            <Text style={styles.messagesHeader}>Messages Récents</Text>
            {[1, 2, 3].map((_, index) => (
              <Animated.View
                key={index}
                entering={FadeInDown.duration(400).delay(index * 100)}
                style={styles.messageCard}
              >
                <Image
                  source={{ uri: "https://randomuser.me/api/portraits/men/45.jpg" }}
                  style={styles.avatar}
                />
                <View style={styles.messageTextContainer}>
                  <Text style={styles.messageTitle}>Antoine Moulin</Text>
                  <Text style={styles.messageText}>Salut, j'ai lancé une startup à 10M...</Text>
                </View>
                <Text style={styles.messageTime}>18:20</Text>
              </Animated.View>
            ))}
          </View>
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
  icon: {
    width: 56,
    height: 56,
    marginTop: 12,
   
  },
  calendar: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 20,
    borderRadius: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  subtitle: {
    color: "#E0F2FE",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
    opacity: 0.9,
  },
  daysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  dayButton: {
    width: 70,
    height: 80,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    marginVertical: 4,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  selectedDay: {
    backgroundColor: "#60A5FA",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  highlightedDay: {
    borderWidth: 2,
    borderColor: "#FBBF24",
  },
  trainingDay: {
    backgroundColor: "#FBBF24",
  },
  dayText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
    marginBottom: 4,
  },
  dateText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "700",
  },
  selectedText: {
    color: "#fff",
  },
  trainingText: {
    color: "#1E3A8A",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  card: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 20,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 16,
  },
  temperatureCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  temperatureText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  presenceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  presenceDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    margin: 4,
    elevation: 2,
  },
  messagesContainer: {
    marginBottom: 24,
  },
  messagesHeader: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 20,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  messageCard: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    padding: 20,
    borderRadius: 20,
    marginBottom: 12,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
    borderWidth: 3,
    borderColor: "#fff",
  },
  messageTextContainer: {
    flex: 1,
  },
  messageTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E3A8A",
    marginBottom: 6,
  },
  messageText: {
    fontSize: 15,
    color: "#3B82F6",
    opacity: 0.9,
  },
  messageTime: {
    fontSize: 14,
    color: "#60A5FA",
    fontStyle: "italic",
    fontWeight: "500",
  },
});

export default DashboardScreen;