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
export const resetAll = () => (
{
    type: 'RESET'
});