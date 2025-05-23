import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const RentedBikes = ({ navigation }) => {
  const [rentedBikes, setRentedBikes] = useState([]);
  const user = auth().currentUser;
  const currentDate = new Date('2025-05-20T17:12:00+07:00');

  const openMapWithAddress = (address) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    Linking.openURL(url).catch((err) => console.error('Không thể mở bản đồ:', err));
  };

  useEffect(() => {
    if (!user) return;

    const unsubscribe = firestore()
      .collection('TRANSACTIONS')
      .where('userId', '==', user.uid)
      .where('status', 'in', ['Đã xác nhận', 'Yêu cầu trả'])
      .onSnapshot(async (querySnapshot) => {
        const transactions = [];

        for (const doc of querySnapshot.docs) {
          const data = doc.data();
          let stationData = { stationName: 'Không rõ', address: 'Không rõ' };

          if (data.stationId) {
            try {
              const stationDoc = await firestore().collection('STATIONS').doc(data.stationId).get();
              if (stationDoc.exists) {
                stationData = stationDoc.data();
              }
            } catch (error) {
              console.log('Lỗi lấy thông tin trạm:', error.message);
            }
          }

          transactions.push({
            id: doc.id,
            ...data,
            bikeId: data.bikeId || null,
            stationName: stationData.stationName || 'Không rõ',
            stationAddress: stationData.address || 'Không rõ',
          });
        }

        setRentedBikes(transactions);
      }, (error) => {
        console.log('Lỗi lấy danh sách xe đang thuê:', error.message);
      });

    return () => unsubscribe();
  }, [user]);

  const handleCancelRent = (transactionId, bikeName, bikeId) => {
    console.log('====> bikeId:', bikeId);

    Alert.alert(
      'Xác nhận hủy thuê xe',
      `Bạn có chắc chắn muốn hủy thuê xe "${bikeName}" không?`,
      [
        { text: 'Không', style: 'cancel' },
        {
          text: 'Có',
          style: 'destructive',
          onPress: async () => {
            try {
              await firestore().collection('TRANSACTIONS').doc(transactionId).update({
                status: 'Đã hủy',
                updatedAt: firestore.Timestamp.fromDate(currentDate),
              });

              if (bikeId) {
                await firestore().collection('BIKES').doc(bikeId).update({
                  status: 'Có sẵn',
                });
              }

              Alert.alert('Thành công', 'Đã hủy thuê xe thành công!');
            } catch (error) {
              console.error('Lỗi hủy thuê xe:', error.message);
              Alert.alert('Lỗi', 'Không thể hủy thuê xe. Vui lòng thử lại.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleRequestReturn = (transactionId, bikeName) => {
    Alert.alert(
      'Xác nhận yêu cầu trả xe',
      `Bạn có chắc chắn muốn yêu cầu trả xe "${bikeName}" không?`,
      [
        { text: 'Không', style: 'cancel' },
        {
          text: 'Có',
          style: 'destructive',
          onPress: async () => {
            try {
              await firestore().collection('TRANSACTIONS').doc(transactionId).update({
                status: 'Yêu cầu trả',
                actualReturnDate: firestore.Timestamp.fromDate(currentDate),
              });
              Alert.alert('Thành công', 'Đã gửi yêu cầu trả xe. Vui lòng chờ admin xác nhận!');
            } catch (error) {
              console.error('Lỗi yêu cầu trả xe:', error.message);
              Alert.alert('Lỗi', 'Không thể gửi yêu cầu trả xe. Vui lòng thử lại.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderRentedBike = ({ item }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionInfo}>
        <Text style={styles.bikeName}>{item.bikeName || 'Tên xe không xác định'}</Text>
        <Text style={styles.detailText}>
          Ngày thuê: {item.rentDate ? new Date(item.rentDate.seconds * 1000).toLocaleDateString() : 'Chưa có'}
        </Text>
        <Text style={styles.detailText}>
          Ngày trả: {item.returnDate ? new Date(item.returnDate.seconds * 1000).toLocaleDateString() : 'Chưa có'}
        </Text>
        <Text style={styles.detailText}>
          Tổng chi phí: {item.totalPrice ? `${item.totalPrice.toLocaleString('vi-VN')} VNĐ` : 'Chưa có'}
        </Text>
        <Text style={styles.detailText}>Tên trạm: {item.stationName}</Text>
        <Text style={styles.detailText}>Địa chỉ: {item.stationAddress}</Text>
        <TouchableOpacity onPress={() => openMapWithAddress(item.stationAddress)} style={{ marginTop: 6 }}>
          <Icon name="map-marker" size={24} color="#0288D1" />
        </TouchableOpacity>
        <Text style={[styles.statusText, item.status === 'Đã xác nhận' && { color: '#0288D1' }]}>
          Trạng thái: {item.status}
        </Text>
      </View>

      {item.status === 'Đã xác nhận' && (
        <View style={{ gap: 8 }}>
          <TouchableOpacity style={styles.cancelButton} onPress={() => handleCancelRent(item.id, item.bikeName, item.bikeId)}>
            <Text style={styles.cancelButtonText}>Hủy thuê xe</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.returnButton} onPress={() => handleRequestReturn(item.id, item.bikeName)}>
            <Text style={styles.returnButtonText}>Yêu cầu trả xe</Text>
          </TouchableOpacity>
        </View>
      )}
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
          contentContainerStyle={styles.transactionContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 20,
  },
  transactionContent: {
    paddingBottom: 20,
  },
  transactionItem: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  transactionInfo: {
    flex: 1,
    marginRight: 10,
  },
  bikeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  detailText: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
  },
  statusText: {
    fontSize: 14,
    color: '#D32F2F',
    marginTop: 4,
  },
  cancelButton: {
    backgroundColor: '#D32F2F',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  returnButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  returnButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default RentedBikes;
