import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001';

export const predictEmailCategory = async (emailData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/predict/ml`, {
      title: emailData.title,
      content: emailData.content,
      from_email: emailData.sender
    });

    return response.data;
  } catch (error) {
    console.error('Error calling ML prediction API:', error);
    throw new Error('Có lỗi xảy ra khi phân tích email. Vui lòng thử lại.');
  }
};

