# Base image
FROM node:18-alpine

# Đặt thư mục làm việc trong container
WORKDIR /app

# Copy package.json và lock file
COPY package*.json ./

# Cài dependencies
RUN npm install

# Copy toàn bộ mã nguồn
COPY . .

# Mở port 3000
EXPOSE 3000

# Khởi chạy ứng dụng
CMD ["node", "index.js"]
