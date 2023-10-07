import React, { useState, useEffect } from 'react'
import { Avatar, Button, Container, Grid, TextField, Typography } from "@mui/material"
import { Box } from "@mui/system"
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Link, useLocation } from 'react-router-dom'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import './createProductStyle.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { useNavigate } from 'react-router-dom'
import httpService from '../../services/httpService'

const UpdateProduct = () => {
  const {state} = useLocation()
  const productData = (state && state.product) ? state.product : {} //?  route.params : null
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate()
  const [price, setPrice] = useState('');
  const [isLoginDisabled, setIsLoginDisabled] = useState(false)
  const [loginDisabledTimeout, setLoginDisabledTimeout] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    id: '',
  });

  useEffect(() => {
    if (state && state.product) {
      setFormData(state.product);
    }
  }, [state]);

  useEffect(() => {
    return () => {
        if (loginDisabledTimeout) { 
            clearTimeout(loginDisabledTimeout)
        }
    };
}, [loginDisabledTimeout])

  const handleRegisterProduct = async (e) => {
    e.preventDefault();
    if (isLoginDisabled) {
      return;
    }

  setIsLoginDisabled(true)
  setLoginDisabledTimeout(setTimeout(() => setIsLoginDisabled(false), 8000))

    /*const formData = new FormData(e.currentTarget);
    const data = {};
    
    for (const [key, value] of formData) {
      data[key] = value;
    }*/
    
    try{
      const response = await httpService.updateProduct(formData)
      if (response.status === 201) {
        const result = await response.json();
        toast.success("Produto atualizado com sucesso!")
        setTimeout(() => {
          navigate('/home');
        }, 4000);
      } else if (response.status === 409) {
        const result = await response.json()
        if (result.message) {
          await toast.error(result.message)
        }
      } else {
        const result = await response.json();
        toast(result.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao atualizar o produto!");
      }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  /*const handlePriceChange = (event) => {
    let inputValue = event.target.value;

    inputValue = inputValue.replace(/[^0-9.]/g, '');

    const decimalCount = (inputValue.split('.')[1] || []).length;
    if (decimalCount > 2) {
      inputValue = parseFloat(inputValue).toFixed(2);
    }

    setPrice(inputValue);
  };*/

  return (
    <>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <Button component={Link} to="/home" color="inherit" style={{textDecoration: 'none'}}>
            <ArrowBackIosNewIcon sx={{ mr: 2 }}/>
          </Button>
          <Typography variant="h6" color="inherit" noWrap style={{ margin: 'auto' }}>
            GreenMart
          </Typography>
        </Toolbar>
      </AppBar>

    <Container component="main">
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" sx={{ mt: 4 }}>
          <Avatar sx={{bgcolor: "secondary.main"}}><AddShoppingCartIcon/></Avatar>
          <Typography variant="h5"> {isEditing ? 'Edit Product' : 'Create Product'}</Typography>
          <Box sx={{mt: 2}} component= "form" onSubmit={handleRegisterProduct} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
            <TextField required fullWidth margin="normal" name='name' value={formData.name} onChange={handleInputChange} label="Product Name"/>
            <TextField required fullWidth margin="normal" name="category" value={formData.category} onChange={handleInputChange} label="Product Category"/>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField 
                  required
                  fullWidth
                  margin="normal"
                  name="price"
                  label="Price"
                  type='text'
                  value={formData.price}
                  onChange={handleInputChange}
                  inputProps={{ step: 0.01}}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField required fullWidth margin="normal" name="id" label="Product Code" value={formData.id} onChange={handleInputChange}inputProps={{ pattern: "[0-9]{1,3}", title: "Product Code deve ser um número de 3 dígitos"}}/>
              </Grid>
            </Grid>
            <Button type="submit" fullWidth sx={{bgcolor: "secondary.main", mt: 2}} variant='contained'> Send </Button>
          </Box>
        </Box>
        <ToastContainer/>
      </Container>
    </>
  )
}

export default CreateProduct