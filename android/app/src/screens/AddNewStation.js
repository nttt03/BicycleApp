import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  StyleSheet,
} from "react-native";
import firestore from "@react-native-firebase/firestore";
import MapView, { Marker } from "react-native-maps";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/MaterialIcons";

const AddNewStation = ({ navigation }) => {
  const [stationName, setStationName] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState(10.762622);
  const [longitude, setLongitude] = useState(106.660172);
  const [totalBikes, setTotalBikes] = useState("");
  const [availableBikes, setAvailableBikes] = useState("");
  const [status, setStatus] = useState("Đang hoạt động");
  const [regionDelta, setRegionDelta] = useState(0.01);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalIcon, setModalIcon] = useState("");

  // Debounce
  const [debouncedLatLng, setDebouncedLatLng] = useState({ lat: null, lng: null });
  const debounceTimer = useRef(null);

  const handleMapPress = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setLatitude(latitude);
    setLongitude(longitude);

    // Debounce logic
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      setDebouncedLatLng({ lat: latitude, lng: longitude });
    }, 500);
  };

  // Gọi Nominatim khi tọa độ đã debounce xong
  useEffect(() => {
    const fetchAddress = async () => {
      const { lat, lng } = debouncedLatLng;
      if (lat && lng) {
        try {
          const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
          const response = await fetch(url, {
            headers: {
              "User-Agent": "ReactNativeApp/1.0",
              "Accept-Language": "vi",
            },
          });

          const data = await response.json();

          if (data && data.display_name) {
            setAddress(data.display_name);
          } else {
            setAddress("Không thể xác định địa chỉ");
          }
        } catch (error) {
          console.error("Lỗi lấy địa chỉ:", error);
          setAddress("Lỗi khi lấy địa chỉ");
        }
      }
    };

    fetchAddress();
  }, [debouncedLatLng]);

  const handleZoom = (zoomIn = true) => {
    setRegionDelta((prev) => (zoomIn ? prev / 1.5 : prev * 1.5));
  };

  const handleSave = async () => {
    if (
      !stationName ||
      !address ||
      !totalBikes ||
      !availableBikes ||
      isNaN(totalBikes) ||
      isNaN(availableBikes)
    ) {
      setModalIcon("❗");
      setModalMessage("Vui lòng điền đầy đủ và hợp lệ tất cả thông tin.");
      setModalVisible(true);
      return;
    }

    try {
      await firestore().collection("STATIONS").add({
        stationName,
        address,
        latitude,
        longitude,
        totalBikes: parseInt(totalBikes),
        availableBikes: parseInt(availableBikes),
        status,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      setModalIcon("✅");
      setModalMessage("Trạm đã được thêm thành công!");
      setModalVisible(true);

      setTimeout(() => {
        setModalVisible(false);
        navigation.goBack();
      }, 2000);
    } catch (error) {
      setModalIcon("⚠️");
      setModalMessage("Đã xảy ra lỗi khi lưu. Vui lòng thử lại.");
      setModalVisible(true);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f5f5f5", padding: 16 }}>
      <Text style={styles.label}>Tên trạm</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập tên trạm"
        value={stationName}
        onChangeText={setStationName}
      />

      <Text style={styles.label}>Chọn vị trí trên bản đồ</Text>
      <View style={{ position: "relative", marginBottom: 8 }}>
        <MapView
          style={styles.map}
          region={{
            latitude,
            longitude,
            latitudeDelta: regionDelta,
            longitudeDelta: regionDelta,
          }}
          onPress={handleMapPress}
        >
          <Marker coordinate={{ latitude, longitude }} />
        </MapView>

        <View style={styles.zoomControls}>
          <TouchableOpacity onPress={() => handleZoom(true)} style={styles.zoomButton}>
            <Icon name="zoom-in" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleZoom(false)} style={styles.zoomButton}>
            <Icon name="zoom-out" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.label}>Địa chỉ</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập địa chỉ chính xác"
        value={address}
        onChangeText={setAddress}
      />

      <Text style={styles.label}>Tổng số xe</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Nhập tổng số xe"
        value={totalBikes}
        onChangeText={setTotalBikes}
      />

      <Text style={styles.label}>Số xe có sẵn</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Nhập số xe có sẵn"
        value={availableBikes}
        onChangeText={setAvailableBikes}
      />

      <Text style={styles.label}>Trạng thái</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={status} onValueChange={(value) => setStatus(value)}>
          <Picker.Item label="Đang hoạt động" value="Đang hoạt động" />
          <Picker.Item label="Đóng cửa" value="Đóng cửa" />
          <Picker.Item label="Đang bảo trì" value="Đang bảo trì" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Lưu trạm</Text>
      </TouchableOpacity>

      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={{ fontSize: 36, marginBottom: 10 }}>{modalIcon}</Text>
            <Text style={{ fontSize: 16, textAlign: "center" }}>{modalMessage}</Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default AddNewStation;

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 12,
    color: "#4E342E",
  },
  input: {
    borderWidth: 1,
    borderColor: "#BDBDBD",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
    marginTop: 4,
  },
  map: {
    height: 180,
    borderRadius: 10,
  },
  note: {
    fontSize: 13,
    color: "#F57C00",
    marginTop: 4,
    fontStyle: "italic",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#BDBDBD",
    borderRadius: 8,
    backgroundColor: "#fff",
    marginTop: 4,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: "#388E3C",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "#00000099",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    minWidth: "70%",
    alignItems: "center",
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: "#388E3C",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  zoomControls: {
    position: "absolute",
    bottom: 10,
    right: 10,
    flexDirection: "column",
  },
  zoomButton: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 25,
    marginVertical: 4,
    elevation: 3,
    alignItems: "center",
    justifyContent: "center",
  },
});
