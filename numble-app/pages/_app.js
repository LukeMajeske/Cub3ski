import { AppWrapper, NumbleProvider } from '../Contexts/numbleContext'
import Home from './index'
import '../styles/globals.css'
import Amplify from 'aws-amplify'
import awsconfig from '../src/aws-exports'

Amplify.configure(awsconfig);

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
