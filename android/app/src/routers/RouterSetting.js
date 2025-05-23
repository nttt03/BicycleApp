import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Setting from '../screens/Setting';
import Statistics from '../screens/Statistics';
import Reports from '../screens/Reports';
import UpdateInfo from '../screens/UpdateInfo';
import ChangePassword from '../screens/ChangePassword';

const Stack = createNativeStackNavigator();

const RouterSetting = () => {
  return (
    <Stack.Navigator
      initialRouteName="Setting"
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
        name="Setting"
        component={Setting}
        options={{ title: 'Cài đặt hệ thống' }}
      />
      <Stack.Screen
        name="Statistics"
        component={Statistics}
        options={{
          title: 'Thống kê',
          headerTitleStyle: {
            fontSize: 22,
            fontWeight: 'bold',
            color: 'white',
          },
        }}
      />
      <Stack.Screen
        name="Reports"
        component={Reports}
        options={{
          title: '',
          headerTitleStyle: {
            fontSize: 22,
            fontWeight: 'bold',
            color: 'white',
          },
        }}
      />
      <Stack.Screen
        name="UpdateInfo"
        component={UpdateInfo}
        options={{ headerShown: false }}
        
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{
          title: 'Đổi mật khẩu',
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

export default RouterSetting;
