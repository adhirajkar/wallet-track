import { SummaryType, TransactionType } from "@/types"
import React, { useCallback } from "react"
import { useState } from "react"
import { Alert } from "react-native"

const API_URL = 'http://localhost:8000/api'
export const useTransactions = (userId:string) => {
    const [summary, setSummary] = useState<SummaryType>({
        balance:0,
        income:0,
        expenses:0
    })
    const [transactions, setTransactions] = useState<TransactionType[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    const getSummary = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/transactions/summary/${userId}`)
            const data = await response.json()
            setSummary(data)
        } catch (error) {
            console.error('Error fetching summary',error)
        }
    },[userId])

    const fetchTransactions = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/transactions/${userId}`)
            const data = await response.json()
            setTransactions(data)
        } catch (error) {
            console.error('Error fetching transactions',error)
        }
    },[userId])

    const loadData = useCallback(async () => {
        if(!userId) return
        setLoading(true)
        try {
            await Promise.all([getSummary(),fetchTransactions()])
        } catch (error) {
            console.error('Error loading data',error)
        }finally{
            setLoading(false)
        }
    },[getSummary,fetchTransactions, userId])

    const deleteTransaction = useCallback(async (id:string) => {
        try {
            const response = await fetch(`${API_URL}/transactions/${id}`,{
                method:'DELETE'
            })
            if(!response.ok){
                throw new Error('Failed to delete transaction')
            }
            await loadData()
            Alert.alert('Success', 'Transaction deleted successfully')
        } catch (error:any) {
            console.error('Error deleting transaction',error)
            Alert.alert('Error', error.message)
        }
    },[loadData])

    return {
        loadData,
        deleteTransaction,
        summary,
        transactions,
        loading
    }
}