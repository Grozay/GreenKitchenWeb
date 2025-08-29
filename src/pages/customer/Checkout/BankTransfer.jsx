import Button from '@mui/material/Button'
import axios from 'axios'
import { API_ROOT } from '~/utils/constants'

export const BankTransfer = () => {

  const getTransactions = async () => {
    const response = await axios.get(`${API_ROOT}/apis/v1/transactions/list`, {
    })
    console.log('Transactions:', response.data)
    return response.data
  }

  return (
    <div>
      <h2>Bank Transfer Payment</h2>
      <Button variant="contained" color="primary" onClick={getTransactions}>
        Get Transactions
      </Button>
    </div>
  )
}
