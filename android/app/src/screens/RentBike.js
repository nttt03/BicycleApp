import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import MapView, { Marker } from 'react-native-maps';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { ScrollView } from 'react-native';

const RentBike = ({ route, navigation }) => {
  const { bike } = route.params;
  const [stationName, setStationName] = useState('');
  const [stationAddress, setStationAddress] = useState('');
  const [stationLat, setStationLat] = useState(null);
  const [stationLng, setStationLng] = useState(null);
  const [rentDate, setRentDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(new Date());
  const [showRentPicker, setShowRentPicker] = useState(false);
  const [showReturnPicker, setShowReturnPicker] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const user = auth().currentUser;

  useEffect(() => {
    calculateTotalPrice();
  }, [rentDate, returnDate]);

  useEffect(() => {
    const fetchStationInfo = async () => {
      try {
        if (bike.stationId) {
          const stationRef = firestore().collection('STATIONS').doc(bike.stationId);
          const stationDoc = await stationRef.get();

          if (stationDoc.exists) {
            const stationData = stationDoc.data();
            setStationName(stationData.stationName || 'Không rõ');
            setStationAddress(stationData.address || 'Không rõ');
            setStationLat(stationData.latitude);
            setStationLng(stationData.longitude);
          } else {
            console.log('Trạm không tồn tại');
          }
        }
      } catch (error) {
        console.log("Lỗi lấy thông tin trạm:", error.message);
      }
    };

    fetchStationInfo();
  }, [bike]);

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
              await firestore().collection('TRANSACTION').add({
                userId: user.uid,
                userEmail: user.email,
                bikeId: bike.id,
                bikeName: bike.name,
                stationId: bike.stationId,
                rentDate: firestore.Timestamp.fromDate(rentDate),
                returnDate: firestore.Timestamp.fromDate(returnDate),
                totalPrice: totalPrice,
                status: 'Đã xác nhận',
                createdAt: firestore.Timestamp.now(),
              });

              await firestore().collection('BIKES').doc(bike.id).update({
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
  <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
      <Text style={styles.backText}>←</Text>
    </TouchableOpacity>

    <Image source={require("../assets/icons/img_bike.png")} style={styles.bikeImage} />
    <Text style={styles.bikeName}>{bike.name || "Tên xe không xác định"}</Text>
    <Text style={styles.bikeType}>{bike.type || "Loại xe không xác định"}</Text>
    <Text style={styles.bikePrice}>
      Giá thuê: {bike.price ? `${bike.price.toLocaleString("vi-VN")} VNĐ/ngày` : "Chưa có giá"}
    </Text>

    <Text style={styles.label}>Thông tin trạm xe:</Text>
    <Text style={styles.dateText}>Tên trạm: {stationName}</Text>
    <Text style={styles.dateText}>Địa chỉ: {stationAddress}</Text>

    {stationLat !== null && stationLng !== null && (
      <View style={styles.mapContainer}>
        <Text style={styles.label}>Vị trí trạm trên bản đồ:</Text>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: stationLat,
            longitude: stationLng,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
          zoomControlEnabled={true} // chỉ hiệu lực trên Android
          zoomEnabled={true}
          scrollEnabled={true}
          showsUserLocation={true}
        >
          <Marker
            coordinate={{ latitude: stationLat, longitude: stationLng }}
            title={stationName}
            description={stationAddress}
          />
        </MapView>
      </View>
    )}

    {/* Phần chọn ngày thuê */}
    <Text style={styles.label}>Chọn ngày thuê:</Text>
    <TouchableOpacity onPress={() => setShowRentPicker(true)} style={styles.datePickerButton}>
      <Text style={styles.dateText}>{rentDate.toLocaleDateString()}</Text>
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
      <Text style={styles.dateText}>{returnDate.toLocaleDateString()}</Text>
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
  </ScrollView>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: "#F5F5F5",
  },
  backButton: {},
  backText: {
    fontSize: 50,
    color: "#4CAF50",
  },
  bikeImage: {
    width: 100,
    height: 100,
    alignSelf: "center",
    // marginVertical: 20,
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
  mapContainer: {
    height: 200,
    marginTop: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
});

export default RentBike;