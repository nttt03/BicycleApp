import { Image, View, FlatList, StyleSheet } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { useEffect, useState } from "react";
import firestore from "@react-native-firebase/firestore";

const ListBike = ({ navigation }) => {
  const [services, setServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

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

  // Danh sách tiện ích (giả lập)
  const utilities = [
    { id: "1", name: "Thuê xe", icon: "bicycle" },
    { id: "2", name: "Trạm xe", icon: "map-marker" },
    { id: "3", name: "Hỗ trợ", icon: "help-circle" },
    { id: "4", name: "Khác", icon: "dots-horizontal" },
  ];

  // Render mục tiện ích
  const renderUtilityItem = ({ item }) => (
    <View style={styles.utilityItem}>
      <Text style={styles.utilityIcon}>{item.icon}</Text>
      <Text style={styles.utilityName}>{item.name}</Text>
    </View>
  );

  // Render mục xe đạp
  const renderServiceItem = ({ item }) => (
    <View style={styles.serviceItem}>
      <View style={styles.serviceInfo}>
        <Text style={styles.serviceName}>{item.name || "Tên xe không xác định"}</Text>
        <Text style={styles.serviceType}>{item.type || "Loại xe không xác định"}</Text>
        <Text style={styles.serviceStatus}>{item.status || "Chưa có trạng thái"}</Text>
        <Text style={styles.servicePrice}>
          {item.price ? `${item.price.toLocaleString("vi-VN")} VNĐ` : "Giá không xác định"}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Thông tin người dùng */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Xin chào..</Text>
        <Text style={styles.username}>Mgft one nghI</Text>
      </View>

      {/* Thanh tìm kiếm */}
      <TextInput
        label="Tìm kiếm"
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchInput}
        mode="outlined"
        theme={{ colors: { primary: "#4CAF50" } }}
        right={<TextInput.Icon icon="magnify" />}
      />
      <Button
        mode="contained"
        onPress={() => {}}
        style={styles.searchButton}
        labelStyle={styles.buttonLabel}
      >
        Tìm kiếm
      </Button>

      {/* Phần tiện ích */}
      <Text style={styles.sectionTitle}>Tiện ích</Text>
      <FlatList
        data={utilities}
        renderItem={renderUtilityItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.utilityList}
      />

      {/* Danh sách xe đạp */}
      <Text style={styles.sectionTitle}>Danh sách xe đạp</Text>
      <FlatList
        data={services}
        renderItem={renderServiceItem}
        keyExtractor={(item) => item.id}
        style={styles.serviceList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#E8F5E9",
  },
  header: {
    marginBottom: 20,
  },
  greeting: {
    fontSize: 16,
    color: "#757575",
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  searchInput: {
    backgroundColor: "#FFF",
    marginBottom: 10,
  },
  searchButton: {
    backgroundColor: "#4CAF50",
    marginBottom: 20,
  },
  buttonLabel: {
    fontSize: 16,
    paddingVertical: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 10,
  },
  utilityList: {
    marginBottom: 20,
  },
  utilityItem: {
    alignItems: "center",
    marginRight: 20,
  },
  utilityIcon: {
    fontSize: 30,
    color: "#4CAF50",
  },
  utilityName: {
    fontSize: 14,
    color: "#4CAF50",
    marginTop: 5,
  },
  serviceList: {
    flex: 1,
  },
  serviceItem: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    elevation: 2,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  serviceType: {
    fontSize: 14,
    color: "#757575",
  },
  serviceStatus: {
    fontSize: 14,
    color: "#D32F2F",
  },
  servicePrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4CAF50",
    marginTop: 5,
  },
});

export default ListBike;