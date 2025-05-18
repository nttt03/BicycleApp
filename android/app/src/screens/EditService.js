import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { Text, Card, Title, TextInput, Button } from "react-native-paper";
import { useRoute, useNavigation } from "@react-navigation/native";
import firestore from "@react-native-firebase/firestore";

const EditService = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { service } = route.params || {};
  const [name, setName] = useState(service?.name || "");
  const [price, setPrice] = useState(service?.price?.toString() || "");

  // Hàm cập nhật dịch vụ
  const updateService = async () => {
    if (!name || !price) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const priceNum = parseInt(price, 10);
    if (isNaN(priceNum) || priceNum < 0) {
      Alert.alert("Lỗi", "Giá phải là số dương!");
      return;
    }

    try {
      await firestore()
        .collection("SERVICES")
        .doc(service.id)
        .update({
          name,
          price: priceNum,
          finalUpdate: firestore.FieldValue.serverTimestamp(),
        });
      Alert.alert("Thành công", "Dịch vụ đã được cập nhật!");
      navigation.goBack();
    } catch (error) {
      console.log("Lỗi cập nhật dịch vụ:", error.message);
      Alert.alert("Lỗi", "Không thể cập nhật dịch vụ. Vui lòng thử lại!");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Service</Title>
          <TextInput
            label="Service name *"
            value={name}
            onChangeText={setName}
            style={styles.input}
            mode="outlined"
          />
          <TextInput
            label="Price *"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            style={styles.input}
            mode="outlined"
          />
          <Button
            mode="contained"
            onPress={updateService}
            style={styles.button}
            labelStyle={styles.buttonLabel}
          >
            Update
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  card: {
    margin: 10,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ff4081",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    backgroundColor: "#ff4081",
  },
  buttonLabel: {
    color: "#fff",
    fontSize: 16,
  },
});

export default EditService;