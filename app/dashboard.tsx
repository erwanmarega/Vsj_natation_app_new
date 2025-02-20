import React, { useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import Navbar from "../components/navbar";

const DashboardScreen = () => {
  const [selectedDay, setSelectedDay] = useState(18);

  const days = [
    { day: "M", date: 17 },
    { day: "T", date: 18 },
    { day: "W", date: 19 },
    { day: "T", date: 20 },
    { day: "F", date: 21 },
    { day: "S", date: 22 },
    { day: "S", date: 23 },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bonjour <Text style={styles.username}>Utilisateur</Text></Text>
        <Image source={{ uri: "https://img.icons8.com/color/96/dolphin.png" }} style={styles.icon} />
      </View>

      <View style={styles.calendar}>
        <Text style={styles.subtitle}>Août - Semaine du 20</Text>
        <View style={styles.daysRow}>
          {days.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedDay(item.date)}
              style={[styles.dayButton, selectedDay === item.date && styles.selectedDay]}
            >
              <Text style={styles.dayText}>{item.date}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Température bassin n°1</Text>
          <View style={styles.temperatureCircle}>
            <Text style={styles.temperatureText}>28°</Text>
          </View>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Présence</Text>
          <View style={styles.presenceGrid}>
            {[...Array(12)].map((_, i) => (
              <View key={i} style={styles.presenceDot} />
            ))}
          </View>
        </View>
      </View>

      <ScrollView style={styles.messagesContainer}>
        {[1, 2, 3].map((_, index) => (
          <View key={index} style={styles.messageCard}>
            <Image source={{ uri: "https://randomuser.me/api/portraits/men/45.jpg" }} style={styles.avatar} />
            <View style={styles.messageTextContainer}>
              <Text style={styles.messageTitle}>Christophe Lemée</Text>
              <Text style={styles.messageText}>Salut, j'ai lancé une startup à 10M et je vous méprise profondément.</Text>
            </View>
            <Text style={styles.messageTime}>18:20</Text>
          </View>
        ))}
      </ScrollView>

      <Navbar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f4f4", padding: 16 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 16 },
  title: { fontSize: 24, fontWeight: "bold" },
  username: { color: "gray" },
  icon: { width: 32, height: 32 },
  calendar: { backgroundColor: "white", padding: 16, borderRadius: 16, marginTop: 16 },
  subtitle: { color: "gray", fontSize: 16 },
  daysRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  dayButton: { padding: 10, borderRadius: 8, borderWidth: 1, borderColor: "gray" },
  selectedDay: { borderColor: "blue" },
  dayText: { textAlign: "center", fontWeight: "bold" },
  row: { flexDirection: "row", marginTop: 16, justifyContent: "space-between" },
  card: { flex: 1, backgroundColor: "white", padding: 16, borderRadius: 16, marginRight: 8 },
  cardTitle: { fontWeight: "bold" },
  temperatureCircle: { width: 96, height: 96, backgroundColor: "#90cdf4", borderRadius: 48, justifyContent: "center", alignItems: "center", marginTop: 8 },
  temperatureText: { fontSize: 20, fontWeight: "bold" },
  presenceGrid: { flexDirection: "row", flexWrap: "wrap", marginTop: 8 },
  presenceDot: { width: 12, height: 12, backgroundColor: "#60a5fa", borderRadius: 6, margin: 4 },
  messagesContainer: { marginTop: 16 },
  messageCard: { flexDirection: "row", backgroundColor: "white", padding: 16, borderRadius: 16, marginBottom: 8, alignItems: "center" },
  avatar: { width: 48, height: 48, borderRadius: 24, marginRight: 8 },
  messageTextContainer: { flex: 1 },
  messageTitle: { fontWeight: "bold" },
  messageText: { color: "gray" },
  messageTime: { color: "gray" },
});

export default DashboardScreen;
