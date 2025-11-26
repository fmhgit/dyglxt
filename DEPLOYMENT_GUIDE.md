# Cloudflare Pages 完整部署指南

## ✅ 已完成的修复
1. **JWT密钥安全化** - 移除了硬编码的JWT密钥，现在使用环境变量
2. **配置更新** - 更新了wrangler.toml以支持环境变量
3. **代码优化** - 在所有认证相关函数中使用了安全的环境变量

## 🔄 需要您完成的步骤

### 步骤1: 获取D1数据库ID
1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **"Workers & Pages"** → **"D1"**
3. 找到您的数据库（应该叫 `subscription-db`）
4. 点击数据库名称
5. 在右侧面板复制 **"Database ID"**（格式类似：`a1b2c3d4-e5f6-7890-abcd-ef1234567890`）

### 步骤2: 更新配置文件
在 `backend/wrangler.toml` 中替换数据库ID：

```toml
[[d1_databases]]
binding = "DB"
database_name = "subscription-db"
database_id = "your-actual-database-id-here"  ← 替换这里
```

### 步骤3: 提交并部署
1. 提交代码更改到GitHub：
   ```bash
   git add .
   git commit -m "fix: 修复部署配置问题"
   git push origin main
   ```

2. Cloudflare Pages会自动重新部署

### 步骤4: 配置环境变量
在Cloudflare Pages项目设置中：
1. 进入 **"Settings"** → **"Functions"**
2. 添加环境变量：
   - **Name**: `JWT_SECRET`
   - **Value**: 一个强随机字符串（例如：`my-super-secret-jwt-key-2024-11-26`）

## 📋 预期部署流程

### 构建过程（应该成功）
```
✓ 依赖安装完成
✓ 前端构建成功（frontend/dist）
✓ 后端打包成功（_worker.js）
✓ 上传到Cloudflare成功
```

### 部署后的验证
1. 访问您的Cloudflare Pages URL
2. 检查前端是否正常显示
3. 测试API接口：
   ```
   GET https://your-domain.pages.dev/api/health
   ```
   应该返回：`{"status":"ok","message":"Subscription Manager API is running"}`

## 🐛 如果仍然失败

### 检查日志
1. 在Cloudflare Pages项目中查看 **"Functions"** 标签页的日志
2. 查看具体的错误信息

### 常见问题
- **"Unknown internal error"**: 通常是数据库配置问题
- **"Database not found"**: D1数据库ID未正确配置
- **"JWT_SECRET missing"**: 环境变量未设置

### 重新初始化数据库
如果需要，可以创建D1数据库迁移：
```bash
wrangler d1 create subscription-db
wrangler d1 execute subscription-db --local --file=./migrations/001_init.sql
```

## 📞 技术支持
如果按照此指南操作后仍有问题，请提供：
1. Cloudflare Pages部署日志
2. D1数据库ID确认
3. 环境变量设置截图