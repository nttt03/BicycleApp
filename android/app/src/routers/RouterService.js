// import { createStackNavigator } from "@react-navigation/native-stack";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Services from "../screens/Services";
import AddNewService from "../screens/AddNewService";
import ServiceDetail from "../screens/ServiceDetail";
import { IconButton } from "react-native-paper";
import { useMyContextController } from '../store';

const Stack = createNativeStackNavigator();

const RouterService = () => {
  const [controller, dispatch] = useMyContextController();
  const { userLogin } = controller;

  return (
    <Stack.Navigator
      initialRouteName="Services"
      screenOptions={{
        title: (userLogin?.name),
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: "pink",
        },
        headerRight: (props) => (
          <IconButton
            icon="account"
            onPress={() => {}}
          />
        ),
      }}
    >
      <Stack.Screen name="Services" component={Services} />
      <Stack.Screen name="AddNewService" component={AddNewService} />
      <Stack.Screen name="ServiceDetail" component={ServiceDetail} />
    </Stack.Navigator>
  );
};

export default RouterService;