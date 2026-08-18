# AI HomeLab Dashboard

一个通过本机与 Tailnet 访问的 Home Dashboard。Home 页通过脱敏快照展示 Tailscale 在线状态、活动连接路径、Home DERP 与延迟；AI 页只读访问 CC Switch SQLite 数据，并展示 CodexBar Provider 额度。

![AI HomeLab Dashboard 预览（脱敏演示数据）](docs/dashboard-preview.png)

AI HomeLab 将本机与 OpenRouter 用量集中在一个轻量 Dashboard 中：Home 页展示 Tailnet 状态与连接路径，AI 页支持本地/OpenRouter 数据源切换、Provider 额度、最近活动的 TTFT/Time/TPS、调用中状态和模型排行。界面采用卡片式汇总、活动与排行双栏布局、低对比度平滑动画，并兼顾桌面端与移动端显示。

## 启动

1. 启动 OrbStack。
2. 复制环境变量示例，并将其中的 `yourname` 替换为当前 macOS 用户名：

   ```bash
   cp .env.example .env
   ```

   默认只监听 `127.0.0.1`。如需从同一 Tailnet 的其他设备访问，运行
   `tailscale ip -4` 获取本机 Tailscale IPv4 地址，并将其填入 `.env` 的
   `DASHBOARD_BIND_IP`。不要设置为 `0.0.0.0`，除非明确希望同时向其他网络接口开放。

3. 启动 Mac 宿主机上的 HomeDash 采集器：

   ```bash
   ./scripts/codexbar-collector start
   ```

   如需展示 OpenRouter 账户余额和最近 30 个已结束 UTC 日的模型用量，先在
   OpenRouter 后台创建专用 Management Key，然后通过 macOS Keychain 的安全提示录入：

   ```bash
   ./scripts/openrouter-key set
   ./scripts/openrouter-key status
   ```

   `set` 不接收命令行中的明文密钥；请直接在 Keychain 提示中输入。删除本机副本使用
   `./scripts/openrouter-key delete`，删除后仍需在 OpenRouter 后台撤销远端 Key。

4. 在本目录运行：

   ```bash
   docker compose up -d --build
   ```

5. 使用 `.env` 中配置的地址和端口 `8787` 打开 Dashboard。默认地址为
   <http://127.0.0.1:8787>。

停止服务：

```bash
docker compose down
```

采集器每 5 分钟刷新一次，关闭终端后仍会运行；Mac 重启后需要手动再次执行 `start`。管理命令：

```bash
./scripts/codexbar-collector status
./scripts/codexbar-collector once
./scripts/codexbar-collector stop
```

采集器日志位于同一目录的 `codexbar-collector.log`。活动日志达到 1 MiB 后自动轮转为
`codexbar-collector.log.1`，仅保留一个备份，因此日志占用约限制在 2 MiB；两个日志文件权限均为 `600`。

采集器调用本机 CodexBar、Tailscale CLI、Clash Verge Unix socket 与 OpenRouter 官方只读查询接口，并把对应脱敏结果原子写入
`~/Library/Application Support/HomeDash/`。目录权限为 `700`，快照权限为 `600`。Docker 只读挂载该目录，不接触 CodexBar 凭据、Tailscale LocalAPI/socket 或 CLI 原始输出。Tailscale 快照只保留在线状态、连接路径枚举、公开 DERP 区域、延迟与时间，不保存设备名、IP、用户、Peer 数量或节点标识。连续 15 分钟没有成功数据时，对应面板独立显示数据延迟。

Provider、Tailscale、Mihomo 与 OpenRouter 仍按 5 分钟采集。另有一个约 1 秒周期的轻量观察线程，仅在 CC Switch 对应应用的 `proxy_config.enabled` 已启用时读取 Codex/Claude 会话事件的元数据，并生成 `ai-live-activity.json`。该快照只包含应用、模型、调用状态、时间和估算性能值，不包含提示词、回复正文、文件路径、工具参数、会话标识或原始错误；超过 5 秒未更新时，API 会清空进行中记录。

