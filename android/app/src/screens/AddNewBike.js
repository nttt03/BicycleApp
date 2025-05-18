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

const AddNewBike = ({ navigation }) => {
  const [name, setName] = useState("");
  const [type, setType] = useState(bikeTypes[0]);
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState(bikeStatuses[0]);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalIcon, setModalIcon] = useState("✅");

  const handleAddBike = async () => {
    if (!name || !type || !price || !status) {
      setModalIcon("❌");
      setModalMessage("Vui lòng điền đầy đủ thông tin.");
      setModalVisible(true);
      return;
    }

    try {
      const timestamp = firestore.FieldValue.serverTimestamp();

      await firestore().collection("BIKES").add({
        name,
        type,
        price: Number(price),
        status,
        createdAt: timestamp,
        updatedAt: timestamp,
      });

      setModalIcon("✅");
      setModalMessage("Đã thêm xe mới thành công!");
      setModalVisible(true);
    } catch (error) {
      setModalIcon("❌");
      setModalMessage("Không thể thêm xe: " + error.message);
      setModalVisible(true);
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
            placeholder="Nhập tên xe"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Loại xe</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={type}
              onValueChange={(itemValue) => setType(itemValue)}
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
            placeholder="Ví dụ: 30000"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Trạng thái</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={status}
              onValueChange={(itemValue) => setStatus(itemValue)}
              style={styles.picker}
            >
              {bikeStatuses.map((st) => (
                <Picker.Item key={st} label={st} value={st} />
              ))}
            </Picker>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleAddBike}>
          <Text style={styles.buttonText}>Thêm xe</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal thông báo hiện đại */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContainer,
              modalIcon === "✅"
                ? { borderLeftColor: "#4CAF50" }
                : { borderLeftColor: "#F44336" },
            ]}
          >
            <Text style={styles.modalEmoji}>{modalIcon}</Text>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setModalVisible(false);
                if (modalIcon === "✅") navigation.goBack();
              }}
            >
              <Text style={styles.closeButtonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default AddNewBike;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 40,
    flexGrow: 1,
  },
  inputGroup: {
    marginBottom: 20,
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
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 10,
    borderLeftWidth: 6,
  },
  modalEmoji: {
    fontSize: 48,
    marginBottom: 15,
  },
  modalMessage: {
    fontSize: 17,
    textAlign: "center",
    color: "#333",
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: "#388E3C",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 30,
    elevation: 2,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});