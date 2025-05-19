import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
} from "react-native";
import firestore from "@react-native-firebase/firestore";

const EditCustomer = ({ route, navigation }) => {
  const { customer } = route.params;

  const [fullName, setFullName] = useState(customer.fullName || "");
  const [email, setEmail] = useState(customer.email || "");
  const [phone, setPhone] = useState(customer.phone || "");
  const [address, setAddress] = useState(customer.address || "");
  const [gender, setGender] = useState(customer.gender || "Nam");
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const showModal = (title, message) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!fullName.trim() || !email.trim() || !phone.trim() || !address.trim() || !gender) {
      showModal("Lỗi", "Vui lòng điền đầy đủ thông tin.");
      return;
    }

    if (!isValidEmail(email)) {
      showModal("Lỗi", "Email không hợp lệ.");
      return;
    }

    setLoading(true);

    try {
      await firestore().collection("USERS").doc(customer.id).update({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        address: address.trim(),
        gender,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });

      showModal("Thành công", "Thông tin đã được cập nhật.");
    } catch (error) {
      showModal("Lỗi", "Không thể cập nhật: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    if (modalTitle === "Thành công") {
      navigation.goBack();
    }
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>Họ và tên:</Text>
        <TextInput
          value={fullName}
          onChangeText={setFullName}
          style={styles.input}
          placeholder="Nhập họ tên"
          editable={!loading}
        />

        <Text style={styles.label}>Email:</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          placeholder="Nhập email"
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading}
        />

        <Text style={styles.label}>Số điện thoại:</Text>
        <TextInput
          value={phone}
          onChangeText={setPhone}
          style={styles.input}
          placeholder="Nhập số điện thoại"
          keyboardType="phone-pad"
          editable={!loading}
        />

        <Text style={styles.label}>Địa chỉ:</Text>
        <TextInput
          value={address}
          onChangeText={setAddress}
          style={styles.input}
          placeholder="Nhập địa chỉ"
          editable={!loading}
        />

        <Text style={styles.label}>Giới tính:</Text>
        <View style={styles.genderContainer}>
          <TouchableOpacity
            style={[
              styles.genderButton,
              gender === "Nam" && styles.genderSelected,
            ]}
            onPress={() => setGender("Nam")}
            disabled={loading}
          >
            <Text
              style={[
                styles.genderText,
                gender === "Nam" && styles.genderSelectedText,
              ]}
            >
              Nam
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.genderButton,
              gender === "Nữ" && styles.genderSelected,
            ]}
            onPress={() => setGender("Nữ")}
            disabled={loading}
          >
            <Text
              style={[
                styles.genderText,
                gender === "Nữ" && styles.genderSelectedText,
              ]}
            >
              Nữ
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, loading && { opacity: 0.6 }]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? "Đang lưu..." : "Lưu thay đổi"}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleCloseModal}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default EditCustomer;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F1F8E9",
    flexGrow: 1,
  },
  label: {
    fontSize: 16,
    color: "#388E3C",
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    borderColor: "#C8E6C9",
    borderWidth: 1,
  },
  genderContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  genderButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: "#E0E0E0",
  },
  genderSelected: {
    backgroundColor: "#66BB6A",
  },
  genderText: {
    fontSize: 16,
    color: "#333",
  },
  genderSelectedText: {
    color: "#fff",
    fontWeight: "bold",
  },
  saveButton: {
    marginTop: 30,
    backgroundColor: "#388E3C",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 25,
    width: "100%",
    maxWidth: 350,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    color: "#388E3C",
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  modalButton: {
    backgroundColor: "#388E3C",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});