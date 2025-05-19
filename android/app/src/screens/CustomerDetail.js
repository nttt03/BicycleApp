import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

const CustomerDetail = ({ route, navigation }) => {
  const { customer } = route.params;

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalIcon, setModalIcon] = useState("✅");

  const handleDelete = () => {
    setModalIcon("❓");
    setModalMessage("Bạn có chắc muốn xóa khách hàng này không?");
    setModalVisible(true);
  };

  const confirmDelete = async () => {
    setModalVisible(false);
    try {
      await firestore().collection("USERS").doc(customer.id).delete();

      setModalIcon("✅");
      setModalMessage("Đã xóa khách hàng thành công!");
      setModalVisible(true);
    } catch (error) {
      setModalIcon("❌");
      setModalMessage("Xóa không thành công: " + error.message);
      setModalVisible(true);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "-";
    let dateObj;
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
          source={
            customer.gender === "Nam"
              ? require("../assets/avatar_male.png")
              : require("../assets/avatar_female.png")
          }
          style={styles.avatar}
          resizeMode="contain"
        />

        <View style={styles.infoContainer}>
          <Text style={styles.name}>{customer.fullName}</Text>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{customer.email}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>SĐT:</Text>
            <Text style={styles.value}>{customer.phone}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Giới tính:</Text>
            <Text style={styles.value}>{customer.gender}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Ngày tạo:</Text>
            <Text style={styles.value}>{formatDate(customer.createdAt)}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Cập nhật:</Text>
            <Text style={styles.value}>{formatDate(customer.updatedAt)}</Text>
          </View>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.editButton]}
            onPress={() => navigation.navigate("EditCustomer", { customer })}
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

export default CustomerDetail;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#E8F5E9",
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 100,
    marginBottom: 30,
    backgroundColor: "#fff",
    borderWidth: 3,
    borderColor: "#4CAF50",
  },
  infoContainer: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
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
    marginBottom: 10,
  },
  label: {
    flex: 2,
    fontSize: 16,
    fontWeight: "600",
    color: "#388E3C",
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
