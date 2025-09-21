import Button from '@mui/material/Button'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { API_ROOT } from '~/utils/constants'

export const BankTransfer = () => {
  const { t } = useTranslation()

  const getTransactions = async () => {
    const response = await axios.get(`${API_ROOT}/apis/v1/transactions/list`, {
    })
    console.log('Transactions:', response.data)
    return response.data
  }

  return (
    <div>
      <h2>{t('checkout.bankTransfer.title')}</h2>
      <Button variant="contained" color="primary" onClick={getTransactions}>
        {t('checkout.bankTransfer.getTransactions')}
      </Button>
    </div>
  )
}
