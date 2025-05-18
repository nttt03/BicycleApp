import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ListBike from '../screens/ListBike';
import DetailBike from '../screens/DetailBike';
import RentBike from '../screens/RentBike';
import { IconButton } from "react-native-paper";
import { useMyContextController } from '../store';

const Stack = createNativeStackNavigator();

const RouterUser = () => {
  const [controller, dispatch] = useMyContextController();
  const { userLogin } = controller;

  return (
    <Stack.Navigator
      initialRouteName="VELOGO"
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
      <Stack.Screen name="ListBike" component={ListBike} />
      <Stack.Screen name="DetailBike" component={DetailBike} />
      <Stack.Screen name="RentBike" component={RentBike} />
    </Stack.Navigator>
  );
};

export default RouterUser;