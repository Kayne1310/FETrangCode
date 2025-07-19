import axios from 'axios';

const API_BASE_URL = 'https://watchers-ai.btecit.tech/predict';

export const predictEmailCategory = async (emailData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/ml`, {
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

