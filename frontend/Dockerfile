# Step 1: build
FROM node:20-alpine AS builder
WORKDIR /app

# 先複製 package.json 與 lock 檔，加速重 build
COPY package.json package-lock.json ./
RUN npm install

# 再把整個專案複製進來
COPY . ./

# 執行打包（Vite 預設輸出到 dist）
RUN npm run build

# Step 2: serve with nginx + custom proxy
FROM nginx:stable-alpine

# 把打包好的檔案放到 nginx 的預設靜態目錄
COPY --from=builder /app/dist /usr/share/nginx/html

# 複製自訂的 nginx.conf（裡面包含 /api proxy 設定）
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
