import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { Text, Card, Title, Paragraph, Menu } from "react-native-paper";
import { useRoute, useNavigation } from "@react-navigation/native";
import firestore from "@react-native-firebase/firestore";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const ServiceDetail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { service } = route.params || {};
  const [menuVisible, setMenuVisible] = useState(false);

  // Định dạng ngày tháng
  const formatTimestamp = (timestamp) => {
    if (timestamp) {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    }
    return "Chưa có";
  };

  // Hàm xóa dịch vụ
  const deleteService = async () => {
    try {
      await firestore().collection("SERVICES").doc(service.id).delete();
      Alert.alert("Thành công", "Dịch vụ đã được xóa!");
      navigation.goBack();
    } catch (error) {
      console.log("Lỗi xóa dịch vụ:", error.message);
      Alert.alert("Lỗi", "Không thể xóa dịch vụ. Vui lòng thử lại!");
    }
  };

  // Thêm nút menu vào thanh tiêu đề
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Icon
              name="dots-vertical"
              size={24}
              color="black"
              onPress={() => setMenuVisible(true)}
              style={styles.menuIcon}
            />
          }
        >
          <Menu.Item
            onPress={() => {
              setMenuVisible(false);
              navigation.navigate("EditService", { service });
            }}
            title="Update"
          />
          <Menu.Item
            onPress={() => {
              setMenuVisible(false);
              Alert.alert(
                "Xác nhận",
                "Bạn có chắc chắn muốn xóa dịch vụ này?",
                [
                  { text: "Hủy", style: "cancel" },
                  { text: "Xóa", onPress: deleteService, style: "destructive" },
                ]
              );
            }}
            title="Delete"
          />
        </Menu>
      ),
    });
  }, [navigation, menuVisible]);

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Service detail</Title>
          <Paragraph style={styles.label}>Service name:</Paragraph>
          <Paragraph style={styles.value}>
            {service?.name || "Chưa có tên"}
          </Paragraph>
          <Paragraph style={styles.label}>Price:</Paragraph>
          <Paragraph style={styles.value}>
            {service?.price?.toLocaleString("vi-VN") || "0"} đ
          </Paragraph>
          <Paragraph style={styles.label}>Creator:</Paragraph>
          <Paragraph style={styles.value}>
            {service?.creator || "Chưa có"}
          </Paragraph>
          <Paragraph style={styles.label}>Time:</Paragraph>
          <Paragraph style={styles.value}>
            {formatTimestamp(service?.createdAt) || "Chưa có"}
          </Paragraph>
          <Paragraph style={styles.label}>Final update:</Paragraph>
          <Paragraph style={styles.value}>
            {formatTimestamp(service?.finalUpdate) || "Chưa có"}
          </Paragraph>
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
    color: "green",
    marginBottom: 15,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  menuIcon: {
    marginRight: 10,
  },
});

export default ServiceDetail;