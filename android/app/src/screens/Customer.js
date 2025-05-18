import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import firestore from "@react-native-firebase/firestore";

const Customer = () => {
  const [customers, setCustomers] = useState([]);

  // Lấy dữ liệu khách hàng từ Firestore
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

  // Render mỗi mục khách hàng
  const renderCustomerItem = ({ item }) => (
    <TouchableOpacity style={styles.customerItem}>
      <View style={styles.customerInfo}>
        <Text style={styles.customerName}>{item.fullName}</Text>
        <Text style={styles.customerEmail}>{item.email}</Text>
        <Text style={styles.customerPhone}>{item.phone}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh sách khách hàng</Text>
      <FlatList
        data={customers}
        renderItem={renderCustomerItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 15,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#ff4081",
  },
  listContainer: {
    paddingBottom: 15,
  },
  customerItem: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    elevation: 2,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 18,
    color: "green",
    fontWeight: "bold",
    marginBottom: 5,
  },
  customerEmail: {
    fontSize: 16,
    color: "gray",
    marginBottom: 3,
  },
  customerPhone: {
    fontSize: 16,
    color: "gray",
  },
});

export default Customer;