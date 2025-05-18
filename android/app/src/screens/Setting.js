import { Text, View, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { logout, useMyContextController } from "../store";
import { useEffect } from "react";

const Setting = ({ navigation }) => {
  const [controller, dispatch] = useMyContextController();
  const { userLogin } = controller;

  const handleLogout = () => {
    logout(dispatch);
  };

  useEffect(() => {
    if (userLogin === null) {
      navigation.navigate("Login");
    }
  }, [userLogin]);

  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <Button mode="contained" onPress={handleLogout} style={styles.button} labelStyle={styles.buttonLabel}>
        Logout
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 20,
    backgroundColor: "#ff4081",
    paddingVertical: 5,
    margin: 20
  },
  buttonLabel: {
    fontSize: 20,
  },
})

export default Setting;