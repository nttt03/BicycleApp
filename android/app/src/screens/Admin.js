import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import RouterService from "../routers/RouterService";
import Transaction from "./Transaction";
import Customers from "./Customer";
import Setting from "./Setting";

const Tab = createMaterialBottomTabNavigator();

const Admin = () => (
  <Tab.Navigator>
    <Tab.Screen
      name="RouterService"
      component={RouterService}
      options={{
        title: "Home",
        tabBarIcon: "home",
      }}
    />
    <Tab.Screen
      name="Transaction"
      component={Transaction}
      options={{
        tabBarIcon: "cash",
      }}
    />
    <Tab.Screen
      name="Customers"
      component={Customers}
      options={{
        tabBarIcon: "account",
      }}
    />
    <Tab.Screen
      name="Setting"
      component={Setting}
      options={{
        tabBarIcon: "cog",
      }}
    />
  </Tab.Navigator>
);

export default Admin;