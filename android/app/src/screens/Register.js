import { Alert, View } from "react-native";
import { TextInput, HelperText, Button, Text } from "react-native-paper";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { useState } from "react";

const Register = ({ navigation }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [hiddenPassword, setHiddenPassword] = useState(false);
  const [hiddenPasswordConfirm, setHiddenPasswordConfirm] = useState(false);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const hasErrorFullName = () => !fullName.includes(" ");
  const hasErrorEmail = () => !email.includes("@");
  const hasErrorPassword = () => password.length < 6;
  const hasErrorPasswordConfirm = () => passwordConfirm !== password;

  const handleCreateAccount = () => {
    if (
      hasErrorFullName() ||
      hasErrorEmail() ||
      hasErrorPassword() ||
      hasErrorPasswordConfirm()
    ) {
      Alert.alert("❌ Vui lòng kiểm tra lại thông tin");
      return;
    }

    auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const { uid, email } = userCredential.user;
        firestore()
          .collection("USERS")
          .doc(uid)
          .set({
            uid,
            fullName,
            email,
            address,
            phone,
            role: "customer",
            createdAt: firestore.FieldValue.serverTimestamp(),
          })
          .then(() => {
            Alert.alert("✅ Đăng ký thành công");
            navigation.navigate("Login");
          })
          .catch((error) => {
            console.error("Lỗi khi lưu dữ liệu:", error);
            Alert.alert("❌ Lỗi khi lưu thông tin người dùng");
          });
      })
      .catch((error) => {
        console.error("Lỗi đăng ký:", error);
        Alert.alert("❌ Tài khoản đã tồn tại hoặc thông tin không hợp lệ");
      });
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Text
        style={{
          fontSize: 30,
          fontWeight: "bold",
          alignSelf: "center",
          color: "#4CAF50",
          marginTop: 50,
          marginBottom: 50,
        }}
      >
        Đăng ký tài khoản mới
      </Text>

      <TextInput
        label={"Họ và tên"}
        value={fullName}
        onChangeText={setFullName}
      />
      <HelperText type="error" visible={hasErrorFullName()}>
        Vui lòng nhập họ và tên đầy đủ
      </HelperText>

      <TextInput label={"Email"} value={email} onChangeText={setEmail} />
      <HelperText type="error" visible={hasErrorEmail()}>
        Email không hợp lệ
      </HelperText>

      <TextInput
        label={"Mật khẩu"}
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!hiddenPassword}
        right={
          <TextInput.Icon
            icon={hiddenPassword ? "eye" : "eye-off"}
            onPress={() => setHiddenPassword(!hiddenPassword)}
          />
        }
      />
      <HelperText type="error" visible={hasErrorPassword()}>
        Mật khẩu phải có ít nhất 6 ký tự
      </HelperText>

      <TextInput
        label={"Xác nhận mật khẩu"}
        value={passwordConfirm}
        onChangeText={setPasswordConfirm}
        secureTextEntry={!hiddenPasswordConfirm}
        right={
          <TextInput.Icon
            icon={hiddenPasswordConfirm ? "eye" : "eye-off"}
            onPress={() => setHiddenPasswordConfirm(!hiddenPasswordConfirm)}
          />
        }
      />
      <HelperText type="error" visible={hasErrorPasswordConfirm()}>
        Mật khẩu xác nhận không khớp
      </HelperText>

      <TextInput
        label={"Địa chỉ"}
        value={address}
        onChangeText={setAddress}
        style={{ marginBottom: 20 }}
      />

      <TextInput
        label={"Số điện thoại"}
        value={phone}
        onChangeText={setPhone}
        style={{ marginBottom: 20 }}
        keyboardType="phone-pad"
      />

      <Button mode="contained" buttonColor="#4CAF50" onPress={handleCreateAccount}>
        Tạo tài khoản
      </Button>

      <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 10 }}>
        <Text>Bạn đã có tài khoản?</Text>
        <Button onPress={() => navigation.navigate("Login")}>
          Đăng nhập
        </Button>
      </View>
    </View>
  );
};

export default Register;