import React, { useEffect, useState } from "react";
import {
  Image,
  View,
  FlatList,
  StyleSheet,
  Pressable,
} from "react-native";
import { Text, IconButton } from "react-native-paper";
import firestore from "@react-native-firebase/firestore";

const BikeManagement = ({ navigation }) => {
  const [bikes, setBikes] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection("BIKES")
      .onSnapshot(
        (querySnapshot) => {
          const bikeList = [];
          querySnapshot.forEach((doc) => {
            bikeList.push({ id: doc.id, ...doc.data() });
          });
          setBikes(bikeList);
        },
        (error) => {
          console.log("Lỗi lấy dữ liệu xe:", error.message);
        }
      );

    return () => unsubscribe();
  }, []);

  const renderBikeItem = ({ item }) => {
    return (
      <Pressable
        style={({ pressed }) => [
          styles.bikeItem,
          {
            backgroundColor: pressed ? "#E8F5E9" : "#F1F8E9",
          },
        ]}
        onPress={() => navigation.navigate("BikeDetail", { bike: item })}
      >
        <Image
          source={require("../assets/icons/img_bike.png")}
          style={styles.bikeImage}
          resizeMode="contain"
        />
        <View style={styles.bikeInfo}>
          <Text style={styles.bikeName}>{item.name}</Text>
          <Text style={styles.bikeText}>Loại xe: {item.type}</Text>
          <Text style={styles.bikeText}>Giá: {formatPrice(item.price)} VNĐ/Giờ</Text>
          <Text style={styles.bikeText}>Tình trạng: {item.status}</Text>
        </View>
      </Pressable>
    );
  };

  const formatPrice = (price) => {
    if (!price && price !== 0) return "-";
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/img_velogo.png")}
        style={styles.logo}
      />
      <View style={styles.header}>
        <Text style={styles.title}>Danh sách xe đạp</Text>
        <IconButton
          icon="plus-circle"
          iconColor="#4CAF50"
          size={36}
          onPress={() => navigation.navigate("AddNewBike")}
        />
      </View>

      <FlatList
        data={bikes}
        renderItem={renderBikeItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 15, paddingBottom: 90 }}
      />
    </View>
  );
};

export default BikeManagement;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  logo: {
    alignSelf: "center",
    marginVertical: 40,
    width: 240,
    height: 80,
    borderRadius: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  bikeItem: {
    flexDirection: "row",
    padding: 15,
    marginVertical: 8,
    backgroundColor: "#F1F8E9",
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#C5E1A5", 
    shadowColor: "#000",   
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  bikeImage: {
    width: 90,
    height: 90,
    borderRadius: 5,
    marginRight: 15,
  },
  bikeInfo: {
    flex: 1,
    justifyContent: "center",
  },
  bikeName: {
    fontSize: 18, 
    fontWeight: "bold",
    color: "#388E3C",
    marginBottom: 4,
  },
  bikeText: {
    fontSize: 15, 
    color: "#4E4E4E",
    marginBottom: 2,
  },
});