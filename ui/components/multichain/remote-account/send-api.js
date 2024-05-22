import axios from 'axios';


// module.exports = async function SendAPI(apiKey) {
export const SendAPI = async (apiKey) => {
  try {
    const response = await axios.get(`localhost:3000/wallet/get?api=${apiKey}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log(response);
    return response;
  } catch (error) {
    console.log(error.response.data);
    throw error;
  }
};
