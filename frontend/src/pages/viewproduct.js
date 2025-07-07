import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Button, IconButton } from '@mui/material';
import { Card, CardContent, CardHeader, Typography, Rating, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { ShoppingCart, FavoriteBorder, LocalShipping, CheckCircle, Palette, Replay, LocalShippingOutlined } from '@mui/icons-material';
import Nav from '../components/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductViewPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [brandData, setBrandData] = useState(null);
  const [categoryData, setCategoryData] = useState(null);
  const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token');


  useEffect(() => {
    axios.get(`http://localhost:3001/api/products/product?id=${id}`)
      .then((response) => {
        setProduct(response.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (product) {
      axios.get(`http://localhost:3001/api/brands/brand?id=${product.product_brand_id}`)
        .then((response) => {
          setBrandData(response.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [product]);

  useEffect(() => {
    if (product) {
      axios.get(`http://localhost:3001/api/categories/category?id=${product.product_category_id}`)
        .then((response) => {
          setCategoryData(response.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [product]);

    const handleAddToCart = (product_id) => {
        axios.post(
        'http://localhost:3001/api/cart/addtocart',
        { product_id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
        )
        .then(() => {
        toast.success('Product added to cart');
        })
        .catch((err) => {
        toast.error('Error adding to cart');
        console.error('Error adding to cart:', err);
        });
    };

  if (loading) return <div className='text-center p-10'>Loading...</div>;
  if (!product) return <div className='text-center p-10'>Product not found</div>;

  return (
    <div>
      <Nav />
      <ToastContainer position="top-center" autoClose={3000} />
    
      <div className='flex justify-center items-center min-h-screen p-6 bg-gray-100 py-28'>
        <Card className='w-full max-w-6xl shadow-2xl rounded-2xl bg-white p-8'>
          <CardHeader title={<Typography variant='h4' className='font-bold text-gray-800'>{product.product_name}</Typography>} subheader={<Typography variant='subtitle1' className='text-gray-600'>{brandData?.brand_name} | {categoryData?.category_name}</Typography>} />
          <Divider className='my-4' />
          <CardContent>
            <div className='flex flex-col lg:flex-row items-start gap-10'>
              <img src={`http://localhost:3001${product.product_image}`} alt={product.product_name} className='w-full lg:w-1/2 rounded-lg shadow-md object-cover'/>
              <div className='space-y-6'>
                <Typography variant='body1' className='text-gray-700'>{product.product_description}</Typography>
                <Typography variant='h5' className='font-semibold text-green-700'>Rs.{product.product_price}</Typography>
                {/*<Rating name='product-rating' value={4} readOnly size='large' />*/}
                {/*<Typography variant='body2' className={`text-sm ${product.stock_count > 0 ? 'text-green-600' : 'text-red-600'}`}>Stock: {product.stock_count > 0 ? `${product.stock_count} available` : 'Out of stock'}</Typography>*/}
                <div className='flex gap-4'>
                  <Button variant='contained' color='primary' startIcon={<ShoppingCart />} className='mt-4 py-2 px-5 rounded-md text-white shadow hover:shadow-lg' onClick={()=> handleAddToCart(product.product_id)}>
                    Add to Cart
                  </Button>
                </div>
                <Typography variant='subtitle2' className='text-gray-600'>Category: {categoryData?.category_name}</Typography>
                <Typography variant='subtitle2' className='text-gray-600'>Brand: {brandData?.brand_name}</Typography>
              </div>
            </div>
            <Divider className='my-6' />
            <Typography variant='h6' className='font-bold text-gray-800'>Product Details:</Typography>
            <List>
              <ListItem><ListItemIcon><CheckCircle color='success' /></ListItemIcon><ListItemText primary='High quality and durable materials' /></ListItem>
              <ListItem><ListItemIcon><Palette color='primary' /></ListItemIcon><ListItemText primary='Available in multiple colors' /></ListItem>
              <ListItem><ListItemIcon><Replay color='secondary' /></ListItemIcon><ListItemText primary='30-day return policy' /></ListItem>
              <ListItem><ListItemIcon><LocalShippingOutlined color='info' /></ListItemIcon><ListItemText primary='Free shipping on orders over LKR 100000' /></ListItem>
            </List>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductViewPage;
