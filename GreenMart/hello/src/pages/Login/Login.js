import React, { useState, useEffect } from 'react'
import { Avatar, Box, Button, Container, Grid, TextField, Typography } from '@mui/material'
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore'
import httpService from '../../services/httpService'
import Paper from '@mui/material/Paper'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import './loginStyle.css'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { Link, useNavigate } from 'react-router-dom'

const Login = () => {
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

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (isLoginDisabled) {
            return;
        }

        setIsLoginDisabled(true)
        setLoginDisabledTimeout(setTimeout(() => setIsLoginDisabled(false), 8000))
        const formData = new FormData(e.currentTarget)
        const data = {}
        for(const [key, value] of formData) {
            data[key] = value
        }

        try {
            const response = await httpService.login(data)

            if (response.status === 200) { 
                const result = await response.json()
                localStorage.setItem("token", "Bearer " + result["Access-Token"])
                navigate("/home")
            } else {
                const result = await response.json()
                if (result.message) {
                    toast.error(result.message)
                }
            }
        } catch (err) {
            toast("Erro ao realizar login!");
        }
    }

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword)
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
  };

  return (
    <>
    <Paper elevation={3} className="paper-container">
            <Container component="main">
                <Box className="login-box">
                    <Avatar sx={{bgcolor:"secondary.main"}}>
                        <LocalGroceryStoreIcon />
                    </Avatar>
                    <Typography variant='h5'>
                        Sign in
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit} className='login-box'>
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
                        <Button type="submit" fullWidth sx={{bgcolor: "secondary.main", mt: 2}} variant='contained'> Send </Button>
                        <Grid sx={{mt: 2}} container>
                            <Grid item xs={4}>
                                <Link> Forgot Password? </Link>
                            </Grid>
                            <Grid item xs={8}>
                                <Link to='/user/create'> Don't have an account? Create Account</Link> 
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
            <ToastContainer/>
        </Paper>
    </>
  )
}

export default Login