import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import firestore from "@react-native-firebase/firestore";
import { Picker } from "@react-native-picker/picker";

const Reports = () => {
  const [modalVisible, setModalVisible] = useState(null);
  const [timeRange, setTimeRange] = useState("month");
  const [reportData, setReportData] = useState({});

  const timeRanges = ["day", "week", "month", "quarter", "year"];

  useEffect(() => {
    if (modalVisible === "revenueTime") fetchRevenueByTime();
    if (modalVisible === "revenueProduct") fetchRevenueByProduct();
    if (modalVisible === "revenueStation") fetchRevenueByStation();
    if (modalVisible === "topUsers") fetchTopUsers();
  }, [modalVisible, timeRange]);

  const filterDate = (timestamp) => {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diff = (now - date) / (1000 * 60 * 60 * 24);

    switch (timeRange) {
      case "day":
        return diff <= 1;
      case "week":
        return diff <= 7;
      case "month":
        return diff <= 30;
      case "quarter":
        return diff <= 90;
      case "year":
        return diff <= 365;
      default:
        return true;
    }
  };

  const fetchRevenueByTime = async () => {
    const trans = await firestore().collection("TRANSACTIONS").get();
    const filtered = trans.docs.filter(doc => filterDate(doc.data().createdAt));
    const total = filtered.reduce((sum, doc) => sum + (doc.data().totalPrice || 0), 0);
    setReportData({ count: filtered.length, total });
  };

  const fetchRevenueByProduct = async () => {
    const trans = await firestore().collection("TRANSACTIONS").get();
    const bikes = await firestore().collection("BIKES").get();

    const bikeMap = {};
    bikes.forEach(doc => (bikeMap[doc.id] = doc.data().name));

    const result = {};
    trans.forEach(doc => {
      const data = doc.data();
      if (!filterDate(data.createdAt)) return;
      const name = bikeMap[data.bikeId] || "Không rõ";
      result[name] = (result[name] || 0) + (data.totalPrice || 0);
    });

    setReportData(result);
  };

  const fetchRevenueByStation = async () => {
    const trans = await firestore().collection("TRANSACTIONS").get();
    const stations = await firestore().collection("STATIONS").get();

    const stationMap = {};
    stations.forEach(doc => (stationMap[doc.id] = doc.data().stationName));

    const result = {};
    trans.forEach(doc => {
      const data = doc.data();
      if (!filterDate(data.createdAt)) return;
      const name = stationMap[data.stationId] || "Không rõ";
      result[name] = (result[name] || 0) + (data.totalPrice || 0);
    });

    setReportData(result);
  };

  const fetchTopUsers = async () => {
    const trans = await firestore().collection("TRANSACTIONS").get();
    const users = await firestore().collection("USERS").get();

    const userMap = {};
    users.forEach(doc => (userMap[doc.id] = doc.data().fullName));

    const result = {};
    trans.forEach(doc => {
      const data = doc.data();
      const name = userMap[data.userId] || "Không rõ";
      result[name] = (result[name] || 0) + 1;
    });

    const sorted = Object.entries(result)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    setReportData(Object.fromEntries(sorted));
  };

  const renderModal = () => {
    if (!modalVisible) return null;

    const entries = Object.entries(reportData || {});
    const totalSum = entries.reduce((sum, [, value]) => sum + value, 0);

    const renderItem = ([label, value], index) => (
      <View
        style={[styles.rowItem, { backgroundColor: index % 2 === 0 ? "#f0f9f0" : "#ffffff" }]}
        key={label}
      >
        <Text style={styles.cellLeft}>{label}</Text>
        <Text style={styles.cellRight}>{value.toLocaleString("vi-VN")}</Text>
        {modalVisible !== "topUsers" && (
          <Text style={styles.cellPercent}>
            ({((value / totalSum) * 100).toFixed(0)}%)
          </Text>
        )}
      </View>
    );

    return (
      <Modal visible={!!modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>📋 Báo cáo: {getModalTitle(modalVisible)}</Text>
            {modalVisible === "revenueTime" && (
              <>
                <Picker
                  selectedValue={timeRange}
                  onValueChange={setTimeRange}
                  style={styles.picker}
                >
                  {timeRanges.map(t => (
                    <Picker.Item label={t.toUpperCase()} value={t} key={t} />
                  ))}
                </Picker>
                <Text style={styles.rowItem}>Số giao dịch: {reportData.count || 0}</Text>
                <Text style={styles.rowItem}>Tổng doanh thu: {reportData.total?.toLocaleString("vi-VN") || 0} VNĐ</Text>
              </>
            )}

            {entries.length > 0 && modalVisible !== "revenueTime" && (
              <>
                <Text style={styles.summaryText}>Phạm vi: {timeRange.toUpperCase()}</Text>
                <Text style={styles.summaryText}>Tổng: {entries.length} mục</Text>
                <ScrollView style={{ marginTop: 10 }}>{entries.map(renderItem)}</ScrollView>
              </>
            )}

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(null)}
            >
              <Text style={styles.closeText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  const getModalTitle = (key) => {
    switch (key) {
      case "revenueTime":
        return "Doanh thu theo giao dịch";
      case "revenueProduct":
        return "Doanh thu theo sản phẩm";
      case "revenueStation":
        return "Doanh thu theo trạm";
      case "topUsers":
        return "Top khách hàng";
      default:
        return "";
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🧾 Báo cáo</Text>
      {renderModal()}
      <ReportButton label="1. Doanh thu theo giao dịch" onPress={() => setModalVisible("revenueTime")} />
      <ReportButton label="2. Doanh thu theo sản phẩm" onPress={() => setModalVisible("revenueProduct")} />
      <ReportButton label="3. Doanh thu theo trạm" onPress={() => setModalVisible("revenueStation")} />
      <ReportButton label="4. Top khách hàng" onPress={() => setModalVisible("topUsers")} />
    </ScrollView>
  );
};

const ReportButton = ({ label, onPress }) => (
  <TouchableOpacity style={styles.reportButton} onPress={onPress}>
    <Text style={styles.reportText}>{label}</Text>
  </TouchableOpacity>
);

export default Reports;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#E8F5E9",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 20,
    textAlign: "center",
  },
  reportButton: {
    backgroundColor: "#A5D6A7",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  reportText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2E7D32",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 12,
  },
  closeButton: {
    backgroundColor: "#388E3C",
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  closeText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  rowItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  cellLeft: {
    flex: 2,
    fontWeight: "500",
    color: "#333",
  },
  cellRight: {
    flex: 2,
    textAlign: "right",
    fontWeight: "bold",
    color: "#2E7D32",
  },
  cellPercent: {
    flex: 1,
    textAlign: "right",
    color: "#888",
    fontSize: 12,
  },
  picker: {
    marginVertical: 10,
    backgroundColor: "#E8F5E9",
    borderRadius: 8,
  },
  summaryText: {
    fontSize: 14,
    color: "#2E7D32",
    fontWeight: "600",
    marginBottom: 6,
  },
});
