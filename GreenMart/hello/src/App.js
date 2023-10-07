import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import {ThemeProvider, createTheme} from '@mui/material/styles'
import './App.css';
import Login from './pages/Login/Login';
import CreateUser from './pages/CreateUser/CreateUser'
import Home from './pages/Home/Home'
import CreateProduct from './pages/CreateProduct/CreateProduct'

function App() {
  const defaultRouter = createBrowserRouter([
    {
      path: "/",
      element: <Login/>
    },
    {
      path: "/user/create",
      element: <CreateUser/>
    },
    {
      path: "/home",
      element: <Home/>
    },
    {
      path: "/product/create",
      element: <CreateProduct/>
    },
  ])

  const defaultTheme = createTheme({
    palette: {
        primary: {
          main: '#87A46A'
        }, 
        secondary: {
          main: '#556B45'
        }
    }
  });

  return (
    <ThemeProvider theme={defaultTheme}>
      <div className="App">
        <RouterProvider router={defaultRouter}/>
      </div>
    </ThemeProvider>
  )
}

export default App;
