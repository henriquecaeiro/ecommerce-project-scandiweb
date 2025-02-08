import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import client from "./apollo/client";
import HomePage from "./pages/HomePage/HomePage";
import Header from "./components/Header/Header";
import ErrorScreen from "./components/ErrorScreen/ErrorScreen";
import { useError } from "./context/ErrorContext";
import ProductDetail from "./pages/ProductDetail/ProductDetail";
import CartOverlay from "./components/CartOverlay/CartOverlay";
import NotFound from "./pages/NotFound/NotFound";

const App: React.FC = () => {
  const { error } = useError();

  return (
    <ApolloProvider client={client}>
      {error && <ErrorScreen />}
      <Router>
        <Header />
        <CartOverlay />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/details/:id" element={<ProductDetail/>} />
          <Route path="*" element={<NotFound/>} />
        </Routes>
      </Router>
    </ApolloProvider>
  );
};

export default App;
