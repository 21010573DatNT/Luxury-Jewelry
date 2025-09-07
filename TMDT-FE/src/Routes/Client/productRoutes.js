import { Route } from 'react-router-dom';
import Product from '../../Pages/Product';

export const ProductRoute = () => {
  return(
    <Route path="products" exact component={<Product />} />
  )
};
