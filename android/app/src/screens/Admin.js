import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import RouterBike from "../routers/RouterBike";
import RouterCustomer from "../routers/RouterCustomer";
import RouterStation from "../routers/RouterStation";
import RouterTransaction from "../routers/RouterTransaction";
import Setting from "./Setting";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const Tab = createBottomTabNavigator();

const Admin = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarShowLabel: false,
      tabBarStyle: {
        height: 65,
        backgroundColor: "#E8F5E9", 
        borderTopWidth: 0,
        elevation: 0,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
      },
      tabBarActiveTintColor: "#2E7D32",  
      tabBarInactiveTintColor: "#888888",   
    }}
  >
    <Tab.Screen
      name="RouterCustomer"
      component={RouterCustomer}
      options={{
        tabBarIcon: ({ color, focused }) => (
          <Icon
            name="account-group"
            color={color}
            size={focused ? 34 : 26}
            style={{ marginTop: 6 }}
          />
        ),
      }}
    />
    <Tab.Screen
      name="RouterStation"
      component={RouterStation}
      options={{
        tabBarIcon: ({ color, focused }) => (
          <Icon
            name="map-marker-radius"
            color={color}
            size={focused ? 34 : 26}
            style={{ marginTop: 6 }}
          />
        ),
      }}
    />
    <Tab.Screen
      name="RouterBike"
      component={RouterBike}
      options={{
        tabBarIcon: ({ color, focused }) => (
          <Icon
            name="bike"
            color={color}
            size={focused ? 34 : 30}
            style={{ marginTop: 4 }}
          />
        ),
      }}
    />
    <Tab.Screen
      name="RouterTransaction"
      component={RouterTransaction}
      options={{
        tabBarIcon: ({ color, focused }) => (
          <Icon
            name="cash-multiple"
            color={color}
            size={focused ? 34 : 26}
            style={{ marginTop: 6 }}
          />
        ),
      }}
    />
    <Tab.Screen
      name="Setting"
      component={Setting}
      options={{
        tabBarIcon: ({ color, focused }) => (
          <Icon
            name="cog"
            color={color}
            size={focused ? 34 : 26}
            style={{ marginTop: 6 }}
          />
        ),
      }}
    />
  </Tab.Navigator>
);

export default Admin;