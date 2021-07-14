import React, {useContext} from 'react'
import ProductContext from '../ProductContext'
import UserContext from '../UserContext';

export default function ProductListing() {
    const context = useContext(ProductContext);
    const userContext = useContext(UserContext)
    const products = context.getProducts();
    console.log(products)
    return <React.Fragment>
        <h1>Welcome back to our shop, {userContext.getUser().email}</h1>
        <button onClick={()=>{context.refreshProducts()}}>Refresh</button>
        <ul>
            {products.map( p => <li>{p.name} : ${p.cost/100} </li>)}
        </ul>

    </React.Fragment>
}