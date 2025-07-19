import { createServiceClient } from '../config/axiosConfig'

// ============================================
// Sử dụng createServiceClient
// ============================================

// Tạo service client cho endpoint cụ thể
const userService = createServiceClient('/users')
const productService = createServiceClient('/products')

// Service cho User
export const userAPI = {
  // Lấy danh sách users
  getAll: async (params = {}) => {
    try {
      const response = await userService.get('', { params })
      return response.data
    } catch (error) {
      console.error('❌ Lỗi khi lấy danh sách users:', error)
      throw error
    }
  },

  // Lấy user theo ID
  getById: async (id) => {
    try {
      const response = await userService.get(`/${id}`)
      return response.data
    } catch (error) {
      console.error('❌ Lỗi khi lấy user:', error)
      throw error
    }
  },

  // Tạo user mới
  create: async (userData) => {
    try {
      const response = await userService.post('', userData)
      return response.data
    } catch (error) {
      console.error('❌ Lỗi khi tạo user:', error)
      throw error
    }
  },

  // Cập nhật user
  update: async (id, userData) => {
    try {
      const response = await userService.put(`/${id}`, userData)
      return response.data
    } catch (error) {
      console.error('❌ Lỗi khi cập nhật user:', error)
      throw error
    }
  },

  // Xóa user
  delete: async (id) => {
    try {
      const response = await userService.delete(`/${id}`)
      return response.data
    } catch (error) {
      console.error('❌ Lỗi khi xóa user:', error)
      throw error
    }
  },

  // Login
  login: async (credentials) => {
    try {
      const response = await userService.post('/login', credentials)
      // Lưu token vào localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
      }
      return response.data
    } catch (error) {
      console.error('❌ Lỗi khi đăng nhập:', error)
      throw error
    }
  },

  // Logout
  logout: async () => {
    try {
      await userService.post('/logout')
      localStorage.removeItem('token')
    } catch (error) {
      console.error('❌ Lỗi khi đăng xuất:', error)
      // Vẫn xóa token dù có lỗi
      localStorage.removeItem('token')
      throw error
    }
  }
}

// Service cho Product
export const productAPI = {
  // Lấy danh sách sản phẩm với phân trang
  getAll: async (page = 1, limit = 10, search = '') => {
    try {
      const response = await productService.get('', {
        params: { page, limit, search }
      })
      return response.data
    } catch (error) {
      console.error('❌ Lỗi khi lấy danh sách sản phẩm:', error)
      throw error
    }
  },

  // Lấy sản phẩm theo danh mục
  getByCategory: async (categoryId) => {
    try {
      const response = await productService.get(`/category/${categoryId}`)
      return response.data
    } catch (error) {
      console.error('❌ Lỗi khi lấy sản phẩm theo danh mục:', error)
      throw error
    }
  },

  // Upload ảnh sản phẩm
  uploadImage: async (productId, formData) => {
    try {
      const response = await productService.post(
        `/${productId}/upload-image`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )
      return response.data
    } catch (error) {
      console.error('❌ Lỗi khi upload ảnh:', error)
      throw error
    }
  }
}

