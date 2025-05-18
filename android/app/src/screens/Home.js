import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import HomeTab from "./HomeTab";
import ListBike from "./ListBike";
import StationTab from "./StationTab";
import HistoryTab from "./HistoryTab";
import MoreTab from "./MoreTab";

const Tab = createMaterialBottomTabNavigator();

const Home = () => (
  <Tab.Navigator
    activeColor="#4CAF50"
    inactiveColor="#757575"
    barStyle={{ backgroundColor: "#E8F5E9" }}
  >
    <Tab.Screen
      name="HomeTab"
      component={HomeTab}
      options={{
        title: "Trang chủ",
        tabBarIcon: "home",
      }}
    />
    <Tab.Screen
      name="StationTab"
      component={StationTab}
      options={{
        title: "Trạm xe",
        tabBarIcon: "map-marker",
      }}
    />
    <Tab.Screen
      name="HistoryTab"
      component={HistoryTab}
      options={{
        title: "Lịch sử",
        tabBarIcon: "history",
      }}
    />
    <Tab.Screen
      name="MoreTab"
      component={MoreTab}
      options={{
        title: "Mở rộng",
        tabBarIcon: "menu",
      }}
    />
  </Tab.Navigator>
);

export default Home;