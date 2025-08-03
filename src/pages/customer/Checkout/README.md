# Checkout System - Green Kitchen

## 📋 Tổng quan
Hệ thống checkout hoàn chỉnh cho khách hàng đặt hàng, bao gồm:

## 🗂️ Structure Components
```
Checkout/
├── Checkout.jsx                 # Main checkout page
└── components/
    ├── DeliveryInfoForm.jsx     # Form thông tin giao hàng
    ├── PaymentMethodForm.jsx    # Form chọn phương thức thanh toán  
    ├── OrderSummary.jsx         # Tóm tắt đơn hàng
    └── OrderConfirmDialog.jsx   # Dialog xác nhận đơn hàng
```

## ✨ Features

### 1. **DeliveryInfoForm Component**
- ✅ Thông tin người nhận (tên, số điện thoại)
- ✅ Địa chỉ giao hàng đầy đủ (đường, phường, quận, thành phố)
- ✅ Chọn thời gian giao hàng với DateTimePicker
- ✅ Validation form đầy đủ

### 2. **PaymentMethodForm Component**  
- ✅ 2 phương thức thanh toán:
  - 💰 COD (Thanh toán khi nhận hàng)
  - 💳 Thanh toán bằng thẻ
- ✅ UI hiện đại với icons và mô tả
- ✅ Thông báo bổ sung cho từng phương thức

### 3. **OrderSummary Component**
- ✅ Hiển thị danh sách món ăn đã chọn
- ✅ Tính toán giá tự động:
  - Tạm tính
  - Phí vận chuyển (miễn phí > 200k)
  - Giảm giá thành viên (5%)
  - Tổng cộng cuối cùng
- ✅ Format giá theo VNĐ

### 4. **OrderConfirmDialog Component**
- ✅ Review tất cả thông tin trước khi đặt hàng
- ✅ Hiển thị đầy đủ:
  - Thông tin giao hàng
  - Phương thức thanh toán  
  - Tóm tắt đơn hàng
- ✅ Xác nhận cuối cùng

### 5. **Main Checkout Page**
- ✅ Layout responsive với Grid
- ✅ State management hoàn chỉnh
- ✅ Integration với Redux để lấy cart
- ✅ API call để tạo order
- ✅ Validation và error handling
- ✅ Progress indicator khi loading
- ✅ Navigation sau khi đặt hàng thành công

## 🎨 Design System
- ✅ Consistent với theme hiện tại (#4C082A primary color)
- ✅ White cards với border radius 5
- ✅ Header màu #f8f9fa cho mỗi section
- ✅ Icons Material-UI phù hợp
- ✅ Responsive design

## 🔄 User Flow
1. **Checkout page** → Nhập thông tin giao hàng
2. **Chọn phương thức thanh toán** → COD hoặc Card
3. **Review order summary** → Xem tóm tắt giá
4. **Click "Đặt hàng ngay"** → Validation form
5. **Confirmation dialog** → Review tất cả thông tin
6. **Click "Xác nhận đặt hàng"** → API call
7. **Success** → Redirect đến orders page

## 🛠️ Technical Details

### State Management
```javascript
- deliveryInfo: Thông tin giao hàng
- paymentMethod: 'cod' | 'card'  
- orderSummary: Tính toán giá
- errors: Form validation
- loading: API call state
```

### API Integration
```javascript
- createOrder(orderData) → POST /apis/v1/orders
- updateOrder(orderId, data) → PUT /apis/v1/orders/:id
- getOrderById(orderId) → GET /apis/v1/orders/:id
```

### Validation Rules
- ✅ Tên người nhận: required
- ✅ Số điện thoại: required, 10-11 digits
- ✅ Địa chỉ: tất cả field required
- ✅ Thời gian giao hàng: required, >= hiện tại

## 🚀 Usage

### Import và sử dụng:
```jsx
import Checkout from '~/pages/customer/Checkout/Checkout'

// Route
<Route path="/customer/checkout" element={<Checkout />} />
```

### Prerequisites:
- ✅ User phải đăng nhập
- ✅ Cart phải có ít nhất 1 món
- ✅ Redux store có meal state
- ✅ Backend API đã implement Order system

## 📦 Dependencies
```json
{
  "@mui/material": "UI components",
  "@mui/x-date-pickers": "DateTime picker",
  "react-router-dom": "Navigation", 
  "react-redux": "State management"
}
```

## 🎯 Next Steps
1. Implement payment gateway cho card method
2. Add coupon/discount code system
3. Add order tracking
4. Email confirmation
5. SMS notification

---
**Designed by AI Assistant** 🤖 | **Theme: Green Kitchen** 🥬
