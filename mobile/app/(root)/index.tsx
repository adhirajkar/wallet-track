import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { FlatList, SafeAreaView } from 'react-native'
import { Text, View, TouchableOpacity } from 'react-native'
import { SignOutButton } from '@/components/SignOutButton'
import { useTransactions } from '@/hooks/useTransactions'
import { useEffect } from 'react'
import {styles} from '@/assets/styles/home.styles'
import { Ionicons } from '@expo/vector-icons'
import { BalanceCard } from '@/components/BalanceCard'
export default function Page() {
  const { user } : any = useUser()
  const router = useRouter()
  const {transactions, summary, loading, loadData, deleteTransaction} = useTransactions(user.id)

  useEffect(() => {
    loadData()
  },[loadData])

  console.log('transactions',transactions)
  console.log('summary',summary)  

  return (
    <SafeAreaView style={styles.container}>
     <View style={styles.content}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>Welcome,</Text>
            <Text style={styles.usernameText}>{user?.emailAddresses?.[0]?.emailAddress.split('@')[0]}</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.addButton} onPress={() => router.push('/(root)/create')}>
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
          <SignOutButton />
        </View>
      </View>
      <BalanceCard summary={summary} />
      <View style={styles.transactionsHeaderContainer}>
        <Text style={styles.headerTitle}>Recent Transactions</Text>
      </View>
     </View>
     <FlatList
     style={styles.transactionsList}
     contentContainerStyle={styles.transactionsListContent}
     data={transactions}
     renderItem={({item}) => (
      <View>
        <Text>{item.title}</Text>
      </View>
     )}
     keyExtractor={(item) => item.id}
     />
    </SafeAreaView>
  )
}