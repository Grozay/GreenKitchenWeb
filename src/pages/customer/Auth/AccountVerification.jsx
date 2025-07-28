import { useEffect, useState } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import { verifyCustomerAPI } from '~/apis'

export default function AccountVerification() {
  //get token and email from url
  let [searchParams] = useSearchParams()
  // const token = searchParams.get('token')
  // const email = searchParams.get('email')
  const { token, email } = Object.fromEntries(searchParams)

  // tao state de biet duoc duoc verify chua
  const [isVerified, setIsVerified] = useState(false)

  // goi api verify account
  useEffect(() => {
    if (token && email) {
      verifyCustomerAPI({ token, email })
        .then(() => {
          setIsVerified(true)
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.log(error)
        })
    }
  }, [token, email])

  // 1. New url co van de, khong ton tai 1 trong 2 gia tri email hoac token thi hien thi 404
  if (!token || !email) {
    return <Navigate to="/404" />
  }

  // 2. Neu chua verify thi hien thi loading
  if (!isVerified) {
    return (
      <PageLoadingSpinner caption="Verifying your account..." />
    )
  }

  // 3. Neu verify thanh cong thi dieu huong den trang login cung gia tri verifiedEmail
  return <Navigate to={`/login?verifiedEmail=${email}`} />

}
