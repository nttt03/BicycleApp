import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeTab from '../screens/HomeTab';
import DetailBike from '../screens/DetailBike';
import RentBike from '../screens/RentBike';
import RentedBikes from '../screens/RentedBikes';
import { IconButton } from "react-native-paper";
import { useMyContextController } from '../store';

const Stack = createNativeStackNavigator();

const RouterUser = () => {
  const [controller, dispatch] = useMyContextController();
  const { userLogin } = controller;

  return (
    <Stack.Navigator
      initialRouteName="HomeTab"
      screenOptions={{
        title: userLogin?.name,
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: "#F5F5F5",
        },
        
      }}
    >
      <Stack.Screen name="HomeTab" component={HomeTab} options={{ headerShown: false }} />
      <Stack.Screen name="DetailBike" component={DetailBike} options={{ headerShown: false }} />
      <Stack.Screen name="RentBike" component={RentBike} options={{ headerShown: false }} />
      <Stack.Screen name="RentedBikes" component={RentedBikes} />
    </Stack.Navigator>
  );
};

export default RouterUser;