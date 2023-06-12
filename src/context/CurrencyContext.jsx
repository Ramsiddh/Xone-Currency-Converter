import { createContext, useState } from "react";

export const CurrencyContext = createContext();

const CurrencyProvider = ({ children }) => {
  const [baseCurrency, setBaseCurrency] = useState("EUR (Euro)");
  const [quoteCurrency, setQuoteCurrency] = useState("INR (Indian rupee)");
  const [firstAmount, setFirstAmount] = useState("");

  const value = {
    baseCurrency,
    setBaseCurrency,
    quoteCurrency,
    setQuoteCurrency,
    firstAmount,
    setFirstAmount
  };
  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export default CurrencyProvider;