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

const ProfilScreen = () => {
  const router = useRouter();
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    bio: "",
    license: {
      number: "",
      holder: "",
      birthDate: "",
      expiryDate: "",
    },
  });
  const [isEditingBio, setIsEditingBio] = useState(false);

  const fetchUserData = async () => {
    const token = await AsyncStorage.getItem("authToken");
    if (token && API_URL) {
      try {
        const response = await fetch(`${API_URL}/api/swimmer/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUserData({
            firstName: data.prenom || "",
            lastName: data.nom || "",
            phone: data.telephone || "",
            email: data.email || "",
            bio: data.bio || "",
            license: {
              number: data.license?.number || "",
              holder: `${data.prenom || ""} ${data.nom || ""}`.trim(),
              birthDate: data.dateNaissance || "",
              expiryDate: data.license?.expiryDate || "",
            },
          });
        }
      } catch (error) {
        console.error("Erreur:", error);
      }
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleSaveBio = async () => {
    const token = await AsyncStorage.getItem("authToken");
    if (token && API_URL) {
      try {
        const response = await fetch(`${API_URL}/api/swimmer/bio`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ bio: userData.bio }),
        });
        if (response.ok) {
          Alert.alert("Succès", "Bio mise à jour !");
          setIsEditingBio(false);
        } else {
          Alert.alert("Erreur", "Échec de la mise à jour.");
        }
      } catch (error) {
        console.error("Erreur bio:", error);
        Alert.alert("Erreur", "Une erreur s'est produite.");
      }
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("authToken");
    router.replace("/");
  };

  return (
    <LinearGradient colors={["#1E3A8A", "#3B82F6"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View entering={FadeInDown.duration(600)}>
          <View style={styles.header}>
            <Image
              source={require("../assets/images/Logo_3D.png")}
              style={styles.avatar}
            />
            <Text style={styles.name}>
              {userData.firstName || userData.lastName
                ? `${userData.firstName} ${userData.lastName}`
                : "Utilisateur"}
            </Text>
          </View>

          <View style={styles.bioContainer}>
            <View style={styles.bioHeader}>
              <Text style={styles.sectionTitle}>Bio</Text>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => (isEditingBio ? handleSaveBio() : setIsEditingBio(true))}
              >
                <LinearGradient
                  colors={["#60A5FA", "#3B82F6"]}
                  style={styles.editGradient}
                >
                  <Ionicons
                    name={isEditingBio ? "checkmark" : "pencil"}
                    size={20}
                    color="#fff"
                  />
                </LinearGradient>
              </TouchableOpacity>
            </View>
            {isEditingBio ? (
              <TextInput
                style={styles.bioInput}
                value={userData.bio}
                onChangeText={(text) => setUserData({ ...userData, bio: text })}
                placeholder="Ajoutez votre bio..."
                placeholderTextColor="#93C5FD"
                multiline
                maxLength={200}
              />
            ) : (
              <Text style={styles.bioText}>
                {userData.bio || "Aucune bio pour le moment"}
              </Text>
            )}
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.sectionTitle}>Informations</Text>
            <InfoRow label="Prénom" value={userData.firstName} />
            <InfoRow label="Nom" value={userData.lastName} />
            <InfoRow label="Email" value={userData.email} />
            <InfoRow label="Téléphone" value={userData.phone} />
          </View>

          <View style={styles.licenseContainer}>
            <Text style={styles.sectionTitle}>Licence Natation</Text>
            <LinearGradient
              colors={["#60A5FA", "#3B82F6"]}
              style={styles.licenseCard}
            >
              <Text style={styles.licenseText}>Licence FFN</Text>
              <Text style={styles.licenseDetails}>Titulaire: {userData.license.holder}</Text>
              <Text style={styles.licenseDetails}>N°: {userData.license.number}</Text>
              <Text style={styles.licenseDetails}>Né(e): {userData.license.birthDate}</Text>
              <Text style={styles.licenseDetails}>Expire: {userData.license.expiryDate}</Text>
            </LinearGradient>
          </View>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#EF4444", "#DC2626"]}
              style={styles.logoutGradient}
            >
              <Ionicons name="log-out-outline" size={24} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.logoutText}>Déconnexion</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
      <Navbar />
    </LinearGradient>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.infoRow}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.infoValue}>{value || "Non renseigné"}</Text>
  </View>
);

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
    alignItems: "center",
    marginBottom: 32,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 50,
    marginRight: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  name: {
    fontSize: 32,
    fontWeight: "800",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 6,
  },
  bioContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  bioHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  editButton: {
    borderRadius: 24,
    overflow: "hidden",
  },
  editGradient: {
    padding: 10,
    borderRadius: 24,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  bioInput: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: "#1E3A8A",
    minHeight: 120,
    maxHeight: 200,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  bioText: {
    fontSize: 16,
    color: "#E0F2FE",
    fontWeight: "500",
    opacity: 0.9,
    lineHeight: 24,
  },
  infoContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
  },
  label: {
    fontSize: 18,
    color: "#E0F2FE",
    fontWeight: "600",
  },
  infoValue: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "500",
    opacity: 0.9,
  },
  licenseContainer: {
    marginBottom: 24,
  },
  licenseCard: {
    borderRadius: 20,
    padding: 20,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  licenseText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 16,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  licenseDetails: {
    fontSize: 16,
    color: "#E0F2FE",
    marginBottom: 10,
    fontWeight: "500",
  },
  logoutButton: {
    borderRadius: 16,
    overflow: "hidden",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  logoutGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    paddingHorizontal: 36,
  },
  logoutText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 10,
  },
  buttonIcon: {
    marginRight: 10,
  },
});

export default ProfilScreen;