import { createRoot } from 'react-dom/client'
import { HashRouter } from "react-router-dom"
import { ChakraProvider, } from '@chakra-ui/react';
import { Provider } from 'react-redux'
import store from './app/store'
import './index.css'
import App from './App'
import system from './assets/theme';


createRoot(document.getElementById('root')!).render(
  <HashRouter>
    <Provider store={store}>
        <ChakraProvider value={system}>
          <App />
        </ChakraProvider>
    </Provider>
  </HashRouter>
)
