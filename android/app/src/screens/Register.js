// import { Alert, View } from "react-native";
// import { TextInput, HelperText, Button, Text } from "react-native-paper";
// import firestore from "@react-native-firebase/firestore";
// import auth from "@react-native-firebase/auth";
// import { useState } from "react";

// const Register = ({ navigation }) => {
//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [passwordConfirm, setPasswordConfirm] = useState("");
//   const [hiddenPassword, setHiddenPassword] = useState(false);
//   const [hiddenPasswordConfirm, setHiddenPasswordConfirm] = useState(false);
//   const [address, setAddress] = useState("");
//   const [phone, setPhone] = useState("");

//   const hasErrorFullName = () => !fullName.includes(" ");
//   const hasErrorEmail = () => !email.includes("@");
//   const hasErrorPassword = () => password.length < 6;
//   const hasErrorPasswordConfirm = () => passwordConfirm !== password;

//   const handleCreateAccount = () => {
//     auth()
//       .createUserWithEmailAndPassword(email, password)
//       .then((response) => {
//         const users = firestore().collection("USERS").doc(email);
//         users
//           .set({
//             fullName,
//             email,
//             password,
//             address,
//             phone,
//             role: "customer",
//           })
//           .then(() => navigation.navigate("Login"))
//           .catch((e) => Alert.alert("Tai khon ton tai"));
//       })
//       .catch((e) => Alert.alert("Tai khon ton tai"));
//   };

//   return (
//     <View style={{ flex: 1, padding: 10 }}>
//       <Text
//         style={{
//           fontSize: 30,
//           fontWeight: "bold",
//           alignSelf: "center",
//           color: "#ff4081",
//           marginTop: 50,
//           marginBottom: 50,
//         }}
//       >
//         Register New Account
//       </Text>
//       <TextInput
//         label={"Full Name"}
//         value={fullName}
//         onChangeText={setFullName}
//       />
//       <HelperText type="error" visible={hasErrorFullName()}>
//         Full name khong duoc phep đê trong
//       </HelperText>
//       <TextInput
//         label={"Email"}
//         value={email}
//         onChangeText={setEmail}
//       />
//       <HelperText type="error" visible={hasErrorEmail()}>
//         Địa chỉ email không hợp lệ
//       </HelperText>
//       <TextInput
//         label={"Password"}
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry={!hiddenPassword}
//         right={
//           <TextInput.Icon
//             icon={"eye"}
//             onPress={() => setHiddenPassword(!hiddenPassword)}
//           />
//         }
//       />
//       <HelperText type="error" visible={hasErrorPassword()}>
//         Password ít nhất 6 ký tự
//       </HelperText>
//       <TextInput
//         label={"Confirm Password"}
//         value={passwordConfirm}
//         onChangeText={setPasswordConfirm}
//         secureTextEntry={!hiddenPasswordConfirm}
//         right={
//           <TextInput.Icon
//             icon={"eye"}
//             onPress={() => setHiddenPasswordConfirm(!hiddenPasswordConfirm)}
//           />
//         }
//       />
//       <HelperText type="error" visible={hasErrorPasswordConfirm()}>
//         Confirm password phải khớp với password
//       </HelperText>
//       <TextInput
//         label={"Address"}
//         value={address}
//         onChangeText={setAddress}
//         style={{ marginBottom: 20 }}
//       />
//       <TextInput
//         label={"Phone"}
//         value={phone}
//         onChangeText={setPhone}
//         style={{ marginBottom: 20 }}
//       />
//       <Button mode="contained" buttonColor="#ff4081" onPress={handleCreateAccount}>
//         Create New Account
//       </Button>
//       <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
//         <Text>Do you have an account ?</Text>
//         <Button onPress={() => navigation.navigate("Login")}>
//           Login Account
//         </Button>
//       </View>
//     </View>
//   );
// };

// export default Register;

import { Alert, View, StyleSheet } from "react-native";
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
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then((response) => {
        const users = firestore().collection("USERS").doc(email);
        users
          .set({
            fullName,
            email,
            password,
            address,
            phone,
            role: "customer",
          })
          .then(() => navigation.navigate("Login"))
          .catch((e) => Alert.alert("Tài khoản đã tồn tại"));
      })
      .catch((e) => Alert.alert("Tài khoản đã tồn tại"));
  };

  return (
    <View style={{ flex: 1, padding: 10, backgroundColor: "white" }}>
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
        Register New Account
      </Text>
      <TextInput
        label={"Full Name"}
        value={fullName}
        onChangeText={setFullName}
        mode="outlined"
        theme={{ colors: { primary: "#4CAF50" } }}
      />
      <HelperText type="error" visible={hasErrorFullName()}>
        Full name không được phép để trống
      </HelperText>
      <TextInput
        label={"Email"}
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        theme={{ colors: { primary: "#4CAF50" } }}
      />
      <HelperText type="error" visible={hasErrorEmail()}>
        Địa chỉ email không hợp lệ
      </HelperText>
      <TextInput
        label={"Password"}
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!hiddenPassword}
        mode="outlined"
        theme={{ colors: { primary: "#4CAF50" } }}
        right={
          <TextInput.Icon
            icon={"eye"}
            onPress={() => setHiddenPassword(!hiddenPassword)}
          />
        }
      />
      <HelperText type="error" visible={hasErrorPassword()}>
        Password ít nhất 6 ký tự
      </HelperText>
      <TextInput
        label={"Confirm Password"}
        value={passwordConfirm}
        onChangeText={setPasswordConfirm}
        secureTextEntry={!hiddenPasswordConfirm}
        mode="outlined"
        theme={{ colors: { primary: "#4CAF50" } }}
        right={
          <TextInput.Icon
            icon={"eye"}
            onPress={() => setHiddenPasswordConfirm(!hiddenPasswordConfirm)}
          />
        }
      />
      <HelperText type="error" visible={hasErrorPasswordConfirm()}>
        Confirm password phải khớp với password
      </HelperText>
      <TextInput
        label={"Address"}
        value={address}
        onChangeText={setAddress}
        mode="outlined"
        theme={{ colors: { primary: "#4CAF50" } }}
        style={{ marginBottom: 20 }}
      />
      <TextInput
        label={"Phone"}
        value={phone}
        onChangeText={setPhone}
        mode="outlined"
        theme={{ colors: { primary: "#4CAF50" } }}
        style={{ marginBottom: 20 }}
      />
      <Button style={styles.RegisterButton} mode="contained" buttonColor="#4CAF50" onPress={handleCreateAccount}>
        Create New Account
      </Button>
      <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 20 }}>
        <Text>Do you have an account ?</Text>
        <Button onPress={() => navigation.navigate("Login")} textColor="#4CAF50">
          Login Account
        </Button>
      </View>
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  RegisterButton: {
    marginTop: 10,
    backgroundColor: "#4CAF50",
    borderRadius: 5,
  },
})