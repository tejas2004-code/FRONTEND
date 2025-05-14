import { Slide } from "@mui/material";
import axios from "axios";
import { forwardRef } from "react";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://your-backend-url.vercel.app';

const getCart = async (setProceed, setCart, authToken) => {
    if (setProceed) {
        const { data } = await axios.get(`${API_BASE_URL}/api/cart/fetchcart`,
            {
                headers: {
                    'Authorization': authToken
                }
            })
        setCart(data);
    }
}
const getWishList = async (setProceed, setWishlistData, authToken) => {
    if (setProceed) {
        const { data } = await axios.get(`${API_BASE_URL}/api/wishlist/fetchwishlist`,
            {
                headers: {
                    'Authorization': authToken
                }
            })
        setWishlistData(data)
    }
}
const handleLogOut = (setProceed, toast, navigate, setOpenAlert) => {
    if (setProceed) {
        localStorage.removeItem('Authorization')
        toast.success("Logout Successfully", { autoClose: 500, theme: 'colored' })
        navigate('/')
        setOpenAlert(false)
    }
    else {
        toast.error("User is already logged of", { autoClose: 500, theme: 'colored' })
    }
}

const handleClickOpen = (setOpenAlert) => {
    setOpenAlert(true);
};

const handleClose = (setOpenAlert) => {
    setOpenAlert(false);
};
const getAllProducts = async (setData) => {
    try {
        const { data } = await axios.get(`${API_BASE_URL}/api/product/fetchproduct`);
        setData(data)
    } catch (error) {
        console.log(error);
    }
}

const getSingleProduct = async (setProduct, id, setLoading) => {
    const { data } = await axios.get(`${API_BASE_URL}/api/product/fetchproduct/${id}`)
    setProduct(data)
    setLoading(false);
}

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export { getCart, getWishList, handleClickOpen, handleClose, handleLogOut, getAllProducts, getSingleProduct, Transition }