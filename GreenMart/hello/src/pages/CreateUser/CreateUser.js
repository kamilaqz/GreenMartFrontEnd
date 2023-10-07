import React, { useState, useEffect } from 'react'
import { Avatar, Button, Container, Grid, TextField, Typography, InputAdornment, IconButton } from "@mui/material"
import { Box } from "@mui/system"
import PersonIcon from '@mui/icons-material/Person';
import Paper from '@mui/material/Paper'
import httpService from '../../services/httpService'
import './createUserStyle.css';
import { Link } from 'react-router-dom'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { useNavigate } from 'react-router-dom'

const CreateUser = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [isLoginDisabled, setIsLoginDisabled] = useState(false)
  const [loginDisabledTimeout, setLoginDisabledTimeout] = useState(null)

  useEffect(() => {
    return () => {
        if (loginDisabledTimeout) { 
            clearTimeout(loginDisabledTimeout)
        }
    };
}, [loginDisabledTimeout])

  const handleRegisterUser = async (e) => {
    e.preventDefault();
    if (isLoginDisabled) {
      return;
  }

  setIsLoginDisabled(true)
  setLoginDisabledTimeout(setTimeout(() => setIsLoginDisabled(false), 8000))

    const formData = new FormData(e.currentTarget);
    const data = {};
    
    for (const [key, value] of formData) {
      data[key] = value;
    }

    try{
      console.log(data)
      const response = await httpService.createUser(data);

      if (response.status === 201) {
        const result = await response.json();
        toast.success("Cadastro realizado com sucesso!")
        setTimeout(() => {
          navigate('/');
        }, 6000);
      } else if (response.status === 409) {
        const result = await response.json()
        if (result.message) {
          await toast.error(result.message)
        }
      } else {
        const result = await response.json()
        toast("Erro ao realizar cadastro.")
      }
    } catch (err) {
      toast.error("Erro ao criar o usuário!");
      console.error(err);
    }
  }

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword)
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value) 
  };

  return (
    <Paper elevation={3} className="paper-container">
      <Container component="main">
        <Box className='createUser-box'>
          <Avatar sx={{bgcolor: "secondary.main"}}><PersonIcon/></Avatar>
          <Typography variant="h5"> Sign Up</Typography>
          <Box component='form' className='createUser-box2' onSubmit={handleRegisterUser}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField required fullWidth margin="normal" name="firstName" label="First Name" id="firstName"/>
              </Grid>
              <Grid item xs={6}>
                <TextField required fullWidth margin="normal" name="lastName" label="Last Name" id="lastName"/>
              </Grid>
            </Grid>
            <TextField required fullWidth margin="normal" name="email" type="email" label="Email"/>
            <TextField
                required
                fullWidth
                margin="normal"
                name="password"
                type={showPassword ? 'text' : 'password'}
                label="Password"
                value={password}
                onChange={handlePasswordChange}
                InputProps={{
                    endAdornment: (
                    <InputAdornment position="end">
                        <IconButton onClick={handlePasswordVisibility} edge="end">
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                    </InputAdornment>
                    ),
                }}
            />
            <Button type="submit"  fullWidth sx={{bgcolor: "secondary.main", mt: 2}} variant='contained'> Send </Button>
            <Grid sx={{mt: 2}}>
              <Link to='/'> Already have an account? Log in</Link> 
            </Grid>
          </Box>
        </Box>
      </Container>
      <ToastContainer/>
    </Paper>
  )
}

export default CreateUser