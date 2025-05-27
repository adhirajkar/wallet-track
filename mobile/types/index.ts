
export interface SummaryType {
    balance:number,
    income:number,
    expenses:number
}

export interface TransactionType {
    id:string,
    user_id:string,
    title:string,
    amount:number,
    category:string,
    created_at:Date,
}