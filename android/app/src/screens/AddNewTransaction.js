import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Platform,
} from "react-native";
import firestore from "@react-native-firebase/firestore";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";

const AddNewTransaction = ({ navigation }) => {
  const [bikes, setBikes] = useState([]);
  const [users, setUsers] = useState([]);
  const [stations, setStations] = useState([]);

  const [selectedBike, setSelectedBike] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState("");

  const [stationId, setStationId] = useState("");
  const [stationName, setStationName] = useState("");

  const [totalPrice, setTotalPrice] = useState("");
  const [bikeId, setBikeId] = useState("");
  const [status, setStatus] = useState("");

  const [rentDate, setRentDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(new Date());
  const [showRentPicker, setShowRentPicker] = useState(false);
  const [showReturnPicker, setShowReturnPicker] = useState(false);
  const [calculatedTotal, setCalculatedTotal] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalIcon, setModalIcon] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const bikeSnapshot = await firestore().collection("BIKES").get();
      const userSnapshot = await firestore().collection("USERS").get();
      const stationSnapshot = await firestore().collection("STATIONS").get();

      setBikes(bikeSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setUsers(userSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setStations(stationSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchData();
  }, []);

  useEffect(() => {
    const selected = bikes.find((bike) => bike.name === selectedBike);
    if (selected) {
      setBikeId(selected.id);
      setStationId(selected.stationId || "");
      setTotalPrice(selected.price?.toString() || "");

      const matchedStation = stations.find((s) => s.id === selected.stationId);
      setStationName(matchedStation ? matchedStation.stationName : "");
    } else {
      setBikeId("");
      setStationId("");
      setTotalPrice("");
      setStationName("");
    }
  }, [selectedBike, stations]);

  useEffect(() => {
    const selected = users.find((u) => u.fullName === selectedUser);
    if (selected) {
      setUserEmail(selected.email);
      setUserId(selected.id);
    } else {
      setUserEmail("");
      setUserId("");
    }
  }, [selectedUser]);

  useEffect(() => {
  if (!totalPrice) {
    setCalculatedTotal("");
    return;
  }

    const oneDay = 24 * 60 * 60 * 1000;
    const start = new Date(rentDate).setHours(0, 0, 0, 0);
    const end = new Date(returnDate).setHours(0, 0, 0, 0);

    let days = Math.round((end - start) / oneDay);
    if (days < 1) days = 1;

    const price = parseFloat(totalPrice);
    const total = price * days;

    setCalculatedTotal(total.toString());
  }, [rentDate, returnDate, totalPrice]);


  const handleSave = async () => {
    if (!bikeId || !selectedBike || !selectedUser || !stationId || !totalPrice || !status) {
      setModalIcon("❗");
      setModalMessage("Vui lòng chọn đầy đủ thông tin.");
      setModalVisible(true);
      return;
    }

    try {
      await firestore().collection("TRANSACTIONS").add({
        bikeId,
        bikeName: selectedBike,
        userEmail,
        userId,
        stationId,
        totalPrice: parseFloat(calculatedTotal),
        rentDate,
        returnDate,
        status,
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });

      setModalIcon("✅");
      setModalMessage("Giao dịch đã được thêm thành công!");
      setModalVisible(true);
      setTimeout(() => {
        setModalVisible(false);
        navigation.goBack();
      }, 2000);
    } catch (error) {
      setModalIcon("⚠️");
      setModalMessage("Đã xảy ra lỗi khi lưu.");
      setModalVisible(true);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Chọn xe</Text>
      <View style={styles.picker}>
        <Picker
          selectedValue={selectedBike}
          onValueChange={(value) => setSelectedBike(value)}
        >
          <Picker.Item label="-- Chọn xe --" value="" />
          {bikes.map((bike) => (
            <Picker.Item key={bike.id} label={bike.name} value={bike.name} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Trạm</Text>
      <TextInput style={styles.input} value={stationName} editable={false} />

      <Text style={styles.label}>Giá thuê</Text>
      <TextInput style={styles.input} value={totalPrice} editable={false} />

      <Text style={styles.label}>Khách hàng</Text>
      <View style={styles.picker}>
        <Picker
          selectedValue={selectedUser}
          onValueChange={(value) => setSelectedUser(value)}
        >
          <Picker.Item label="-- Chọn khách hàng --" value="" />
          {users.map((user, index) => (
            <Picker.Item key={index} label={user.fullName} value={user.fullName} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Email khách hàng</Text>
      <TextInput style={styles.input} value={userEmail} editable={false} />

      <Text style={styles.label}>Trạng thái giao dịch</Text>
      <View style={styles.picker}>
        <Picker
          selectedValue={status}
          onValueChange={(value) => setStatus(value)}
        >
          <Picker.Item label="-- Chọn trạng thái --" value="" />
          <Picker.Item label="Hoàn thành" value="Hoàn thành" />
          <Picker.Item label="Đã xác nhận" value="Đã xác nhận" />
          <Picker.Item label="Yêu cầu trả" value="Yêu cầu trả" />
          <Picker.Item label="Đã hủy" value="Đã hủy" />
        </Picker>
      </View>

      <Text style={styles.label}>Ngày thuê</Text>
      <TouchableOpacity
        onPress={() => setShowRentPicker(true)}
        style={styles.dateButton}
      >
        <Text style={styles.dateButtonText}>{rentDate.toLocaleDateString()}</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Ngày trả</Text>
      <TouchableOpacity
        onPress={() => setShowReturnPicker(true)}
        style={styles.dateButton}
      >
        <Text style={styles.dateButtonText}>{returnDate.toLocaleDateString()}</Text>
      </TouchableOpacity>

      {showRentPicker && (
        <DateTimePicker
          value={rentDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowRentPicker(Platform.OS === "ios");
            if (selectedDate) setRentDate(selectedDate);
          }}
        />
      )}

      {showReturnPicker && (
        <DateTimePicker
          value={returnDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowReturnPicker(Platform.OS === "ios");
            if (selectedDate) setReturnDate(selectedDate);
          }}
        />
      )}

      <Text style={styles.label}>Tổng tiền (VNĐ)</Text>
        <TextInput style={styles.input} value={calculatedTotal} editable={false} />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Lưu giao dịch</Text>
      </TouchableOpacity>

      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={{ fontSize: 36, marginBottom: 10 }}>{modalIcon}</Text>
            <Text style={{ textAlign: "center" }}>{modalMessage}</Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default AddNewTransaction;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 12,
    color: "#4E342E",
  },
  input: {
    borderWidth: 1,
    borderColor: "#BDBDBD",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#e0e0e0",
    marginTop: 4,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#BDBDBD",
    borderRadius: 8,
    backgroundColor: "#fff",
    marginTop: 4,
  },
  dateButton: {
    marginTop: 6,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#BDBDBD",
  },
  dateButtonText: {
    color: "#333",
  },
  saveButton: {
    backgroundColor: "#388E3C",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "#00000099",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    minWidth: "70%",
    alignItems: "center",
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: "#388E3C",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
