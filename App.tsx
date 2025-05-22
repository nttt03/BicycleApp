import { MyContextControllerProvider } from "./android/app/src/store";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import Router from "./android/app/src/routers/Router";
import { Provider as PaperProvider } from "react-native-paper";
const App = () => {
  const USERS = firestore().collection("USERS");
  const admin = {
    fullName: "Admin",
    email: "admin@gmail.com",
    password: "123456",
    phone: "1234567890",
    address: "Binh Duong",
    role: "admin"
  };

  // useEffect(() => {
  //   const unsubscribe = USERS.doc(admin.email)
  //     .onSnapshot((snapshot) => {
  //       if (!snapshot.exists) {
  //         auth()
  //           .createUserWithEmailAndPassword(admin.email, admin.password)
  //           .then((response) => {
  //             return USERS.doc(admin.email).set(admin);
  //           })
  //           .then(() => {
  //             console.log("Add new account admin");
  //           })
  //           .catch((error) => {
  //             console.log("Lỗi tạo tài khoản:", error.message);
  //           });
  //       }
  //     }, (error) => {
  //       console.log("Lỗi snapshot:", error.message);
  //     });

  //   return () => unsubscribe();
  // }, []);

  useEffect(() => {
  console.log("🟡 useEffect chạy");

  const unsubscribe = USERS.doc(admin.email)
    .onSnapshot((snapshot) => {
      console.log("🟡 Đang kiểm tra tài khoản admin:", admin.email);

      if (!snapshot.exists) {
        console.log("🟠 Tài khoản chưa có trong Firestore. Tiến hành tạo mới...");
        
        auth()
          .createUserWithEmailAndPassword(admin.email, admin.password)
          .then(() => {
            console.log("✅ Tạo tài khoản thành công, thêm vào Firestore...");
            return USERS.doc(admin.email).set(admin);
          })
          .then(() => {
            console.log("✅ Đã thêm tài khoản admin vào Firestore");
          })
          .catch((error) => {
            console.log("❌ Lỗi khi tạo tài khoản:", error.message);
          });
      } else {
        console.log("✅ Tài khoản admin đã tồn tại trong Firestore");
      }
    });

  return () => unsubscribe();
}, []);

  return (
    <MyContextControllerProvider>
      <PaperProvider>
        <NavigationContainer>
          <Router />
        </NavigationContainer>
      </PaperProvider>
    </MyContextControllerProvider>
  );
};
export default App;