import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Pressable,
  TextInput,
  RefreshControl,
  Modal,
  TouchableOpacity,
} from "react-native";
import { Text, IconButton } from "react-native-paper";
import firestore from "@react-native-firebase/firestore";
import { Picker } from "@react-native-picker/picker";

const TransactionManagement = ({ navigation }) => {
  const [transactions, setTransactions] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [statusFilter, setStatusFilter] = useState("Tất cả");

  const fetchTransactions = async () => {
    try {
      const snapshot = await firestore().collection("TRANSACTIONS").get();
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTransactions(list);
    } catch (error) {
      console.log("Lỗi lấy giao dịch:", error.message);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTransactions();
    setRefreshing(false);
  };

  // const filteredTransactions = transactions.filter((item) => {
  //   const text = searchText.toLowerCase();
  //   return (
  //     item.bikeName?.toLowerCase().includes(text) ||
  //     item.userEmail?.toLowerCase().includes(text)
  //   );
  // });
  const filteredTransactions = transactions.filter((item) => {
    const text = searchText.toLowerCase();
    const matchesText =
        item.bikeName?.toLowerCase().includes(text) ||
        item.userEmail?.toLowerCase().includes(text);
    const matchesStatus =
        statusFilter === "Tất cả" || item.status === statusFilter;

    return matchesText && matchesStatus;
  });


  const getStatusColor = (status) => {
    switch (status) {
      case "Hoàn thành":
      case "Đã xác nhận":
        return "#2E7D32";
      case "Yêu cầu trả":
        return "#FBC02D";
      case "Đã hủy":
        return "#D32F2F";
      default:
        return "#333";
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp?.toDate) return "";
    const date = timestamp.toDate();
    return date.toLocaleString();
  };

  const formatPrice = (price) => {
    if (!price && price !== 0) return "";
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleConfirmReturn = async () => {
    if (!selectedTransaction?.bikeId || !selectedTransaction?.id) return;

    try {
      await firestore().collection("BIKES").doc(selectedTransaction.bikeId).update({
        status: "Có sẵn",
      });

      await firestore().collection("TRANSACTIONS").doc(selectedTransaction.id).update({
        status: "Hoàn thành",
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });

      setModalVisible(false);
      setSelectedTransaction(null);
      onRefresh(); 
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái xe:", error.message);
    }
  };

const renderTransactionItem = ({ item }) => {
  return (
    <Pressable
      onPress={() => navigation.navigate("TransactionDetail", { transaction: item })}
      style={({ pressed }) => [
        styles.itemContainer,
        { backgroundColor: pressed ? "#E8F5E9" : "#F1F8E9" },
      ]}
    >
      {item.status === "Yêu cầu trả" && (
        <IconButton
          icon="alert-circle"
          iconColor="#FFA000"
          size={22}
          style={styles.alertIcon}
          onPress={() => {
            setSelectedTransaction(item);
            setModalVisible(true);
          }}
        />
      )}

      <View style={styles.rowHeader}>
        <IconButton icon="receipt" size={24} iconColor="#2E7D32" />
        <Text style={styles.title}>{item.bikeName}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>👤 Người thuê:</Text>
        <Text style={styles.value}>{item.userEmail}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>🕒 Thuê:</Text>
        <Text style={styles.value}>{formatDate(item.rentDate)}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>🔁 Trả:</Text>
        <Text style={styles.value}>{formatDate(item.returnDate)}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>💰 Tổng tiền:</Text>
        <Text style={styles.value}>{formatPrice(item.totalPrice)} VNĐ</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>📌 Trạng thái:</Text>
        <Text style={[styles.value, { color: getStatusColor(item.status) }]}>
          {item.status}
        </Text>
      </View>
    </Pressable>
  );
};

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm theo tên xe hoặc email"
          value={searchText}
          onChangeText={setSearchText}
        />
        <IconButton icon="refresh" iconColor="#4CAF50" size={28} onPress={onRefresh} />
        <IconButton
          icon="plus-circle"
          iconColor="#388E3C"
          size={32}
          onPress={() => navigation.navigate("AddNewTransaction")}
        />
      </View>
      <View style={styles.filterRow}>
        {/* <Text style={{ marginRight: 10, fontWeight: "bold" }}>Lọc:</Text> */}
        <Picker
            selectedValue={statusFilter}
            onValueChange={(value) => setStatusFilter(value)}
            style={styles.picker}
            dropdownIconColor="#2E7D32"
        >
            <Picker.Item label="Tất cả" value="Tất cả" />
            <Picker.Item label="Hoàn thành" value="Hoàn thành" />
            <Picker.Item label="Đã xác nhận" value="Đã xác nhận" />
            <Picker.Item label="Yêu cầu trả" value="Yêu cầu trả" />
            <Picker.Item label="Đã hủy" value="Đã hủy" />
        </Picker>
        </View> 

      {filteredTransactions.length === 0 ? (
        <View style={{ padding: 20, alignItems: "center" }}>
          <Text style={{ fontSize: 16, color: "#888" }}>
            Không có giao dịch nào để hiển thị.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredTransactions}
          renderItem={renderTransactionItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingHorizontal: 15,
            paddingBottom: 90,
            paddingTop: 5,
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Xác nhận trả xe</Text>
            <Text style={{ textAlign: "center", marginBottom: 20 }}>
              Bạn có chắc muốn xác nhận rằng xe đã được trả?
            </Text>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#4CAF50" }]}
                onPress={handleConfirmReturn}
              >
                <Text style={styles.modalButtonText}>Xác nhận</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#BDBDBD" }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TransactionManagement;

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
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 8,
    },
  picker: {
    flex: 1,
    height: 50,
    color: "#2E7D32",
    backgroundColor: "#F1F8E9",
    borderRadius: 10,
    },
  itemContainer: {
    padding: 15,
    marginVertical: 6,
    backgroundColor: "#F1F8E9",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#AED581",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    position: "relative",
  },
  rowHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2E7D32",
    marginLeft: 6,
  },
  infoRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 4,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#555",
  },
  value: {
    fontSize: 15,
    color: "#333",
    marginLeft: 4,
  },
  alertIcon: {
    position: "absolute",
    top: 6,
    right: 6,
    zIndex: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 25,
    borderRadius: 12,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#333",
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
