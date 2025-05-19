import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const RentedBikes = ({ navigation }) => {
  const [rentedBikes, setRentedBikes] = useState([]);
  const user = auth().currentUser;
  const currentDate = new Date('2025-05-19T10:50:00+07:00'); // Cập nhật thời gian hiện tại: 10:50 AM +07, 19/05/2025

  // Lấy danh sách xe đang thuê từ Firestore
  useEffect(() => {
    if (!user) return;

    const unsubscribe = firestore()
      .collection('TRANSACTION')
      .where('userId', '==', user.uid)
      .where('status', 'in', ['Chờ xác nhận', 'Đã xác nhận']) // Chỉ lấy giao dịch đang thuê
      .onSnapshot((querySnapshot) => {
        const transactions = [];
        querySnapshot.forEach((doc) => {
          transactions.push({ id: doc.id, ...doc.data() });
        });
        setRentedBikes(transactions);
      }, (error) => {
        console.log("Lỗi lấy danh sách xe đang thuê:", error.message);
      });

    return () => unsubscribe();
  }, [user]);

  // Kiểm tra xem giao dịch có thể hủy được không
  const canCancelRent = (item) => {
    return item.status === 'Chờ xác nhận';
  };

  // Kiểm tra xem giao dịch có thể yêu cầu trả được không
  const canRequestReturn = (item) => {
    return item.status === 'Đã xác nhận';
  };

  // Xử lý hủy thuê xe
  const handleCancelRent = (transactionId, bikeName) => {
    Alert.alert(
      "Xác nhận hủy thuê xe",
      `Bạn có chắc chắn muốn hủy thuê xe "${bikeName}" không?`,
      [
        { text: "Không", style: "cancel" },
        {
          text: "Có",
          style: "destructive",
          onPress: async () => {
            try {
              await firestore()
                .collection('TRANSACTION')
                .doc(transactionId)
                .update({
                  status: 'Cancelled',
                  updatedAt: firestore.Timestamp.fromDate(currentDate),
                });
              Alert.alert("Thành công", "Đã hủy thuê xe thành công!");
            } catch (error) {
              console.log("Lỗi hủy thuê xe:", error.message);
              Alert.alert("Lỗi", "Không thể hủy thuê xe. Vui lòng thử lại.");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Xử lý yêu cầu trả xe
  const handleRequestReturn = (transactionId, bikeName) => {
    Alert.alert(
      "Xác nhận yêu cầu trả xe",
      `Bạn có chắc chắn muốn yêu cầu trả xe "${bikeName}" không?`,
      [
        { text: "Không", style: "cancel" },
        {
          text: "Có",
          style: "destructive",
          onPress: async () => {
            try {
              await firestore()
                .collection('TRANSACTION')
                .doc(transactionId)
                .update({
                  status: 'Yêu cầu trả',
                  actualReturnDate: firestore.Timestamp.fromDate(currentDate),
                });
              Alert.alert("Thành công", "Đã gửi yêu cầu trả xe. Vui lòng chờ admin xác nhận!");
            } catch (error) {
              console.log("Lỗi yêu cầu trả xe:", error.message);
              Alert.alert("Lỗi", "Không thể gửi yêu cầu trả xe. Vui lòng thử lại.");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Render mỗi giao dịch thuê xe
  const renderRentedBike = ({ item }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionInfo}>
        <Text style={styles.bikeName}>{item.bikeName}</Text>
        <Text style={styles.detailText}>
          Ngày thuê: {item.rentDate ? new Date(item.rentDate.seconds * 1000).toLocaleDateString() : "Chưa có"}
        </Text>
        <Text style={styles.detailText}>
          Ngày trả: {item.returnDate ? new Date(item.returnDate.seconds * 1000).toLocaleDateString() : "Chưa có"}
        </Text>
        <Text style={styles.detailText}>
          Tổng chi phí: {item.totalPrice ? `${item.totalPrice.toLocaleString("vi-VN")} VNĐ` : "Chưa có"}
        </Text>
        <Text style={[styles.statusText, item.status === 'Đã xác nhận' && { color: '#0288D1' }]}>
          Trạng thái: {item.status}
        </Text>
      </View>
      {canCancelRent(item) ? (
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => handleCancelRent(item.id, item.bikeName)}
        >
          <Text style={styles.cancelButtonText}>Hủy thuê xe</Text>
        </TouchableOpacity>
      ) : canRequestReturn(item) ? (
        <TouchableOpacity
          style={styles.returnButton}
          onPress={() => handleRequestReturn(item.id, item.bikeName)}
        >
          <Text style={styles.returnButtonText}>Yêu cầu trả xe</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh sách xe đang thuê</Text>
      {rentedBikes.length === 0 ? (
        <Text style={styles.emptyText}>Bạn chưa có xe nào đang thuê.</Text>
      ) : (
        <FlatList
          data={rentedBikes}
          renderItem={renderRentedBike}
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
    backgroundColor: "#F5F5F5",
    padding: 20,
  },
  title: {
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
    flexDirection: "row",
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    alignItems: "center",
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
    color: "#D32F2F",
    marginTop: 4,
  },
  cancelButton: {
    backgroundColor: "#D32F2F",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  returnButton: {
    backgroundColor: "#FF9800", // Màu cam cho nút yêu cầu trả xe
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: "#B0BEC5",
    opacity: 0.6,
  },
  cancelButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
  returnButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyText: {
    fontSize: 16,
    color: "#757575",
    textAlign: "center",
    marginTop: 20,
  },
});

export default RentedBikes;