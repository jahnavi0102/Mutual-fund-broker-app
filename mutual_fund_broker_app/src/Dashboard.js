import React, { useState, useEffect } from 'react';
import { fetchOpenEndedSchemas , buyMutualFundUnits} from "./api";
import { useLocation } from 'react-router-dom';

const FUND_FAMILY = [
  'Axis Mutual Fund',
  'ICICI Prudential Mutual Fund',
  'Edelweiss Mutual Fund',
  'Invesco Mutual Fund',
  '360 ONE Mutual Fund (Formerly Known as IIFL Mutual Fund)',
  'PGIM India Mutual Fund',
  'NJ Mutual Fund',
  'Taurus Mutual Fund',
  'SBI Mutual Fund',
  'Groww Mutual Fund',
  'Helios Mutual Fund',
  'Shriram Mutual Fund',
  'HDFC Mutual Fund',
  'Bajaj Finserv Mutual Fund',
  'Baroda BNP Paribas Mutual Fund',
  'HSBC Mutual Fund',
  'Old Bridge Mutual Fund',
  'Motilal Oswal Mutual Fund',
  'PPFAS Mutual Fund',
  'UTI Mutual Fund',
  'Sundaram Mutual Fund',
  'ITI Mutual Fund',
  'JM Financial Mutual Fund',
  'LIC Mutual Fund',
  'Aditya Birla Sun Life Mutual Fund',
  'Trust Mutual Fund',
  'Union Mutual Fund',
  'Bank of India Mutual Fund',
  'Quantum Mutual Fund',
  'Mahindra Manulife Mutual Fund',
  'quant Mutual Fund',
  'WhiteOak Capital Mutual Fund',
  'Mirae Asset Mutual Fund',
  'Zerodha Mutual Fund',
  'Canara Robeco Mutual Fund',
  'DSP Mutual Fund',
  'Franklin Templeton Mutual Fund',
  'Tata Mutual Fund',
  'Samco Mutual Fund',
  'Bandhan Mutual Fund',
  'Nippon India Mutual Fund',
  'Kotak Mahindra Mutual Fund',
  'Navi Mutual Fund',
];

const SchemaList = () => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [funds, setFunds] = useState([]);
  const [token, setToken] = useState('');
  const [units, setUnits] = useState({}); // Track units per fund

  const location = useLocation();

  const handleSelection = (event) => {
    setSelectedIndex(event.target.value);
  };

  useEffect(() => {
    // Get the token from the location state
    if (location.state && location.state.token) {
      setToken(location.state.token);
    } else {
      alert('No token provided. Redirecting to login.');
      // Handle the case where no token is provided (optional)
    }
  }, [location.state]);

  const handleFetchSchemas = async () => {
    if (selectedIndex === null) {
      alert('Please select a mutual fund');
      return;
    }
    try {
      const response = await fetchOpenEndedSchemas(selectedIndex, token);
      setFunds(response['Open ended Schemas']);
      console.log('Fetched Schemas:', response);
      alert('Schemas fetched successfully!');
    } catch (error) {
      console.error(error);
      alert('Error fetching schemas.');
    }
  };

  const handleUnitChange = (schemeCode, event) => {
    setUnits((prevUnits) => ({
        ...prevUnits,
        [schemeCode]: event.target.value,
      }));
  };

  const handleBuy = async (fund_data) => {
    try {
        const response = await buyMutualFundUnits(fund_data, token, units);
        // Displaying the response in an alert
        alert(
            `Purchase Successful!\n\nTransaction ID: ${response.transaction_id}\nUnits Purchased: ${response.units_purchased}\nTotal Amount: ₹${response.amount}\nNAV: ₹${response.nav}\nScheme Name: ${response.scheme_name}`
        );
      } catch (error) {
        console.error(error);
        alert('Error fetching schemas.');
      }
  };

  return (
    <div>
      <h2>Select a Mutual Fund</h2>
      <select onChange={handleSelection} value={selectedIndex || ''}>
        <option value="" disabled>Select a fund</option>
        {FUND_FAMILY.map((fund, index) => (
          <option key={index} value={index}>
            {fund}
          </option>
        ))}
      </select>
      <button style={{ marginTop: '1rem' }} onClick={handleFetchSchemas}>
        Fetch Open-End Schemas
      </button>

      {funds.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Available Schemes</h3>
          <ul>
            {funds.map((fund) => (
              <li key={fund.Scheme_Code} style={{ marginBottom: '10px' }}>
                <div>
                  <strong>{fund.Scheme_Name}</strong> - {fund.Scheme_Category}
                </div>
                <div>
                  <span>Net Asset Value (NAV): {fund.Net_Asset_Value}</span>
                </div>
                <div>
                  <input
                    type="number"
                    min="1"
                    placeholder="Enter units"
                    value={units[fund.Scheme_Code] || ''}
                    onChange={(e) => handleUnitChange(fund.Scheme_Code, e)}
                  />
                  <button onClick={() => handleBuy(fund)}>Buy</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SchemaList;