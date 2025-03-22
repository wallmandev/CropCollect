import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const CheckoutForm = () => {
  return (
    <div id="checkout">
      <h1>Checkout is currently disabled.</h1>
    </div>
  );
};

const Return = () => {
  return (
    <section id="success">
      <p>
        We appreciate your business! If you have any questions, please email <a href="mailto:orders@example.com">orders@example.com</a>.
      </p>
    </section>
  );
};

const App = () => {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/checkout" element={<CheckoutForm />} />
          <Route path="/return" element={<Return />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
