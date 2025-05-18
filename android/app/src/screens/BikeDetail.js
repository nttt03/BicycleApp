import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import firestore from "@react-native-firebase/firestore";

const BikeDetail = ({ route, navigation }) => {
  const { bike } = route.params;

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalIcon, setModalIcon] = useState("✅");

  const handleDelete = () => {
    // Hiện modal xác nhận xóa (cách đơn giản: modal custom)
    setModalIcon("❓");
    setModalMessage("Bạn có chắc muốn xóa xe này không?");
    setModalVisible(true);
  };

  // Hàm xóa thật sự gọi firestore
  const confirmDelete = async () => {
    setModalVisible(false);
    try {
      await firestore().collection("BIKES").doc(bike.id).delete();
      setModalIcon("✅");
      setModalMessage("Đã xóa xe thành công!");
      setModalVisible(true);
      // Sau khi đóng modal thành công, quay lại trang trước
      // Chúng ta sẽ xử lý khi nhấn Đóng trong modal
    } catch (error) {
      setModalIcon("❌");
      setModalMessage("Xóa không thành công: " + error.message);
      setModalVisible(true);
    }
  };

  const formatPrice = (price) => {
    if (!price && price !== 0) return "-";
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Định dạng ngày giờ: dd/mm/yyyy HH:MM:ss
  const formatDate = (timestamp) => {
    if (!timestamp) return "-";
    let dateObj;
    // Firestore timestamp có thể là object hoặc số millis
    if (timestamp.toDate) {
      dateObj = timestamp.toDate();
    } else if (timestamp.seconds) {
      dateObj = new Date(timestamp.seconds * 1000);
    } else {
      dateObj = new Date(timestamp);
    }

    const pad = (n) => (n < 10 ? "0" + n : n);

    const d = pad(dateObj.getDate());
    const m = pad(dateObj.getMonth() + 1);
    const y = dateObj.getFullYear();

    const hh = pad(dateObj.getHours());
    const mm = pad(dateObj.getMinutes());
    const ss = pad(dateObj.getSeconds());

    return `${d}/${m}/${y} ${hh}:${mm}:${ss}`;
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <Image
          source={require("../assets/icons/img_bike.png")}
          style={styles.bikeImage}
          resizeMode="contain"
        />

        <View style={styles.infoContainer}>
          <Text style={styles.name}>{bike.name}</Text>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Loại xe:</Text>
            <Text style={styles.value}>{bike.type}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Giá thuê:</Text>
            <Text style={styles.value}>{formatPrice(bike.price)} VNĐ/Giờ</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Tình trạng:</Text>
            <Text style={styles.value}>{bike.status}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Ngày tạo:</Text>
            <Text style={styles.value}>{formatDate(bike.createdAt)}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Cập nhật lúc:</Text>
            <Text style={styles.value}>{formatDate(bike.updatedAt)}</Text>
          </View>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.editButton]}
            onPress={() => navigation.navigate("EditBike", { bike })}
          >
            <Text style={styles.buttonText}>Sửa</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDelete}>
            <Text style={styles.buttonText}>Xóa</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal thông báo */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContainer,
              modalIcon === "✅"
                ? { borderLeftColor: "#4CAF50" }
                : modalIcon === "❌"
                ? { borderLeftColor: "#F44336" }
                : { borderLeftColor: "#FFC107" }, // dấu hỏi màu vàng
            ]}
          >
            <Text style={styles.modalEmoji}>{modalIcon}</Text>
            <Text style={styles.modalMessage}>{modalMessage}</Text>

            {/* Nếu modalIcon là dấu hỏi thì hiện 2 nút Xác nhận và Hủy */}
            {modalIcon === "❓" ? (
              <View style={styles.confirmButtonsRow}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.modalButtonText}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={confirmDelete}
                >
                  <Text style={styles.modalButtonText}>Xóa</Text>
                </TouchableOpacity>
              </View>
            ) : (
              // Các modal khác chỉ có nút Đóng
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  setModalVisible(false);
                  if (modalIcon === "✅") {
                    navigation.goBack();
                  }
                }}
              >
                <Text style={styles.closeButtonText}>Đóng</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
};

export default BikeDetail;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#E8F5E9",
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  bikeImage: {
    width: "80%",
    height: 200,
    borderRadius: 15,
    marginBottom: 30,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  infoContainer: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 20,
    textAlign: "center",
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  label: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: "#4E944F",
  },
  value: {
    flex: 1,
    fontSize: 18,
    color: "#333",
  },
  buttonRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  button: {
    flex: 0.48,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    elevation: 4,
  },
  editButton: {
    backgroundColor: "#388E3C",
  },
  deleteButton: {
    backgroundColor: "#D32F2F",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    width: "80%",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
    borderLeftWidth: 6,
  },
    modalEmoji: {
    fontSize: 48,
    marginBottom: 15,
  },
    modalMessage: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
    confirmButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
    modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 8,
    alignItems: "center",
  },
    cancelButton: {
    backgroundColor: "#BDBDBD",
  },
    confirmButton: {
    backgroundColor: "#D32F2F",
  },
    modalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
    closeButton: {
    backgroundColor: "#388E3C",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
    closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});