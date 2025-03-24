import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import Navbar from "../components/navbar";
import { AntDesign, Ionicons } from "@expo/vector-icons";
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

const DashboardScreen = () => {
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [userFirstName, setUserFirstName] = useState<string | null>("Erwan");
  const [days, setDays] = useState<
    { day: string; date: number; fullDate: Date; isTrainingDay: boolean }[]
  >([]);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(
    new Date().getDate().toString()
  );
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(
    null
  );

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
    const initialMonth = currentDate.toISOString().slice(0, 7);
    fetchUserTrainings(initialMonth);
  }, []);

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

      const userData = await userResponse.json();
      const groupId = userData.groupId;

      if (!groupId) return;

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
    }
  };

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

  const handleMonthChange = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
    setSelectedDate(null);
    const month = newDate.toISOString().slice(0, 7);
    fetchUserTrainings(month);
  };

  const handleDayPress = (day: number) => {
    setSelectedDay(day);
    setSelectedDate(day.toString());
    setCalendarVisible(true);
  };

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

  const presenceData = Array(35)
    .fill(null)
    .map((_, i) => ({
      value: Math.random() * 10,
      active: [4, 5, 6, 10, 11, 12, 20, 21, 22, 23].includes(i),
    }));

  return (
    <LinearGradient colors={["#1E3A8A", "#3B82F6"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View entering={FadeInDown.duration(600)}>
          <View style={styles.header}>
            <Text style={styles.title}>
              Bonjour{" "}
              <Text style={styles.username}>{userFirstName || "Utilisateur"}</Text>
            </Text>
            <Image
              source={require("../assets/images/Logo_3D.png")}
              style={styles.icon}
            />
          </View>

          <View style={styles.calendar}>
            <Text style={styles.subtitle}>
              {days.length > 0
                ? `${new Date().toLocaleString("fr-FR", {
                    month: "long",
                    year: "numeric",
                  })} - Semaine du ${days[0].date}`
                : "Chargement..."}
            </Text>
            <View style={styles.daysRow}>
              {days.map((item, index) => (
                <Animated.View
                  key={index}
                  entering={FadeInDown.duration(300).delay(index * 50)}
                >
                  <TouchableOpacity
                    onPress={() => handleDayPress(item.date)}
                    style={[
                      styles.dayButton,
                      selectedDay === item.date && styles.selectedDay,
                      item.date === new Date().getDate() && styles.highlightedDay,
                      item.isTrainingDay && styles.trainingDay,
                    ]}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        selectedDay === item.date && styles.selectedText,
                        item.isTrainingDay && styles.trainingText,
                      ]}
                    >
                      {item.day}
                    </Text>
                    <Text
                      style={[
                        styles.dateText,
                        selectedDay === item.date && styles.selectedText,
                        item.isTrainingDay && styles.trainingText,
                      ]}
                    >
                      {item.date}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          </View>

          <Modal
            animationType="slide"
            transparent={true}
            visible={calendarVisible}
            onRequestClose={() => setCalendarVisible(false)}
          >
            <View style={styles.fullCalendarContainer}>
              <ScrollView style={styles.fullCalendarContent}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setCalendarVisible(false)}
                >
                  <Ionicons name="close" size={24} color="#fff" />
                </TouchableOpacity>

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
                  {getDaysInMonth(currentMonth, currentYear).map(
                    (week, weekIndex) => (
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
                    )
                  )}
                </View>

                <View style={styles.eventsContainer}>
                  <Text style={styles.eventsHeader}>
                    Entraînements du {selectedDate || today}{" "}
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
              </ScrollView>
            </View>
          </Modal>

          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={closeTrainingModal}
          >
            <View style={styles.modalOverlay}>
              <ScrollView style={styles.modalContent}>
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={closeTrainingModal}
                >
                  <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>

                {selectedTraining && (
                  <>
                    <Text style={styles.modalTitle}>
                      {selectedTraining.title}
                    </Text>
                    <Text style={styles.modalDate}>
                      {new Date(selectedTraining.date).toLocaleDateString(
                        "fr-FR",
                        {
                          day: "2-digit",
                          month: "long",
                        }
                      )}
                    </Text>
                    <View style={styles.modalRow}>
                      <Text style={styles.modalLabel}>Horaires</Text>
                      <Text style={styles.modalValue}>
                        {new Date(selectedTraining.date).toLocaleTimeString(
                          "fr-FR",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}{" "}
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
                        <Text style={styles.durationText}>
                          {selectedTraining.duration}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.modalRow}>
                      <Text style={styles.modalLabel}>Intensité</Text>
                      <Text style={styles.modalValue}>
                        {selectedTraining.intensity}
                      </Text>
                      <View style={styles.intensityIcon}>
                        <Ionicons
                          name="bar-chart-outline"
                          size={20}
                          color="#3B82F6"
                        />
                      </View>
                    </View>
                    <View style={styles.modalRow}>
                      <Text style={styles.modalLabel}>Groupe</Text>
                      <Text style={styles.modalValue}>
                        {selectedTraining.category}
                      </Text>
                      <Image
                        source={{
                          uri: "https://randomuser.me/api/portraits/women/44.jpg",
                        }}
                        style={styles.groupAvatar}
                      />
                    </View>
                    <View style={styles.descriptionContainer}>
                      <Text style={styles.modalLabel}>Description</Text>
                      <View style={styles.descriptionBubble}>
                        <Text style={styles.descriptionText}>
                          Entrainement :
                        </Text>
                        <Text style={styles.descriptionText}>
                          {selectedTraining.description ||
                            "Aucune description disponible."}
                        </Text>
                      </View>
                    </View>
                  </>
                )}
              </ScrollView>
            </View>
          </Modal>

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
                  source={{
                    uri: "https://randomuser.me/api/portraits/men/45.jpg",
                  }}
                  style={styles.avatar}
                />
                <View style={styles.messageTextContainer}>
                  <Text style={styles.messageTitle}>Antoine Moulin</Text>
                  <Text style={styles.messageText}>
                    Salut, j'ai lancé une startup à 10M...
                  </Text>
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
  fullCalendarContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullCalendarContent: {
    backgroundColor: "#1E3A8A",
    borderRadius: 20,
    padding: 20,
    width: "95%",
    maxHeight: "90%",
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: 10,
  },
  headerContainer: {
    marginBottom: 32,
    alignItems: "center",
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
  selectedDayText: {
    color: "#fff",
    fontWeight: "700",
  },
  currentDay: {
    borderColor: "#FBBF24",
    borderWidth: 2,
  },
  trainingDayText: {
    color: "#1E3A8A",
    fontWeight: "700",
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
    backgroundColor: "rgba(224, 242, 254, 0.95)",
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