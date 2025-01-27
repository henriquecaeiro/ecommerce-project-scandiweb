import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import client from "./apollo/client";
import HomePage from "./pages/HomePage/HomePage";
import Header from "./components/Header/Header";
import ErrorScreen from "./components/ErrorScreen/ErrorScreen";
import { useError } from "./context/ErrorContext";

const App: React.FC = () => {
  const { error } = useError();

  return (
    <ApolloProvider client={client}>
      {error && <ErrorScreen />}
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </Router>
    </ApolloProvider>
  );
};

export default App;
