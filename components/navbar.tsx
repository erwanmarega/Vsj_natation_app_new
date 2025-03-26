import React, { useState, useEffect } from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [pressedIcon, setPressedIcon] = useState<string | null>(null);

  const routes = {
    dashboard: "/dashboard",
    calendar: "/calendar",
    messages: "/MessageScreen",
    cube: "/qrcode",
    profil: "/profil",
  } as const;

  const isActive = (route: typeof routes[keyof typeof routes]) => pathname === route;

  return (
    <View style={styles.navbar}>
      <TouchableOpacity
        onPress={() => router.push(routes.dashboard)}
        onPressIn={() => setPressedIcon("dashboard")}
        onPressOut={() => setPressedIcon(null)}
        activeOpacity={0.7}
      >
        <Ionicons
          name="grid-outline"
          size={24}
          color={
            pressedIcon === "dashboard"
              ? "#60A5FA"
              : isActive(routes.dashboard)
              ? "#3B82F6"
              : "gray"
          }
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push(routes.calendar)}
        onPressIn={() => setPressedIcon("calendar")}
        onPressOut={() => setPressedIcon(null)}
        activeOpacity={0.7}
      >
        <Ionicons
          name="calendar-outline"
          size={24}
          color={
            pressedIcon === "calendar"
              ? "#60A5FA"
              : isActive(routes.calendar)
              ? "#3B82F6"
              : "gray"
          }
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push(routes.messages)}
        onPressIn={() => setPressedIcon("messages")}
        onPressOut={() => setPressedIcon(null)}
        activeOpacity={0.7}
      >
        <Ionicons
          name="chatbubble-outline"
          size={24}
          color={
            pressedIcon === "messages"
              ? "#60A5FA"
              : isActive(routes.messages)
              ? "#3B82F6"
              : "gray"
          }
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push(routes.cube)}
        onPressIn={() => setPressedIcon("cube")}
        onPressOut={() => setPressedIcon(null)}
        activeOpacity={0.7}
      >
        <Ionicons
          name="cube-outline"
          size={24}
          color={
            pressedIcon === "cube"
              ? "#60A5FA"
              : isActive(routes.cube)
              ? "#3B82F6"
              : "gray"
          }
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push(routes.profil)}
        onPressIn={() => setPressedIcon("profil")}
        onPressOut={() => setPressedIcon(null)}
        activeOpacity={0.7}
      >
        <Image
          source={require("../assets/images/Logo_3D.png")}
          style={[
            styles.navAvatar,
            {
              borderColor:
                pressedIcon === "profil"
                  ? "#60A5FA"
                  : isActive(routes.profil)
                  ? "#3B82F6"
                  : "transparent",
              borderWidth: 2,
            },
          ]}
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
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  navAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
});

export default Navbar;