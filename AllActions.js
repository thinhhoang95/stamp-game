export const newTransactionAdd = (description, amount) => (
    {
      type: 'ADD_TRANSACTION',
      description: description, 
      amount: amount
    }
  );
export const newTransactionMinus = (description, amount) => (
{
    type: 'MINUS_TRANSACTION',
    description: description,
    amount: amount
}
);