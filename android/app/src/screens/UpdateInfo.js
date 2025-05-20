import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Text } from "react-native-paper";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { Picker } from "@react-native-picker/picker";

const UpdateInfo = () => {
  const navigation = useNavigation();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("None"); // Giá trị mặc định là "None"

  useEffect(() => {
    const fetchData = async () => {
      const user = auth().currentUser;
      if (user) {
        setEmail(user.email);
        try {
          const doc = await firestore().collection("USERS").doc(user.uid).get();
          if (doc.exists) {
            const data = doc.data();
            setFullName(data.fullName || "");
            setAddress(data.address || "");
            setPhone(data.phone || "");
            setGender(data.gender || "None"); // Lấy gender từ Firestore, nếu không có thì là "None"
          } else {
            console.log("Tài liệu không tồn tại cho UID:", user.uid);
          }
        } catch (error) {
          console.log("Lỗi lấy dữ liệu:", error.message);
        }
      }
    };

    fetchData();
  }, []);

  const handleUpdate = async () => {
    const user = auth().currentUser;
    if (user) {
      try {
        await firestore().collection("USERS").doc(user.uid).update({
          fullName,
          address,
          phone,
          gender,
          updatedAt: firestore.Timestamp.now(),
        });
        Alert.alert("Thành công", "Cập nhật thông tin thành công!");
      } catch (error) {
        console.log("Lỗi cập nhật:", error.message);
        Alert.alert("Lỗi", "Không thể cập nhật thông tin.");
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Nút quay lại */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color="#333" />
        <Text style={styles.backText}>Quay lại</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Cập nhật thông tin cá nhân</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        value={email}
        editable={false}
        style={[styles.input, { backgroundColor: "#f0f0f0", color: "gray" }]}
        placeholder="Email"
      />

      <Text style={styles.label}>Họ tên</Text>
      <TextInput
        value={fullName}
        onChangeText={setFullName}
        style={styles.input}
        placeholder="Nhập họ tên"
      />

      <Text style={styles.label}>Địa chỉ</Text>
      <TextInput
        value={address}
        onChangeText={setAddress}
        style={styles.input}
        placeholder="Nhập địa chỉ"
      />

      <Text style={styles.label}>Số điện thoại</Text>
      <TextInput
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        style={styles.input}
        placeholder="Nhập số điện thoại"
      />

      <Text style={styles.label}>Giới tính</Text>
      <View style={[styles.input, styles.pickerContainer]}>
        <Picker
          selectedValue={gender}
          onValueChange={(itemValue) => setGender(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="None" value="None" />
          <Picker.Item label="Nam" value="Nam" />
          <Picker.Item label="Nữ" value="Nữ" />
        </Picker>
      </View>

      <Button title="Lưu thay đổi" onPress={handleUpdate} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    backgroundColor: "#FFF",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backText: {
    fontSize: 16,
    marginLeft: 8,
    color: "#333",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#00CC99",
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  pickerContainer: {
    padding: 0, // Loại bỏ padding để Picker hiển thị tốt hơn
  },
  picker: {
    height: 50,
    width: "100%",
  },
});

export default UpdateInfo;