import { combineReducers } from 'redux';

const INITIAL_STATE = {
  balance: 0,
  transactions: [],
};

const allReducer = (state = INITIAL_STATE, action) => {
    let state_prime = Object.assign({}, state)
  switch (action.type) {
    case 'ADD_TRANSACTION':
        state_prime.balance += action.amount 
        state_prime.transactions.unshift({description: action.description, date: Date(), amount: action.amount})
        return state_prime
    case 'MINUS_TRANSACTION':
        state_prime.balance -= action.amount 
        state_prime.transactions.unshift({description: action.description, date: Date(), amount: action.amount})
        return state_prime
    default:
      return state
  }
};

export default combineReducers({
  all: allReducer
});