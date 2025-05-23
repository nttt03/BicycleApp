import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TransactionManagement from "../screens/TransactionManagement";
import AddNewTransaction from "../screens/AddNewTransaction";
import TransactionDetail from "../screens/TransactionDetail";
import EditTransaction from "../screens/EditTransaction";

const Stack = createNativeStackNavigator();

const RouterTransaction = () => {
  return (
    <Stack.Navigator
      initialRouteName="TransactionManagement"
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
        name="TransactionManagement"
        component={TransactionManagement}
        options={{ title: 'Quản lý giao dịch' }}
      />
      <Stack.Screen
        name="AddNewTransaction"
        component={AddNewTransaction}
        options={{
          title: 'Thêm giao dịch',
          headerTitleStyle: {
            fontSize: 22,
            fontWeight: 'bold',
            color: 'white',
          },
        }}
      />
      <Stack.Screen
        name="TransactionDetail"
        component={TransactionDetail}
        options={{
          title: 'Chi tiết giao dịch',
          headerTitleStyle: {
            fontSize: 22,
            fontWeight: 'bold',
            color: 'white',
          },
        }}
      />
      <Stack.Screen
        name="EditTransaction"
        component={EditTransaction}
        options={{
          title: 'Cập nhật giao dịch',
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

export default RouterTransaction;
