import { createContext, useContext, useMemo, useReducer } from "react";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { Alert } from "react-native";

const MyContext = createContext();
MyContext.displayName = "vbdvab";

//Dinh nghia reducer
const reducer = (state, action) => {
  switch (action.type) {
    case "USER_LOGIN":
      return { ...state, userLogin: action.value };
    case "LOGOUT":
      return { ...state, userLogin: null };
    default:
      return new Error("Action not found");
      break;
  }
};

//Dinh nghia MyContextControllerProvider
const MyContextControllerProvider = ({ children }) => {
  //Khoi store
  const initialState = {
    userLogin: null,
    services: [],
  };

  const [controller, dispatch] = useReducer(reducer, initialState);
  //phan biet useMemo useEffect
  const value = useMemo(() => [controller, dispatch], [controller, dispatch]);

  return (
    <MyContext.Provider value={value}>
      {children}
    </MyContext.Provider>
  );
};

//Dinh nghia useMyContextController
const useMyContextController = () => {
  const context = useContext(MyContext);
  if (context === null) {
    throw new Error("useMyContextController must inside in MyContextControllerProvider");
  }
  return context;
};

//Dinh nghia cac action
const login = (dispatch, email, password) => {
  auth()
    .signInWithEmailAndPassword(email, password)
    .then((response) => {
      const users = firestore().collection("USERS").doc(email).onSnapshot((u) => {
        dispatch({ type: "USER_LOGIN", value: u.data() });
      });
    })
    .catch((e) => Alert.alert("Sai email va password"));
};

const logout = (dispatch) => {
  auth()
    .signOut()
    .then(() => dispatch({ type: "LOGOUT" }));
};

export {
  MyContextControllerProvider,
  useMyContextController,
  login,
  logout
};