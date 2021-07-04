export const newTransactionAdd = (description, amount, sn) => (
    {
      type: 'ADD_TRANSACTION',
      description: description, 
      amount: amount,
      sn: sn
    }
  );
export const newTransactionMinus = (description, amount) => (
{
    type: 'MINUS_TRANSACTION',
    description: description,
    amount: amount
});
export const restoreBackup = (balance, transactions) => ({
  type: 'RESTORE_BACKUP',
  balance: balance,
  transactions: transactions
});
export const addAccumulatedTU = (tu) => ({
  type: 'ADD_TU',
  tu: tu
});
export const resetAccumulatedTU = () => ({
  type: 'RESET_TU'
});
export const resetAll = () => (
{
    type: 'RESET'
});