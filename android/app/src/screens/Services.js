import { Image, View, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { IconButton, Text } from "react-native-paper";
import { useEffect, useState } from "react";
import firestore from "@react-native-firebase/firestore";

const Services = ({ navigation }) => {
  const [services, setServices] = useState([]);

  // Lấy dữ liệu từ Firestore
  useEffect(() => {
    const unsubscribe = firestore()
      .collection("SERVICES")
      .onSnapshot((querySnapshot) => {
        const serviceList = [];
        querySnapshot.forEach((doc) => {
          serviceList.push({ id: doc.id, ...doc.data() });
        });
        setServices(serviceList);
      }, (error) => {
        console.log("Lỗi lấy dịch vụ:", error.message);
      });

    return () => unsubscribe();
  }, []);

  // Render mỗi mục dịch vụ
  const renderServiceItem = ({ item }) => (
    <TouchableOpacity
      style={styles.serviceItem}
      onPress={() => navigation.navigate("ServiceDetail", { service: item })}
    >
      <Image
        source={require("../assets/service.png")}
      />
      <View style={styles.serviceInfo}>
        <Text style={styles.serviceName}>{item.name}</Text>
        <Text style={styles.servicePrice}>
          {item.price.toLocaleString("vi-VN")}đ
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <Image
        source={require("../assets/logo.png")}
        style={{
          alignSelf: "center",
          marginVertical: 50,
        }}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 15,
        }}
      >
        <Text style={{ fontSize: 30, fontWeight: "bold" }}>
          Danh sách dịch vụ
        </Text>
        <IconButton
          icon="plus-circle"
          iconColor="red"
          size={30}
          onPress={() => navigation.navigate("AddNewService")}
        />
      </View>
      {/* Hiển thị danh sách dịch vụ */}
      <FlatList
        style={{backgroundColor: "white"}}
        data={services}
        renderItem={renderServiceItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 15 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  serviceItem: {
    flexDirection: "row",
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    elevation: 2,
  },
  serviceImage: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: 10,
  },
  serviceInfo: {
    flex: 1,
    flexDirection: "row", // Đặt tên và giá nằm ngang
    alignItems: "center", 
    justifyContent: "space-between",
  },
  serviceName: {
    fontSize: 18,
    fontWeight: "bold",
    flexShrink: 1, // Đảm bảo tên không bị tràn
  },
  servicePrice: {
    fontSize: 16,
    color: "gray",
  },
});

export default Services;