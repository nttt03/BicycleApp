import { createContext, useContext, useMemo, useReducer } from "react";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { Alert } from "react-native";

const MyContext = createContext();
MyContext.displayName = "vbdvab";

// Định nghĩa reducer
const reducer = (state, action) => {
  switch (action.type) {
    case "USER_LOGIN":
      return { ...state, userLogin: action.value };
    case "LOGOUT":
      return { ...state, userLogin: null };
    default:
      return new Error("Action not found");
  }
};

// Định nghĩa MyContextControllerProvider
const MyContextControllerProvider = ({ children }) => {
  const initialState = {
    userLogin: null,
    services: [],
  };

  const [controller, dispatch] = useReducer(reducer, initialState);
  const value = useMemo(() => [controller, dispatch], [controller, dispatch]);

  return (
    <MyContext.Provider value={value}>
      {children}
    </MyContext.Provider>
  );
};

// Định nghĩa useMyContextController
const useMyContextController = () => {
  const context = useContext(MyContext);
  if (context === null) {
    throw new Error("useMyContextController must inside in MyContextControllerProvider");
  }
  return context;
};

// Định nghĩa các action
const login = async (dispatch, email, password) => {
  try {
    // Xác thực với Firebase Authentication
    const response = await auth().signInWithEmailAndPassword(email, password);
    const uid = response.user.uid;

    // Lấy thông tin user từ Firestore dựa trên uid
    const userDoc = await firestore().collection("USERS").doc(uid).get();
    if (userDoc.exists) {
      const userData = userDoc.data();
      const userInfo = {
        uid: uid,
        email: userData.email || email,
        role: userData.role || "customer", // Giả định role mặc định là "customer"
        fullName: userData.fullName || "Unknown",
      };
      dispatch({ type: "USER_LOGIN", value: userInfo });
    } else {
      throw new Error("Không tìm thấy thông tin user trong Firestore.");
    }
  } catch (error) {
    console.log("Lỗi đăng nhập:", error.message);
    Alert.alert("Lỗi đăng nhập", error.message || "Sai email hoặc mật khẩu.");
  }
};

const logout = (dispatch) => {
  auth()
    .signOut()
    .then(() => dispatch({ type: "LOGOUT" }))
    .catch((error) => Alert.alert("Lỗi đăng xuất", error.message));
};

export {
  MyContextControllerProvider,
  useMyContextController,
  login,
  logout,
};