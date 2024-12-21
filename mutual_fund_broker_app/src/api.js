import axios from "axios";

const API_BASE_URL = "http://localhost:8000"; // FastAPI backend URL

export const login = async () => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`);
    return response.data;
  } catch (error) {
    console.error("Login failed:", error.response.data);
    throw error;
  }
};

export const fetchOpenEndedSchemas = async (fundFamilyId, token) => {
  console.log(token)
  try {
    const response = await axios.get(`${API_BASE_URL}/open-ended-schema/${fundFamilyId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch schemas:", error.response.data);
    throw error;
  }
};

export const buyMutualFundUnits = async (fundData, token, units) => {
  try {
    const payload = {
      scheme_code: fundData.Scheme_Code,
      units: units[fundData.Scheme_Code],
      investor_id: 1, 
      nav: fundData.Net_Asset_Value,
      scheme_name: fundData.Scheme_Name,
      payment_details: {
        method: "paypal", 
      },
    };
    const response = await axios.post(`${API_BASE_URL}/purchase-mutual-fund`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Failed to purchase mutual fund units:", error.response ? error.response.data : error);
    throw error;
  }
};