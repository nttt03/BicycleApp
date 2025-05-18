import { View, Image, StyleSheet } from "react-native";
import { Button, HelperText, Text, TextInput } from "react-native-paper";
import { useEffect, useState } from "react";
import { login, useMyContextController } from "../store";

const Login = ({ navigation }) => {
  const [controller, dispatch] = useMyContextController();
  const { userLogin } = controller;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hiddenPassword, setHiddenPassword] = useState(true);

  const hasErrorEmail = () => !email.includes("@");
  const hasErrorPassword = () => password.length < 6;

  const handleLogin = (dispatch, email, password) => {
    login(dispatch, email, password);
  };

  useEffect(() => {
    if (userLogin != null) {
      if (userLogin.role === "admin") {
        navigation.navigate("Admin");
      } else {
        navigation.navigate("Home");
      }
    }
  }, [userLogin]);

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/img_bg_velogo.png")}
        style={styles.logo}
      />
      <TextInput
        label="Account"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        mode="outlined"
        theme={{ colors: { primary: "#4CAF50" } }}
      />
      <HelperText type="error" visible={hasErrorEmail()}>
        Địa chỉ Email không hợp lệ
      </HelperText>
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={hiddenPassword}
        style={styles.input}
        mode="outlined"
        theme={{ colors: { primary: "#4CAF50" } }}
        right={<TextInput.Icon icon="eye" onPress={() => setHiddenPassword(!hiddenPassword)} />}
      />
      <HelperText type="error" visible={hasErrorPassword()}>
        Password phải có ít nhất 6 ký tự
      </HelperText>
      <Button
        mode="contained"
        onPress={() => handleLogin(dispatch, email, password)}
        style={styles.loginButton}
        labelStyle={styles.buttonLabel}
      >
        Login
      </Button>
      <Button
        mode="outlined"
        onPress={() => navigation.goBack()}
        style={styles.closeButton}
        labelStyle={styles.buttonLabel}
      >
        Close
      </Button>
      <View style={styles.linkContainer}>
        <Button
          onPress={() => navigation.navigate("Register")}
          textColor="#4CAF50"
        >
          Đăng ký tài khoản
        </Button>
        <Button
          onPress={() => navigation.navigate("ForgotPassword")}
          textColor="#4CAF50"
        >
          Quên mật khẩu
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
    justifyContent: "center",
  },
  logo: {
    width: 330,
    height: 280,
    alignSelf: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4CAF50", // Tiêu đề màu xanh lá cây
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    marginBottom: 10,
    backgroundColor: "#FFF",
  },
  loginButton: {
    marginTop: 10,
    backgroundColor: "#4CAF50", // Nút Login màu xanh lá cây
    borderRadius: 5,
  },
  closeButton: {
    marginTop: 10,
    borderColor: "#4CAF50", // Viền nút Close màu xanh lá cây
    borderRadius: 5,
  },
  buttonLabel: {
    fontSize: 16,
    paddingVertical: 5,
  },
  linkContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
});

export default Login;

// import { View,Image } from "react-native";
// import { Button, HelperText, Text, TextInput } from "react-native-paper";
// import { useEffect, useState } from "react";
// import { login, useMyContextController } from "../store";

// const Login = ({ navigation }) => {
//   const [controller, dispatch] = useMyContextController();
//   const { userLogin } = controller;

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [hiddenPassword, setHiddenPassword] = useState(true);

//   const hasErrorEmail = () => !email.includes("@");
//   const hasErrorPassword = () => password.length < 6;

//   const handleLogin = (dispatch, email, password) => {
//     login(dispatch, email, password);
//   };

//   useEffect(() => {
//     if (userLogin != null) {
//       if (userLogin.role === "admin") {
//         navigation.navigate("Admin");
//       } else {
//         navigation.navigate("Home");
//       }
//     }
//   }, [userLogin]);

//   return (
//     <View style={{ flex: 1, padding: 10 }}>
//       <Image
//               source={require("../assets/login.png")}
//               style={{
//                 alignSelf: "center",
//                 marginVertical: 50,
//                 width: 150,
//                 height: 150
//               }}
//             />
//       <TextInput
//         label={"Email"}
//         value={email}
//         onChangeText={setEmail}
//       />
//       <HelperText type="error" visible={hasErrorEmail()}>
//         Địa chỉ Email không hợp lệ
//       </HelperText>
//       <TextInput
//         label={"Password"}
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry={hiddenPassword}
//         right={<TextInput.Icon icon={"eye"} onPress={() => setHiddenPassword(!hiddenPassword)} />}
//       />
//       <HelperText type="error" visible={hasErrorPassword()}>
//         Password phải 6 ký tự
//       </HelperText>
//       <Button
//         mode="contained"
//         buttonColor="#ff4081"
//         onPress={() => handleLogin(dispatch, email, password)}
//       >
//         Login
//       </Button>
//       <View
//         style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}
//       >
//         <Button onPress={() => navigation.navigate("Register")}>
//           Create new account
//         </Button>
//       </View>
//       <View
//         style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}
//       >
//         <Button onPress={() => navigation.navigate("ForgotPassword")}>
//           Forgot Password
//         </Button>
//       </View>
//     </View>
//   );
// };
// export default Login;