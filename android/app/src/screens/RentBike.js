import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const RentBike = ({ route, navigation }) => {
  const { bike } = route.params;
  const [rentDate, setRentDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(new Date());
  const [showRentPicker, setShowRentPicker] = useState(false);
  const [showReturnPicker, setShowReturnPicker] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const user = auth().currentUser;

  useEffect(() => {
    calculateTotalPrice();
  }, [rentDate, returnDate]);

  const calculateTotalPrice = () => {
    const diffTime = Math.abs(returnDate - rentDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const pricePerDay = bike.price || 0;
    setTotalPrice(diffDays * pricePerDay);
  };

  const onRentDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || rentDate;
    setShowRentPicker(false);
    setRentDate(currentDate);
  };

  const onReturnDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || returnDate;
    setShowReturnPicker(false);
    setReturnDate(currentDate);
  };

//   const handleRent = async () => {
//     if (!user) {
//       Alert.alert("Lỗi", "Vui lòng đăng nhập để thuê xe.");
//       return;
//     }

//     Alert.alert(
//       "Xác nhận thuê xe",
//       `Bạn có chắc muốn thuê xe này không? Tổng chi phí: ${totalPrice.toLocaleString("vi-VN")} VNĐ`,
//       [
//         { text: "Không", style: "cancel" },
//         {
//           text: "Có",
//           onPress: async () => {
//             try {
//               await firestore()
//                 .collection('TRANSACTION')
//                 .add({
//                   userId: user.uid,
//                   userEmail: user.email,
//                   bikeId: bike.id,
//                   bikeName: bike.name,
//                   rentDate: firestore.Timestamp.fromDate(rentDate),
//                   returnDate: firestore.Timestamp.fromDate(returnDate),
//                   totalPrice: totalPrice,
//                   status: 'Đã xác nhận',
//                   createdAt: firestore.Timestamp.now(),
//                 });
//               Alert.alert("Thành công", "Đã đặt thuê xe thành công!");
//                navigation.navigate("RentedBikes");
//             } catch (error) {
//               console.log("Lỗi lưu giao dịch:", error.message);
//               Alert.alert("Lỗi", "Không thể lưu giao dịch. Vui lòng thử lại.");
//             }
//           },
//         },
//       ],
//       { cancelable: true }
//     );
//   };

  const handleRent = async () => {
  if (!user) {
    Alert.alert("Lỗi", "Vui lòng đăng nhập để thuê xe.");
    return;
  }

  Alert.alert(
    "Xác nhận thuê xe",
    `Bạn có chắc muốn thuê xe này không? Tổng chi phí: ${totalPrice.toLocaleString("vi-VN")} VNĐ`,
    [
      { text: "Không", style: "cancel" },
      {
        text: "Có",
        onPress: async () => {
          try {
            // 1. Ghi giao dịch mới
            await firestore()
              .collection('TRANSACTION')
              .add({
                userId: user.uid,
                userEmail: user.email,
                bikeId: bike.id,
                bikeName: bike.name,
                rentDate: firestore.Timestamp.fromDate(rentDate),
                returnDate: firestore.Timestamp.fromDate(returnDate),
                totalPrice: totalPrice,
                status: 'Đã xác nhận',
                createdAt: firestore.Timestamp.now(),
              });

            // 2. Cập nhật status của xe thành "Đang cho thuê"
            await firestore()
              .collection('BIKES')
              .doc(bike.id)
              .update({
                status: 'Đang cho thuê',
              });

            Alert.alert("Thành công", "Đã đặt thuê xe thành công!");
            navigation.navigate("RentedBikes");
          } catch (error) {
            console.log("Lỗi lưu giao dịch:", error.message);
            Alert.alert("Lỗi", "Không thể lưu giao dịch. Vui lòng thử lại.");
          }
        },
      },
    ],
    { cancelable: true }
  );
};


  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>
      <Image source={require("../assets/icons/img_bike.png")} style={styles.bikeImage} />
      <Text style={styles.bikeName}>{bike.name || "Tên xe không xác định"}</Text>
      <Text style={styles.bikeType}>{bike.type || "Loại xe không xác định"}</Text>
      <Text style={styles.bikePrice}>
        Giá thuê: {bike.price ? `${bike.price.toLocaleString("vi-VN")} VNĐ/ngày` : "Chưa có giá"}
      </Text>
      {/* <Text style={styles.dateText}>
        Ngày tạo: {bike.createdAt ? new Date(bike.createdAt.seconds * 1000).toLocaleDateString() : "Chưa có"}
      </Text>
      <Text style={styles.dateText}>
        Ngày cập nhật: {bike.updatedAt ? new Date(bike.updatedAt.seconds * 1000).toLocaleDateString() : "Chưa có"}
      </Text> */}

      <Text style={styles.label}>Chọn ngày thuê:</Text>
      <TouchableOpacity onPress={() => setShowRentPicker(true)} style={styles.datePickerButton}>
        <Text style={styles.dateText}>
          {rentDate.toLocaleDateString()}
        </Text>
      </TouchableOpacity>
      {showRentPicker && (
        <DateTimePicker
          value={rentDate}
          mode="date"
          display="default"
          onChange={onRentDateChange}
          minimumDate={new Date()}
        />
      )}

      <Text style={styles.label}>Chọn ngày trả:</Text>
      <TouchableOpacity onPress={() => setShowReturnPicker(true)} style={styles.datePickerButton}>
        <Text style={styles.dateText}>
          {returnDate.toLocaleDateString()}
        </Text>
      </TouchableOpacity>
      {showReturnPicker && (
        <DateTimePicker
          value={returnDate}
          mode="date"
          display="default"
          onChange={onReturnDateChange}
          minimumDate={new Date(rentDate.getTime() + 24 * 60 * 60 * 1000)}
        />
      )}

      <Text style={styles.totalPrice}>
        Tổng chi phí: {totalPrice.toLocaleString("vi-VN")} VNĐ
      </Text>

      <Button mode="contained" onPress={handleRent} style={styles.rentButton}>
        Thuê xe
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: "#F5F5F5",
  },
  backButton: {
    // padding: 10,
  },
  backText: {
    fontSize: 50,
    color: "#4CAF50",
  },
  bikeImage: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginVertical: 20,
  },
  bikeName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4CAF50",
    textAlign: "center",
  },
  bikeType: {
    fontSize: 16,
    color: "#757575",
    textAlign: "center",
    marginVertical: 5,
  },
  bikePrice: {
    fontSize: 16,
    color: "#4CAF50",
    textAlign: "center",
  },
  dateText: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
    marginVertical: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 15,
  },
  datePickerButton: {
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    alignItems: "center",
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "600",
    color: "#D32F2F",
    textAlign: "center",
    marginVertical: 20,
  },
  rentButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: 10,
  },
});

export default RentBike;