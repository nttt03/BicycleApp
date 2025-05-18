import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BikeManagement from "../screens/BikeManagement";
import AddNewBike from "../screens/AddNewBike";
import BikeDetail from "../screens/BikeDetail";
import EditBike from "../screens/EditBike";

const Stack = createNativeStackNavigator();

const RouterBike = () => {
  return (
    <Stack.Navigator
      initialRouteName="BikeManagement"
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
        name="BikeManagement"
        component={BikeManagement}
        options={{ title: 'Quản lý xe' }}
      />
      <Stack.Screen name="AddNewBike" component={AddNewBike} options={{
        title: 'Thêm xe mới',
        headerTitleStyle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',},}}/>
      <Stack.Screen name="BikeDetail" component={BikeDetail} options={{
        title: 'Thông tin xe',
        headerTitleStyle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',},}}/>
      <Stack.Screen name="EditBike" component={EditBike} options={{
        title: 'Cập nhật thông tin xe',
        headerTitleStyle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',},}}/>
    </Stack.Navigator>
  );
};

export default RouterBike;