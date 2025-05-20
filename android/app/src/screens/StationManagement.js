import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Pressable,
  TextInput,
  RefreshControl,
} from "react-native";
import { Text, IconButton } from "react-native-paper";
import firestore from "@react-native-firebase/firestore";

const StationManagement = ({ navigation }) => {
  const [stations, setStations] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const fetchStations = async () => {
    try {
      const snapshot = await firestore().collection("STATIONS").get();
      const stationList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Station List:", stationList);
      setStations(stationList);
    } catch (error) {
      console.log("Lỗi lấy trạm:", error.message);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStations();
    setRefreshing(false);
  };

  const filteredStations = stations.filter((item) => {
    const text = searchText.toLowerCase();
    return (
      item.stationName?.toLowerCase().includes(text) ||
      item.address?.toLowerCase().includes(text)
    );
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Đang hoạt động":
        return "#2E7D32"; 
      case "Đang bảo trì":
        return "#FBC02D"; 
      case "Đóng cửa":
        return "#D32F2F"; 
      default:
        return "#333";
    }
  };

  const renderStationItem = ({ item }) => {
    return (
      <Pressable
        style={({ pressed }) => [
          styles.stationItem,
          { backgroundColor: pressed ? "#E8F5E9" : "#F1F8E9" },
        ]}
        onPress={() => navigation.navigate("StationDetail", { station: item })}
      >
        <View style={styles.rowHeader}>
          <IconButton icon="bike" size={24} iconColor="#2E7D32" />
          <Text style={styles.stationName}>{item.stationName}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>📍 Địa chỉ:</Text>
          <Text style={styles.value}>{item.address}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>🚲 Xe trong trạm:</Text>
          <Text style={styles.value}>{item.totalBikes}</Text>
          <Text style={styles.label}> | Có sẵn:</Text>
          <Text style={styles.value}>{item.availableBikes}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>⚙️ Trạng thái:</Text>
          <Text style={[styles.value, { color: getStatusColor(item.status) }]}>
            {item.status}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm theo tên hoặc địa chỉ"
          value={searchText}
          onChangeText={setSearchText}
        />
        <IconButton
          icon="refresh"
          iconColor="#4CAF50"
          size={28}
          onPress={onRefresh}
        />
        <IconButton
          icon="plus-circle"
          iconColor="#388E3C"
          size={32}
          onPress={() => navigation.navigate("AddNewStation")}
        />
      </View>

      {filteredStations.length === 0 ? (
        <View style={{ padding: 20, alignItems: "center" }}>
          <Text style={{ fontSize: 16, color: "#888" }}>
            Không có trạm nào để hiển thị.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredStations}
          renderItem={renderStationItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingHorizontal: 15,
            paddingBottom: 90,
            paddingTop: 5,
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
};

export default StationManagement;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 20,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: "#C5E1A5",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: "#F1F8E9",
    marginRight: 10,
  },
  stationItem: {
    padding: 15,
    marginVertical: 6,
    backgroundColor: "#F1F8E9",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#AED581",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  rowHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  stationName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2E7D32",
    marginLeft: 6,
  },
  infoRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 4,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#555",
  },
  value: {
    fontSize: 15,
    color: "#333",
    marginLeft: 4,
  },
});
