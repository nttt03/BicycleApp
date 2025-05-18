import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import firestore from "@react-native-firebase/firestore";

const bikeTypes = [
  "Xe đạp thể thao",
  "Xe đạp du lịch",
  "Xe đạp đường phố",
  "Xe đạp cào cào",
  "Xe đạp lai",
  "Xe đạp gấp",
  "Xe trợ lực điện",
  "Xe đạp ba bánh",
];

const bikeStatuses = ["Có sẵn", "Đang cho thuê", "Bảo trì"];

const EditBike = ({ route, navigation }) => {
  const { bike } = route.params;

  const [name, setName] = useState(bike.name);
  const [type, setType] = useState(bike.type);
  const [price, setPrice] = useState(String(bike.price));
  const [status, setStatus] = useState(bike.status);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalSuccess, setModalSuccess] = useState(false);

  const openModal = (message, success = false) => {
    setModalMessage(message);
    setModalSuccess(success);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    if (modalSuccess) {
      navigation.navigate("BikeManagement");
    }
  };

  const handleUpdateBike = async () => {
    if (!name || !type || !price || !status) {
      openModal("Vui lòng điền đầy đủ thông tin", false);
      return;
    }

    try {
      await firestore().collection("BIKES").doc(bike.id).update({
        name,
        type,
        price: Number(price),
        status,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
      openModal("Đã cập nhật thông tin xe thành công", true);
    } catch (error) {
      openModal("Không thể cập nhật: " + error.message, false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#E8F5E9" }}
      behavior={Platform.OS === "ios" ? "padding" : null}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tên xe</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Nhập tên xe"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Loại xe</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={type}
              onValueChange={(value) => setType(value)}
              style={styles.picker}
            >
              {bikeTypes.map((type) => (
                <Picker.Item key={type} label={type} value={type} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Giá thuê (VNĐ/Giờ)</Text>
          <TextInput
            style={styles.input}
            value={price}
            onChangeText={setPrice}
            placeholder="Ví dụ: 30000"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Trạng thái</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={status}
              onValueChange={(value) => setStatus(value)}
              style={styles.picker}
            >
              {bikeStatuses.map((s) => (
                <Picker.Item key={s} label={s} value={s} />
              ))}
            </Picker>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleUpdateBike}>
          <Text style={styles.buttonText}>Lưu thay đổi</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContainer,
              modalSuccess ? styles.modalSuccess : styles.modalError,
            ]}
          >
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
              <Text style={styles.modalButtonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default EditBike;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 40,
    flexGrow: 1,
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#1B5E20",
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#A5D6A7",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#A5D6A7",
    borderRadius: 10,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  picker: {
    height: 50,
    width: "100%",
  },
  button: {
    backgroundColor: "#388E3C",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    elevation: 3,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 25,
    width: "100%",
    alignItems: "center",
    elevation: 10,
  },
  modalSuccess: {
    borderLeftWidth: 6,
    borderLeftColor: "#4CAF50",
  },
  modalError: {
    borderLeftWidth: 6,
    borderLeftColor: "#D32F2F",
  },
  modalMessage: {
    fontSize: 18,
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: "#388E3C",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});