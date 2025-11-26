# Cloudflare Pages 部署问题解决方案

## 问题分析
您的项目在Cloudflare Pages部署时出现"Unknown internal error occurred."错误，主要原因是：
1. `wrangler.toml`中的数据库ID仍然是占位符
2. JWT密钥硬编码在代码中
3. 环境变量配置不完整

## 解决步骤

### 1. 获取D1数据库ID
1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **"Workers & Pages"** → **"D1"**
3. 找到您的数据库（应该是`subscription-db`）
4. 复制实际的Database ID

### 2. 更新wrangler.toml
将获取到的Database ID替换到`backend/wrangler.toml`中的`database_id`字段：

```toml
[[d1_databases]]
binding = "DB"
database_name = "subscription-db"
database_id = "your-actual-database-id-here"
```

### 3. 修复安全配置
在`backend/src/routes/auth.ts`中，JWT密钥应该使用环境变量：

```typescript
const JWT_SECRET = c.env.JWT_SECRET || 'fallback-secret-change-in-prod';
```

### 4. 设置环境变量
在Cloudflare Pages项目设置中添加环境变量：
- `JWT_SECRET`: 一个强随机字符串（用于JWT签名）

### 5. 重新部署
1. 提交代码更改到GitHub
2. Cloudflare Pages会自动重新部署
3. 检查部署日志确保成功

## 预期结果
完成后，您的应用应该能够：
- ✅ 成功部署到Cloudflare Pages
- ✅ 前端静态文件正常访问
- ✅ API接口正常工作
- ✅ D1数据库连接正常

## 如果仍有问题
1. 检查Cloudflare Pages的Functions日志
2. 确认所有环境变量都已正确设置
3. 验证D1数据库权限设置