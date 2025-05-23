import { Container } from '@mui/system'
import axios from 'axios'
import CartCard from '../../Components/Card/CartCard/CartCard'
import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { ContextFunction } from '../../Context/Context'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Dialog, DialogActions, DialogContent, Typography } from '@mui/material'
import { AiFillCloseCircle, AiOutlineLogin } from 'react-icons/ai'
import { EmptyCart } from '../../Assets/Images/Image'
import { Transition } from '../../Constants/Constant'
import CopyRight from '../../Components/CopyRight/CopyRight'
import './Wishlist.css'

const Wishlist = () => {
    const { wishlistData, setWishlistData } = useContext(ContextFunction)
    const [openAlert, setOpenAlert] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    let authToken = localStorage.getItem('Authorization')
    let setProceed = authToken ? true : false
    let navigate = useNavigate()

    useEffect(() => {
        getWishList()
    }, [])

    const getWishList = async () => {
        if (setProceed) {
            try {
                setIsLoading(true)
                console.log('API URL:', process.env.REACT_APP_GET_WISHLIST)
                console.log('Auth Token:', authToken)

                const { data } = await axios.get(`${process.env.REACT_APP_GET_WISHLIST}`, {
                    headers: {
                        'Authorization': authToken
                    }
                })
                
                console.log('Wishlist Data:', data)
                
                if (!data) {
                    throw new Error('No data received from server')
                }
                
                setWishlistData(data)
                setError(null)
            } catch (err) {
                console.error('Wishlist Error:', err)
                setError(err.response?.data?.message || err.message || "Failed to load wishlist")
                toast.error("Failed to load wishlist: " + (err.response?.data?.message || err.message), 
                    { autoClose: 2000, theme: 'colored' })
            } finally {
                setIsLoading(false)
            }
        } else {
            setOpenAlert(true)
        }
    }

    const removeFromWishlist = async (product) => {
        if (setProceed) {
            try {
                await axios.delete(`${process.env.REACT_APP_DELETE_WISHLIST}/${product._id}`, {
                    headers: {
                        'Authorization': authToken
                    }
                })
                setWishlistData(wishlistData.filter(c => c.productId._id !== product.productId._id))
                toast.success("Removed From Wishlist", { autoClose: 500, theme: 'colored' })
            } catch (error) {
                toast.error(error.response?.data?.msg || "Error removing item", { autoClose: 500, theme: 'colored' })
            }
        }
    }

    const handleClose = () => {
        setOpenAlert(false)
        navigate('/')
    }

    const handleToLogin = () => {
        navigate('/login')
    }

    return (
        <>
            <Typography variant='h3' sx={{ textAlign: 'center', margin: "10px 0", color: '#1976d2', fontWeight: 'bold' }}>
                Wishlist
            </Typography>

            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                    <Typography>Loading wishlist...</Typography>
                </Box>
            ) : error ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                    <Typography color="error">{error}</Typography>
                </Box>
            ) : setProceed && (
                wishlistData.length <= 0 ? (
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <div className="main-card">
                            <img src={EmptyCart} alt="Empty_cart" className="empty-cart-img" />
                            <Typography variant='h6' sx={{ textAlign: 'center', color: '#1976d2', fontWeight: 'bold' }}>
                                No products in wishlist
                            </Typography>
                        </div>
                    </Box>
                ) : (
                    <Container maxWidth='xl' style={{ display: "flex", justifyContent: 'center', flexWrap: "wrap", paddingBottom: 20 }}>
                        {wishlistData.map(product => (
                            <CartCard 
                                product={product} 
                                removeFromCart={removeFromWishlist} 
                                key={product._id} 
                            />
                        ))}
                    </Container>
                )
            )}

            <Dialog
                open={openAlert}
                keepMounted
                onClose={handleClose}
                TransitionComponent={Transition}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogContent sx={{ width: { xs: 280, md: 350, xl: 400 }, display: 'flex', justifyContent: 'center' }}>
                    <Typography variant='h5'>Please Login To Proceed</Typography>
                </DialogContent>
                <DialogActions sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
                    <Button variant='contained' onClick={handleToLogin} endIcon={<AiOutlineLogin />} color='primary'>
                        Login
                    </Button>
                    <Button variant='contained' color='error' endIcon={<AiFillCloseCircle />} onClick={handleClose}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
            <CopyRight sx={{ mt: 8, mb: 10 }} />
        </>
    )
}

export default Wishlist