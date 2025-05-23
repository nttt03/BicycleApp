import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import firestore from "@react-native-firebase/firestore";

const TransactionDetail = ({ route, navigation }) => {
  const { transaction } = route.params;

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalIcon, setModalIcon] = useState("✅");

  const [userName, setUserName] = useState("");
  const [stationName, setStationName] = useState("");

  useEffect(() => {
    const fetchExtraData = async () => {
      try {
        const userDoc = await firestore().collection("USERS").doc(transaction.userId).get();
        setUserName(userDoc.exists ? userDoc.data().fullName : "-");

        const stationDoc = await firestore().collection("STATIONS").doc(transaction.stationId).get();
        setStationName(stationDoc.exists ? stationDoc.data().stationName : "-");
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu người dùng hoặc trạm:", error);
      }
    };

    fetchExtraData();
  }, []);

  const handleDelete = () => {
    setModalIcon("❓");
    setModalMessage("Bạn có chắc muốn xóa giao dịch này không?");
    setModalVisible(true);
  };

  const confirmDelete = async () => {
    setModalVisible(false);
    try {
      await firestore().collection("TRANSACTIONS").doc(transaction.id).delete();
      setModalIcon("✅");
      setModalMessage("Đã xóa giao dịch thành công!");
      setModalVisible(true);
    } catch (error) {
      setModalIcon("❌");
      setModalMessage("Xóa không thành công: " + error.message);
      setModalVisible(true);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "-";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString("vi-VN");
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.infoContainer}>
          {[
            { label: "ID xe", value: transaction.bikeId },
            { label: "Tên xe", value: transaction.bikeName },
            { label: "Tên khách hàng", value: userName },
            { label: "Email khách hàng", value: transaction.userEmail },
            { label: "Tên trạm", value: stationName },
            { label: "Tổng tiền thuê", value: transaction.totalPrice?.toLocaleString() + " VNĐ" },
            { label: "Trạng thái", value: transaction.status },
            { label: "Thời gian thuê", value: formatDate(transaction.rentDate) },
            { label: "Thời gian trả (dự kiến)", value: formatDate(transaction.returnDate) },
            { label: "Thời gian trả (thực tế)", value: formatDate(transaction.actualReturnDate) },
            { label: "Thời gian tạo", value: formatDate(transaction.createdAt) },
            { label: "Cập nhật", value: formatDate(transaction.updatedAt) },
          ].map((item, index) => (
            <View style={styles.infoRow} key={index}>
              <Text style={styles.label}>{item.label}:</Text>
              <Text style={styles.value}>{item.value || "-"}</Text>
            </View>
          ))}
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.editButton]}
            onPress={() => navigation.navigate("EditTransaction", { transaction })}
          >
            <Text style={styles.buttonText}>Sửa</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={handleDelete}
          >
            <Text style={styles.buttonText}>Xóa</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContainer,
              modalIcon === "✅"
                ? { borderLeftColor: "#4CAF50" }
                : modalIcon === "❌"
                ? { borderLeftColor: "#F44336" }
                : { borderLeftColor: "#FFC107" },
            ]}
          >
            <Text style={styles.modalEmoji}>{modalIcon}</Text>
            <Text style={styles.modalMessage}>{modalMessage}</Text>

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

export default TransactionDetail;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#E8F5E9", // màu nền xanh lá nhạt
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  infoContainer: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#388E3C",
    marginBottom: 20,
    textAlign: "center",
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  label: {
    flex: 2,
    fontSize: 16,
    fontWeight: "600",
    color: "#2E7D32",
  },
  value: {
    flex: 3,
    fontSize: 16,
    color: "#333",
  },
  buttonRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  button: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    elevation: 4,
    width: "48%",
  },
  editButton: {
    backgroundColor: "#4CAF50",
  },
  deleteButton: {
    backgroundColor: "#D32F2F",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
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
