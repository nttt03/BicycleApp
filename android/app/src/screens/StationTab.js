import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Text } from "react-native-paper";
import firestore from "@react-native-firebase/firestore";

const StationTab = () => {
  const [stations, setStations] = useState([]);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const snapshot = await firestore()
          .collection("STATIONS")
          .where("status", "==", "Đang hoạt động")
          .get();
        const stationsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStations(stationsList);
      } catch (error) {
        console.log("Lỗi lấy dữ liệu trạm:", error.message);
      }
    };

    fetchStations();
  }, []);

  const renderStation = ({ item }) => (
    <View style={styles.stationItem}>
      <Text style={styles.stationName}>{item.stationName || "Chưa có tên"}</Text>
      <Text style={styles.stationDetail}>Địa chỉ: {item.address || "Chưa có địa chỉ"}</Text>
      <Text style={styles.stationDetail}>Trạng thái: {item.status || "Chưa xác định"}</Text>
      <Text style={styles.stationDetail}>
        Số xe khả dụng: {item.availableBikes || 0}/{item.totalBikes || 0}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.tabTitle}>Trạm xe</Text>
      {stations.length === 0 ? (
        <Text>Chưa có trạm xe nào đang hoạt động.</Text>
      ) : (
        <FlatList
          data={stations}
          renderItem={renderStation}
          keyExtractor={(item) => item.id}
          style={styles.stationList}
          contentContainerStyle={styles.stationContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#E8F5E9",
  },
  tabTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 20,
  },
  stationList: {
    flex: 1,
  },
  stationContent: {
    paddingBottom: 20,
  },
  stationItem: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  stationName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  stationDetail: {
    fontSize: 14,
    color: "#333",
    marginTop: 4,
  },
});

export default StationTab;