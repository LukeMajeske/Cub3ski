import { AppWrapper, NumbleProvider } from '../Contexts/numbleContext'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return(
    <NumbleProvider>
      <Component {...pageProps} />
    </NumbleProvider>
  )
}

export default MyApp
