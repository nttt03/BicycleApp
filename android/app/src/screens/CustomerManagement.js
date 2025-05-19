import React, { useEffect, useState } from "react";
import {
  Image,
  View,
  FlatList,
  StyleSheet,
  Pressable,
  TextInput,
} from "react-native";
import { Text, IconButton } from "react-native-paper";
import firestore from "@react-native-firebase/firestore";

const CustomerManagement = ({ navigation }) => {
  const [customers, setCustomers] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const unsubscribe = firestore()
      .collection("USERS")
      .where("role", "==", "customer")
      .onSnapshot(
        (querySnapshot) => {
          const customerList = [];
          querySnapshot.forEach((doc) => {
            customerList.push({ id: doc.id, ...doc.data() });
          });
          setCustomers(customerList);
        },
        (error) => {
          console.log("Lỗi lấy khách hàng:", error.message);
        }
      );

    return () => unsubscribe();
  }, []);

  const filteredCustomers = customers.filter((item) => {
    const text = searchText.toLowerCase();
    return (
      item.fullName?.toLowerCase().includes(text) ||
      item.phone?.toLowerCase().includes(text) ||
      item.gender?.toLowerCase().includes(text)
    );
  });

  const renderCustomerItem = ({ item }) => {
    const avatarSource =
      item.gender === "Nữ"
        ? require("../assets/avatar_female.png")
        : require("../assets/avatar_male.png");

    return (
      <Pressable
        style={({ pressed }) => [
          styles.customerItem,
          {
            backgroundColor: pressed ? "#DCEDC8" : "#F1F8E9",
          },
        ]}
        onPress={() => navigation.navigate("CustomerDetail", { customer: item })}
      >
        <Image
          source={avatarSource}
          style={styles.avatar}
          resizeMode="cover"
        />
        <View style={styles.customerInfo}>
          <Text style={styles.customerName}>{item.fullName}</Text>
          <Text style={styles.customerText}>Số điện thoại: {item.phone}</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm theo tên, giới tính, SĐT"
          value={searchText}
          onChangeText={setSearchText}
        />
        <IconButton
          icon="plus-circle"
          iconColor="#388E3C"
          size={32}
          onPress={() => navigation.navigate("AddNewCustomer")}
        />
      </View>

      <FlatList
        data={filteredCustomers}
        renderItem={renderCustomerItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 90, paddingTop: 5 }}
      />
    </View>
  );
};

export default CustomerManagement;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 20, 
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: "#C5E1A5",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: "#F1F8E9",
    marginRight: 10,
  },
  customerItem: {
    flexDirection: "row",
    padding: 15,
    marginVertical: 6, // nhỏ lại
    backgroundColor: "#F1F8E9",
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#C5E1A5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  customerInfo: {
    flex: 1,
    justifyContent: "center",
  },
  customerName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#388E3C",
    marginBottom: 4,
  },
  customerText: {
    fontSize: 15,
    color: "#424242",
    marginBottom: 2,
  },
});