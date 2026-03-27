import axios from 'axios'

export const initiatePayment = async (payload: any, env: 'sandbox' | 'live') => {
  const url =
    env === 'live'
      ? 'https://securepay.sslcommerz.com/gwprocess/v4/api.php'
      : 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php'

  const { data } = await axios.post(url, payload)

  return data
}