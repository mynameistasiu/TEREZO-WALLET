// centralized configuration/constants for backend

const MEMBERSHIP_FEE = parseInt(process.env.MEMBERSHIP_FEE) || 10000
const WELCOME_BONUS = parseInt(process.env.WELCOME_BONUS) || 64000

const MANUAL_PAYMENT_DETAILS = {
  accountName: process.env.BANK_ACCOUNT_NAME || 'Abubakar Abdullahi',
  bank: process.env.BANK_NAME || 'Opay Bank',
  accountNumber: process.env.BANK_ACCOUNT_NUMBER || '7382948273',
  amount: MEMBERSHIP_FEE,
  instructions:
    'Transfer the required amount to the account above then submit the reference using the app.',
}

module.exports = {
  MEMBERSHIP_FEE,
  WELCOME_BONUS,
  MANUAL_PAYMENT_DETAILS,
}
