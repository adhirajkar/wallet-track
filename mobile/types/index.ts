
export interface SummaryType {
    balance:string,
    income:string,
    expense:string
}

export interface TransactionType {
    id:string,
    user_id:string,
    title:string,
    amount:number,
    category:string,
    created_at:Date,
}