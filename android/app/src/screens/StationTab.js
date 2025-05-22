import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Modal,
  TouchableOpacity,
} from "react-native";
import { Text } from "react-native-paper";
import firestore from "@react-native-firebase/firestore";
import MapView, { Marker } from "react-native-maps";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const StationTab = () => {
  const [stations, setStations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [region, setRegion] = useState(null);

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
    const factor = zoomIn ? 0.5 : 2; // zoom in = giảm delta, zoom out = tăng delta
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

      {/* Modal hiển thị bản đồ */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={{ flex: 1 }}>
          {region && (
            <MapView style={{ flex: 1 }} region={region}>
              {selectedLocation && (
                <Marker coordinate={selectedLocation} title="Trạm xe" />
              )}
            </MapView>
          )}

          {/* Nút zoom in */}
          <TouchableOpacity
            style={[styles.zoomButton, { bottom: 100 }]}
            onPress={() => handleZoom(true)}
          >
            <Text style={styles.zoomText}>＋</Text>
          </TouchableOpacity>

          {/* Nút zoom out */}
          <TouchableOpacity
            style={[styles.zoomButton, { bottom: 50 }]}
            onPress={() => handleZoom(false)}
          >
            <Text style={styles.zoomText}>−</Text>
          </TouchableOpacity>

          {/* Nút đóng */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={{ color: "#FFF" }}>Đóng bản đồ</Text>
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
    backgroundColor: "#3399FF",
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
});

export default StationTab;
