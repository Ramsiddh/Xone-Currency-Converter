import { Autocomplete, Grid, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { currencyName } from './CountryNames';

const SelectCountry = (props) => {
  const { value, setValue, label } = props;
  const [data, setData] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [baseCurrencyError, setBaseCurrencyError] = useState(false);
  const [baseCurrencyValue, setBaseCurrencyValue] = useState(value);

  useEffect(() => {
    fetch('https://swop.cx/graphql?api-key=7735dc8109cd994728d36236dac2734744cc55574d616b5b0f917b23f546956c', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query LatestCurrency {
            latest {
              baseCurrency
              quoteCurrency
            }
          }
        `,
        variables: {
          now: new Date().toISOString(),
        },
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const countries = result.data.latest.map(item => ({
          baseCurrency: item.baseCurrency,
          quoteCurrency: item.quoteCurrency,
        }));
        setData(countries);
        setLoaded(true);
      })
      .catch(() => {
        setError(true);
      });
  }, []);

  useEffect(() => {
    setBaseCurrencyValue(value);
  }, [value]);

  useEffect(() => {
    if (baseCurrencyValue === "EUR (Euro)") {
      setBaseCurrencyError(false);
    }
  }, [baseCurrencyValue]);

  if (!loaded) {
    return (
      <Grid item xs={12} md={3}>
        
      </Grid>
    );
  }

  if (error) {
    return "Something went wrong!";
  }

  const handleCurrencyChange = (event, newValue) => {
    if (label === "From") {
      if (newValue !== "EUR (Euro)") {
        setBaseCurrencyError(true);
      } else {
        setBaseCurrencyError(false);
      }
    }
    setValue(newValue);
  };

  const dataCountries = data.map(item => {
    const quoteCurrency = item.quoteCurrency;
    const currency = currencyName[quoteCurrency];
    return `${item.quoteCurrency} (${currency})`;
  });

  return (
    <Grid item xs={12} md={3}>
      <Autocomplete
        value={baseCurrencyValue}
        disableClearable
        onChange={handleCurrencyChange}
        options={dataCountries}
        isOptionEqualToValue={(option, value) => option === value}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            error={baseCurrencyError}
            helperText={baseCurrencyError && label === "From" ? "This app only accepts conversions from Euro" : null}
          />
        )}
      />
    </Grid>
  );
}

export default SelectCountry;



