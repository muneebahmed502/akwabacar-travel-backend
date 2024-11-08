import axios from 'axios';

const translateMessage = async (message, targetLanguage = 'fr') => {
  const apiKey = 'AIzaSyAAUM3rHSN_Bk-E9rdAEMQP3rhB6VZgmwU'; // Replace with your API Key
  try {
    const response = await axios.post(
      `https://translation.googleapis.com/language/translate/v2`,
      {
        q: message,
        target: targetLanguage,
        key: apiKey,
      }
    );
    return response.data.data.translations[0].translatedText;
  } catch (error) {
    console.error('Error during translation:', error);
    return message; // Fallback to original message if translation fails
  }
};

// Translation middleware
const translateResponse = async (req, res, next) => {
//   const targetLanguage = req.query.lang || 'fr'; // Default to French if no language specified

  // Save the original `send` method to call it after translation
  const originalSend = res.send;

  res.send = async (body) => {
    if (typeof body === 'object' && body.message) {
      // Translate only the message field if it exists
      body.message = await translateMessage(body.message,'fr');
    }
    originalSend.call(res, body);
  };

  next();
};

export { translateResponse };
