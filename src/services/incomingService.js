import {createServiceClient } from '../config/axiosConfig'

// ============================================
// Sử dụng createServiceClient
// ============================================

// Tạo service client cho endpoint cụ thể

const productService = createServiceClient('/EmailCheck')

// Service cho User
export const emailCheckService = {
  // Lấy danh sách emails
  getDataSearch: async (params) => {
    const response = await productService.post('/GetData', params);
    console.log("response",response.data);
    return response.data;
  }
}

