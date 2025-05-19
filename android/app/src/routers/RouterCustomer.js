import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CustomerManagement from "../screens/CustomerManagement";
import AddNewCustomer from "../screens/AddNewCustomer";
import CustomerDetail from "../screens/CustomerDetail";
import EditCustomer from "../screens/EditCustomer";

const Stack = createNativeStackNavigator();

const RouterCustomer = () => {
  return (
    <Stack.Navigator
      initialRouteName="CustomerManagement"
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
        name="CustomerManagement"
        component={CustomerManagement}
        options={{ title: 'Quản lý khách hàng' }}
      />
      <Stack.Screen name="AddNewCustomer" component={AddNewCustomer} options={{
        title: 'Thêm khách hàng',
        headerTitleStyle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',},}}/>
      <Stack.Screen name="CustomerDetail" component={CustomerDetail} options={{
        title: 'Thông tin khách hàng',
        headerTitleStyle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',},}}/>
      <Stack.Screen name="EditCustomer" component={EditCustomer} options={{
        title: 'Cập nhật thông tin',
        headerTitleStyle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',},}}/>
    </Stack.Navigator>
  );
};

export default RouterCustomer;