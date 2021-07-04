import { combineReducers } from 'redux';

const INITIAL_STATE = {
  balance: 0,
  transactions: [],
  tu: 0
};

const allReducer = (state = INITIAL_STATE, action) => {
    let state_prime = Object.assign({}, state)
  switch (action.type) {
    case 'ADD_TRANSACTION':
        state_prime.balance += action.amount 
        state_prime.transactions.unshift({description: action.description, date: Date(), amount: action.amount, sn: action.sn})
        return state_prime
    case 'MINUS_TRANSACTION':
        state_prime.balance -= action.amount 
        state_prime.transactions.unshift({description: action.description, date: Date(), amount: action.amount})
        return state_prime
    case 'RESET': 
        state_prime.balance = 0
        state_prime.transactions = []
        state_prime.tu = 0
        return state_prime
    case 'RESTORE_BACKUP':
      state_prime.balance = action.balance
      state_prime.transactions = action.transactions
      return state_prime
    case 'ADD_TU': 
      state_prime.tu = state_prime.tu + action.tu
      return state_prime
    case 'RESET_TU':
      state_prime.tu = 0
      return state_prime
    default:
      return state
  }
};

export default combineReducers({
  all: allReducer
});