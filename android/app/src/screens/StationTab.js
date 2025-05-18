import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";

const StationTab = () => (
  <View style={styles.container}>
    <Text style={styles.tabTitle}>Trạm xe</Text>
    <Text>Danh sách trạm xe sẽ hiển thị tại đây.</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#E8F5E9",
  },
  tabTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 20,
  },
});

export default StationTab;