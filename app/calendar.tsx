import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Navbar from "../components/navbar";

const CalendarScreen = () => {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    setCurrentDate(new Date());
  }, []);

  const getDaysInMonth = (month: number, year: number) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let daysArray: string[][] = [];
    let week: string[] = new Array(firstDay).fill("");
    
    for (let day = 1; day <= daysInMonth; day++) {
      week.push(day.toString());
      if (week.length === 7) {
        daysArray.push(week);
        week = [];
      }
    }
    if (week.length) daysArray.push(week);
    return daysArray;
  };

  const handleMonthChange = (direction: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1);
    setCurrentDate(newDate);
  };

  const today = new Date().getDate().toString();
  const isCurrentMonth = new Date().getMonth() === currentDate.getMonth() && new Date().getFullYear() === currentDate.getFullYear();

  const events = [
    { date: "03/02/25", title: "Entrainement", details: "Crawl technique 10x200m\nRetour au calme 2000m", time: "18:20", coach: "Coach SO", color: "#3b82f6" },
    { date: "05/02/25", title: "Entrainement", details: "Crawl technique 10x200m\nRetour au calme 2000m", time: "18:20", coach: "Coach SO", color: "#3b82f6" },
    { date: "09/02/25", title: "Compétition", details: "14 avenue des lilas, Meaux", time: "13:30", color: "#facc15" },
    { date: "11/02/25", title: "Entrainement", details: "Crawl technique 10x200m\nRetour au calme 2000m", time: "18:20", coach: "Coach SO", color: "#3b82f6" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{currentDate.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}</Text>
      <View style={styles.calendarNav}>
        <TouchableOpacity style={styles.navButton} onPress={() => handleMonthChange(-1)}>
          <Ionicons name="chevron-back" size={24} color="#3b82f6" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => handleMonthChange(1)}>
          <Ionicons name="chevron-forward" size={24} color="#3b82f6" />
        </TouchableOpacity>
      </View>
      <View style={styles.calendarGrid}>
        <View style={styles.weekRow}>
          {["Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam.", "Dim."].map((day, index) => (
            <Text key={index} style={styles.dayLabel}>{day}</Text>
          ))}
        </View>
        {getDaysInMonth(currentDate.getMonth(), currentDate.getFullYear()).map((week, index) => (
          <View key={index} style={styles.weekRow}>
            {week.map((day, idx) => (
              <TouchableOpacity
                key={idx}
                style={[styles.dayCell, selectedDate === day && styles.selectedDay, isCurrentMonth && day === today && styles.currentDay]}
                onPress={() => setSelectedDate(day)}
              >
                <Text style={styles.dayText}>{day}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
      <ScrollView style={styles.eventList}>
        {events.map((event, index) => (
          <View key={index} style={[styles.eventCard, { borderColor: event.color }]}> 
            <Text style={styles.eventDate}>{event.date}</Text>
            <Text style={[styles.eventTitle, { color: event.color }]}>{event.title}</Text>
            <Text style={styles.eventDetails}>{event.details}</Text>
            <View style={styles.eventFooter}>
              <Text style={styles.eventTime}>{event.time}</Text>
              {event.coach && <Text style={styles.eventCoach}>{event.coach}</Text>}
            </View>
          </View>
        ))}
      </ScrollView>
      <Navbar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f4f4", padding: 16 },
  header: { fontSize: 28, fontWeight: "bold", textAlign: "center" },
  calendarNav: { flexDirection: "row", justifyContent: "space-between", marginVertical: 10 },
  navButton: { backgroundColor: "#e0e0e0", borderRadius: 20, padding: 10 },
  calendarGrid: { backgroundColor: "white", padding: 16, borderRadius: 16 },
  weekRow: { flexDirection: "row", justifyContent: "space-between", marginVertical: 4 },
  dayLabel: { fontWeight: "bold", textAlign: "center", flex: 1 },
  dayCell: { flex: 1, height: 40, justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "#ddd", borderRadius: 8 },
  selectedDay: { backgroundColor: "#3b82f6", borderColor: "#3b82f6" },
  currentDay: { borderColor: "#3b82f6", borderWidth: 2 },
  dayText: { fontSize: 16 },
  eventList: { marginTop: 10 },
  eventCard: { backgroundColor: "white", padding: 16, borderRadius: 16, borderWidth: 2, marginBottom: 10 },
  eventDate: { fontSize: 14, color: "gray" },
  eventTitle: { fontSize: 18, fontWeight: "bold" },
  eventDetails: { fontSize: 14, color: "gray", marginVertical: 5 },
  eventFooter: { flexDirection: "row", justifyContent: "space-between" },
  eventTime: { fontSize: 14, fontWeight: "bold" },
  eventCoach: { fontSize: 14, color: "gray" },
});

export default CalendarScreen;
