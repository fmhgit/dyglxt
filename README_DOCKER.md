# Docker 部署与 NAS 导入指南

本指南将帮助您构建 Subscription Management System 的 Docker 镜像，并将其导入到您的 NAS 中。

## 前置要求

- 您的电脑上已安装 Docker Desktop 或 Docker Engine。
- 您的 NAS 支持 Docker（如群晖 Container Manager、威联通 Container Station 或 Portainer）。

## 1. 构建镜像

在项目根目录下打开终端（Terminal 或 CMD），运行以下命令构建镜像：

```bash
# 构建名为 dyglxt 的镜像
docker build -t dyglxt .
```

> **注意**：如果您使用的是 Apple Silicon (M1/M2/M3) 芯片的 Mac，而 NAS 是 Intel/AMD (x86_64) 架构，请使用以下命令构建以确保兼容性：
> ```bash
> docker build --platform linux/amd64 -t dyglxt .
> ```
> 反之亦然。如果不确定，通常 `linux/amd64` 是 NAS 最常用的架构。

## 2. 导出镜像

构建完成后，将镜像保存为 `.tar` 文件，以便传输到 NAS：

```bash
docker save -o dyglxt.tar dyglxt
```

这将在当前目录下生成一个 `dyglxt.tar` 文件。

## 3. 导入到 NAS

1.  将 `dyglxt.tar` 文件上传到您的 NAS 文件系统中。
2.  打开 NAS 的 Docker 管理工具（如群晖 Container Manager）。
3.  找到“镜像”或“Image”部分，选择“导入”或“Import”。
4.  选择上传的 `dyglxt.tar` 文件进行导入。

## 4. 创建容器

### 方法 A：使用 Docker Compose (推荐)

如果您的 NAS 支持 Docker Compose（如群晖 Container Manager 的“项目”功能，或 Portainer 的 "Stacks"）：

1.  创建一个新项目/Stack。
2.  将 `docker-compose.yml` 的内容复制进去。
3.  **重要**：修改 `docker-compose.yml` 中的 `image: dyglxt`（如果导入的镜像没有标签，可能需要手动指定）。或者，如果您已经导入了本地镜像，确保 Compose 文件中使用的镜像名称与导入的一致。
    *   *提示*：通常本地导入的镜像在 Compose 中直接使用 `image: dyglxt` 即可。
4.  启动项目。

### 方法 B：手动创建容器

1.  在 Docker 管理工具中，选中导入的 `dyglxt` 镜像，点击“运行”或“创建容器”。
2.  配置端口映射：将容器端口 `3000` 映射到 NAS 的任意空闲端口（例如 `3000`）。
3.  配置存储卷（Volume）：
    - 将容器路径 `/app/data` 映射到 NAS 上的一个文件夹（用于持久化保存数据库）。
4.  配置环境变量（Environment Variables）：
    - `NODE_ENV`: `production`
    - `JWT_SECRET`: 设置一个安全的随机字符串。
    - `DB_PATH`: `/app/data/sqlite.db` (通常默认即可，只要映射了 `/app/data`)
5.  启动容器。

## 常见问题

- **数据库未持久化**：请务必确保 `/app/data` 目录已正确映射到 NAS 的文件夹，否则重启容器后数据会丢失。
- **架构不匹配**：如果容器启动后立即停止并报错 `exec format error`，说明镜像架构与 NAS CPU 不匹配。请参考“构建镜像”部分的 `--platform` 参数重新构建。
