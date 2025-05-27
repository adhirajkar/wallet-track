import express from "express";
import { sql } from "../config/db.js";

const router = express.Router()


router.post('/', async (req,res)=>{
    try {
        const {user_id,title,amount,category} = req.body
        if(!user_id || !title || amount==undefined || !category){
            return res.status(400).json({message:"All fields are required"})
        }
        const transaction = await sql`INSERT INTO transactions (user_id,title,amount,category) 
        VALUES (${user_id},${title},${amount},${category})
        RETURNING *`
        return res.status(201).json(transaction[0])
    } catch (error) {
        console.error(error)
        return res.status(500).json({message:"Internal server error"})
    }
})

router.get('/:userId', async (req,res)=>{
    try {
        const {userId} = req.params;    
        if(!userId){
            return res.status(400).json({message:"User ID is required"})
        }
        const transactions = await sql`SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC`
        return res.status(200).json(transactions)
    } catch (error) {
        console.error(error)
        return res.status(500).json({message:"Internal server error"})
    }
})

router.delete('/:id', async (req,res)=>{
    try {
        const {id} = req.params;
        if(!id){
            return res.status(400).json({message:"Transaction ID is required"})
        }
        if(isNaN(id)){
            return res.status(400).json({message:"Transaction ID must be a number"})
        }
       
        const transaction = await sql`DELETE FROM transactions WHERE id = ${id} RETURNING *`
        if(transaction.length === 0){
            return res.status(404).json({message:"Transaction not found"})
        }
        return res.status(200).json({message:"Transaction deleted successfully"})
    } catch (error) {
        console.error(error)
        return res.status(500).json({message:"Internal server error"})
    }
})

router.get('/summary/:userId', async (req,res)=>{
    try {
        const {userId} = req.params;
        if(!userId){
            return res.status(400).json({message:"User ID is required"})
        }
        const balance  = await sql`SELECT COALESCE(SUM(amount),0)
        as balance FROM transactions WHERE user_id = ${userId}`
        const income = await sql`SELECT COALESCE(SUM(amount),0)
        as income FROM transactions WHERE user_id = ${userId} 
        AND amount > 0`
        const expense = await sql`SELECT COALESCE(SUM(amount),0)
        as expense FROM transactions WHERE user_id = ${userId}
        AND amount < 0`

        res.status(200).json({
            balance: balance[0].balance,
            income: income[0].income,
            expense: expense[0].expense
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({message:"Internal server error"})
    }
})

export default router;