import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import client from "./apollo/client";
import Header from "./components/Header/Header";
import ErrorScreen from "./components/ErrorScreen/ErrorScreen";
import { useError } from "./context/ErrorContext";
import CartOverlay from "./components/CartOverlay/CartOverlay"
import AppRoutes from "./routes/AppRoutes";

const App: React.FC = () => {
  const { error } = useError();

  return (
    <ApolloProvider client={client}>
      <Router>
        {error ? <ErrorScreen /> : (
          <>
            <Header />
            <CartOverlay />
            <AppRoutes />
          </>
        )
        }
      </Router>
    </ApolloProvider>
  );
};

export default App;
