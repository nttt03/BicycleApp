import { View, StyleSheet, TouchableOpacity, Alert, Image } from "react-native";
import { Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { logout, useMyContextController } from "../store";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

const MoreTab = () => {
  const navigation = useNavigation();
  const [controller, dispatch] = useMyContextController();
  const { userLogin } = controller;
  const [userName, setUserName] = useState("Người dùng");
  const [gender, setGender] = useState("Nam");

  useEffect(() => {
  const user = auth().currentUser;
  if (user) {
    const email = user.email;
    const unsubscribeUser = firestore()
      .collection("USERS")
      .where("email", "==", email)
      .onSnapshot((querySnapshot) => {
        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          setUserName(userData.fullName || "Người dùng");
          setGender(userData.gender || "nam");
        } else {
          console.log("Không tìm thấy thông tin người dùng với email:", email);
        }
      }, (error) => {
        console.log("Lỗi khi lấy thông tin người dùng:", error.message);
      });

    return () => unsubscribeUser();
  }
}, []);

  // Nếu userLogin = null thì quay về màn hình Login
  useEffect(() => {
    if (userLogin === null) {
      navigation.navigate("Login");
    }
  }, [userLogin]);

  // Xử lý logout
  const handleLogout = () => {
    Alert.alert(
      "Xác nhận đăng xuất",
      "Bạn có chắc chắn muốn đăng xuất?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Đăng xuất",
          style: "destructive",
          onPress: () => logout(dispatch),
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileBox}>
        <Image
          source={
            gender === "Nữ"
              ? require("../assets/avatar_female.png")
              : require("../assets/avatar_male.png")
          }
          style={styles.userImage}
        />
        
        <Text style={styles.userName}>{userName}</Text>

        <TouchableOpacity style={styles.optionItem} onPress={() => navigation.navigate("UpdateInfo")}>
          <Image source={require("../assets/icons/edit.png")} style={styles.optionIcon} />
          <Text style={styles.optionText}>Cập nhật thông tin</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionItem} onPress={() => navigation.navigate("ChangePassword")}>
          <Image source={require("../assets/icons/key.png")} style={styles.optionIcon} />
          <Text style={styles.optionText}>Đổi mật khẩu</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionItem} onPress={handleLogout}>
          <Image source={require("../assets/icons/logout.jpg")} style={styles.optionIcon} />
          <Text style={styles.optionText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>
      <Image source={require("../assets/img_slide_velogo.png")} style={styles.slideVelogo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    paddingTop: 40,
  },
  profileBox: {
    width: "90%",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    elevation: 3,
  },
  avatar: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  userImage: {
    marginRight: 10,
    width: 60,
    height: 60,
    borderRadius: 30, 
    borderWidth: 2,
    borderColor: "#FFF",
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#00CC99",
    marginBottom: 20,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: "#EEE",
    width: "100%",
  },
  optionIcon: {
    width: 22,
    height: 22,
    marginRight: 12,
    marginLeft: 4,
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  slideVelogo: {
    width: 400,
    height: 110,
    marginTop: 50
  }
});

export default MoreTab;