import { AppWrapper, NumbleProvider } from '../Contexts/numbleContext'
import Grid from './grid'
import Home from './index'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {


  return(
    <>
    <NumbleProvider>
      <Home/>
    </NumbleProvider>
    </>
  )
}

export default MyApp
