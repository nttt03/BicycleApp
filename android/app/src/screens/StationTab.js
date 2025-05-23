import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Modal,
  TouchableOpacity,
  Image
} from "react-native";
import { Text } from "react-native-paper";
import firestore from "@react-native-firebase/firestore";
import MapView, { Marker } from "react-native-maps";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";

const StationTab = () => {
  const [stations, setStations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [region, setRegion] = useState(null);
  const [bikeList, setBikeList] = useState([]);
  const [bikeModalVisible, setBikeModalVisible] = useState(false);
  const [selectedStationName, setSelectedStationName] = useState("");
  const navigation = useNavigation();

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

  const fetchBikesForStation = async (stationId, stationName) => {
    try {
      const snapshot = await firestore()
        .collection("BIKES")
        .where("stationId", "==", stationId)
        .where("status", "==", "Có sẵn")
        .get();

      const bikes = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBikeList(bikes);
      setSelectedStationName(stationName);
      setBikeModalVisible(true);
    } catch (error) {
      console.error("Lỗi lấy dữ liệu xe đạp:", error.message);
    }
  };

  const openMap = (latitude, longitude) => {
    if (latitude && longitude) {
      const initialRegion = {
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setSelectedLocation({ latitude, longitude });
      setRegion(initialRegion);
      setModalVisible(true);
    } else {
      alert("Không tìm thấy tọa độ của trạm.");
    }
  };

  const handleZoom = (zoomIn = true) => {
    if (!region) return;
    const factor = zoomIn ? 0.5 : 2;
    setRegion({
      ...region,
      latitudeDelta: region.latitudeDelta * factor,
      longitudeDelta: region.longitudeDelta * factor,
    });
  };

  const renderStation = ({ item }) => (
    <View style={styles.stationItem}>
      <View style={styles.rowBetween}>
        <Text style={styles.stationName}>{item.stationName || "Chưa có tên"}</Text>
        <TouchableOpacity onPress={() => openMap(item.latitude, item.longitude)}>
          <Icon name="map-marker" size={24} color="#FF3333" />
        </TouchableOpacity>
      </View>
      <Text style={styles.stationDetail}>Địa chỉ: {item.address || "Chưa có địa chỉ"}</Text>
      <Text style={styles.stationDetail}>Trạng thái: {item.status || "Chưa xác định"}</Text>
      <TouchableOpacity
        onPress={() => fetchBikesForStation(item.id, item.stationName)}
      >
        <Text style={{ color: '#4CAF50', marginTop: 6 }}>Xem xe có sẵn</Text>
      </TouchableOpacity>
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

      {/* Modal bản đồ */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={{ flex: 1 }}>
          {region && (
            <MapView style={{ flex: 1 }} region={region}>
              {selectedLocation && (
                <Marker coordinate={selectedLocation} title="Trạm xe" />
              )}
            </MapView>
          )}
          <TouchableOpacity
            style={[styles.zoomButton, { bottom: 100 }]}
            onPress={() => handleZoom(true)}
          >
            <Text style={styles.zoomText}>＋</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.zoomButton, { bottom: 50 }]}
            onPress={() => handleZoom(false)}
          >
            <Text style={styles.zoomText}>−</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={{ color: "#FFF" }}>Đóng bản đồ</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Modal danh sách xe */}
      <Modal visible={bikeModalVisible} animationType="slide">
        <View style={{ flex: 1, padding: 20, backgroundColor: "#FFF" }}>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
            Xe tại trạm: {selectedStationName}
          </Text>

          {bikeList.length === 0 ? (
            <Text>Không có xe khả dụng.</Text>
          ) : (
            <FlatList
              data={bikeList}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setBikeModalVisible(false); // đóng modal trước
                    navigation.navigate("RentBike", { bike: item });
                  }}

                  style={{
                    marginBottom: 12,
                    padding: 10,
                    backgroundColor: "#F5F5F5",
                    borderRadius: 8,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image source={require("../assets/icons/img_bike.png")} style={styles.bikeImage} />
                    <View style={styles.bikeInfo}>
                      <Text style={styles.bikeName}>Tên xe: {item.name || "Không có tên"}</Text>
                      <Text>Loại: {item.type || "Không xác định"}</Text>
                      <Text>Giá thuê: {item.price ? `${item.price} VND` : "Không rõ"}</Text>
                      <Text style={styles.rentText}>Thuê xe</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          )}

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setBikeModalVisible(false)}
          >
            <Text style={{ color: "#FFF" }}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
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
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stationName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3399FF",
  },
  stationDetail: {
    fontSize: 14,
    color: "#333",
    marginTop: 4,
  },
  closeButton: {
    position: "absolute",
    bottom: 30,
    left: "35%",
    right: "35%",
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  zoomButton: {
    position: "absolute",
    right: 20,
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 25,
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  zoomText: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  bikeItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },

  bikeImage: {
    width: 60,
    height: 60,
    resizeMode: "contain",
    marginRight: 12,
  },

  bikeInfo: {
    flex: 1,
  },

  bikeName: {
    fontWeight: "bold",
    marginBottom: 4,
  },

  rentText: {
    color: "#4CAF50",
    marginTop: 4,
  }

});

export default StationTab;
