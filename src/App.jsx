import { Box, Container, Grid,  Typography } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import InputAmout from './components/InputAmout';
import SelectCountry from './components/SelectCountry';
import SwitchCurrency from './components/SwitchCurrency';
import { CurrencyContext } from './context/CurrencyContext';

function App() {
  const {
    baseCurrency,
    setBaseCurrency,
    quoteCurrency,
    setQuoteCurrency,
    firstAmount,
  } = useContext(CurrencyContext);
  const [resultCurrency, setResultCurrency] = useState(0);
  const codeFromCurrency = typeof baseCurrency === 'string' ? baseCurrency.split(" ")[0] : '';
  const codeToCurrency = typeof quoteCurrency === 'string' ? quoteCurrency.split(" ")[0] : '';

  useEffect(() => {
    if (firstAmount && codeFromCurrency && codeToCurrency) {
      fetch('https://swop.cx/graphql?api-key=7735dc8109cd994728d36236dac2734744cc55574d616b5b0f917b23f546956c', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
          query LatestCurrency {
            latest(baseCurrency: "${codeFromCurrency}", quoteCurrencies: ["${codeToCurrency}"]) {
              date
              baseCurrency
              quoteCurrency
              quote
            }
          }
          `,
          variables: {
            now: new Date().toISOString(),
          },
        }),
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        const { latest } = data.data;
        if (latest && latest.length > 0) {
          const { quote } = latest[0];
          setResultCurrency(quote);
        } else {
          setResultCurrency(0);
        }
      })
      .catch((error) => {
        console.log(error);
        setResultCurrency(0);
      });
    } else {
      setResultCurrency(0);
    }
  }, [firstAmount, baseCurrency, quoteCurrency,codeFromCurrency , codeToCurrency]);

  const boxStyles = {
    background: "#eaebec",
    marginTop: "10%",
    textAlign: "center",
    color: "#222",
    minHeight: "20rem",
    borderRadius: "25% 0 25% 0",
    padding: "4rem 2rem",
    boxShadow: "0px 10px 15px -3px rgba(0,0,0,0.1)",
    position: "relative"
  }
  
  
  
  return (
    <Container maxWidth="md" sx={boxStyles} >
      
      <Typography variant='h5' sx={{ marginBottom: "2rem", fontFamily: "poppins Heebo",  fontSize: "24px"}}>Xone Currency Converter</Typography>
      <Grid container spacing={2}>
        <InputAmout />
        <SelectCountry value={baseCurrency} setValue={setBaseCurrency}  label="From" />
        <SwitchCurrency />
        <SelectCountry value={quoteCurrency} setValue={setQuoteCurrency} label="To" />

      </Grid>

      {firstAmount  ? (
        <Box sx={{ textAlign: "center", marginTop: "1rem" }}>
          <Typography>{firstAmount} {baseCurrency} =</Typography>
          <Typography variant='h5' sx={{ marginTop: "5px", fontWeight: "bold" }}>
            {resultCurrency*firstAmount} {quoteCurrency}
          </Typography>
        </Box>
      ) : null}

      
    </Container>
  );
}

export default App;

































