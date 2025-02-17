# 第一阶段：构建阶段
FROM node:20 AS builder

# 安装 pnpm
RUN npm install -g pnpm

# 设置工作目录
WORKDIR /app

# 复制 package.json、pnpm-lock.yaml 和 .npmrc（如果有的话）
COPY package.json pnpm-lock.yaml ./

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY . .

# 构建生产版本
RUN pnpm run build

# 第二阶段：运行阶段
FROM nginx:alpine

# 复制构建的文件到 Nginx 的默认路径
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制自定义 Nginx 配置文件（可选）
# COPY nginx.conf /etc/nginx/nginx.conf

# 暴露端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
