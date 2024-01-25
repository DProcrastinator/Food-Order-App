import { useContext } from "react";
import Modal from "./Ul/Modal";
import CartContext from "../store/CartContext";
import { currencyFormatter } from "../util/formatting";
import Input from "./Ul/Input";
import Button from "./Ul/Button";
import UserProgressContext from "../store/UserProgressContext";
import useHttp from "../hooks/useHttp";
const requestConfig = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
};

export default function Checkout() {
  const cartCtx = useContext(CartContext);
  const userProgressCtx = useContext(UserProgressContext);
  const {
    data,
    isLoading: isSending,
    error,
    sendRequest,
  } = useHttp("http://localhost:3000/orders", requestConfig);

  const cartTotal = cartCtx.items.reduce((totalPrice, item) => {
    return totalPrice + item.quantity * item.price;
  }, 0);
  function handleClose() {
    userProgressCtx.hideCheckout();
  }

  function handleFinish(){
    userProgressCtx.hideCheckout();
    cartCtx.clearCart();
  }
  function handleSubmit(event) {
    event.preventDefault();
    const fd = new FormData(event.target);
    const customerData = Object.fromEntries(fd.entries());
    sendRequest(
      JSON.stringify({
        order: {
          items: cartCtx.items,
          customer: customerData,
        },
      })
    );
  }
  let actions = (
    <>
      <Button onClick={handleClose} type="button" textOnly>
        Close
      </Button>
      <Button>Submit Order</Button>
    </>
  );
  if (isSending) {
    actions = <span>Sending orders data..</span>;
  }
  if (data && !error) {
    return (
      <Modal
        open={userProgressCtx.progress === "checkout"}
        onClose={handleFinish}
      >
        <h2>Success</h2>
        <p>Yoru Order was submitted successfully</p>
        <p className="modal-actions">
            <Button onClick ={handleFinish}>Okay</Button>
        </p>
      </Modal>
    );
  }
  return (
    <Modal open={userProgressCtx.progress === "checkout"} onClose={handleClose}>
      <form onSubmit={handleSubmit}>
        <h2>Checkout</h2>
        <p>Total Amount: {currencyFormatter.format(cartTotal)}</p>
        <Input label="Full Name" type="text" id="name" required />
        <Input label="Email Address" type="email" id="email" />
        <Input label="street" type="text" id="street" required />
        <div className="control-row">
          <Input label="Postal Code" type="text" id="postal-code" />
          <Input label="City" type="text" id="city" />
        </div>
        {error && <Error title="Failed to submit Order" message={error} />}
        <p className="modal-actions">{actions}</p>
      </form>
    </Modal>
  );
}
