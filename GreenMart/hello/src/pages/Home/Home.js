import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import LogoutIcon from '@mui/icons-material/Logout';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import httpService from '../../services/httpService'
import EditIcon from '@mui/icons-material/Edit';
import './homeStyle.css'
import ClearIcon from '@mui/icons-material/Clear';

const Home = () => {
  const [products, setProducts] = useState([])
  const navigate = useNavigate()

  const goTo = (path, params) => {
    return () => {
      navigate(path, {state: {product: params}})
    }
    
  }

  const EmptyProducts = ()=> {
    return (
      <Container sx={{ py: 3 }} maxWidth="md">Nenhum produto cadastrado</Container>
    )
  }
  
  const ListProducts = () =>{
    return (
  
      <Container sx={{ py: 3 }} maxWidth="md">
            <Grid container spacing={4}>
              {products.map((product) => (
                <Grid item xs={12} sm={6} md={4}>
                  <Card
                    sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                  >
                    <CardMedia
                      component="div"
                      sx={{
                        // 16:9
                        pt: '56.25%',
                      }}
                      
                      image="https://img.freepik.com/premium-vector/grocery-set-meat-fish-salad-bread-milk_169241-692.jpg"
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {product.name}
                      </Typography>
                      <Typography variant= "h6">
                        R$ {product.price}
                      </Typography>
                      <Typography>
                        code: {product.id}
                      </Typography>
                    </CardContent>
                    <CardActions>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Button size="small">
                            <ClearIcon/>
                            <Typography color="inherit" noWrap sx={{ textTransform: 'none', mr: 1}}>
                              Remove
                            </Typography>
                          </Button>
                        </Grid>
                        <Grid item xs={6}>
                          <Button onClick={goTo("/product/create", product)} size="small">
                          <EditIcon/>
                            <Typography color="inherit" noWrap sx={{ textTransform: 'none', mr: 1}}>
                              Edit
                            </Typography>
                          </Button>
                        </Grid>
                      </Grid>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
    )
  }

  useEffect(() => {
    async function fetchProducts() {
      try{
        const response = await httpService.getProducts()
        const products = await response.json()
        setProducts(products)
        //setLoading(false)
      } catch (error) {
        console.error("Erro")
        //setLoading(false)
      }
    }
    fetchProducts()
  }, [])

    return (
      <>
        <CssBaseline />
        <AppBar position="relative">
          <Toolbar>
            <LocalGroceryStoreIcon sx={{ mr: 2 }} />
            <Typography variant="h6" color="inherit" className="" noWrap >
              GreenMart
            </Typography>
  
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
              <Button component={RouterLink} to="/" color="inherit" style={{textDecoration: 'none'}}>
                <Typography variant="h6" color="inherit" noWrap sx={{ textTransform: 'none', mr: 1 }}>
                  Logout
                </Typography>
                <LogoutIcon />
              </Button>
            </div>
          </Toolbar>
        </AppBar>
        <main>
        <Box sx={{ position: 'relative', mt: 5, mr: -90 }}>
            <Button component={RouterLink} onClick={goTo("/product/create")} sx={{ textTransform: 'none', bgcolor: "primary.main"}}>
              <Typography variant="h6" color="black" noWrap sx={{ textTransform: 'none', fontSize: "14px" }}>
                Add Product
              </Typography>
            </Button>
        </Box>
        {products.length !== 0 ?<ListProducts/> :  <EmptyProducts/>}
          
        </main>
        </>
    );

}



export default Home