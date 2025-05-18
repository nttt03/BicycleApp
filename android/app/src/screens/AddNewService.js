import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import firestore from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";

const AddNewService = () => {
  const [serviceName, setServiceName] = useState("");
  const [price, setPrice] = useState("");
  const navigation = useNavigation();

  const hasErrorServiceName = () => !serviceName.trim();
  const hasErrorPrice = () => isNaN(price) || parseFloat(price) <= 0;

  const handleAddService = async () => {
    if (hasErrorServiceName() || hasErrorPrice()) {
      Alert.alert("Lỗi", "Vui lòng nhập tên dịch vụ và giá hợp lệ (số lớn hơn 0)!");
      return;
    }

    try {
      const newService = {
        name: serviceName.trim(),
        price: parseFloat(price),
        creator: "Admin", // Có thể thay bằng user hiện tại
        createdAt: firestore.Timestamp.now(),
        finalUpdate: firestore.Timestamp.now(),
      };

      await firestore().collection("SERVICES").add(newService);
      Alert.alert("Thành công", "Dịch vụ đã được thêm!");
      navigation.goBack(); // Quay lại màn hình trước
    } catch (error) {
      console.log("Lỗi thêm dịch vụ:", error.message);
      Alert.alert("Lỗi", "Không thể thêm dịch vụ. Vui lòng thử lại!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Service</Text>
      <TextInput
        label="Service name *"
        value={serviceName}
        onChangeText={setServiceName}
        mode="outlined"
        error={hasErrorServiceName()}
        style={styles.input}
        placeholder="Input a service name"
      />
      <TextInput
        label="Price *"
        value={price}
        onChangeText={setPrice}
        mode="outlined"
        keyboardType="numeric"
        error={hasErrorPrice()}
        style={styles.input}
        placeholder="0"
      />
      <Button
        mode="contained"
        onPress={handleAddService}
        style={styles.button}
        labelStyle={styles.buttonLabel}
      >
        Add
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#ff4081",
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#ff4081",
    paddingVertical: 5,
  },
  buttonLabel: {
    fontSize: 16,
  },
});

export default AddNewService;