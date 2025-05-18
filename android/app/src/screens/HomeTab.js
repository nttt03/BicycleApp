import { Image, View, FlatList, StyleSheet } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { useEffect, useState } from "react";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

const HomeTab = ({ navigation }) => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [userName, setUserName] = useState("Người dùng");

  // Lấy thông tin người dùng
  useEffect(() => {
    const user = auth().currentUser;
    if (user) {
      const email = user.email;
      const unsubscribeUser = firestore()
        .collection("USERS")
        .doc(email)
        .onSnapshot((doc) => {
          if (doc.exists) {
            const userData = doc.data();
            setUserName(userData.fullName || "Người dùng");
          }
        }, (error) => {
          console.log("Lỗi lấy thông tin người dùng:", error.message);
        });

      return () => unsubscribeUser();
    }
  }, []);

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
        setFilteredServices(serviceList); // Ban đầu hiển thị toàn bộ danh sách
      }, (error) => {
        console.log("Lỗi lấy dịch vụ:", error.message);
      });

    return () => unsubscribe();
  }, []);

  // Lọc dữ liệu dựa trên tìm kiếm
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredServices(services);
    } else {
      const filtered = services.filter((item) =>
        item.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredServices(filtered);
    }
  }, [searchQuery, services]);

  // Danh sách tiện ích
  const utilities = [
    { id: "1", name: "Chuyến đi của tôi", icon: require("../assets/icons/img_bike.png") },
    { id: "2", name: "Hướng dẫn", icon: require("../assets/icons/img_book.png") },
    { id: "3", name: "Giới thiệu", icon: require("../assets/icons/img_introduce.png") },
    { id: "4", name: "Bảng giá", icon: require("../assets/icons/img_price.png") },
  ];

  // Render mục tiện ích
  const renderUtilityItem = ({ item }) => (
    <View style={styles.utilityItem}>
      <Image source={item.icon} style={styles.utilityIcon} />
      <Text style={styles.utilityName}>{item.name}</Text>
    </View>
  );

  // Render mục xe đạp
  const renderServiceItem = ({ item }) => (
    <View style={styles.serviceItem}>
      <Image source={require("../assets/icons/img_bike.png")} style={styles.serviceImage} />
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
        <Text style={styles.username}>{userName}</Text>
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
        contentContainerStyle={styles.utilityContent}
      />

      {/* Danh sách xe đạp */}
      <Text style={styles.sectionTitle}>Danh sách xe đạp</Text>
      <FlatList
        data={filteredServices}
        renderItem={renderServiceItem}
        keyExtractor={(item) => item.id}
        style={styles.serviceList}
        contentContainerStyle={styles.serviceContent}
      />
    </View>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "white",
//   },
//   header: {
//     padding: 20,
//     backgroundColor: "#4CAF50",
//   },
//   greeting: {
//     fontSize: 16,
//     color: "#FFF",
//   },
//   username: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#FFF",
//   },
//   searchInput: {
//     backgroundColor: "#FFF",
//     marginBottom: 10,
//     marginHorizontal: 20,
//   },
//   searchButton: {
//     backgroundColor: "#4CAF50",
//     marginBottom: 20,
//     marginHorizontal: 20,
//   },
//   buttonLabel: {
//     fontSize: 16,
//     paddingVertical: 5,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#4CAF50",
//     marginBottom: 10,
//     marginHorizontal: 20,
//   },
//   utilityContent: {
//     paddingHorizontal: 20,
//   },
//   utilityItem: {
//     alignItems: "center",
//     marginRight: 20,
//   },
//   utilityList: {
//     flexGrow: 0,
//     marginBottom: 20,
//     backgroundColor: "#ccc",
//     paddingTop: 20,
//     paddingBottom: 20,
//     marginLeft: 20,
//     marginRight: 20
//   },
//   utilityIcon: {
//     width: 40,
//     height: 40,
//     resizeMode: "contain",
//   },
//   utilityName: {
//     fontSize: 14,
//     marginTop: 5,
//     textAlign: "center",
//   },
//   serviceList: {
//     flex: 1,
//     marginBottom: 20,
//   },
//   serviceContent: {
//     paddingHorizontal: 20,
//     paddingBottom: 20,
//   },
//   serviceItem: {
//     flexDirection: "row",
//     backgroundColor: "#FFF",
//     padding: 15,
//     borderRadius: 5,
//     marginBottom: 10,
//     elevation: 2,
//     alignItems: "center",
//   },
//   serviceImage: {
//     width: 60,
//     height: 60,
//     borderRadius: 5,
//     marginRight: 10,
//   },
//   serviceInfo: {
//     flex: 1,
//   },
//   serviceName: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#4CAF50",
//   },
//   serviceType: {
//     fontSize: 14,
//     color: "#757575",
//   },
//   serviceStatus: {
//     fontSize: 14,
//     color: "#D32F2F",
//   },
//   servicePrice: {
//     fontSize: 14,
//     fontWeight: "bold",
//     color: "#4CAF50",
//     marginTop: 5,
//   },
// });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    padding: 20,
    backgroundColor: "#4CAF50",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  greeting: {
    fontSize: 16,
    color: "#FFF",
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
    marginTop: 4,
  },
  searchInput: {
    backgroundColor: "#FFF",
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 10,
  },
  searchButton: {
    backgroundColor: "#4CAF50",
    marginTop: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    paddingVertical: 6,
  },
  buttonLabel: {
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 25,
    marginBottom: 10,
    marginHorizontal: 20,
  },
  utilityList: {
    marginBottom: 10,
  },
  utilityContent: {
    paddingHorizontal: 20,
  },
  utilityItem: {
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginRight: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    width: 90,
  },
  utilityIcon: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  utilityName: {
    fontSize: 13,
    marginTop: 8,
    textAlign: "center",
    color: "#333",
  },
  serviceList: {
    flex: 1,
  },
  serviceContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  serviceItem: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    alignItems: "center",
  },
  serviceImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
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
    marginTop: 2,
  },
  serviceStatus: {
    fontSize: 14,
    color: "#D32F2F",
    marginTop: 2,
  },
  servicePrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4CAF50",
    marginTop: 4,
  },
});

export default HomeTab;