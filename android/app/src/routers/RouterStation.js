import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StationManagement from "../screens/StationManagement";
import AddNewStation from "../screens/AddNewStation";
import StationDetail from "../screens/StationDetail";
import EditStation from "../screens/EditStation";

const Stack = createNativeStackNavigator();

const RouterStation = () => {
  return (
    <Stack.Navigator
      initialRouteName="StationManagement"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#4CAF50',
          height: 50,
        },
        headerTitleStyle: {
          fontSize: 22,
          color: 'white',
          fontWeight: 'bold',
          alignSelf: 'flex-start',
        },
        headerTitleAlign: 'left',
        headerTintColor: 'white',
      }}
    >
      <Stack.Screen
        name="StationManagement"
        component={StationManagement}
        options={{ title: 'Quản lý trạm' }}
      />
      <Stack.Screen
        name="AddNewStation"
        component={AddNewStation}
        options={{
          title: 'Thêm trạm',
          headerTitleStyle: {
            fontSize: 22,
            fontWeight: 'bold',
            color: 'white',
          },
        }}
      />
      <Stack.Screen
        name="StationDetail"
        component={StationDetail}
        options={{
          title: 'Thông tin trạm',
          headerTitleStyle: {
            fontSize: 22,
            fontWeight: 'bold',
            color: 'white',
          },
        }}
      />
      <Stack.Screen
        name="EditStation"
        component={EditStation}
        options={{
          title: 'Cập nhật trạm',
          headerTitleStyle: {
            fontSize: 22,
            fontWeight: 'bold',
            color: 'white',
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default RouterStation;