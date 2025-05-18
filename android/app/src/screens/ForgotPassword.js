import { Alert, View } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { useState } from "react";
import auth from "@react-native-firebase/auth";

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState("");

  const handleResetPassword = () => {
    if (!email.includes("@")) {
      Alert.alert("Lỗi", "Vui lòng nhập địa chỉ email hợp lệ.");
      return;
    }

    auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        Alert.alert(
          "Thành công",
          "Email khôi phục mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư."
        );
        navigation.navigate("Login");
      })
      .catch((error) => {
        console.error("Lỗi khi gửi email khôi phục:", error.message);
        Alert.alert("Lỗi", "Không thể gửi email. Hãy kiểm tra lại email.");
      });
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
      <Text
        style={{
          fontSize: 28,
          fontWeight: "bold",
          alignSelf: "center",
          color: "#4CAF50",
          marginBottom: 40,
        }}
      >
        Quên mật khẩu
      </Text>

      <TextInput
        label="Nhập email của bạn"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={{ marginBottom: 20 }}
      />

      <Button
        mode="contained"
        buttonColor="#4CAF50"
        onPress={handleResetPassword}
        style={{ marginBottom: 20 }}
      >
        Gửi email khôi phục
      </Button>

      <Button
        onPress={() => navigation.navigate("Login")}
        textColor="#4CAF50"
      >
        Quay lại đăng nhập
      </Button>
    </View>
  );
};

export default ForgotPassword;