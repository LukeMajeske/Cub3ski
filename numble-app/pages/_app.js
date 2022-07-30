import {Cub3skiProvider} from '../Contexts/cub3skiContext'
import Home from './index'
import '../styles/globals.css'
import Amplify from 'aws-amplify'
import awsconfig from '../src/aws-exports'

Amplify.configure(awsconfig);

function MyApp({ Component, pageProps }) {


  return(
    <>
      <Cub3skiProvider>
        <Home/>
      </Cub3skiProvider>
    </>
  )
}

export default MyApp
