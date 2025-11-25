# 订阅管理系统 (Subscription Manager)

一个基于 Cloudflare Workers + Hono + React + D1 的现代化订阅管理系统。支持多渠道通知、农历显示、自动续期计算等功能。

## ✨ 功能特点

- **订阅管理**：轻松管理会员、域名、服务器等各类订阅服务。
- **智能提醒**：支持自定义提前提醒天数，精确到分钟的通知推送。
- **农历支持**：完美支持农历生日/纪念日提醒（如：每年农历正月初一）。
- **多渠道通知**：
  - Telegram Bot
  - iOS Bark
  - 企业微信机器人
  - 自定义 Webhook
  - Email (Resend)
- **数据安全**：支持数据导出备份与恢复 (JSON 格式)。
- **现代化 UI**：响应式设计，适配移动端与桌面端，极致的用户体验。

## 🛠️ 技术栈

- **Frontend**: React, Vite, TailwindCSS, Lucide Icons
- **Backend**: Hono, Drizzle ORM
- **Database**: Cloudflare D1 (Production), SQLite (Docker/Local)
## 部署 (Deployment)

### 方式一：Cloudflare Pages (推荐，最简单)

这种方式不需要您购买服务器，也不需要懂代码，完全免费且速度快。

1.  **Fork 本项目**
    - 点击右上角的 "Fork" 按钮，将本项目复制到您的 GitHub 账号下。

2.  **连接 Cloudflare Pages**
    - 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)。
    - 进入 "Compute (Workers & Pages)" -> "Pages"。
    - 点击 "Connect to Git"，选择您刚才 Fork 的仓库。

3.  **配置构建设置**
    - **Project name**: 随便填，例如 `subscription-manager`。
    - **Production branch**: `main`
    - **Framework preset**: `None` (不要选任何预设)
    - **Build command**: `npm run build`
    - **Build output directory**: `frontend/dist`
    - 点击 "Save and Deploy"。

4.  **配置数据库 (D1)**
    - 部署完成后，进入项目设置 -> "Settings" -> "Functions"。
    - 找到 "D1 Database Bindings"。
    - Variable name 填写 `DB`。
    - D1 Database 选择您创建的数据库（如果没有，去 "Workers & Pages" -> "D1" 创建一个）。
    - 点击 "Save"。
    - **重新部署**：去 "Deployments" 选项卡，点击最新的部署右边的三个点，选择 "Retry deployment"。

### 方式二：Docker (NAS / VPS)

如果您有 NAS (群晖/威联通) 或 VPS，可以使用 Docker 部署。请查看 [Docker 部署指南](./README_DOCKER.md)。

### 方式三：Cloudflare Workers (高级)

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cpuboy/subscription-manager)

适合开发者进行二次开发。
   ```
6. **部署**：
   ```bash
   npm run deploy
   ```
   这会自动构建前端并部署后端 Worker。

### 方法二：Docker 部署 (备用)

如果 Cloudflare 不可用，你可以使用 Docker 部署到任何服务器。

1. **构建并启动**：
   ```bash
   docker-compose up -d
   ```
2. **访问**：
   打开浏览器访问 `http://localhost:3000`。
3. **数据持久化**：
   数据保存在 `./data` 目录下。

## 📅 农历功能说明

在添加订阅时，开启“农历日期”开关，并选择对应的农历日期。系统会自动计算每年的对应公历日期进行提醒。

## 🔔 通知配置

在“设置”页面配置各渠道的参数：
- **Telegram**: 需要 Bot Token 和 Chat ID。
- **Bark**: 需要 Bark Key。
- **Webhook**: 支持自定义 POST 请求。

## 📝 版权信息

Copyright © 2024 Fan Jianhui. All rights reserved.
