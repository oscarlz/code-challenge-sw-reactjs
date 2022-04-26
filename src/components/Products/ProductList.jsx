import React, { useEffect, useState } from 'react';
import ProductsTile from './ProductTile';
import { Link } from 'react-router-dom'
import axios from 'axios';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  // Fetch current products from backend
  useEffect(() => {
    
    const getProducts = async () => {
      let p = await axios.get('http://127.0.0.1/scandiweb-backend/index.php/products/get-products')
      setProducts(p.data);
    }

    getProducts();
  }, [])

  // Delete selected products
  const massDelete = async () => {
    let productsIdsToDelete = [];
    let currentProducts = document.getElementsByClassName('delete-checkbox');
    
    for(let item of currentProducts){
        if(item.checked === true){
            // Parse to int the product_id attribute, it comes as a string (we want it in INT so we can update the grid list if the delete was successful)
            productsIdsToDelete.push(parseInt(item.getAttribute('productid')));
        }
    }

    if(productsIdsToDelete.length > 0){
        
      // Hit endpoint to mass delete these ids
        const resp = await axios.post('http://127.0.0.1/scandiweb-backend/index.php/products/delete-products', JSON.stringify(productsIdsToDelete));
      
        if(resp.status === 200){
            // update ProductList
            setProducts((product) => product.filter((product) => (productsIdsToDelete.indexOf(product.id) < 0)))
        }
    }
}

  return (
    <div>
      <div className='topbar'>
        <h3>Product List</h3>
        <div>
            <Link to="/product-add"><button>Add</button></Link>
            <button onClick={massDelete}>Mass delete</button>
        </div>
    </div>
    <hr></hr>

      <div className='products-grid'>
      {products.length > 0 ? products.map((product) => {
        return (
            <ProductsTile key={product.id} product={product}/>
            )
          })
        : 
        <div>No products</div>}
      </div>
    </div>
  )
}

export default ProductList