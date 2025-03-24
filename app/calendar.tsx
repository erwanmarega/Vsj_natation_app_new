import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
  Modal,
  Image,
} from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import Navbar from "../components/navbar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

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

const CalendarScreen = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(
    new Date().getDate().toString()
  );
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(null);

  const getDaysInMonth = (month: number, year: number) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const firstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    let daysArray: string[][] = [];
    let week: string[] = new Array(firstDay).fill("");

    for (let day = 1; day <= daysInMonth; day++) {
      week.push(day.toString());
      if (week.length === 7 || day === daysInMonth) {
        while (week.length < 7) week.push("");
        daysArray.push(week);
        week = [];
      }
    }
    return daysArray;
  };

  const fetchUserTrainings = async (month: string) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token || !API_URL) return;

      const userResponse = await fetch(`${API_URL}/api/swimmer/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!userResponse.ok) {
        Alert.alert("Erreur", "Erreur lors de la récupération des données utilisateur.");
        return;
      }

      const userData = await userResponse.json();
      const groupId = userData.groupId;

      if (!groupId) {
        Alert.alert("Erreur", "Aucun groupe associé.");
        return;
      }

      const trainingResponse = await fetch(
        `${API_URL}/api/group/${groupId}/trainings?month=${month}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      if (trainingResponse.ok) {
        const trainingData = await trainingResponse.json();
        setTrainings(trainingData.trainings || []);
      }
    } catch (error) {
      console.error("Erreur fetch:", error);
      Alert.alert("Erreur", "Problème de chargement des entraînements.");
    }
  };

  const handleMonthChange = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
    setSelectedDate(null);
    const month = newDate.toISOString().slice(0, 7);
    fetchUserTrainings(month);
  };

  useEffect(() => {
    const initialMonth = currentDate.toISOString().slice(0, 7);
    fetchUserTrainings(initialMonth);
  }, []);

  const today = new Date().getDate();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const getTrainingsForSelectedDate = () => {
    const dateToFilter = selectedDate || today.toString();
    return trainings.filter((training) => {
      const trainingDate = new Date(training.date);
      return (
        trainingDate.getDate() === Number(dateToFilter) &&
        trainingDate.getMonth() === currentMonth &&
        trainingDate.getFullYear() === currentYear
      );
    });
  };

  const selectedTrainings = getTrainingsForSelectedDate();

  const openTrainingModal = (training: Training) => {
    setSelectedTraining(training);
    setModalVisible(true);
  };

  const closeTrainingModal = () => {
    setModalVisible(false);
    setSelectedTraining(null);
  };

  return (
    <LinearGradient colors={["#1E3A8A", "#3B82F6"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View entering={FadeInDown.duration(600)}>
          <View style={styles.headerContainer}>
            <Text style={styles.header}>
              {currentDate.toLocaleString("fr-FR", { month: "long" })}{" "}
              {currentYear}
            </Text>
            <View style={styles.calendarNav}>
              <TouchableOpacity
                style={styles.navButton}
                onPress={() => handleMonthChange(-1)}
              >
                <LinearGradient
                  colors={["#60A5FA", "#3B82F6"]}
                  style={styles.navGradient}
                >
                  <AntDesign name="caretleft" size={24} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.navButton}
                onPress={() => handleMonthChange(1)}
              >
                <LinearGradient
                  colors={["#60A5FA", "#3B82F6"]}
                  style={styles.navGradient}
                >
                  <AntDesign name="caretright" size={24} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.calendarGrid}>
            <View style={styles.weekRow}>
              {["L", "M", "M", "J", "V", "S", "D"].map((day, index) => (
                <Text key={index} style={styles.dayLabel}>
                  {day}
                </Text>
              ))}
            </View>
            {getDaysInMonth(currentMonth, currentYear).map((week, weekIndex) => (
              <View key={weekIndex} style={styles.weekRow}>
                {week.map((day, dayIndex) => {
                  const isTrainingDay = trainings.some((training) => {
                    const trainingDate = new Date(training.date);
                    return (
                      trainingDate.getDate() === Number(day) &&
                      trainingDate.getMonth() === currentMonth &&
                      trainingDate.getFullYear() === currentYear
                    );
                  });

                  return (
                    <TouchableOpacity
                      key={dayIndex}
                      style={[
                        styles.dayCell,
                        selectedDate === day && styles.selectedDay,
                        Number(day) === today &&
                          currentMonth === new Date().getMonth() &&
                          currentYear === new Date().getFullYear() &&
                          styles.currentDay,
                        isTrainingDay && styles.trainingDay,
                      ]}
                      onPress={() => day && setSelectedDate(day)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.dayText,
                          selectedDate === day && styles.selectedDayText,
                          isTrainingDay && styles.trainingDayText,
                        ]}
                      >
                        {day}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>

          <View style={styles.eventsContainer}>
            <Text style={styles.eventsHeader}>
              Entraînements du{" "}
              {selectedDate || today}{" "}
              {currentDate.toLocaleString("fr-FR", { month: "long" })}
            </Text>
            {selectedTrainings.length > 0 ? (
              selectedTrainings.map((event, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => openTrainingModal(event)}
                  activeOpacity={0.8}
                >
                  <Animated.View
                    entering={FadeInDown.duration(400).delay(index * 100)}
                    style={styles.trainingEvent}
                  >
                    <Text style={styles.eventDate}>
                      {new Date(event.date).toLocaleDateString("fr-FR")}
                    </Text>
                    <Text style={styles.eventTitle}>{event.title}</Text>
                    <Text style={styles.eventTime}>
                      {new Date(event.date).toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      - {event.duration}
                    </Text>
                  </Animated.View>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noEventsText}>
                Aucun entraînement prévu ce jour.
              </Text>
            )}
          </View>
        </Animated.View>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeTrainingModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={closeTrainingModal}
            >
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>

            {selectedTraining && (
              <>
                <Text style={styles.modalTitle}>{selectedTraining.title}</Text>
                <Text style={styles.modalDate}>
                  {new Date(selectedTraining.date).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "long",
                  })}
                </Text>

                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Horaires</Text>
                  <Text style={styles.modalValue}>
                    {new Date(selectedTraining.date).toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    -{" "}
                    {new Date(
                      new Date(selectedTraining.date).getTime() +
                        parseInt(selectedTraining.duration) * 60 * 1000
                    ).toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                  <View style={styles.durationBadge}>
                    <Text style={styles.durationText}>{selectedTraining.duration}</Text>
                  </View>
                </View>

                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Intensité</Text>
                  <Text style={styles.modalValue}>{selectedTraining.intensity}</Text>
                  <View style={styles.intensityIcon}>
                    <Ionicons name="bar-chart-outline" size={20} color="#3B82F6" />
                  </View>
                </View>

                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Groupe</Text>
                  <Text style={styles.modalValue}>{selectedTraining.category}</Text>
                  <Image
                    source={{ uri: "https://randomuser.me/api/portraits/women/44.jpg" }}
                    style={styles.groupAvatar}
                  />
                </View>

                <View style={styles.descriptionContainer}>
                  <Text style={styles.modalLabel}>Description</Text>
                  <View style={styles.descriptionBubble}>
                    <Text style={styles.descriptionText}>Entrainement :</Text>
                    <Text style={styles.descriptionText}>
                      {selectedTraining.description || "Aucune description disponible."}
                    </Text>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

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
  headerContainer: {
    marginBottom: 32,
    alignItems: "center",
  },
  header: {
    fontSize: 36,
    fontWeight: "800",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 6,
  },
  calendarNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 40,
    marginTop: 16,
  },
  navButton: {
    borderRadius: 24,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  navGradient: {
    padding: 12,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  calendarGrid: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    elevation: 2,
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  dayLabel: {
    fontWeight: "700",
    textAlign: "center",
    flex: 1,
    fontSize: 18,
    color: "#E0F2FE",
    opacity: 0.9,
  },
  dayCell: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  selectedDay: {
    backgroundColor: "#60A5FA",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  selectedDayText: {
    color: "#fff",
    fontWeight: "700",
  },
  currentDay: {
    borderColor: "#FBBF24",
    borderWidth: 2,
  },
  trainingDay: {
    backgroundColor: "#FBBF24",
  },
  trainingDayText: {
    color: "#1E3A8A",
    fontWeight: "700",
  },
  dayText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
  },
  eventsContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  eventsHeader: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 20,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  trainingEvent: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  eventDate: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E3A8A",
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E3A8A",
    marginVertical: 6,
  },
  eventTime: {
    fontSize: 16,
    color: "#3B82F6",
    fontStyle: "italic",
    fontWeight: "500",
  },
  noEventsText: {
    fontSize: 18,
    color: "#E0F2FE",
    textAlign: "center",
    fontWeight: "500",
    opacity: 0.8,
    padding: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalCloseButton: {
    alignSelf: "flex-start",
    padding: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
    textAlign: "center",
    marginBottom: 8,
  },
  modalDate: {
    fontSize: 16,
    color: "#000",
    textAlign: "center",
    marginBottom: 20,
  },
  modalRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    flex: 1,
  },
  modalValue: {
    fontSize: 16,
    color: "#000",
    flex: 2,
  },
  durationBadge: {
    backgroundColor: "#E0F2FE",
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  durationText: {
    fontSize: 14,
    color: "#3B82F6",
    fontWeight: "500",
  },
  intensityIcon: {
    marginLeft: 10,
  },
  groupAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 10,
  },
  descriptionContainer: {
    marginTop: 10,
  },
  descriptionBubble: {
    backgroundColor: "#F0F4F8",
    borderRadius: 10,
    padding: 10,
    marginTop: 5,
  },
  descriptionText: {
    fontSize: 14,
    color: "#000",
    lineHeight: 20,
  },
});

export default CalendarScreen;