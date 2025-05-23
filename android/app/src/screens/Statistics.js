import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from "react-native";
import firestore from "@react-native-firebase/firestore";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

const Statistics = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBikes: 0,
    totalStations: 0,
    totalTransactions: 0,
    todayTransactions: 0,
    totalRevenue: 0,
    topStation: "-",
    transactionsByDay: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const last7Days = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d;
      });

      const [users, bikes, stations, transactions] = await Promise.all([
        firestore().collection("USERS").get(),
        firestore().collection("BIKES").get(),
        firestore().collection("STATIONS").get(),
        firestore().collection("TRANSACTIONS").get(),
      ]);

      let revenue = 0;
      let todayCount = 0;
      const stationCount = {};
      const dailyCounts = Array(7).fill(0);

      transactions.forEach(doc => {
        const data = doc.data();
        const date = data.createdAt?.toDate?.() || new Date(data.createdAt);

        if (date >= startOfToday) todayCount++;
        if (typeof data.totalPrice === "number") revenue += data.totalPrice;

        const stationId = data.stationId;
        if (stationId) stationCount[stationId] = (stationCount[stationId] || 0) + 1;

        const diff = Math.floor((new Date() - date) / (1000 * 60 * 60 * 24));
        if (diff < 7) dailyCounts[6 - diff]++;
      });

      let topStationId = Object.keys(stationCount).sort((a, b) => stationCount[b] - stationCount[a])[0];
      let topStation = "-";
      if (topStationId) {
        const doc = await firestore().collection("STATIONS").doc(topStationId).get();
        if (doc.exists) topStation = doc.data().stationName;
      }

      setStats({
        totalUsers: users.size,
        totalBikes: bikes.size,
        totalStations: stations.size,
        totalTransactions: transactions.size,
        todayTransactions: todayCount,
        totalRevenue: revenue,
        topStation,
        transactionsByDay: dailyCounts,
      });

      setLoading(false);
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={{ marginTop: 10 }}>Đang tải thống kê...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
        
      <View style={styles.chartContainer}>
        <Text style={styles.cardTitle}>📈 Giao dịch 7 ngày qua</Text>
        <LineChart
          data={{
            labels: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
            datasets: [{ data: stats.transactionsByDay }],
          }}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            backgroundColor: "#e8f5e9",
            backgroundGradientFrom: "#e8f5e9",
            backgroundGradientTo: "#e8f5e9",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(56, 142, 60, ${opacity})`,
            labelColor: () => "#555",
          }}
          style={{ marginVertical: 10, borderRadius: 12 }}
        />
      </View>

      <View style={styles.row}>
        <StatCard title="Người dùng" value={stats.totalUsers-1} icon="👤" />
        <StatCard title="Xe đạp" value={stats.totalBikes} icon="🚲" />
      </View>

      <View style={styles.row}>
        <StatCard title="Trạm" value={stats.totalStations} icon="🏙️" />
        <StatCard title="Giao dịch" value={stats.totalTransactions} icon="📁" />
      </View>

      <View style={styles.row}>
        <StatCard title="Hôm nay" value={stats.todayTransactions} icon="📅" />
        <StatCard
          title="Doanh thu"
          value={stats.totalRevenue.toLocaleString("vi-VN") + " VNĐ"}
          icon="💰"
        />
      </View>

      <View style={styles.fullWidthCard}>
        <Text style={styles.cardTitle}>📍 Trạm phổ biến: {stats.topStation}</Text>
      </View>
    </ScrollView>
  );
};

const StatCard = ({ title, value, icon }) => (
  <View style={styles.card}>
    <Text style={styles.cardIcon}>{icon}</Text>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardValue}>{value}</Text>
  </View>
);

export default Statistics;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#E8F5E9",
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 20,
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginHorizontal: 5,
    alignItems: "center",
    elevation: 3,
  },
  fullWidthCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginVertical: 10,
    elevation: 3,
  },
  cardIcon: {
    fontSize: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#388E3C",
    marginVertical: 6,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  chartContainer: {
    marginTop: 20,
    alignItems: "center",
  },
});
