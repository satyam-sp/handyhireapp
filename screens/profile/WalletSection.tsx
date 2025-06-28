import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';

const WalletScreen = () => {
  const [balance, setBalance] = useState(1500);
  const [transactions, setTransactions] = useState([
    { id: '1', type: 'Credit', amount: 500, method: 'GPay', date: '2025-04-20' },
    { id: '2', type: 'Debit', amount: 300, method: 'Paytm', date: '2025-04-22' },
  ]);

  const addMoney = (amount: number) => {
    const options: any = {
      description: 'Add to Wallet',
      currency: 'INR',
      key: 'rzp_test_wzBsmFpkLhIgun', // Replace with your Razorpay key
      amount: amount * 100,
      name: 'HandyHire Wallet',
      prefill: {
        email: 'user@example.com',
        contact: '9340081847',
        name: 'Ravi Kumar',
      },
      method: {
        upi: true,  // 🔥 enable UPI apps (PhonePe, GPay, Paytm will show automatically)
        card: true, // if you want to allow card payment also
        netbanking: true // optional
      },
      external: {
        wallets: ['paytm', 'phonepe', 'googlepay']
      },
      theme: { color: '#f8e71c' }
    };

    RazorpayCheckout.open(options)
      .then(data => {
        setBalance(prev => prev + amount);
        setTransactions(prev => [
          { id: Date.now().toString(), type: 'Credit', amount, method: 'Razorpay', date: new Date().toISOString().slice(0, 10) },
          ...prev
        ]);
        Alert.alert('Success', 'Amount added to wallet');
      })
      .catch(error => {
        Alert.alert('Failed', 'Transaction failed');
      });
  };

  const withdrawMoney = async (amount: number) => {
    if (amount > balance) {
      Alert.alert('Insufficient Balance');
      return;
    }

    setBalance(prev => prev - amount);

    // try {
    // const response = await axios.post('https://your-api.com/wallet/withdraw', {
    //     user_id: 1,
    //     amount: amount,
    // });

    // if (response.data.message) {
    //     Alert.alert('Withdrawal successful!');
    // }
    // } catch (error) {
    //     Alert.alert('error', error.response?.data?.error || 'Withdrawal failed');
    // }
      
    setTransactions(prev => [
      { id: Date.now().toString(), type: 'Debit', amount, method: 'UPI Transfer', date: new Date().toISOString().slice(0, 10) },
      ...prev
    ]);
    Alert.alert('Success', 'Withdraw request initiated');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.balanceLabel}>Wallet Balance</Text>
      <Text style={styles.balance}>₹{balance}</Text>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.button} onPress={() => addMoney(100)}>
          <Text style={styles.buttonText}>Add ₹100</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => withdrawMoney(300)}>
          <Text style={styles.buttonText}>Withdraw ₹300</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.historyLabel}>Transaction History</Text>
      <FlatList
        data={transactions}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.transactionRow}>
            <Text style={styles.transactionText}>{item.type} - ₹{item.amount}</Text>
            <Text style={styles.transactionMeta}>{item.method} | {item.date}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f9f9f9' },
  balanceLabel: { fontSize: 16, color: '#666' },
  balance: { fontSize: 32, fontWeight: 'bold', marginVertical: 12 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20 },
  button: { backgroundColor: '#007bff', padding: 12, borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  historyLabel: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
  transactionRow: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  transactionText: { fontSize: 16 },
  transactionMeta: { fontSize: 12, color: '#666' },
});

export default WalletScreen;
