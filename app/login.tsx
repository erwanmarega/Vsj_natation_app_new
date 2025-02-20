import React from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const Navbar = () => {
  const router = useRouter();

  return (
    <View style={styles.navbar}>
      <TouchableOpacity onPress={() => router.push("/")}> 
        <Ionicons name="grid-outline" size={24} color="gray" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/")}> 
        <Ionicons name="calendar-outline" size={24} color="gray" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/message")}> 
        <Ionicons name="chatbubble-outline" size={24} color="green" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/")}> 
        <Ionicons name="cube-outline" size={24} color="gray" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/")}> 
        <Image
          source={{ uri: "https://randomuser.me/api/portraits/men/45.jpg" }}
          style={styles.navAvatar}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 16,
    marginTop: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  navAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
});

export default Navbar;
