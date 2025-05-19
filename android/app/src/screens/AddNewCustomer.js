import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
} from "react-native";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth"; 
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const genders = ["Nam", "Nữ"];

const AddNewCustomer = ({ navigation }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState(genders[0]);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalIcon, setModalIcon] = useState("✅");

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleAddCustomer = async () => {
    if (!fullName || !email || !password || !confirmPassword || !phone || !address || !gender) {
      setModalIcon("❌");
      setModalMessage("Vui lòng điền đầy đủ thông tin.");
      setModalVisible(true);
      return;
    }

    if (!validateEmail(email)) {
      setModalIcon("❌");
      setModalMessage("Email không hợp lệ.");
      setModalVisible(true);
      return;
    }

    if (password.length < 6) {
      setModalIcon("❌");
      setModalMessage("Mật khẩu phải có ít nhất 6 ký tự.");
      setModalVisible(true);
      return;
    }

    if (password !== confirmPassword) {
      setModalIcon("❌");
      setModalMessage("Mật khẩu xác nhận không khớp.");
      setModalVisible(true);
      return;
    }

    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const userId = userCredential.user.uid;

      const timestamp = firestore.FieldValue.serverTimestamp();

      await firestore().collection("USERS").doc(userId).set({
        fullName,
        email,
        password, 
        phone,
        address,
        gender,
        role: "customer",
        createdAt: timestamp,
        updatedAt: timestamp,
      });

      setModalIcon("✅");
      setModalMessage("Đã thêm khách hàng thành công!");
      setModalVisible(true);
    } catch (error) {
      setModalIcon("❌");
      let errorMsg = "Không thể thêm khách hàng.";
      if (error.code === "auth/email-already-in-use") {
        errorMsg = "Email đã được sử dụng.";
      } else if (error.code === "auth/invalid-email") {
        errorMsg = "Email không hợp lệ.";
      } else {
        errorMsg = error.message;
      }
      setModalMessage(errorMsg);
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
          <Text style={styles.label}>Họ và tên</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập họ tên"
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="example@gmail.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Mật khẩu</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Nhập mật khẩu"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Icon
                name={showPassword ? "eye" : "eye-off"}
                size={22}
                color="#777"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Xác nhận mật khẩu</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.eyeIcon}
            >
              <Icon
                name={showConfirmPassword ? "eye" : "eye-off"}
                size={22}
                color="#777"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Số điện thoại</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập số điện thoại"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Địa chỉ</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập địa chỉ"
            value={address}
            onChangeText={setAddress}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Giới tính</Text>
          <View style={styles.genderContainer}>
            <TouchableOpacity
              style={[
                styles.genderButton,
                gender === "Nam" && styles.genderSelected,
              ]}
              onPress={() => setGender("Nam")}
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
        </View>

        <TouchableOpacity style={styles.button} onPress={handleAddCustomer}>
          <Text style={styles.buttonText}>Thêm khách hàng</Text>
        </TouchableOpacity>
      </ScrollView>

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

export default AddNewCustomer;

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
    elevation: 2,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#A5D6A7",
    paddingHorizontal: 10,
    elevation: 2,
  },
  passwordInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  eyeIcon: {
    paddingHorizontal: 10,
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
  },
  closeButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
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
});
