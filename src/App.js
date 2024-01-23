import { useSelector, useDispatch } from "react-redux";
import Cart from "./components/Cart/Cart";
import Layout from "./components/Layout/Layout";
import Products from "./components/Shop/Products";
import { useEffect } from "react";
import { uiAction } from "./store/uiSlice";
import { cartAction } from "./store/cartSlice";
import Notification from "./components/UI/Notification";

let isInitial = true;
function App() {
    const dispatch = useDispatch();
    const cartVisible = useSelector((state) => state.ui.cartIsVisible);

    const cart = useSelector((state) => state.cart);
    const notification = useSelector((state) => state.ui.notification);
    //////////////////
    useEffect(() => {
        const fetchCartData = async () => {
            dispatch(
                uiAction.showNotification({
                    status: "PENDING",
                    title: "fetching cart",
                    message: "Sending request to fetch cart data!!",
                })
            );
            const response = await fetch(
                "https://react-96cf8-default-rtdb.firebaseio.com/cart.json"
            );

            if (!response.ok) {
                throw new Error();
            }
            const cartData = await response.json()
            

            dispatch(cartAction.replaceCart({
                totalQuantity: cartData.totalQuantity || 0,
                items: cartData.items || [],
                changed: false
            }));
            dispatch(
                uiAction.showNotification({
                    status: "SUCCESS",
                    title: "Cart fetch",
                    message: "Successfully fetched the cart data !!",
                })
            );
        };

        fetchCartData().catch((error) => {
            dispatch(
                uiAction.showNotification({
                    status: "ERROR",
                    title: "Error occured",
                    message: "Updating cart data from database failed !!",
                })
            );
        });
    }, [dispatch]);

    //////////////////////////////////
    useEffect(() => {
        const sendCartData = async () => {
            dispatch(
                uiAction.showNotification({
                    status: "PENDING",
                    title: "Updating cart",
                    message: "Sending cart data for updating!!",
                })
            );
            const response = await fetch(
                "https://react-96cf8-default-rtdb.firebaseio.com/cart.json",
                {
                    method: "PUT",
                    body: JSON.stringify(cart),
                }
            );

            if (!response.ok) {
                throw new Error();
            }

            //const responseData = response.json();
            dispatch(
                uiAction.showNotification({
                    status: "SUCCESS",
                    title: "Cart updated",
                    message: "Successfully updated the cart data !!",
                })
            );
        };

        if (isInitial) {
            isInitial = false;
            return;
        }
        if (cart.changed) {
            sendCartData().catch((error) => {
                dispatch(
                    uiAction.showNotification({
                        status: "ERROR",
                        title: "Error occured",
                        message: "Updating cart data failed !!",
                    })
                );
            }); 
        }
        
    }, [cart, dispatch]);
    //////////////////////////////////////////////////
    return (
        <>
            {notification && (
                <Notification
                    status={notification.status}
                    title={notification.title}
                    message={notification.message}
                ></Notification>
            )}
            <Layout>
                {cartVisible && <Cart />}
                <Products />
            </Layout>
        </>
    );
}

export default App;