Clash Verge 采集只读取本机配置中的 Unix socket 路径和 secret，并精确查询 `PROXY` 组。两者只在采集进程内存中使用；快照与 API 仅保留当前选中节点名称、状态和时间，不保存候选节点、服务器地址、订阅或原始错误。HomeDash 不会启用 Clash Verge TCP 控制端口，也不能切换节点。

OpenRouter Management Key 固定存放在 macOS Keychain 的
`homedash.openrouter.management` 条目中。采集器只向
`https://openrouter.ai/api/v1/activity` 和 `/api/v1/credits` 发送 GET 请求；Key 不进入
Docker、环境变量、日志、快照或浏览器。OpenRouter 快照只保留账户 credits 汇总及按模型聚合的公开用量字段，不保存 endpoint ID、API Key hash、workspace、用户或账户身份。Management Key 本身具有管理 API Key 的权限，建议为 HomeDash 单独创建并定期轮换。

Compose 使用 `.env` 中的 `CC_SWITCH_DB_PATH` 只读挂载 CC Switch 数据库：

```bash
CC_SWITCH_DB_PATH=/absolute/path/to/cc-switch.db docker compose up -d --build
```

快照目录通过 `CODEXBAR_SNAPSHOT_DIR` 配置；宿主机 UID/GID 可通过
`DASHBOARD_UID` 和 `DASHBOARD_GID` 调整。示例值 `501:20` 是常见的首个 macOS
用户身份，实际值可通过 `id -u` 和 `id -g` 查询。

容器只绑定 `DASHBOARD_BIND_IP` 指定的地址，默认是 `127.0.0.1`；设置为
Tailscale IP 时只通过该 Tailnet 地址访问。它看不到 CC Switch 的认证文件、设置、日志或会话正文。

## 数据口径

- 可选范围：今日、最近 7 天、最近 30 天。
- 可选应用：全部、Codex、Claude。
- 总 Token 按 CC Switch 用量口径汇总输入、输出、缓存读取与缓存创建 Token。
- 模型排行按总 Token 排序，占比也按总 Token 计算；名称优先使用 CC Switch `model_pricing.display_name`，缺失时回退到原始模型 ID。
- Provider 额度不受日期和 Codex/Claude 筛选影响；按量付费显示余额，Coding plan 的进度条表示剩余额度。
- AI 页可在“本地 / OpenRouter”之间切换整套用量视图。OpenRouter 范围固定为最近 30 个已结束的 UTC 日，模型按 credits 用量排序，不与 CC Switch 本地排行混合。
- Tailscale 活动连接路径是所有活动 Peer 的脱敏汇总；Home DERP 的存在不代表当前流量一定经过 DERP。
- TTFT、Time、TPS 和“调用中”状态只在对应应用的 CC Switch 路由模式启用时显示；“全部”筛选下任一应用启用即保留指标位置，缺失值显示 `—`。已完成请求优先使用 CC Switch 数据库精确值，进行中值标记为估算。

## 商标说明

最近活动中的 OpenAI Blossom 与 Anthropic 标识仅用于识别对应调用来源。OpenAI 与 Anthropic 的名称及标识归各自权利人所有；HomeDash 与两家公司不存在赞助或背书关系。使用时应同时遵循 [OpenAI 品牌指南](https://openai.com/brand/)与 [Anthropic Press Kit](https://www.anthropic.com/press-kit)。

## 本地测试

无需安装 Python 包：

```bash
PYTHONPATH=. PYTHONPYCACHEPREFIX=/tmp/cc-dashboard-pycache python3 -m unittest discover -s tests -v
node --check static/app.js
```

健康检查：

```bash
curl http://127.0.0.1:8787/api/v1/health
curl http://127.0.0.1:8787/api/v1/providers
curl http://127.0.0.1:8787/api/v1/tailscale
curl http://127.0.0.1:8787/api/v1/clash-verge
curl http://127.0.0.1:8787/api/v1/openrouter
curl http://127.0.0.1:8787/api/v1/live-activity
```

[界面与功能参考：NodeSeek 帖子](https://www.nodeseek.com/post-810228-2)
