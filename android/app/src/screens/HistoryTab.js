import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Text as PaperText } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const HistoryTab = () => {
  const [historyBikes, setHistoryBikes] = useState([]);
  const user = auth().currentUser;
  const currentDate = new Date('2025-05-19T11:03:00+07:00'); // Cập nhật thời gian hiện tại: 11:03 AM +07, 19/05/2025

  // Lấy danh sách lịch sử thuê xe từ Firestore
  useEffect(() => {
    if (!user) return;

    const unsubscribe = firestore()
      .collection('TRANSACTION')
      .where('userId', '==', user.uid)
      .where('status', '==', 'Hoàn thành') // Chỉ lấy giao dịch đã hoàn thành
      .onSnapshot((querySnapshot) => {
        const transactions = [];
        querySnapshot.forEach((doc) => {
          transactions.push({ id: doc.id, ...doc.data() });
        });
        setHistoryBikes(transactions);
      }, (error) => {
        console.log("Lỗi lấy lịch sử thuê xe:", error.message);
      });

    return () => unsubscribe();
  }, [user]);

  // Render mỗi giao dịch lịch sử
  const renderHistoryItem = ({ item }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionInfo}>
        <Text style={styles.bikeName}>{item.bikeName || "Tên xe không xác định"}</Text>
        <Text style={styles.detailText}>
          Ngày thuê: {item.rentDate ? new Date(item.rentDate.seconds * 1000).toLocaleDateString() : "Chưa có"}
        </Text>
        <Text style={styles.detailText}>
          Ngày trả: {item.returnDate ? new Date(item.returnDate.seconds * 1000).toLocaleDateString() : "Chưa có"}
        </Text>
        <Text style={styles.detailText}>
          Ngày trả thực tế: {item.actualReturnDate ? new Date(item.actualReturnDate.seconds * 1000).toLocaleDateString() : "Chưa có"}
        </Text>
        <Text style={styles.detailText}>
          Tổng chi phí: {item.totalPrice ? `${item.totalPrice.toLocaleString("vi-VN")} VNĐ` : "Chưa có"}
        </Text>
        <Text style={styles.statusText}>Trạng thái: {item.status}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <PaperText style={styles.tabTitle}>Lịch sử</PaperText>
      {historyBikes.length === 0 ? (
        <Text style={styles.emptyText}>Bạn chưa có lịch sử thuê xe nào.</Text>
      ) : (
        <FlatList
          data={historyBikes}
          renderItem={renderHistoryItem}
          keyExtractor={(item) => item.id}
          style={styles.transactionList}
          contentContainerStyle={styles.transactionContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  tabTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 20,
  },
  transactionList: {
    flex: 1,
  },
  transactionContent: {
    paddingBottom: 20,
  },
  transactionItem: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  transactionInfo: {
    flex: 1,
  },
  bikeName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  detailText: {
    fontSize: 14,
    color: "#333",
    marginTop: 4,
  },
  statusText: {
    fontSize: 14,
    color: "#0288D1", // Màu xanh dương cho trạng thái hoàn thành
    marginTop: 4,
  },
  emptyText: {
    fontSize: 16,
    color: "#757575",
    textAlign: "center",
    marginTop: 20,
  },
});

export default HistoryTab;