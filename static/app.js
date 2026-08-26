const translations = {
  zh: {
    navHome: "Home",
    navBus: "Bus",
    navAsst: "Asst",
    navDarkroom: "Darkroom",
    tailscaleWaiting: "正在等待 Tailscale",
    tailscaleUpdated: "Tailscale · {time}",
    tailscaleDelayed: "Tailscale 数据延迟 · {time}",
    tailscaleUnavailable: "Tailscale 状态数据暂不可用",
    tailscaleDataDelayed: "Tailscale 探测暂时失败，正在显示最后一次成功数据。",
    tailscaleStatus: "Tailscale 状态",
    tailscaleOnline: "在线",
    tailscaleOffline: "离线",
    tailscaleUnknown: "暂不可用",
    privateNetwork: "私有网络",
    activeTransport: "活动连接路径",
    transportScope: "所有活动 Peer 的脱敏汇总",
    transportDirect: "P2P 直连",
    transportDerp: "DERP 中继",
    transportPeerRelay: "Peer Relay",
    transportMixed: "混合路径",
    transportIdle: "无活动连接",
    transportUnknown: "未知",
    homeDerp: "Home DERP",
    derpLatency: "DERP 延迟",
    derpRoundTrip: "当前 Home DERP 往返延迟",
    transportExplanation: "Home DERP 是节点的中继归属区域；活动连接仍可能使用 P2P 直连。",
    currentProxy: "PROXY",
    selectedNode: "已选节点",
    clashWaiting: "正在等待 Mihomo",
    clashUpdated: "Mihomo · {time}",
    clashDelayed: "Mihomo 数据延迟 · {time}",
    clashUnavailable: "Mihomo 状态暂不可用",
    clashSelected: "已选择",
    clashDelayedStatus: "数据延迟",
    clashUnavailableStatus: "暂不可用",
    connecting: "正在连接",
    live: "实时",
    delayed: "数据稍有延迟",
    disconnected: "连接中断",
    localOnly: "本机",
    loadingPage: "正在加载页面数据",
    localData: "本地",
    today: "今日",
    sevenDays: "7 天",
    thirtyDays: "30 天",
    all: "全部",
    todayUsage: "今日用量",
    sevenDayUsage: "7 天用量",
    thirtyDayUsage: "30 天用量",
    requests: "次请求",
    primaryModel: "主要模型",
    byTokenVolume: "按 Token 用量",
    successRate: "成功率",
    successfulRequests: "{success} / {total} 次成功",
    totalTokens: "总 Token",
    trendKicker: "TREND",
    trendTitle: "Token 用量趋势",
    trendInput: "输入",
    trendOutput: "输出",
    trendCache: "缓存",
    trendCacheRate: "缓存率 {value}%",
    providerQuotas: "Provider 额度",
    remainingCapacity: "剩余额度",
    providerWaiting: "正在等待 CodexBar",
    providerUpdated: "CodexBar · {time}",
    providerDelayed: "CodexBar 数据延迟 · {time}",
    providerUnavailable: "CodexBar 额度数据暂不可用",
    providerNoProviders: "CodexBar 当前没有启用的 Provider",
    providerLive: "实时",
    providerStale: "延迟",
    providerUnavailableStatus: "暂不可用",
    balance: "可用余额",
    credits: "credits",
    paid: "已付费",
    granted: "赠送",
    used: "已使用",
    totalAdded: "累计添加",
    noQuotaData: "当前 Provider 没有可展示的额度信息",
    openrouterUsage: "账户用量",
    openrouterWaiting: "正在等待 OpenRouter",
    openrouterUpdated: "OpenRouter · {time}",
    openrouterDelayed: "OpenRouter 数据延迟 · {time}",
    openrouterUnavailable: "OpenRouter 用量暂不可用，请配置 Management Key 并运行采集器。",
    openrouterPartial: "部分 OpenRouter 数据暂时不可用，正在显示最近一次成功结果。",
    openrouterRemaining: "剩余 Credits",
    officialCredits: "OpenRouter 官方账户余额",
    openrouterUsage30d: "30 日用量",
    completedUtcDays: "已结束的 UTC 日",
    openrouterRequests: "请求数",
    lastThirtyCompletedDays: "最近 30 个已结束的 UTC 日",
    openrouterTopModel: "主要模型",
    byCreditsUsage: "按 Credits 用量",
    openrouterModels: "模型用量",
    creditsShare: "Credits 占比",
    throughUtcDate: "数据截至 {date} UTC",
    noOpenrouterModels: "最近 30 个已结束的 UTC 日内没有模型用量",
    openrouterActivity: "模型用量",
    openrouterActivityHint: "30 日聚合",
    totalModels: "共 {count} 个模型",
    promptShort: "输入",
    completionShort: "输出",
    reasoningShort: "推理",
    quotaRemaining: "剩余 {percent}%",
    resetAt: "重置",
    resetNow: "即将重置",
    manualResets: "手动重置",
    manualResetsAvailable: "{count} 次可用",
    resetCreditExpires: "到期 {time} · {relative}",
    resetCreditNoExpiry: "永久有效",
    resetCreditExpiresSoon: "即将到期",
    resetInMinutes: "{count} 分钟后",
    resetInHours: "{count} 小时后",
    resetInDays: "{count} 天后",
    fiveHourLimit: "5 小时限额",
    dailyLimit: "每日限额",
    weeklyLimit: "7 天限额",
    weeklyRemaining: "本周剩余",
    weeklyQuotaPlans: "覆盖 {count} 个周额度",
    weeklyElapsed: "本周已过 {value}%",
    weeklyPaceOk: "进度健康",
    weeklyPaceFast: "消耗偏快",
    monthlyLimit: "月度限额",
    minuteWindowLimit: "{count} 分钟限额",
    hourWindowLimit: "{count} 小时限额",
    dayWindowLimit: "{count} 天限额",
    customLimit: "额度窗口",
    lastSuccess: "上次成功：{time}",
    latestActivity: "最近活动",
    requestStream: "请求记录",
    calling: "调用中",
    completed: "完成",
    failed: "失败",
    ttft: "TTFT",
    elapsedTime: "Time",
    estimatedMetric: "估算值",
    modelRankings: "模型排行",
    tokenShare: "Token 占比",
    waitingForData: "正在等待数据",
    updatedEvery: "每 10 秒更新 · {time}",
    totalRequests: "共 {count} 次",
    noActivity: "当前筛选范围内没有活动记录",
    noModels: "当前筛选范围内没有模型数据",
    databaseDelayed: "数据库暂时不可读，正在显示最后一次成功数据。",
    databaseUnavailable: "暂时无法读取 CC Switch 数据，请确认 CC Switch 数据库已挂载。",
    cache: "缓存",
    cost: "费用",
    schema: "Schema v{version}",
    justNow: "刚刚",
  },
  en: {
    navHome: "Home",
    navBus: "Bus",
    navAsst: "Asst",
    navDarkroom: "Darkroom",
    tailscaleWaiting: "Waiting for Tailscale",
    tailscaleUpdated: "Tailscale · {time}",
    tailscaleDelayed: "Tailscale delayed · {time}",
    tailscaleUnavailable: "Tailscale status data is unavailable",
    tailscaleDataDelayed: "Tailscale probing failed temporarily. Showing the last good snapshot.",
    tailscaleStatus: "Tailscale Status",
    tailscaleOnline: "Online",
    tailscaleOffline: "Offline",
    tailscaleUnknown: "Unavailable",
    privateNetwork: "Private network",
    activeTransport: "Active Transport",
    transportScope: "Sanitized summary of all active peers",
    transportDirect: "P2P Direct",
    transportDerp: "DERP Relay",
    transportPeerRelay: "Peer Relay",
    transportMixed: "Mixed Paths",
    transportIdle: "No Active Link",
    transportUnknown: "Unknown",
    homeDerp: "Home DERP",
    derpLatency: "DERP Latency",
    derpRoundTrip: "Round-trip latency to the current Home DERP",
    transportExplanation: "Home DERP is the node's relay region; active connections may still use direct P2P paths.",
    currentProxy: "PROXY",
    selectedNode: "Selected Node",
    clashWaiting: "Waiting for Mihomo",
    clashUpdated: "Mihomo · {time}",
    clashDelayed: "Mihomo delayed · {time}",
    clashUnavailable: "Mihomo status is unavailable",
    clashSelected: "selected",
    clashDelayedStatus: "delayed",
    clashUnavailableStatus: "unavailable",
    connecting: "connecting",
    live: "live",
    delayed: "data delayed",
    disconnected: "disconnected",
    localOnly: "local",
    loadingPage: "Loading dashboard data",
    localData: "Local",
    today: "Today",
    sevenDays: "7 days",
    thirtyDays: "30 days",
    all: "All",
    todayUsage: "Today Usage",
    sevenDayUsage: "7-Day Usage",
    thirtyDayUsage: "30-Day Usage",
    requests: "requests",
    primaryModel: "Primary Model",
    byTokenVolume: "By token volume",
    successRate: "Success Rate",
    successfulRequests: "{success} / {total} successful",
    totalTokens: "Total Tokens",
    trendKicker: "TREND",
    trendTitle: "Token Usage Trend",
    trendInput: "Input",
    trendOutput: "Output",
    trendCache: "Cache",
    trendCacheRate: "Cache rate {value}%",
    providerQuotas: "Provider Quotas",
    remainingCapacity: "Remaining Capacity",
    providerWaiting: "Waiting for CodexBar",
    providerUpdated: "CodexBar · {time}",
    providerDelayed: "CodexBar delayed · {time}",
    providerUnavailable: "CodexBar quota data is unavailable",
    providerNoProviders: "No providers are enabled in CodexBar",
    providerLive: "live",
    providerStale: "delayed",
    providerUnavailableStatus: "unavailable",
    balance: "Available Balance",
    credits: "credits",
    paid: "Paid",
    granted: "Granted",
    used: "Used",
    totalAdded: "Total added",
    noQuotaData: "No quota details are available for this provider",
    openrouterUsage: "Account Usage",
    openrouterWaiting: "Waiting for OpenRouter",
    openrouterUpdated: "OpenRouter · {time}",
    openrouterDelayed: "OpenRouter delayed · {time}",
    openrouterUnavailable: "OpenRouter usage is unavailable. Configure the Management Key and run the collector.",
    openrouterPartial: "Some OpenRouter data is unavailable. Showing the latest successful values.",
    openrouterRemaining: "Remaining Credits",
    officialCredits: "Official OpenRouter account balance",
    openrouterUsage30d: "30-Day Usage",
    completedUtcDays: "Completed UTC days",
    openrouterRequests: "Requests",
    lastThirtyCompletedDays: "Last 30 completed UTC days",
    openrouterTopModel: "Top Model",
    byCreditsUsage: "By credits usage",
    openrouterModels: "Model Usage",
    creditsShare: "Credits Share",
    throughUtcDate: "Data through {date} UTC",
    noOpenrouterModels: "No model usage in the last 30 completed UTC days",
    openrouterActivity: "Model Usage",
    openrouterActivityHint: "30-day aggregate",
    totalModels: "{count} models",
    promptShort: "Prompt",
    completionShort: "Completion",
    reasoningShort: "Reasoning",
    quotaRemaining: "{percent}% remaining",
    resetAt: "Resets",
    resetNow: "resetting soon",
    manualResets: "Manual resets",
    manualResetsAvailable: "{count} available",
    resetCreditExpires: "Expires {time} · {relative}",
    resetCreditNoExpiry: "No expiry",
    resetCreditExpiresSoon: "expiring soon",
    resetInMinutes: "in {count} min",
    resetInHours: "in {count} hr",
    resetInDays: "in {count} days",
    fiveHourLimit: "5-hour limit",
    dailyLimit: "Daily limit",
    weeklyLimit: "7-day limit",
    weeklyRemaining: "Week left",
    weeklyQuotaPlans: "{count} weekly plans",
    weeklyElapsed: "{value}% of week elapsed",
    weeklyPaceOk: "On track",
    weeklyPaceFast: "Burning fast",
    monthlyLimit: "Monthly limit",
    minuteWindowLimit: "{count}-minute limit",
    hourWindowLimit: "{count}-hour limit",
    dayWindowLimit: "{count}-day limit",
    customLimit: "Quota window",
    lastSuccess: "Last success: {time}",
    latestActivity: "Latest Activity",
    requestStream: "Request Stream",
    calling: "Calling",
    completed: "Completed",
    failed: "Failed",
    ttft: "TTFT",
    elapsedTime: "Time",
    estimatedMetric: "Estimated",
    modelRankings: "Model Rankings",
    tokenShare: "Token Share",
    waitingForData: "Waiting for data",
    updatedEvery: "Updated every 10s · {time}",
    totalRequests: "{count} total",
    noActivity: "No activity in this range",
    noModels: "No model data in this range",
    databaseDelayed: "The database is temporarily unavailable. Showing the last good snapshot.",
    databaseUnavailable: "CC Switch data is unavailable. Check the read-only database mount.",
    cache: "Cache",
    cost: "Cost",
    schema: "Schema v{version}",
    justNow: "just now",
  },
};

const state = {
  language: localStorage.getItem("cc-dashboard-language") === "en" ? "en" : "zh",
  view: window.location.hash === "#ai" ? "ai" : "home",
  source: localStorage.getItem("cc-dashboard-source") === "openrouter" ? "openrouter" : "local",
  range: "today",
  app: "all",
  payload: null,
  fetching: false,
  dashboardRequestKey: null,
  dashboardReloadPending: false,
  providerPayload: null,
  providerFetching: false,
  providerFailed: false,
  tailscalePayload: null,
  tailscaleFetching: false,
  tailscaleFailed: false,
  clashPayload: null,
  clashFetching: false,
  clashFailed: false,
  openrouterPayload: null,
  openrouterFetching: false,
  openrouterFailed: false,
  livePayload: null,
  liveFetching: false,
  renderedSource: null,
  renderedView: null,
};

const elements = {
  navHome: document.querySelector("#nav-home"),
  navAi: document.querySelector("#nav-ai"),
  navIndicator: document.querySelector(".nav-indicator"),
  dashboard: document.querySelector(".dashboard"),
  pageLoader: document.querySelector("#page-loader"),
  homeView: document.querySelector("#home-view"),
  aiView: document.querySelector("#ai-view"),
  homeProviderSlot: document.querySelector("#home-provider-slot"),
  aiProviderSlot: document.querySelector("#ai-provider-slot"),
  providerPanel: document.querySelector("#provider-panel"),
  connectionDot: document.querySelector("#connection-dot"),
  connectionLabel: document.querySelector("#connection-label"),
  languageToggle: document.querySelector("#language-toggle"),
  sourceFilter: document.querySelector("#source-filter"),
  localFilters: document.querySelector("#local-filters"),
  openrouterPeriod: document.querySelector("#openrouter-period"),
  rangeFilter: document.querySelector("#range-filter"),
  appFilter: document.querySelector("#app-filter"),
  notice: document.querySelector("#notice"),
  requestsLabel: document.querySelector("#requests-label"),
  requestsValue: document.querySelector("#requests-value"),
  requestsHint: document.querySelector("#requests-hint"),
  modelLabel: document.querySelector("#model-label"),
  modelValue: document.querySelector("#model-value"),
  modelHint: document.querySelector("#model-hint"),
  successLabel: document.querySelector("#success-label"),
  successValue: document.querySelector("#success-value"),
  successHint: document.querySelector("#success-hint"),
  tokensLabel: document.querySelector("#tokens-label"),
  tokensValue: document.querySelector("#tokens-value"),
  tokensHint: document.querySelector("#tokens-hint"),
  tokensSourceHint: document.querySelector("#tokens-source-hint"),
  tokenInValue: document.querySelector("#token-in-value"),
  tokenOutValue: document.querySelector("#token-out-value"),
  trendPanel: document.querySelector("#trend-panel"),
  trendLegend: document.querySelector(".trend-legend"),
  trendSvg: document.querySelector("#trend-svg"),
  trendAxisStart: document.querySelector("#trend-axis-start"),
  trendAxisEnd: document.querySelector("#trend-axis-end"),
  trendTooltip: document.querySelector("#trend-tooltip"),
  trendCacheRate: document.querySelector("#trend-cache-rate"),
  trendCrosshair: document.querySelector("#trend-crosshair"),
  weeklyQuota: document.querySelector("#weekly-quota"),
  weeklyQuotaBar: document.querySelector("#weekly-quota-bar"),
  weeklyQuotaValue: document.querySelector("#weekly-quota-value"),
  weeklyQuotaSummary: document.querySelector("#weekly-quota-summary"),
  weeklyQuotaProgress: document.querySelector("#weekly-quota-progress"),
  providerList: document.querySelector("#provider-list"),
  providerMeta: document.querySelector("#provider-meta"),
  activityList: document.querySelector("#activity-list"),
  dataThrough: document.querySelector("#data-through"),
  activityHeading: document.querySelector("#activity-heading"),
  rankingList: document.querySelector("#ranking-list"),
  rankingTotal: document.querySelector("#ranking-total"),
  rankingKicker: document.querySelector("#ranking-kicker"),
  rankingHeading: document.querySelector("#ranking-heading"),
  updatedAt: document.querySelector("#updated-at"),
  schemaVersion: document.querySelector("#schema-version"),
  tailscaleMeta: document.querySelector("#tailscale-meta"),
  tailscaleNotice: document.querySelector("#tailscale-notice"),
  tailscaleStatusDot: document.querySelector("#tailscale-status-dot"),
  tailscaleStatusValue: document.querySelector("#tailscale-status-value"),
  tailscaleStatusHint: document.querySelector("#tailscale-status-hint"),
  tailscaleTransportValue: document.querySelector("#tailscale-transport-value"),
  tailscaleTransportHint: document.querySelector("#tailscale-transport-hint"),
  tailscaleDerpValue: document.querySelector("#tailscale-derp-value"),
  tailscaleDerpHint: document.querySelector("#tailscale-derp-hint"),
  tailscaleLatencyValue: document.querySelector("#tailscale-latency-value"),
  tailscaleLatencyHint: document.querySelector("#tailscale-latency-hint"),
  clashMeta: document.querySelector("#clash-meta"),
  clashCurrent: document.querySelector("#clash-current"),
  clashStatusDot: document.querySelector("#clash-status-dot"),
  clashNodeName: document.querySelector("#clash-node-name"),
  clashStatus: document.querySelector("#clash-status"),
};

const numberAnimations = new WeakMap();
const progressAnimations = new WeakMap();
const rowAnimations = new WeakMap();
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const listMoveDuration = 620;
const listHighlightDuration = 900;
const listEasing = "cubic-bezier(0.22, 1, 0.36, 1)";
const viewTransitionDuration = 260;
const viewEnterDistance = 16;
const viewExitDistance = 12;
const contentFadeDuration = 220;
const resetCountdownThresholdMs = 10 * 60_000;
const resetCountdownCriticalMs = 60_000;
const resetCountdownTickMs = 160;
const resetFlipClockThresholdMs = 5 * 60_000;
const pageLoaderMinimumDuration = 420;

function t(key, values = {}) {
  let text = translations[state.language][key] ?? key;
  Object.entries(values).forEach(([name, value]) => {
    text = text.replace(`{${name}}`, value);
  });
  return text;
}

let pageLoadSequence = 0;
let pageLoadStartedAt = 0;
let pageLoadHideTimer = null;

function setPageLoading(active) {
  window.clearTimeout(pageLoadHideTimer);
  pageLoadHideTimer = null;
  elements.pageLoader.hidden = !active;
  elements.dashboard.classList.toggle("is-loading", active);
  [elements.homeView, elements.aiView].forEach((view) => {
    view.removeAttribute("aria-busy");
  });
  if (active) {
    const activeView = state.view === "home" ? elements.homeView : elements.aiView;
    activeView.setAttribute("aria-busy", "true");
  }
}

function visiblePageRequestPending() {
  if (state.view === "home") {
    return state.tailscaleFetching || state.clashFetching || state.providerFetching;
  }
  if (state.source === "openrouter") return state.openrouterFetching;
  return state.fetching || state.providerFetching;
}

async function waitForVisiblePageRequests(sequence) {
  while (sequence === pageLoadSequence && visiblePageRequestPending()) {
    await new Promise((resolve) => window.setTimeout(resolve, 40));
  }
}

async function runPageLoad(loaders) {
  const sequence = ++pageLoadSequence;
  pageLoadStartedAt = performance.now();
  setPageLoading(true);
  await Promise.allSettled(loaders.map((load) => Promise.resolve().then(load)));
  await waitForVisiblePageRequests(sequence);
  if (sequence !== pageLoadSequence) return;
  const remaining = Math.max(
    0,
    pageLoaderMinimumDuration - (performance.now() - pageLoadStartedAt),
  );
  pageLoadHideTimer = window.setTimeout(() => {
    if (sequence === pageLoadSequence) setPageLoading(false);
  }, remaining);
}

function locale() {
  return state.language === "zh" ? "zh-CN" : "en-US";
}

function formatInteger(value) {
  return new Intl.NumberFormat(locale(), { maximumFractionDigits: 0 }).format(value ?? 0);
}

function formatCompact(value) {
  const number = Number(value ?? 0);
  if (Math.abs(number) < 10000) return formatInteger(number);
  return new Intl.NumberFormat(locale(), {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(number);
}

function formatCost(value) {
  const number = Number(value ?? 0);
  const maximumFractionDigits = number < 0.01 ? 4 : 2;
  return new Intl.NumberFormat(locale(), {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits,
  }).format(number);
}

function formatCredits(value) {
  const number = Number(value ?? 0);
  return `${new Intl.NumberFormat(locale(), {
    minimumFractionDigits: 2,
    maximumFractionDigits: Math.abs(number) < 0.01 ? 6 : 4,
  }).format(number)} credits`;
}

function formatDate(value, includeDate = true) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(locale(), {
    ...(includeDate ? { year: "numeric", month: "2-digit", day: "2-digit" } : {}),
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
}

function formatShortDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(locale(), {
    month: "numeric",
    day: "numeric",
  }).format(date);
}

function formatHourLabel(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(locale(), {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

function formatRelativeReset(value) {
  const resetAt = new Date(value).getTime();
  if (!Number.isFinite(resetAt)) return "";
  const remainingMilliseconds = resetAt - Date.now();
  if (remainingMilliseconds <= 60_000) return t("resetNow");
  const minutes = Math.ceil(remainingMilliseconds / 60_000);
  if (minutes < 60) {
    return t("resetInMinutes", { count: formatInteger(minutes) });
  }
  const hours = Math.ceil(minutes / 60);
  if (hours < 48) {
    return t("resetInHours", { count: formatInteger(hours) });
  }
  return t("resetInDays", { count: formatInteger(Math.ceil(hours / 24)) });
}

function formatRelativeExpiry(value) {
  const expiresAt = new Date(value).getTime();
  if (!Number.isFinite(expiresAt)) return "";
  const remainingMilliseconds = expiresAt - Date.now();
  if (remainingMilliseconds <= 60_000) return t("resetCreditExpiresSoon");
  const minutes = Math.ceil(remainingMilliseconds / 60_000);
  if (minutes < 60) {
    return t("resetInMinutes", { count: formatInteger(minutes) });
  }
  const hours = Math.ceil(minutes / 60);
  if (hours < 48) {
    return t("resetInHours", { count: formatInteger(hours) });
  }
  return t("resetInDays", { count: formatInteger(Math.ceil(hours / 24)) });
}

function formatResetCreditExpiry(value) {
  return t("resetCreditExpires", {
    time: formatDate(value),
    relative: formatRelativeExpiry(value),
  });
}

function formatCountdownClock(milliseconds) {
  const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function formatWindowLabel(windowMinutes) {
  const minutes = Number(windowMinutes);
  if (minutes === 300) return t("fiveHourLimit");
  if (minutes === 1_440) return t("dailyLimit");
  if (minutes === 10_080) return t("weeklyLimit");
  if (minutes >= 38_880 && minutes <= 46_080) return t("monthlyLimit");
  if (minutes > 0 && minutes % 1_440 === 0) {
    return t("dayWindowLimit", { count: formatInteger(minutes / 1_440) });
  }
  if (minutes > 0 && minutes % 60 === 0) {
    return t("hourWindowLimit", { count: formatInteger(minutes / 60) });
  }
  if (minutes > 0) {
    return t("minuteWindowLimit", { count: formatInteger(minutes) });
  }
  return t("customLimit");
}

function formatBalanceAmount(balance, value) {
  const amount = Number(value);
  if (balance.currency) {
    const symbol = { CNY: "¥", USD: "$", EUR: "€", GBP: "£" }[balance.currency];
    const formatted = new Intl.NumberFormat(locale(), {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
    return symbol ? `${symbol}${formatted}` : `${formatted} ${balance.currency}`;
  }
  if (balance.unit === "credits") {
    const formatted = new Intl.NumberFormat(locale(), {
      maximumFractionDigits: 2,
    }).format(amount);
    return `${formatted} ${t("credits")}`;
  }
  return balance.text || String(amount);
}

function formatBalanceDetail(value) {
  if (!value) return "";
  const paidMatch = /^Paid (.+) · Granted (.+)$/.exec(value);
  if (paidMatch) {
    return `${t("paid")} ${paidMatch[1]} · ${t("granted")} ${paidMatch[2]}`;
  }
  const originalParts = value.split(" · ");
  const creditParts = originalParts.map((part) => {
    const usedMatch = /^Used (.+)$/.exec(part);
    if (usedMatch) return `${t("used")} ${usedMatch[1]}`;
    const totalMatch = /^Total added (.+)$/.exec(part);
    if (totalMatch) return `${t("totalAdded")} ${totalMatch[1]}`;
    return part;
  });
  if (creditParts.some((part, index) => part !== originalParts[index])) {
    return creditParts.join(" · ");
  }
  return value;
}

function removeSkeleton(element) {
  element.classList.remove("skeleton-text");
}

function animateNumber(element, previousValue, nextValue, formatter, titleFormatter = null) {
  const previousAnimation = numberAnimations.get(element);
  if (previousAnimation) cancelAnimationFrame(previousAnimation.frame);

  let from = Number(previousAnimation?.currentValue ?? previousValue);
  const to = Number(nextValue);
  const finalText = formatter(to);
  removeSkeleton(element);
  element.title = titleFormatter ? titleFormatter(to) : finalText;

  if (!Number.isFinite(to)) {
    element.textContent = finalText;
    numberAnimations.delete(element);
    return;
  }
  if (!Number.isFinite(from)) from = 0;

  if (from === to || reducedMotion.matches) {
    element.textContent = finalText;
    numberAnimations.delete(element);
    return;
  }

  const duration = 560;
  let startedAt = null;
  const animationState = { frame: 0, currentValue: from };
  element.textContent = formatter(from);

  const tick = (timestamp) => {
    if (!element.isConnected) {
      if (numberAnimations.get(element) === animationState) {
        numberAnimations.delete(element);
      }
      return;
    }
    if (startedAt === null) startedAt = timestamp;
    const progress = Math.min(1, (timestamp - startedAt) / duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    animationState.currentValue = from + (to - from) * eased;
    element.textContent = formatter(animationState.currentValue);

    if (progress < 1) {
      animationState.frame = requestAnimationFrame(tick);
      return;
    }

    element.textContent = finalText;
    animationState.currentValue = to;
    if (numberAnimations.get(element) === animationState) {
      numberAnimations.delete(element);
    }
  };

  animationState.frame = requestAnimationFrame(tick);
  numberAnimations.set(element, animationState);
}

function animateProgress(element, previousValue, nextValue) {
  const previousAnimation = progressAnimations.get(element);
  if (previousAnimation) cancelAnimationFrame(previousAnimation.frame);

  let from = Number(previousAnimation?.currentValue ?? previousValue);
  const to = Math.max(0, Math.min(100, Number(nextValue)));
  if (!Number.isFinite(to)) {
    element.value = 0;
    progressAnimations.delete(element);
    return;
  }
  if (!Number.isFinite(from)) from = 0;

  if (from === to || reducedMotion.matches) {
    element.value = to;
    progressAnimations.delete(element);
    return;
  }

  const duration = 620;
  let startedAt = null;
  const animationState = { frame: 0, currentValue: from };
  element.value = from;

  const tick = (timestamp) => {
    if (!element.isConnected) {
      if (progressAnimations.get(element) === animationState) {
        progressAnimations.delete(element);
      }
      return;
    }
    if (startedAt === null) startedAt = timestamp;
    const progress = Math.min(1, (timestamp - startedAt) / duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    animationState.currentValue = from + (to - from) * eased;
    element.value = animationState.currentValue;

    if (progress < 1) {
      animationState.frame = requestAnimationFrame(tick);
      return;
    }

    element.value = to;
    animationState.currentValue = to;
    if (progressAnimations.get(element) === animationState) {
      progressAnimations.delete(element);
    }
  };

  animationState.frame = requestAnimationFrame(tick);
  progressAnimations.set(element, animationState);
}

function appName(value) {
  if (value === "claude") return "Claude";
  if (value === "codex") return "Codex";
  return value || "AI";
}

function localModelDisplayName(item) {
  const model = item?.model || "Unknown model";
  const directName = String(item?.displayName || "").trim();
  if (directName) return directName;
  const catalogItem = (state.payload?.models || []).find(
    (candidate) => candidate.model === item?.model,
  );
  return String(catalogItem?.displayName || "").trim() || model;
}

function localModelTitle(item, displayName) {
  const model = item?.model || "";
  return model && model !== displayName ? model : displayName;
}

const appLogoSources = Object.freeze({
  codex: "/brands/openai.svg",
  claude: "/brands/anthropic.svg",
});

function updateActivityAppIcon(node, app) {
  const logo = node.querySelector(".app-logo");
  const fallback = node.querySelector(".app-icon-fallback");
  const source = appLogoSources[app];

  if (!source) {
    logo.removeAttribute("src");
    delete logo.dataset.source;
    delete logo.dataset.failed;
    logo.hidden = true;
    fallback.hidden = false;
    return;
  }

  if (logo.dataset.source !== source) {
    logo.dataset.source = source;
    delete logo.dataset.failed;
    logo.src = source;
  }

  const failed = logo.dataset.failed === "true";
  logo.hidden = failed;
  fallback.hidden = !failed;
}

function rangeLabelKey() {
  if (state.range === "7d") return "sevenDayUsage";
  if (state.range === "30d") return "thirtyDayUsage";
  return "todayUsage";
}

function setConnection(status) {
  elements.connectionDot.className = `connection-dot ${status}`;
  const label = status === "live" ? "live" : status === "stale" ? "delayed" : status === "offline" ? "disconnected" : "connecting";
  elements.connectionLabel.textContent = t(label);
}

function showNotice(message, error = false) {
  elements.notice.hidden = !message;
  elements.notice.textContent = message || "";
  elements.notice.classList.toggle("error", error);
}

function showTailscaleNotice(message, error = false) {
  elements.tailscaleNotice.hidden = !message;
  elements.tailscaleNotice.textContent = message || "";
  elements.tailscaleNotice.classList.toggle("error", error);
}

function transportLabel(mode) {
  const keys = {
    direct: "transportDirect",
    derp: "transportDerp",
    peer_relay: "transportPeerRelay",
    mixed: "transportMixed",
    idle: "transportIdle",
    unknown: "transportUnknown",
  };
  return t(keys[mode] || "transportUnknown");
}

function renderTailscale(payload, previousPayload = null) {
  const connection = payload?.connection || {};
  const derp = payload?.derp;
  const previousDerp = previousPayload?.derp;
  const stale = Boolean(payload?.meta?.stale);
  const generatedAt = payload?.meta?.generatedAt;

  elements.tailscaleMeta.textContent = stale
    ? t("tailscaleDelayed", { time: formatDate(generatedAt, false) })
    : t("tailscaleUpdated", { time: formatDate(generatedAt, false) });

  const connectionKey =
    connection.status === "online"
      ? "tailscaleOnline"
      : connection.status === "offline"
        ? "tailscaleOffline"
        : "tailscaleUnknown";
  elements.tailscaleStatusValue.textContent = t(connectionKey);
  removeSkeleton(elements.tailscaleStatusValue);
  elements.tailscaleStatusDot.className = `status-dot ${
    connection.status === "online"
      ? ""
      : connection.status === "offline"
        ? "failed"
        : "neutral"
  }`;
  elements.tailscaleStatusHint.textContent = t("privateNetwork");

  elements.tailscaleTransportValue.textContent = transportLabel(connection.transport);
  elements.tailscaleTransportValue.title = elements.tailscaleTransportValue.textContent;
  removeSkeleton(elements.tailscaleTransportValue);
  elements.tailscaleTransportHint.textContent = t("transportScope");

  elements.tailscaleDerpValue.textContent = derp?.name || "—";
  elements.tailscaleDerpValue.title = derp?.name || "";
  removeSkeleton(elements.tailscaleDerpValue);
  elements.tailscaleDerpHint.textContent = derp?.code
    ? `DERP ${String(derp.code).toUpperCase()} · #${formatInteger(derp.id)}`
    : "—";

  if (Number.isFinite(Number(derp?.latencyMs))) {
    animateNumber(
      elements.tailscaleLatencyValue,
      previousDerp?.latencyMs,
      derp.latencyMs,
      (value) => `${Number(value).toFixed(1)} ms`,
    );
  } else {
    elements.tailscaleLatencyValue.textContent = "—";
    elements.tailscaleLatencyValue.title = "";
    removeSkeleton(elements.tailscaleLatencyValue);
  }
  elements.tailscaleLatencyHint.textContent = t("derpRoundTrip");

  if (state.view === "home") {
    if (stale) {
      setConnection("stale");
      showTailscaleNotice(t("tailscaleDataDelayed"));
    } else if (connection.status === "online") {
      setConnection("live");
      showTailscaleNotice("");
    } else if (connection.status === "offline") {
      setConnection("offline");
      showTailscaleNotice("");
    } else {
      setConnection("offline");
      showTailscaleNotice(t("tailscaleUnavailable"), true);
    }
  }
}

function renderTailscaleFailure() {
  elements.tailscaleMeta.textContent = t("tailscaleUnavailable");
  if (state.tailscalePayload) {
    renderTailscale(
      {
        ...state.tailscalePayload,
        meta: { ...state.tailscalePayload.meta, stale: true },
      },
      state.tailscalePayload,
    );
    elements.tailscaleMeta.textContent = t("tailscaleUnavailable");
    return;
  }
  renderTailscale(
    {
      meta: { generatedAt: null, stale: true },
      connection: { status: "unavailable", transport: "unknown" },
      derp: null,
    },
  );
  elements.tailscaleMeta.textContent = t("tailscaleUnavailable");
  if (state.view === "home") {
    setConnection("offline");
    showTailscaleNotice(t("tailscaleUnavailable"), true);
  }
}

function renderClash(payload, previousPayload = null, animateChanges = true) {
  const proxy = payload?.proxy || {};
  const previousProxy = previousPayload?.proxy || {};
  const stale = Boolean(payload?.meta?.stale);
  const generatedAt = payload?.meta?.generatedAt;
  const selected = proxy.status === "selected" && Boolean(proxy.name);

  elements.clashMeta.textContent = selected
    ? stale
      ? t("clashDelayed", { time: formatDate(generatedAt, false) })
      : t("clashUpdated", { time: formatDate(generatedAt, false) })
    : t("clashUnavailable");
  elements.clashNodeName.textContent = selected ? proxy.name : "—";
  elements.clashNodeName.title = selected ? proxy.name : "";
  removeSkeleton(elements.clashNodeName);

  const statusClass = selected ? (stale ? "stale" : "live") : "unavailable";
  elements.clashStatus.className = `clash-status ${statusClass}`;
  elements.clashStatus.textContent = selected
    ? stale
      ? t("clashDelayedStatus")
      : t("clashSelected")
    : t("clashUnavailableStatus");
  elements.clashStatusDot.className = `status-dot ${
    selected ? (stale ? "stale" : "") : "neutral"
  }`;

  if (
    animateChanges &&
    selected &&
    previousProxy.name &&
    previousProxy.name !== proxy.name
  ) {
    cancelRowAnimations(elements.clashCurrent);
    highlightNode(elements.clashCurrent);
  }
}

function renderClashFailure() {
  if (state.clashPayload) {
    renderClash(
      {
        ...state.clashPayload,
        meta: { ...state.clashPayload.meta, stale: true },
      },
      state.clashPayload,
      false,
    );
    elements.clashMeta.textContent = t("clashUnavailable");
    return;
  }
  renderClash(
    {
      meta: { generatedAt: null, stale: true },
      proxy: { status: "unavailable", name: null },
    },
    null,
    false,
  );
}

function renderSummary(payload, previousPayload = null) {
  const summary = payload.summary;
  const previous = previousPayload?.summary;
  elements.requestsLabel.textContent = t(rangeLabelKey());
  elements.modelLabel.textContent = t("primaryModel");
  elements.modelHint.textContent = t("byTokenVolume");
  elements.successLabel.textContent = t("successRate");
  elements.tokensLabel.textContent = t("totalTokens");
  elements.tokensHint.hidden = false;
  elements.tokensSourceHint.hidden = true;
  animateNumber(
    elements.requestsValue,
    previous?.requests,
    summary.requests,
    formatInteger,
  );
  elements.requestsHint.textContent = t("requests");

  elements.modelValue.textContent = summary.primaryModelDisplayName || summary.primaryModel || "—";
  elements.modelValue.title = summary.primaryModel || "";

  animateNumber(
    elements.successValue,
    previous?.successRate,
    summary.successRate,
    (value) => `${Number(value).toFixed(1)}%`,
  );
  elements.successHint.textContent = t("successfulRequests", {
    success: formatInteger(summary.successfulRequests),
    total: formatInteger(summary.requests),
  });

  animateNumber(
    elements.tokensValue,
    previous?.totalTokens,
    summary.totalTokens,
    formatCompact,
    formatInteger,
  );
  animateNumber(
    elements.tokenInValue,
    previous?.inputTokens,
    summary.inputTokens,
    (value) => `P-○ ↑${formatCompact(value)}`,
    formatInteger,
  );
  animateNumber(
    elements.tokenOutValue,
    previous?.outputTokens,
    summary.outputTokens,
    (value) => `O-○ ↓${formatCompact(value)}`,
    formatInteger,
  );

  [elements.requestsValue, elements.modelValue, elements.successValue, elements.tokensValue].forEach(removeSkeleton);
}

const trendChartWidth = 600;
const trendChartHeight = 120;
const trendChartPadX = 4;
const trendChartPadY = 12;
let trendRenderedSignature = null;
const trendSeriesVisible = { input: true, output: true, cache: true };
let trendContext = null;

const trendSeriesReaders = {
  input: (bucket) => Number(bucket.inputTokens) || 0,
  output: (bucket) => Number(bucket.outputTokens) || 0,
  cache: (bucket) =>
    (Number(bucket.cacheReadTokens) || 0) + (Number(bucket.cacheCreationTokens) || 0),
};

const trendSeriesLabelKeys = {
  input: "trendInput",
  output: "trendOutput",
  cache: "trendCache",
};

function smoothTrendPath(points) {
  if (points.length < 2) return "";
  let d = `M ${points[0][0]},${points[0][1]}`;
  for (let index = 0; index < points.length - 1; index += 1) {
    const p0 = points[Math.max(0, index - 1)];
    const p1 = points[index];
    const p2 = points[index + 1];
    const p3 = points[Math.min(points.length - 1, index + 2)];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x.toFixed(2)},${c1y.toFixed(2)} ${c2x.toFixed(2)},${c2y.toFixed(2)} ${p2[0]},${p2[1]}`;
  }
  return d;
}

function cacheRateOf(input, cache) {
  const total = input + cache;
  return total > 0 ? cache / total : null;
}

function hideTrendHover() {
  elements.trendTooltip.hidden = true;
  elements.trendCrosshair.hidden = true;
  elements.trendSvg
    .querySelectorAll(".trend-hover-dot")
    .forEach((dot) => (dot.hidden = true));
}

function showTrendHover(index) {
  if (!trendContext) return;
  const { trend, pointsBySeries } = trendContext;
  const bucket = trend[index];
  if (!bucket) return;

  const referencePoints = Object.values(pointsBySeries)[0];
  const x = referencePoints[index][0];
  elements.trendCrosshair.hidden = false;
  elements.trendCrosshair.setAttribute("x1", String(x));
  elements.trendCrosshair.setAttribute("x2", String(x));

  elements.trendSvg.querySelectorAll(".trend-series").forEach((group) => {
    const dot = group.querySelector(".trend-hover-dot");
    const points = pointsBySeries[group.dataset.series];
    if (!dot || !points || !trendSeriesVisible[group.dataset.series]) {
      if (dot) dot.hidden = true;
      return;
    }
    dot.hidden = false;
    dot.setAttribute("cx", String(points[index][0]));
    dot.setAttribute("cy", String(points[index][1]));
  });

  const tooltip = elements.trendTooltip;
  tooltip.querySelector(".trend-tooltip-title").textContent =
    trendContext.formatAxis(bucket.bucket);
  const rows = tooltip.querySelector(".trend-tooltip-rows");
  rows.replaceChildren(
    ...Object.entries(trendSeriesReaders)
      .filter(([key]) => trendSeriesVisible[key])
      .map(([key, read]) => {
        const row = document.createElement("p");
        row.className = "trend-tooltip-row";
        const dot = document.createElement("span");
        dot.className = `trend-legend-dot dot-${key}`;
        dot.setAttribute("aria-hidden", "true");
        const label = document.createElement("span");
        label.textContent = t(trendSeriesLabelKeys[key]);
        const value = document.createElement("span");
        value.className = "trend-tooltip-value";
        value.textContent = formatCompact(read(bucket));
        row.append(dot, label, value);
        return row;
      }),
  );
  const rate = cacheRateOf(
    trendSeriesReaders.input(bucket),
    trendSeriesReaders.cache(bucket),
  );
  const rateLine = tooltip.querySelector(".trend-tooltip-rate");
  if (rate === null) {
    rateLine.hidden = true;
  } else {
    rateLine.hidden = false;
    rateLine.textContent = t("trendCacheRate", {
      value: Math.round(rate * 100),
    });
  }

  const chartBox = elements.trendSvg.getBoundingClientRect();
  const px = (x / trendChartWidth) * chartBox.width;
  tooltip.hidden = false;
  tooltip.classList.toggle("is-left", px > chartBox.width - 70);
  tooltip.classList.toggle("is-right", px < 70);
  tooltip.style.left = `${(x / trendChartWidth) * 100}%`;
}

function renderTrend(payload) {
  const trend = payload?.trend;
  const granularity = payload?.meta?.granularity;
  const visible =
    (granularity === "day" || granularity === "hour") &&
    Array.isArray(trend) &&
    trend.length >= 2;
  if (!visible) {
    elements.trendPanel.hidden = true;
    trendRenderedSignature = null;
    trendContext = null;
    hideTrendHover();
    return;
  }

  const wasHidden = elements.trendPanel.hidden;
  elements.trendPanel.hidden = false;

  const seriesValues = Object.fromEntries(
    Object.entries(trendSeriesReaders).map(([key, read]) => [
      key,
      trend.map((bucket) => read(bucket)),
    ]),
  );
  const visibleMax = Math.max(
    0,
    ...Object.entries(seriesValues).flatMap(([key, values]) =>
      trendSeriesVisible[key] ? values : [],
    ),
  );

  const innerWidth = trendChartWidth - trendChartPadX * 2;
  const innerHeight = trendChartHeight - trendChartPadY * 2;
  const stepX = innerWidth / (trend.length - 1);
  const baseline = trendChartHeight - trendChartPadY;
  const toPoint = (value, index) => {
    const x = trendChartPadX + stepX * index;
    const y =
      visibleMax > 0
        ? trendChartPadY + innerHeight * (1 - value / visibleMax)
        : baseline;
    return [Number(x.toFixed(2)), Number(y.toFixed(2))];
  };

  const pointsBySeries = {};
  elements.trendSvg.querySelectorAll(".trend-series").forEach((group) => {
    const key = group.dataset.series;
    const line = group.querySelector(".trend-line");
    const fill = group.querySelector(".trend-fill");
    const endDot = group.querySelector(".trend-end-dot");
    if (!line || !fill || !endDot) return;
    const points = seriesValues[key].map(toPoint);
    pointsBySeries[key] = points;
    const seriesVisibleNow = trendSeriesVisible[key] === true;
    group.classList.toggle("is-muted", !seriesVisibleNow);
    if (!seriesVisibleNow) return;
    const linePath = smoothTrendPath(points);
    const first = points[0];
    const last = points[points.length - 1];
    line.setAttribute("d", linePath);
    fill.setAttribute(
      "d",
      `${linePath} L ${last[0]},${baseline} L ${first[0]},${baseline} Z`,
    );
    endDot.setAttribute("cx", String(last[0]));
    endDot.setAttribute("cy", String(last[1]));
  });

  const formatAxis =
    granularity === "hour" ? formatHourLabel : formatShortDate;
  elements.trendAxisStart.textContent = formatAxis(trend[0].bucket);
  elements.trendAxisEnd.textContent = formatAxis(trend[trend.length - 1].bucket);

  const totalInput = seriesValues.input.reduce((sum, value) => sum + value, 0);
  const totalCache = seriesValues.cache.reduce((sum, value) => sum + value, 0);
  const rangeRate = cacheRateOf(totalInput, totalCache);
  elements.trendCacheRate.textContent =
    rangeRate === null ? "" : `· ${Math.round(rangeRate * 100)}%`;

  trendContext = { trend, granularity, formatAxis, pointsBySeries };

  const signature = `${state.range}:${state.app}:${trend.length}`;
  if (wasHidden || signature !== trendRenderedSignature) {
    trendRenderedSignature = signature;
    playRowAnimation(
      elements.trendSvg,
      [
        { opacity: 0, transform: "translate3d(0, 6px, 0)" },
        { opacity: 1, transform: "translate3d(0, 0, 0)" },
      ],
      { duration: contentFadeDuration + 200, easing: listEasing },
    );
  }
}

function activityKey(item) {
  if (item.state === "calling") {
    return JSON.stringify(["calling", item.startedAt, item.app, item.model]);
  }
  return JSON.stringify([
    item.createdAt,
    item.app,
    item.model,
    item.inputTokens,
    item.outputTokens,
    item.cacheReadTokens,
    item.cacheCreationTokens,
    item.totalCostUsd,
    item.statusCode,
  ]);
}

function createEmptyState(message) {
  const element = document.createElement("div");
  element.className = "empty-state";
  element.textContent = message;
  return element;
}

function renderEmptyState(container, message) {
  const current = container.firstElementChild;
  if (
    container.children.length === 1 &&
    current?.classList.contains("empty-state")
  ) {
    current.textContent = message;
    return;
  }
  container.replaceChildren(createEmptyState(message));
}

function itemNodes(container, itemClass) {
  return Array.from(container.children).filter(
    (node) =>
      node.classList.contains(itemClass) &&
      !node.classList.contains("list-exit-overlay"),
  );
}

function keyedNodePool(nodes) {
  const pool = new Map();
  nodes.forEach((node) => {
    const key = node.dataset.listKey;
    if (!key) return;
    const matches = pool.get(key) || [];
    matches.push(node);
    pool.set(key, matches);
  });
  return pool;
}

function takeKeyedNode(pool, key) {
  const matches = pool.get(key);
  if (!matches?.length) return null;
  const node = matches.shift();
  if (!matches.length) pool.delete(key);
  return node;
}

function cancelRowAnimations(element) {
  (rowAnimations.get(element) || []).forEach((animation) => animation.cancel());
  rowAnimations.delete(element);
  element.style.removeProperty("will-change");
}

function playRowAnimation(element, keyframes, options) {
  if (
    reducedMotion.matches ||
    typeof element.animate !== "function" ||
    !element.isConnected
  ) {
    return null;
  }

  element.style.willChange = "transform, background-color, opacity";
  const animation = element.animate(keyframes, { fill: "both", ...options });
  const activeAnimations = rowAnimations.get(element) || new Set();
  activeAnimations.add(animation);
  rowAnimations.set(element, activeAnimations);
  const clearWillChange = () => {
    activeAnimations.delete(animation);
    if (!activeAnimations.size) {
      rowAnimations.delete(element);
      element.style.removeProperty("will-change");
    }
  };
  animation.finished.then(
    () => {
      animation.cancel();
      clearWillChange();
    },
    clearWillChange,
  );
  return animation;
}

function animateMovedNode(element, deltaY) {
  if (Math.abs(deltaY) < 0.5) return;
  playRowAnimation(
    element,
    [
      { transform: `translate3d(0, ${deltaY}px, 0)` },
      { transform: "translate3d(0, 0, 0)" },
    ],
    { duration: listMoveDuration, easing: listEasing },
  );
}

function highlightNode(element, isNew = false) {
  if (isNew) {
    playRowAnimation(
      element,
      [
        { transform: "translate3d(0, -6px, 0)" },
        { transform: "translate3d(0, 0, 0)" },
      ],
      { duration: listMoveDuration, easing: listEasing },
    );
  }

  playRowAnimation(
    element,
    [
      { backgroundColor: "rgba(63, 130, 215, 0.04)" },
      { backgroundColor: "rgba(63, 130, 215, 0.014)", offset: 0.55 },
      { backgroundColor: "rgba(63, 130, 215, 0)" },
    ],
    { duration: listHighlightDuration, easing: listEasing },
  );
}

function animateDepartures(container, outgoingNodes, oldPositions) {
  if (!outgoingNodes.length || reducedMotion.matches) return;
  const containerRect = container.getBoundingClientRect();

  outgoingNodes.forEach((node) => {
    const oldRect = oldPositions.get(node);
    if (!oldRect) return;

    const overlay = node.cloneNode(true);
    overlay.classList.add("list-exit-overlay");
    overlay.setAttribute("aria-hidden", "true");
    overlay.style.left = `${oldRect.left - containerRect.left}px`;
    overlay.style.top = `${oldRect.top - containerRect.top}px`;
    overlay.style.width = `${oldRect.width}px`;
    overlay.style.height = `${oldRect.height}px`;
    container.append(overlay);

    const animation = playRowAnimation(
      overlay,
      [
        { opacity: 0.92, transform: "translate3d(0, 0, 0)" },
        { opacity: 0, transform: "translate3d(0, 4px, 0)" },
      ],
      { duration: 260, easing: "ease-out" },
    );
    if (animation) {
      animation.finished.then(
        () => overlay.remove(),
        () => overlay.remove(),
      );
    } else {
      overlay.remove();
    }
  });
}

function reconcileKeyedList({
  container,
  itemClass,
  items,
  keyFor,
  createNode,
  updateNode,
  animateLayout,
  shouldHighlight = () => false,
}) {
  const existingNodes = itemNodes(container, itemClass);
  const oldPositions = new Map();
  if (animateLayout) {
    existingNodes.forEach((node) => {
      oldPositions.set(node, node.getBoundingClientRect());
    });
  }
  existingNodes.forEach(cancelRowAnimations);

  const pool = keyedNodePool(existingNodes);
  const entries = items.map((item) => {
    const key = String(keyFor(item));
    const existingNode = takeKeyedNode(pool, key);
    const node = existingNode || createNode();
    node.dataset.listKey = key;
    updateNode(node, item);
    return {
      item,
      key,
      node,
      isNew: !existingNode,
      highlight: shouldHighlight(item),
    };
  });

  const desiredNodes = new Set(entries.map((entry) => entry.node));
  const outgoingNodes = existingNodes.filter((node) => !desiredNodes.has(node));

  entries.forEach((entry, index) => {
    entry.node.classList.toggle("list-last-item", index === entries.length - 1);
    const current = container.children[index] || null;
    if (current !== entry.node) {
      container.insertBefore(entry.node, current);
    }
  });
  Array.from(container.children).forEach((node) => {
    if (!desiredNodes.has(node)) node.remove();
  });

  if (!animateLayout) return entries;

  const newPositions = new Map();
  entries.forEach((entry) => {
    newPositions.set(entry.node, entry.node.getBoundingClientRect());
  });
  animateDepartures(container, outgoingNodes, oldPositions);

  entries.forEach((entry) => {
    const oldRect = oldPositions.get(entry.node);
    const newRect = newPositions.get(entry.node);
    if (oldRect && newRect) {
      animateMovedNode(entry.node, oldRect.top - newRect.top);
    }
    if (entry.isNew || entry.highlight) {
      highlightNode(entry.node, entry.isNew);
    }
  });

  return entries;
}

function createActivityNode() {
  const node = document.createElement("div");
  node.className = "activity-item";
  node.innerHTML = `
    <div class="activity-top">
      <div class="activity-model-line">
        <span class="activity-model"></span>
        <span class="status-dot"></span>
        <span class="activity-state"></span>
      </div>
      <time class="activity-time"></time>
    </div>
    <div class="activity-bottom">
      <div class="activity-stats">
        <span class="app-chip">
          <span class="app-icon" aria-hidden="true">
            <img class="app-logo" alt="" decoding="async" hidden>
            <span class="app-icon-fallback">AI</span>
          </span>
          <span class="app-name"></span>
        </span>
        <span class="stat-cost"></span>
        <span class="stat-cache"></span>
      </div>
      <span class="token-pill">
        <span>Tokens:</span>
        <span class="in"></span>
        <span class="out"></span>
      </span>
    </div>
    <div class="activity-performance" hidden>
      <span class="performance-ttft"></span>
      <span class="performance-time"></span>
      <span class="performance-tps"></span>
    </div>
  `;
  const logo = node.querySelector(".app-logo");
  const fallback = node.querySelector(".app-icon-fallback");
  logo.addEventListener("load", () => {
    delete logo.dataset.failed;
    logo.hidden = false;
    fallback.hidden = true;
  });
  logo.addEventListener("error", () => {
    logo.dataset.failed = "true";
    logo.hidden = true;
    fallback.hidden = false;
  });
  return node;
}

function formatMilliseconds(value) {
  return value !== null && value !== undefined && Number.isFinite(Number(value))
    ? `${formatInteger(value)} ms`
    : "—";
}

function formatSeconds(value) {
  return value !== null && value !== undefined && Number.isFinite(Number(value))
    ? `${(Number(value) / 1000).toFixed(1)}s`
    : "—";
}

function formatTps(value) {
  return value !== null && value !== undefined && Number.isFinite(Number(value))
    ? `${Number(value).toFixed(2)}/s`
    : "—";
}

function routingMetricsVisible(payload = state.payload) {
  const routing = payload?.routing || {};
  if (state.app === "all") return Boolean(routing.codex || routing.claude);
  return Boolean(routing[state.app]);
}

function updateActivityNode(node, item, showMetrics) {
  const model = localModelDisplayName(item);
  const modelElement = node.querySelector(".activity-model");
  modelElement.textContent = model;
  modelElement.title = localModelTitle(item, model);

  const status = node.querySelector(".status-dot");
  const calling = item.state === "calling";
  const failed = item.state === "failed" || (!calling && !item.success);
  status.className = `status-dot${failed ? " failed" : ""}${calling ? " calling" : ""}`;
  status.setAttribute("aria-label", calling ? t("calling") : failed ? t("failed") : t("completed"));
  node.querySelector(".activity-state").textContent = calling
    ? t("calling")
    : failed
      ? t("failed")
      : t("completed");
  node.classList.toggle("is-calling", calling);

  const time = node.querySelector(".activity-time");
  const timestamp = item.startedAt || item.createdAt;
  time.dateTime = timestamp || "";
  time.textContent = formatDate(timestamp);

  updateActivityAppIcon(node, item.app);
  node.querySelector(".app-name").textContent = appName(item.app);
  const cost = node.querySelector(".stat-cost");
  cost.textContent = `${t("cost")}: ${formatCost(item.totalCostUsd)}`;
  cost.hidden = calling;
  const cache = node.querySelector(".stat-cache");
  cache.textContent = `${t("cache")}: ${formatCompact(item.cacheReadTokens)}`;
  cache.hidden = calling;
  node.querySelector(".token-pill .in").textContent = `↑${formatCompact(item.inputTokens)}`;
  node.querySelector(".token-pill .out").textContent = `↓${formatCompact(item.outputTokens)}`;

  const performance = node.querySelector(".activity-performance");
  performance.hidden = !showMetrics;
  if (showMetrics) {
    const estimate = item.estimated ? "≈" : "";
    performance.title = item.estimated ? t("estimatedMetric") : "";
    const ttft = formatMilliseconds(item.ttftMs);
    const duration = formatSeconds(item.durationMs);
    const tps = formatTps(item.tps);
    node.querySelector(".performance-ttft").textContent = `${t("ttft")}: ${ttft === "—" ? "—" : estimate + ttft}`;
    node.querySelector(".performance-time").textContent = `${t("elapsedTime")}: ${duration === "—" ? "—" : estimate + duration}`;
    node.querySelector(".performance-tps").textContent = `TPS: ${tps === "—" ? "—" : estimate + tps}`;
  }
}

function renderActivity(payload, previousPayload = null, animateEntries = false) {
  elements.dataThrough.textContent = formatDate(payload.meta.dataThrough);
  const showMetrics = routingMetricsVisible(payload);
  const liveItems = showMetrics
    ? (state.livePayload?.activities || [])
        .filter((item) => state.app === "all" || item.app === state.app)
        .map((item) => ({
          ...item,
          createdAt: item.startedAt,
          cacheReadTokens: 0,
          cacheCreationTokens: 0,
          totalCostUsd: 0,
          statusCode: 0,
          success: true,
          routed: true,
        }))
    : [];
  const items = [...liveItems, ...payload.recent].slice(0, 8);
  if (!items.length) {
    renderEmptyState(elements.activityList, t("noActivity"));
    return;
  }

  const sameView =
    previousPayload?.meta?.range === payload.meta.range &&
    previousPayload?.meta?.app === payload.meta.app;
  reconcileKeyedList({
    container: elements.activityList,
    itemClass: "activity-item",
    items,
    keyFor: activityKey,
    createNode: createActivityNode,
    updateNode: (node, item) => updateActivityNode(node, item, showMetrics),
    animateLayout: animateEntries && sameView && !reducedMotion.matches,
  });
}

function createRankingNode() {
  const node = document.createElement("div");
  node.className = "ranking-item";
  node.innerHTML = `
    <div class="ranking-labels">
      <span class="ranking-name"></span>
      <span class="ranking-values">
        <span class="ranking-request-value"></span>
        <span class="share ranking-share-value"></span>
      </span>
    </div>
    <progress class="ranking-track" value="0" max="100"></progress>
  `;
  return node;
}

function updateRankingNode(node, item) {
  const name = localModelDisplayName(item);
  const percentage = Math.max(0, Math.min(100, Number(item.percentage) || 0));
  const nameElement = node.querySelector(".ranking-name");
  nameElement.textContent = name;
  nameElement.title = localModelTitle(item, name);

  const progress = node.querySelector(".ranking-track");
  progress.max = 100;
  progress.setAttribute("aria-label", `${name} ${percentage.toFixed(1)}%`);
  progress.textContent = `${percentage.toFixed(1)}%`;
}

function renderRanking(payload, previousPayload = null, animateEntries = false) {
  animateNumber(
    elements.rankingTotal,
    previousPayload?.summary?.requests,
    payload.summary.requests,
    (value) => t("totalRequests", { count: formatInteger(value) }),
  );
  if (!payload.models.length) {
    renderEmptyState(elements.rankingList, t("noModels"));
    return;
  }

  const previousModels = new Map(
    (previousPayload?.models || []).map((item) => [item.model, item]),
  );
  const sameView =
    previousPayload?.meta?.range === payload.meta.range &&
    previousPayload?.meta?.app === payload.meta.app;
  const rankedModels = payload.models.slice(0, 8);

  const entries = reconcileKeyedList({
    container: elements.rankingList,
    itemClass: "ranking-item",
    items: rankedModels,
    keyFor: (item) => item.model,
    createNode: createRankingNode,
    updateNode: updateRankingNode,
    animateLayout: animateEntries && sameView && !reducedMotion.matches,
    shouldHighlight: (item) => {
      const previous = previousModels.get(item.model);
      return Boolean(
        previous &&
          (previous.requests !== item.requests ||
            previous.totalTokens !== item.totalTokens ||
            previous.percentage !== item.percentage),
      );
    },
  });

  entries.forEach(({ item, node }) => {
    const previous = previousModels.get(item.model);
    animateNumber(
      node.querySelector(".ranking-request-value"),
      previous?.requests,
      item.requests,
      formatInteger,
    );
    animateNumber(
      node.querySelector(".ranking-share-value"),
      previous?.percentage,
      item.percentage,
      (value) => `${Number(value).toFixed(1)}%`,
    );
    animateProgress(
      node.querySelector(".ranking-track"),
      previous?.percentage,
      item.percentage,
    );
  });
}

function providerStatusLabel(status) {
  if (status === "live") return t("providerLive");
  if (status === "stale") return t("providerStale");
  return t("providerUnavailableStatus");
}

function providerQuotaSignature(provider) {
  return JSON.stringify({
    status: provider?.status,
    balance: provider?.balance,
    limits: provider?.limits,
    resetCredits: provider?.resetCredits,
  });
}

function createProviderNode() {
  const node = document.createElement("article");
  node.className = "provider-card";
  node.innerHTML = `
    <div class="provider-urgency-banner" hidden>
      <span class="provider-urgency-label"></span>
      <span class="provider-urgency-value"></span>
    </div>
    <div class="provider-flip-clock" hidden>
      <div class="provider-flip-clock-label" data-i18n="resetNow">即将重置</div>
      <div class="provider-flip-clock-digits" aria-hidden="true">
        <span class="flip-digit"><span class="flip-digit-current">0</span></span>
        <span class="flip-digit"><span class="flip-digit-current">0</span></span>
        <span class="flip-separator">:</span>
        <span class="flip-digit"><span class="flip-digit-current">0</span></span>
        <span class="flip-digit"><span class="flip-digit-current">0</span></span>
      </div>
      <time class="provider-flip-clock-time" hidden></time>
    </div>
    <div class="provider-card-heading">
      <h3 class="provider-name"></h3>
      <span class="provider-status"></span>
    </div>
    <div class="provider-balance" hidden>
      <p class="provider-balance-label"></p>
      <p class="provider-balance-value"></p>
      <p class="provider-balance-detail"></p>
    </div>
    <div class="provider-limits"></div>
    <section class="provider-reset-credits" hidden>
      <div class="provider-reset-credits-heading">
        <span class="provider-reset-credits-label"></span>
        <span class="provider-reset-credits-count"></span>
      </div>
      <div class="provider-reset-credit-list"></div>
    </section>
    <p class="provider-empty" hidden></p>
    <p class="provider-last-success" hidden></p>
  `;
  return node;
}

function updateProviderNode(node, provider) {
  const status = ["live", "stale", "unavailable"].includes(provider.status)
    ? provider.status
    : "unavailable";
  node.dataset.providerStatus = status;

  const name = provider.name || provider.id;
  const nameElement = node.querySelector(".provider-name");
  nameElement.textContent = name;
  nameElement.title = name;

  const statusElement = node.querySelector(".provider-status");
  statusElement.className = `provider-status ${status}`;
  statusElement.textContent = providerStatusLabel(status);

  updateProviderUrgency(node, provider);

  const hasBalance = Boolean(provider.balance);
  const hasLimits = Boolean(provider.limits?.length);
  const hasResetCredits = provider.id === "codex" && Boolean(provider.resetCredits);
  const balanceBlock = node.querySelector(".provider-balance");
  balanceBlock.hidden = !hasBalance;
  node.querySelector(".provider-balance-label").textContent = t("balance");
  const balanceDetail = node.querySelector(".provider-balance-detail");
  balanceDetail.textContent = formatBalanceDetail(provider.balance?.detail);
  balanceDetail.hidden = !provider.balance?.detail;

  const resetCredits = node.querySelector(".provider-reset-credits");
  resetCredits.hidden = !hasResetCredits;
  node.querySelector(".provider-reset-credits-label").textContent = t("manualResets");

  const empty = node.querySelector(".provider-empty");
  empty.hidden = hasBalance || hasLimits || hasResetCredits;
  empty.textContent = status === "unavailable" ? t("providerUnavailable") : t("noQuotaData");

  const lastSuccess = node.querySelector(".provider-last-success");
  const showLastSuccess = status !== "live" && Boolean(provider.lastSuccessAt);
  lastSuccess.hidden = !showLastSuccess;
  lastSuccess.textContent = showLastSuccess
    ? t("lastSuccess", { time: formatDate(provider.lastSuccessAt) })
    : "";
}

function quotaSeverity(remainingPercent) {
  if (remainingPercent > 50) return "normal";
  if (remainingPercent >= 20) return "warning";
  return "critical";
}

function createProviderLimitNode() {
  const node = document.createElement("div");
  node.className = "provider-limit";
  node.innerHTML = `
    <div class="provider-limit-heading">
      <span class="provider-limit-name"></span>
      <span class="provider-limit-percent"></span>
    </div>
    <progress class="provider-limit-track" value="0" max="100"></progress>
    <p class="provider-limit-detail" hidden></p>
    <time class="provider-limit-reset" hidden></time>
  `;
  return node;
}

function updateProviderLimitNode(node, limit) {
  const remaining = Math.max(0, Math.min(100, Number(limit.remainingPercent) || 0));
  const label = formatWindowLabel(limit.windowMinutes);
  node.querySelector(".provider-limit-name").textContent = label;

  const detail = node.querySelector(".provider-limit-detail");
  detail.textContent = limit.detail || "";
  detail.hidden = !limit.detail;

  const reset = node.querySelector(".provider-limit-reset");
  reset.hidden = !limit.resetAt;
  reset.dateTime = limit.resetAt || "";
  reset.textContent = limit.resetAt
    ? `${t("resetAt")} ${formatDate(limit.resetAt)} · ${formatRelativeReset(limit.resetAt)}`
    : "";

  const severity = quotaSeverity(remaining);
  const progress = node.querySelector(".provider-limit-track");
  progress.className = `provider-limit-track ${severity}`;
  progress.max = 100;
  progress.setAttribute("aria-label", `${label}: ${t("quotaRemaining", { percent: remaining.toFixed(1) })}`);
  progress.textContent = `${remaining.toFixed(1)}%`;
}

function renderProviderLimits(node, provider, previousProvider, animateChanges) {
  const container = node.querySelector(".provider-limits");
  const limits = provider.limits || [];
  const previousLimits = new Map(
    (previousProvider?.limits || []).map((limit) => [limit.id, limit]),
  );
  const entries = reconcileKeyedList({
    container,
    itemClass: "provider-limit",
    items: limits,
    keyFor: (limit) => limit.id,
    createNode: createProviderLimitNode,
    updateNode: updateProviderLimitNode,
    animateLayout: animateChanges && Boolean(previousProvider) && !reducedMotion.matches,
    shouldHighlight: (limit) => {
      const previous = previousLimits.get(limit.id);
      return Boolean(previous && JSON.stringify(previous) !== JSON.stringify(limit));
    },
  });

  entries.forEach(({ item, node: limitNode }) => {
    const previous = previousLimits.get(item.id);
    animateNumber(
      limitNode.querySelector(".provider-limit-percent"),
      previous?.remainingPercent,
      item.remainingPercent,
      (value) => t("quotaRemaining", { percent: Number(value).toFixed(1) }),
    );
    animateProgress(
      limitNode.querySelector(".provider-limit-track"),
      previous?.remainingPercent,
      item.remainingPercent,
    );
  });
}

function createProviderResetCreditNode() {
  const node = document.createElement("time");
  node.className = "provider-reset-credit-item";
  return node;
}

function updateProviderResetCreditNode(node, item) {
  if (item.expiresAt) {
    node.dateTime = item.expiresAt;
    node.textContent = formatResetCreditExpiry(item.expiresAt);
    return;
  }
  node.removeAttribute("datetime");
  node.textContent = t("resetCreditNoExpiry");
}

function keyedResetCreditItems(provider) {
  const occurrences = new Map();
  return (provider.resetCredits?.items || []).map((item) => {
    const value = item.expiresAt || "no-expiry";
    const occurrence = occurrences.get(value) || 0;
    occurrences.set(value, occurrence + 1);
    return { ...item, key: `${value}:${occurrence}` };
  });
}

function renderProviderResetCredits(node, provider, previousProvider, animateChanges) {
  const container = node.querySelector(".provider-reset-credit-list");
  const items = keyedResetCreditItems(provider);
  reconcileKeyedList({
    container,
    itemClass: "provider-reset-credit-item",
    items,
    keyFor: (item) => item.key,
    createNode: createProviderResetCreditNode,
    updateNode: updateProviderResetCreditNode,
    animateLayout: animateChanges && Boolean(previousProvider) && !reducedMotion.matches,
    shouldHighlight: () => false,
  });

  const count = Number(provider.resetCredits?.availableCount);
  const previousCount = Number(previousProvider?.resetCredits?.availableCount);
  if (Number.isFinite(count)) {
    animateNumber(
      node.querySelector(".provider-reset-credits-count"),
      Number.isFinite(previousCount) ? previousCount : undefined,
      count,
      (value) => t("manualResetsAvailable", { count: formatInteger(Math.round(value)) }),
    );
  }
}

const weeklyRingCircumference = 2 * Math.PI * 36;

function naturalWeekElapsed() {
  const now = new Date();
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  monday.setDate(monday.getDate() - ((now.getDay() + 6) % 7));
  return Math.min(1, Math.max(0, (now - monday) / (7 * 24 * 3600 * 1000)));
}

function renderWeeklyQuota(providers) {
  const weeklyRemaining = (providers || [])
    .map((provider) =>
      (provider.limits || [])
        .filter((limit) => limit.windowMinutes === 10_080)
        .reduce(
          (lowest, limit) => Math.min(lowest, Number(limit.remainingPercent) || 0),
          Infinity,
        ),
    )
    .filter((value) => Number.isFinite(value));

  if (!weeklyRemaining.length) {
    elements.weeklyQuota.hidden = true;
    return;
  }
  elements.weeklyQuota.hidden = false;

  const average =
    weeklyRemaining.reduce((sum, value) => sum + value, 0) / weeklyRemaining.length;
  const fraction = Math.min(1, Math.max(0, average / 100));
  const bar = elements.weeklyQuotaBar;
  bar.style.strokeDasharray = String(weeklyRingCircumference);
  bar.style.strokeDashoffset = String(weeklyRingCircumference * (1 - fraction));
  bar.style.stroke =
    average > 50 ? "var(--green)" : average >= 20 ? "var(--orange)" : "var(--red)";

  elements.weeklyQuotaValue.textContent = `${Math.round(average)}%`;
  elements.weeklyQuotaSummary.textContent = t("weeklyQuotaPlans", {
    count: weeklyRemaining.length,
  });

  const elapsed = naturalWeekElapsed();
  const onTrack = fraction >= elapsed - 0.0001;
  const pace = document.createElement("span");
  pace.className = onTrack ? "is-ok" : "is-fast";
  pace.textContent = t(onTrack ? "weeklyPaceOk" : "weeklyPaceFast");
  elements.weeklyQuotaProgress.replaceChildren(
    document.createTextNode(
      `${t("weeklyElapsed", { value: Math.round(elapsed * 100) })} · `,
    ),
    pace,
  );
}

function renderProviders(payload, previousPayload = null, animateChanges = false) {
  const generatedAt = payload?.meta?.generatedAt;
  elements.providerMeta.textContent = payload?.meta?.stale
    ? t("providerDelayed", { time: formatDate(generatedAt, false) })
    : t("providerUpdated", { time: formatDate(generatedAt, false) });

  const providers = (payload?.providers || []).filter(
    (provider) => provider.id !== "openrouter" || !officialOpenRouterCreditsAvailable(),
  );
  renderWeeklyQuota(providers);
  if (!providers.length) {
    renderEmptyState(elements.providerList, t("providerNoProviders"));
    return;
  }

  const previousProviders = new Map(
    (previousPayload?.providers || []).map((provider) => [provider.id, provider]),
  );
  const entries = reconcileKeyedList({
    container: elements.providerList,
    itemClass: "provider-card",
    items: providers,
    keyFor: (provider) => provider.id,
    createNode: createProviderNode,
    updateNode: updateProviderNode,
    animateLayout: animateChanges && Boolean(previousPayload) && !reducedMotion.matches,
    shouldHighlight: (provider) => {
      const previous = previousProviders.get(provider.id);
      return Boolean(
        previous && providerQuotaSignature(previous) !== providerQuotaSignature(provider)
      );
    },
  });

  entries.forEach(({ item: provider, node }) => {
    const previous = previousProviders.get(provider.id);
    const balanceValue = node.querySelector(".provider-balance-value");
    if (provider.balance) {
      const amount = Number(provider.balance.amount);
      const previousAmount =
        previous?.balance?.currency === provider.balance.currency &&
        previous?.balance?.unit === provider.balance.unit
          ? previous?.balance?.amount
          : undefined;
      if (Number.isFinite(amount)) {
        animateNumber(
          balanceValue,
          previousAmount,
          amount,
          (value) => formatBalanceAmount(provider.balance, value),
        );
      } else {
        balanceValue.textContent = provider.balance.text || "—";
      }
    }
    renderProviderLimits(node, provider, previous, animateChanges);
    renderProviderResetCredits(node, provider, previous, animateChanges);
  });
}

function updateProviderUrgency(node, provider) {
  const now = Date.now();
  const banner = node.querySelector(".provider-urgency-banner");
  const clock = node.querySelector(".provider-flip-clock");
  const clockTime = node.querySelector(".provider-flip-clock-time");

  const nearest = (provider.limits || [])
    .filter((limit) => limit.resetAt)
    .map((limit) => ({
      limit,
      remaining: new Date(limit.resetAt).getTime() - now,
    }))
    .filter(
      (entry) =>
        entry.remaining > 0 && entry.remaining <= resetFlipClockThresholdMs,
    )
    .sort((a, b) => a.remaining - b.remaining)[0];

  if (!nearest) {
    banner.hidden = true;
    clock.hidden = true;
    clockTime.removeAttribute("datetime");
    return;
  }

  const { limit } = nearest;
  const labelText = t("resetNow");
  const remainingText = limit.remainingPercent != null
    ? t("quotaRemaining", { percent: Number(limit.remainingPercent).toFixed(1) })
    : limit.detail || "";
  banner.hidden = false;
  banner.classList.toggle("is-critical", nearest.remaining <= resetCountdownCriticalMs);
  node.querySelector(".provider-urgency-label").textContent = labelText;
  node.querySelector(".provider-urgency-value").textContent = remainingText;

  clock.hidden = false;
  clockTime.hidden = false;
  clockTime.dateTime = limit.resetAt;
  clockTime.textContent = formatCountdownClock(nearest.remaining);
  setFlipClockValue(
    clock.querySelector(".provider-flip-clock-digits"),
    nearest.remaining,
    false,
  );
}

const flipDigitSettlers = new WeakMap();

function setFlipDigit(digitEl, digit, animate) {
  if (!digitEl) return;
  if (!animate || reducedMotion.matches) {
    flipDigitSettlers.get(digitEl)?.();
    digitEl.classList.remove("is-flipping");
    const current = digitEl.querySelector(".flip-digit-current");
    if (!current || current.textContent !== digit) {
      digitEl.innerHTML = `<span class="flip-digit-current">${digit}</span>`;
    }
    return;
  }
  const current = digitEl.querySelector(".flip-digit-current");
  if (
    current &&
    current.textContent === digit &&
    !digitEl.classList.contains("is-flipping")
  ) {
    return;
  }
  // Force-settle any in-flight flip so the new pair renders from a clean base state.
  flipDigitSettlers.get(digitEl)?.();
  const previous =
    digitEl.querySelector(".flip-digit-current")?.textContent ?? "";
  digitEl.innerHTML = `<span class="flip-digit-current">${previous}</span><span class="flip-digit-next">${digit}</span>`;
  requestAnimationFrame(() => {
    digitEl.classList.add("is-flipping");
    let settled = false;
    const settle = () => {
      if (settled) return;
      settled = true;
      flipDigitSettlers.delete(digitEl);
      digitEl.classList.remove("is-flipping");
      digitEl.innerHTML = `<span class="flip-digit-current">${digit}</span>`;
    };
    flipDigitSettlers.set(digitEl, settle);
    digitEl.addEventListener("transitionend", settle, { once: true });
    window.setTimeout(settle, 400);
  });
}

function setFlipClockValue(digits, remaining, animate) {
  if (!digits) return;
  const safeRemaining = Math.max(0, remaining);
  const minutes = Math.floor(safeRemaining / 60_000);
  const seconds = Math.floor((safeRemaining % 60_000) / 1_000);
  const digitEls = digits.querySelectorAll(".flip-digit");
  setFlipDigit(digitEls[0], String(Math.floor(minutes / 10)), animate);
  setFlipDigit(digitEls[1], String(minutes % 10), animate);
  setFlipDigit(digitEls[2], String(Math.floor(seconds / 10)), animate);
  setFlipDigit(digitEls[3], String(seconds % 10), animate);
}

function updateFlipClockNode(node) {
  const resetAt = new Date(node.dateTime).getTime();
  if (!Number.isFinite(resetAt)) return;
  const remaining = resetAt - Date.now();
  const card = node.closest(".provider-card");
  const banner = card?.querySelector(".provider-urgency-banner");
  const digits = card?.querySelector(".provider-flip-clock-digits");
  const label = card?.querySelector(".provider-flip-clock-label");
  if (!card || !digits) return;

  if (remaining <= 0) {
    if (banner) banner.hidden = true;
    card.querySelector(".provider-flip-clock").hidden = true;
    setFlipClockValue(digits, 0, false);
    node.removeAttribute("datetime");
    return;
  }

  if (remaining > resetFlipClockThresholdMs) {
    if (banner) banner.hidden = true;
    card.querySelector(".provider-flip-clock").hidden = true;
    node.removeAttribute("datetime");
    return;
  }

  banner?.classList.toggle("is-critical", remaining <= resetCountdownCriticalMs);
  if (label) label.textContent = t("resetNow");
  setFlipClockValue(digits, remaining, true);
  node.textContent = formatCountdownClock(remaining);
}

function renderProviderFailure(animateChanges = false) {
  elements.providerMeta.textContent = t("providerUnavailable");
  if (!state.providerPayload) {
    renderEmptyState(elements.providerList, t("providerUnavailable"));
    return;
  }
  const fallback = {
    meta: { ...state.providerPayload.meta, stale: true },
    providers: state.providerPayload.providers.map((provider) => ({
      ...provider,
      status: provider.status === "unavailable" ? "unavailable" : "stale",
    })),
  };
  renderProviders(fallback, state.providerPayload, animateChanges);
  elements.providerMeta.textContent = t("providerUnavailable");
}

function updateLimitResetNode(node) {
  const resetAt = new Date(node.dateTime).getTime();
  if (!Number.isFinite(resetAt)) return;
  const remaining = resetAt - Date.now();
  const wasCounting = node.classList.contains("is-counting");

  if (remaining <= 0) {
    if (!wasCounting) return;
    node.classList.remove("is-counting", "is-critical");
    node.textContent = `${t("resetAt")} ${formatDate(node.dateTime)} · ${t("resetNow")}`;
    playRowAnimation(
      node,
      [
        { backgroundColor: "rgba(63, 130, 215, 0.08)" },
        { backgroundColor: "rgba(63, 130, 215, 0)" },
      ],
      { duration: listHighlightDuration, easing: listEasing },
    );
    return;
  }

  if (remaining > resetCountdownThresholdMs) {
    if (!wasCounting) return;
    node.classList.remove("is-counting", "is-critical");
    node.textContent = `${t("resetAt")} ${formatDate(node.dateTime)} · ${formatRelativeReset(node.dateTime)}`;
    return;
  }

  node.classList.add("is-counting");
  node.classList.toggle("is-critical", remaining <= resetCountdownCriticalMs);
  const text = `${t("resetAt")} ${formatDate(node.dateTime)} · ${formatCountdownClock(remaining)}`;
  if (node.textContent === text) return;
  node.textContent = text;
  playRowAnimation(
    node,
    [
      { opacity: 0.3, transform: "translate3d(0, 2px, 0)" },
      { opacity: 1, transform: "translate3d(0, 0, 0)" },
    ],
    { duration: resetCountdownTickMs, easing: listEasing },
  );
}

function tickProviderCountdowns() {
  if (document.hidden) return;
  elements.providerList
    .querySelectorAll(
      ".provider-reset-credit-item[datetime], .provider-limit-reset[datetime], .provider-flip-clock-time[datetime]",
    )
    .forEach((node) => {
      if (node.classList.contains("provider-reset-credit-item")) {
        const text = formatResetCreditExpiry(node.dateTime);
        if (node.textContent !== text) node.textContent = text;
        return;
      }
      if (node.classList.contains("provider-flip-clock-time")) {
        updateFlipClockNode(node);
        return;
      }
      updateLimitResetNode(node);
    });
}

function officialOpenRouterCreditsAvailable() {
  const credits = state.openrouterPayload?.credits;
  return (
    ["live", "stale"].includes(credits?.status) &&
    Number.isFinite(Number(credits?.remaining))
  );
}

function createOpenRouterActivityNode() {
  const node = document.createElement("div");
  node.className = "activity-item openrouter-activity-item";
  node.innerHTML = `
    <div class="openrouter-model-top">
      <div class="openrouter-model-identity">
        <span class="openrouter-model-name"></span>
        <span class="openrouter-model-provider"></span>
      </div>
      <span class="openrouter-model-usage"></span>
    </div>
    <div class="openrouter-model-stats">
      <span class="requests"></span>
      <span class="prompt"></span>
      <span class="completion"></span>
      <span class="reasoning"></span>
    </div>
  `;
  return node;
}

function updateOpenRouterActivityNode(node, model) {
  const name = model.id || "—";
  const share = Math.max(0, Math.min(100, Number(model.sharePercent) || 0));
  const nameElement = node.querySelector(".openrouter-model-name");
  nameElement.textContent = name;
  nameElement.title = name;
  const providerText = (model.providers || []).join(" · ") || "OpenRouter";
  const providerElement = node.querySelector(".openrouter-model-provider");
  providerElement.textContent = providerText;
  providerElement.title = providerText;
  node.querySelector(".requests").textContent = t("totalRequests", {
    count: formatInteger(model.requests),
  });
  node.querySelector(".prompt").textContent = `${t("promptShort")}: ${formatCompact(model.promptTokens)}`;
  node.querySelector(".completion").textContent = `${t("completionShort")}: ${formatCompact(model.completionTokens)}`;
  const reasoning = node.querySelector(".reasoning");
  reasoning.textContent = `${t("reasoningShort")}: ${formatCompact(model.reasoningTokens)}`;
  reasoning.hidden = !(Number(model.reasoningTokens) > 0);
}

function renderOpenRouterSummary(payload, previousPayload = null) {
  const credits = payload?.credits || {};
  const activity = payload?.activity || {};
  const previousCredits = previousPayload?.credits || {};
  const previousActivity = previousPayload?.activity || {};
  const creditsAvailable = ["live", "stale"].includes(credits.status);
  const activityAvailable = ["live", "stale"].includes(activity.status);
  elements.requestsLabel.textContent = t("openrouterRemaining");
  elements.modelLabel.textContent = t("openrouterUsage30d");
  elements.successLabel.textContent = t("openrouterRequests");
  elements.tokensLabel.textContent = t("openrouterTopModel");
  elements.tokensHint.hidden = true;
  elements.tokensSourceHint.hidden = false;
  if (creditsAvailable && Number.isFinite(Number(credits.remaining))) {
    animateNumber(
      elements.requestsValue,
      previousCredits.remaining,
      credits.remaining,
      formatCredits,
    );
  } else {
    elements.requestsValue.textContent = "—";
  }
  elements.requestsHint.textContent = creditsAvailable
    ? `${t("officialCredits")} · ${formatCredits(credits.totalCredits)} / ${formatCredits(credits.totalUsage)}`
    : t("officialCredits");

  const summary = activity.summary || {};
  const previousSummary = previousActivity.summary || {};
  if (activityAvailable) {
    animateNumber(
      elements.modelValue,
      previousSummary.usageCredits,
      summary.usageCredits,
      formatCredits,
    );
    animateNumber(
      elements.successValue,
      previousSummary.requests,
      summary.requests,
      formatInteger,
    );
  } else {
    elements.modelValue.textContent = "—";
    elements.successValue.textContent = "—";
  }
  const topModel = activity.models?.[0]?.id || "—";
  elements.tokensValue.textContent = topModel;
  elements.tokensValue.title = topModel === "—" ? "" : topModel;
  elements.modelValue.title = "";
  elements.modelHint.textContent = t("completedUtcDays");
  elements.successHint.textContent = t("lastThirtyCompletedDays");
  elements.tokensSourceHint.textContent = t("byCreditsUsage");
  [
    elements.requestsValue,
    elements.modelValue,
    elements.successValue,
    elements.tokensValue,
  ].forEach(removeSkeleton);
}

function renderOpenRouterActivity(payload, previousPayload = null, animateChanges = false) {
  const activity = payload?.activity || {};
  const previousActivity = previousPayload?.activity || {};
  const activityAvailable = ["live", "stale"].includes(activity.status);
  const models = activityAvailable ? activity.models || [] : [];
  if (!models.length) {
    renderEmptyState(elements.activityList, t("noOpenrouterModels"));
    return;
  }
  const previousModels = new Map(
    (previousActivity.models || []).map((model) => [model.id, model]),
  );
  reconcileKeyedList({
    container: elements.activityList,
    itemClass: "activity-item",
    items: models.slice(0, 8),
    keyFor: (model) => model.id,
    createNode: createOpenRouterActivityNode,
    updateNode: updateOpenRouterActivityNode,
    animateLayout: animateChanges && Boolean(previousPayload) && !reducedMotion.matches,
    shouldHighlight: (model) => {
      const previous = previousModels.get(model.id);
      return Boolean(previous && JSON.stringify(previous) !== JSON.stringify(model));
    },
  });
}

function updateOpenRouterRankingNode(node, model) {
  const name = model.id || "—";
  const share = Math.max(0, Math.min(100, Number(model.sharePercent) || 0));
  const nameElement = node.querySelector(".ranking-name");
  nameElement.textContent = name;
  nameElement.title = name;
  const progress = node.querySelector(".ranking-track");
  progress.max = 100;
  progress.setAttribute("aria-label", `${name} ${share.toFixed(1)}%`);
  progress.textContent = `${share.toFixed(1)}%`;
}

function renderOpenRouterRanking(payload, previousPayload = null, animateChanges = false) {
  const activity = payload?.activity || {};
  const previousActivity = previousPayload?.activity || {};
  const models = ["live", "stale"].includes(activity.status) ? activity.models || [] : [];
  elements.rankingTotal.textContent = t("totalModels", {
    count: formatInteger(activity.summary?.modelCount || 0),
  });
  if (!models.length) {
    renderEmptyState(elements.rankingList, t("noOpenrouterModels"));
    return;
  }
  const previousModels = new Map(
    (previousActivity.models || []).map((model) => [model.id, model]),
  );
  const entries = reconcileKeyedList({
    container: elements.rankingList,
    itemClass: "ranking-item",
    items: models.slice(0, 8),
    keyFor: (model) => model.id,
    createNode: createRankingNode,
    updateNode: updateOpenRouterRankingNode,
    animateLayout: animateChanges && Boolean(previousPayload) && !reducedMotion.matches,
    shouldHighlight: (model) => {
      const previous = previousModels.get(model.id);
      return Boolean(previous && JSON.stringify(previous) !== JSON.stringify(model));
    },
  });
  entries.forEach(({ item: model, node }) => {
    const previous = previousModels.get(model.id);
    animateNumber(
      node.querySelector(".ranking-request-value"),
      previous?.usageCredits,
      model.usageCredits,
      formatCredits,
    );
    animateNumber(
      node.querySelector(".ranking-share-value"),
      previous?.sharePercent,
      model.sharePercent,
      (value) => `${Number(value).toFixed(1)}%`,
    );
    animateProgress(
      node.querySelector(".ranking-track"),
      previous?.sharePercent,
      model.sharePercent,
    );
  });
}

function renderOpenRouter(payload, previousPayload = null, animateChanges = false) {
  const partial = payload?.credits?.status !== "live" || payload?.activity?.status !== "live";
  showNotice(partial ? t("openrouterPartial") : "");
  setConnection(payload?.meta?.stale || partial ? "stale" : "live");
  renderOpenRouterSummary(payload, previousPayload);
  renderOpenRouterActivity(payload, previousPayload, animateChanges);
  renderOpenRouterRanking(payload, previousPayload, animateChanges);
  elements.dataThrough.textContent = payload?.activity?.period?.throughDate
    ? t("throughUtcDate", { date: payload.activity.period.throughDate })
    : "—";
  elements.updatedAt.textContent = payload?.meta?.stale
    ? t("openrouterDelayed", { time: formatDate(payload.meta.generatedAt, false) })
    : t("openrouterUpdated", { time: formatDate(payload?.meta?.generatedAt, false) });
  elements.schemaVersion.textContent = "";
}

function renderOpenRouterFailure() {
  showNotice(t("openrouterUnavailable"), true);
  setConnection("offline");
  elements.requestsValue.textContent = "—";
  elements.modelValue.textContent = "—";
  elements.successValue.textContent = "—";
  elements.tokensValue.textContent = "—";
  [
    elements.requestsValue,
    elements.modelValue,
    elements.successValue,
    elements.tokensValue,
  ].forEach(removeSkeleton);
  renderEmptyState(elements.activityList, t("openrouterUnavailable"));
  renderEmptyState(elements.rankingList, t("openrouterUnavailable"));
  elements.dataThrough.textContent = "—";
  elements.rankingTotal.textContent = "—";
  elements.updatedAt.textContent = t("openrouterUnavailable");
  elements.schemaVersion.textContent = "";
}

function renderFooter(payload) {
  elements.updatedAt.textContent = t("updatedEvery", {
    time: formatDate(payload.meta.generatedAt, false),
  });
  elements.schemaVersion.textContent = t("schema", { version: payload.meta.schemaVersion });
}

function configureAISource() {
  document.querySelectorAll("[data-source]").forEach((button) => {
    const selected = button.dataset.source === state.source;
    button.classList.toggle("selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  const isLocal = state.source === "local";
  elements.localFilters.hidden = !isLocal;
  elements.openrouterPeriod.hidden = isLocal;
  elements.aiProviderSlot.hidden = !isLocal;
  elements.activityHeading.textContent = isLocal ? t("requestStream") : t("openrouterActivity");
  elements.rankingKicker.textContent = t("modelRankings");
  elements.rankingHeading.textContent = isLocal ? t("tokenShare") : t("creditsShare");
  if (isLocal) {
    elements.requestsLabel.textContent = t(rangeLabelKey());
    elements.requestsHint.textContent = t("requests");
    elements.modelLabel.textContent = t("primaryModel");
    elements.modelHint.textContent = t("byTokenVolume");
    elements.successLabel.textContent = t("successRate");
    elements.tokensLabel.textContent = t("totalTokens");
    elements.tokensHint.hidden = false;
    elements.tokensSourceHint.hidden = true;
  } else {
    elements.requestsLabel.textContent = t("openrouterRemaining");
    elements.modelLabel.textContent = t("openrouterUsage30d");
    elements.successLabel.textContent = t("openrouterRequests");
    elements.tokensLabel.textContent = t("openrouterTopModel");
    elements.requestsHint.textContent = t("officialCredits");
    elements.modelHint.textContent = t("completedUtcDays");
    elements.successHint.textContent = t("lastThirtyCompletedDays");
    elements.tokensHint.hidden = true;
    elements.tokensSourceHint.hidden = false;
    elements.tokensSourceHint.textContent = t("byCreditsUsage");
  }
  if (state.renderedSource !== state.source) {
    elements.activityList.replaceChildren();
    elements.rankingList.replaceChildren();
    state.renderedSource = state.source;
  }
}

function renderAI(previousPayload = null, animateChanges = false, renderProviderSection = true) {
  configureAISource();
  document.querySelectorAll("[data-range]").forEach((button) => {
    button.classList.toggle("selected", button.dataset.range === state.range);
    button.setAttribute("aria-pressed", String(button.dataset.range === state.range));
  });
  document.querySelectorAll("[data-app]").forEach((button) => {
    button.classList.toggle("selected", button.dataset.app === state.app);
    button.setAttribute("aria-pressed", String(button.dataset.app === state.app));
  });

  if (renderProviderSection) {
    if (state.providerFailed) {
      renderProviderFailure(false);
    } else if (state.providerPayload) {
      renderProviders(state.providerPayload, state.providerPayload, false);
    }
  }

  if (state.source === "openrouter") {
    elements.trendPanel.hidden = true;
    if (state.openrouterFailed) {
      renderOpenRouterFailure();
    } else if (state.openrouterPayload) {
      renderOpenRouter(state.openrouterPayload, previousPayload, animateChanges);
    } else {
      setConnection("connecting");
      showNotice("");
    }
    return;
  }

  if (!state.payload) return;
  renderSummary(state.payload, previousPayload);
  renderTrend(state.payload);
  renderActivity(state.payload, previousPayload, animateChanges);
  renderRanking(state.payload, previousPayload, animateChanges);
  renderFooter(state.payload);
  if (state.payload.meta.stale) {
    setConnection("stale");
    showNotice(t("databaseDelayed"));
  } else {
    setConnection("live");
    showNotice("");
  }
}

function moveProviderPanel(isHome) {
  const destination = isHome ? elements.homeProviderSlot : elements.aiProviderSlot;
  if (elements.providerPanel.parentElement !== destination) {
    destination.append(elements.providerPanel);
  }
}

function renderProviderState() {
  if (state.providerFailed) {
    renderProviderFailure(false);
  } else if (state.providerPayload) {
    renderProviders(state.providerPayload, state.providerPayload, false);
  }
}

let viewTransitionToken = 0;
let activeViewTransition = null;

function unpinExitingView(outgoing) {
  outgoing.classList.remove("is-exiting");
  ["position", "top", "left", "width"].forEach((property) => {
    outgoing.style.removeProperty(property);
  });
}

function finalizeViewTransition() {
  viewTransitionToken += 1;
  if (!activeViewTransition) return;
  const { outgoing, incoming } = activeViewTransition;
  activeViewTransition = null;
  [outgoing, incoming, elements.providerPanel].forEach(cancelRowAnimations);
  unpinExitingView(outgoing);
  outgoing.hidden = true;
}

function finishViewTransition(token) {
  if (token !== viewTransitionToken || !activeViewTransition) return;
  const { outgoing } = activeViewTransition;
  activeViewTransition = null;
  unpinExitingView(outgoing);
  outgoing.hidden = true;
}

function startViewTransition(outgoing, incoming, nextView, panelRectBefore) {
  const token = ++viewTransitionToken;
  activeViewTransition = { outgoing, incoming };

  // Pin the outgoing view over the incoming one so the container height
  // collapses to the incoming view immediately. Reading incoming.offset*
  // after removing outgoing from flow yields its final position.
  outgoing.style.position = "absolute";
  outgoing.style.top = `${incoming.offsetTop}px`;
  outgoing.style.left = `${incoming.offsetLeft}px`;
  outgoing.style.width = `${incoming.offsetWidth}px`;
  outgoing.classList.add("is-exiting");

  // Nav order is Home, AI: moving to AI slides in from the right.
  const forward = nextView === "ai";
  const enterFrom = forward ? viewEnterDistance : -viewEnterDistance;
  const exitTo = forward ? -viewExitDistance : viewExitDistance;

  const exitAnimation = playRowAnimation(
    outgoing,
    [
      { opacity: 1, transform: "translate3d(0, 0, 0)" },
      { opacity: 0, transform: `translate3d(${exitTo}px, 0, 0)` },
    ],
    { duration: viewTransitionDuration, easing: listEasing },
  );
  playRowAnimation(
    incoming,
    [
      { opacity: 0, transform: `translate3d(${enterFrom}px, 0, 0)` },
      { opacity: 1, transform: "translate3d(0, 0, 0)" },
    ],
    { duration: viewTransitionDuration, easing: listEasing },
  );

  if (panelRectBefore?.width) {
    const panelRectAfter = elements.providerPanel.getBoundingClientRect();
    const deltaX = panelRectBefore.left - panelRectAfter.left;
    const deltaY = panelRectBefore.top - panelRectAfter.top;
    if (
      panelRectAfter.width &&
      (Math.abs(deltaX) > 0.5 || Math.abs(deltaY) > 0.5)
    ) {
      playRowAnimation(
        elements.providerPanel,
        [
          { transform: `translate3d(${deltaX}px, ${deltaY}px, 0)` },
          { transform: "translate3d(0, 0, 0)" },
        ],
        { duration: viewTransitionDuration, easing: listEasing },
      );
    }
  }

  if (!exitAnimation) {
    finishViewTransition(token);
    return;
  }
  exitAnimation.finished.then(
    () => finishViewTransition(token),
    () => {},
  );
}

function updateNavIndicator(animate) {
  const indicator = elements.navIndicator;
  const active = state.view === "home" ? elements.navHome : elements.navAi;
  if (!animate) {
    indicator.classList.add("is-instant");
  }
  // Matches the previous underline's 23px inset on each side of the link.
  indicator.style.width = `${active.offsetWidth - 46}px`;
  indicator.style.transform = `translateX(${active.offsetLeft + 23}px)`;
  if (!animate) {
    void indicator.offsetWidth;
    indicator.classList.remove("is-instant");
  }
}

function fadeAiContent() {
  elements.aiView
    .querySelectorAll(".summary-grid, .detail-grid")
    .forEach((section) => {
      playRowAnimation(
        section,
        [
          { opacity: 0, transform: "translate3d(0, 4px, 0)" },
          { opacity: 1, transform: "translate3d(0, 0, 0)" },
        ],
        { duration: contentFadeDuration, easing: listEasing },
      );
    });
}

function renderShell({ transition = false } = {}) {
  finalizeViewTransition();
  document.documentElement.lang = state.language === "zh" ? "zh-CN" : "en";
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  const isChinese = state.language === "zh";
  const languageLabel = isChinese
    ? "当前语言：中文，切换至 English"
    : "Current language: English. Switch to Chinese";
  elements.languageToggle.textContent = isChinese ? "中" : "EN";
  elements.languageToggle.setAttribute("aria-label", languageLabel);
  elements.languageToggle.title = languageLabel;
  elements.pageLoader.setAttribute("aria-label", t("loadingPage"));

  const isHome = state.view === "home";
  const previousView = state.renderedView;
  const viewChanged = previousView !== null && previousView !== state.view;
  const incoming = isHome ? elements.homeView : elements.aiView;
  const outgoing = viewChanged
    ? isHome
      ? elements.aiView
      : elements.homeView
    : null;
  const animateTransition = Boolean(
    transition &&
      outgoing &&
      !reducedMotion.matches &&
      typeof incoming.animate === "function",
  );
  if (transition && viewChanged) {
    window.scrollTo(0, 0);
  }
  const panelRectBefore = animateTransition
    ? elements.providerPanel.getBoundingClientRect()
    : null;

  elements.homeProviderSlot.hidden = false;
  elements.homeView.hidden = !isHome;
  elements.aiView.hidden = isHome;
  if (animateTransition) outgoing.hidden = false;
  elements.navHome.classList.toggle("active", isHome);
  elements.navAi.classList.toggle("active", !isHome);
  moveProviderPanel(isHome);
  renderProviderState();
  updateNavIndicator(Boolean(transition && viewChanged));
  if (animateTransition) {
    startViewTransition(outgoing, incoming, state.view, panelRectBefore);
  }
  state.renderedView = state.view;
  if (isHome) {
    elements.navHome.setAttribute("aria-current", "page");
    elements.navAi.removeAttribute("aria-current");
    document.title = "HomeDash · Home";
    if (state.tailscaleFailed) {
      renderTailscaleFailure();
    } else if (state.tailscalePayload) {
      renderTailscale(state.tailscalePayload, state.tailscalePayload);
    } else {
      setConnection("connecting");
    }
    if (state.clashFailed) {
      renderClashFailure();
    } else if (state.clashPayload) {
      renderClash(state.clashPayload, state.clashPayload, false);
    }
    return;
  }

  elements.navAi.setAttribute("aria-current", "page");
  elements.navHome.removeAttribute("aria-current");
  document.title = "HomeDash · AI Usage";
  const selectedPayload = state.source === "local" ? state.payload : state.openrouterPayload;
  renderAI(selectedPayload, false, false);
  if (!selectedPayload && !state.openrouterFailed) setConnection("connecting");
}

async function loadDashboard({ silent = false } = {}) {
  const requestedRange = state.range;
  const requestedApp = state.app;
  const requestKey = `${requestedRange}:${requestedApp}`;
  if (state.fetching) {
    if (state.dashboardRequestKey !== requestKey) {
      state.dashboardReloadPending = true;
    }
    return;
  }
  state.fetching = true;
  state.dashboardRequestKey = requestKey;
  if (!silent && !state.payload) setConnection("connecting");

  try {
    const params = new URLSearchParams({ range: requestedRange, app: requestedApp });
    const response = await fetch(`/api/v1/dashboard?${params}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Dashboard request failed");
    const previousPayload = state.payload;
    const nextPayload = await response.json();
    if (requestedRange !== state.range || requestedApp !== state.app) {
      state.dashboardReloadPending = true;
      return;
    }
    state.payload = nextPayload;
    if (state.view === "ai" && state.source === "local") {
      renderAI(previousPayload, true, false);
    }
  } catch (_error) {
    if (
      state.view === "ai" &&
      requestedRange === state.range &&
      requestedApp === state.app
    ) {
      setConnection("offline");
      showNotice(t("databaseUnavailable"), true);
    }
  } finally {
    state.fetching = false;
    state.dashboardRequestKey = null;
    if (state.dashboardReloadPending) {
      state.dashboardReloadPending = false;
      loadDashboard();
    }
  }
}

async function loadTailscale({ silent = false } = {}) {
  if (state.tailscaleFetching) return;
  state.tailscaleFetching = true;
  if (!silent && !state.tailscalePayload && state.view === "home") {
    setConnection("connecting");
  }

  try {
    const response = await fetch("/api/v1/tailscale", {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Tailscale request failed");
    const previousPayload = state.tailscalePayload;
    state.tailscalePayload = await response.json();
    state.tailscaleFailed = false;
    renderTailscale(state.tailscalePayload, previousPayload);
  } catch (_error) {
    state.tailscaleFailed = true;
    renderTailscaleFailure();
  } finally {
    state.tailscaleFetching = false;
  }
}

async function loadClashVerge() {
  if (state.clashFetching) return;
  state.clashFetching = true;

  try {
    const response = await fetch("/api/v1/clash-verge", {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Clash Verge request failed");
    const previousPayload = state.clashPayload;
    state.clashPayload = await response.json();
    state.clashFailed = false;
    renderClash(state.clashPayload, previousPayload, true);
  } catch (_error) {
    state.clashFailed = true;
    renderClashFailure();
  } finally {
    state.clashFetching = false;
  }
}

async function loadProviders() {
  if (state.providerFetching) return;
  state.providerFetching = true;

  try {
    const response = await fetch("/api/v1/providers", {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Provider request failed");
    const previousPayload = state.providerPayload;
    state.providerPayload = await response.json();
    state.providerFailed = false;
    renderProviders(state.providerPayload, previousPayload, true);
  } catch (_error) {
    const wasFailed = state.providerFailed;
    state.providerFailed = true;
    if (!wasFailed) renderProviderFailure(true);
  } finally {
    state.providerFetching = false;
  }
}

async function loadOpenRouter() {
  if (state.openrouterFetching) return;
  state.openrouterFetching = true;

  try {
    const response = await fetch("/api/v1/openrouter", {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!response.ok) throw new Error("OpenRouter request failed");
    const previousPayload = state.openrouterPayload;
    state.openrouterPayload = await response.json();
    state.openrouterFailed = false;
    if (state.view === "ai" && state.source === "openrouter") {
      renderAI(previousPayload, true, false);
    }
    if (state.providerPayload) {
      renderProviders(state.providerPayload, state.providerPayload, true);
    }
  } catch (_error) {
    const wasFailed = state.openrouterFailed;
    state.openrouterFailed = true;
    if (!wasFailed) {
      if (state.view === "ai" && state.source === "openrouter") {
        renderOpenRouterFailure();
      }
      if (state.providerPayload) {
        renderProviders(state.providerPayload, state.providerPayload, true);
      }
    }
  } finally {
    state.openrouterFetching = false;
  }
}

let liveActivityStream = null;
let liveActivityStreamFailed = false;

function liveActivityWanted() {
  return state.view === "ai" && state.source === "local" && !document.hidden;
}

function applyLiveActivity(payload) {
  state.livePayload = payload?.meta?.stale ? null : payload;
  if (state.view === "ai" && state.source === "local" && state.payload) {
    renderActivity(state.payload, state.payload, true);
  }
}

function closeLiveActivityStream() {
  liveActivityStream?.close();
  liveActivityStream = null;
}

function manageLiveActivityStream() {
  if (!liveActivityWanted() || liveActivityStreamFailed) {
    closeLiveActivityStream();
    return;
  }
  if (liveActivityStream) return;
  if (typeof EventSource !== "function") {
    liveActivityStreamFailed = true;
    return;
  }
  const stream = new EventSource("/api/v1/live-activity/stream");
  liveActivityStream = stream;
  stream.onmessage = (event) => {
    try {
      applyLiveActivity(JSON.parse(event.data));
    } catch (_error) {}
  };
  stream.onerror = () => {
    // CLOSED means the endpoint failed hard (e.g. 404) and the browser gave
    // up reconnecting — fall back to the 1s polling loop permanently.
    if (stream.readyState === EventSource.CLOSED) {
      liveActivityStreamFailed = true;
      closeLiveActivityStream();
    }
  };
}

async function loadLiveActivity() {
  if (
    liveActivityStream ||
    document.hidden ||
    state.liveFetching ||
    state.view !== "ai" ||
    state.source !== "local" ||
    !routingMetricsVisible()
  ) {
    return;
  }
  state.liveFetching = true;
  try {
    const response = await fetch("/api/v1/live-activity", {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Live activity request failed");
    applyLiveActivity(await response.json());
  } catch (_error) {
    applyLiveActivity(null);
  } finally {
    state.liveFetching = false;
  }
}

elements.sourceFilter.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-source]");
  if (!button || button.dataset.source === state.source) return;
  state.source = button.dataset.source;
  localStorage.setItem("cc-dashboard-source", state.source);
  state.livePayload = null;
  renderAI(null, false, false);
  fadeAiContent();
  if (state.source === "local") {
    runPageLoad([() => loadDashboard(), () => loadLiveActivity()]);
  } else {
    runPageLoad([() => loadOpenRouter()]);
  }
  manageLiveActivityStream();
});

elements.rangeFilter.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-range]");
  if (!button || button.dataset.range === state.range) return;
  state.range = button.dataset.range;
  renderAI(state.payload, false, false);
  fadeAiContent();
  runPageLoad([() => loadDashboard()]);
});

elements.trendLegend.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-series]");
  if (!button) return;
  const series = button.dataset.series;
  if (!(series in trendSeriesVisible)) return;
  const visibleCount = Object.values(trendSeriesVisible).filter(Boolean).length;
  if (trendSeriesVisible[series] && visibleCount === 1) return;
  trendSeriesVisible[series] = !trendSeriesVisible[series];
  button.setAttribute("aria-pressed", String(trendSeriesVisible[series]));
  button.classList.toggle("is-off", !trendSeriesVisible[series]);
  renderTrend(state.payload);
});

elements.trendSvg.addEventListener("pointermove", (event) => {
  if (!trendContext) return;
  const rect = elements.trendSvg.getBoundingClientRect();
  if (rect.width <= 0) return;
  const viewX = ((event.clientX - rect.left) / rect.width) * trendChartWidth;
  const count = trendContext.trend.length;
  const stepX = (trendChartWidth - trendChartPadX * 2) / (count - 1);
  const index = Math.round((viewX - trendChartPadX) / stepX);
  showTrendHover(Math.max(0, Math.min(count - 1, index)));
});

elements.trendSvg.addEventListener("pointerleave", hideTrendHover);

elements.appFilter.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-app]");
  if (!button || button.dataset.app === state.app) return;
  state.app = button.dataset.app;
  renderAI(state.payload, false, false);
  fadeAiContent();
  runPageLoad([() => loadDashboard()]);
});

elements.languageToggle.addEventListener("click", () => {
  state.language = state.language === "zh" ? "en" : "zh";
  localStorage.setItem("cc-dashboard-language", state.language);
  renderShell();
});

window.addEventListener("hashchange", () => {
  state.view = window.location.hash === "#ai" ? "ai" : "home";
  renderShell({ transition: state.view !== state.renderedView });
  if (state.view === "home") {
    runPageLoad([
      () => loadTailscale(),
      () => loadClashVerge(),
      () => loadProviders(),
      () => loadOpenRouter(),
    ]);
  } else {
    runPageLoad([
      () => loadDashboard(),
      () => loadProviders(),
      () => loadOpenRouter(),
    ]);
  }
  manageLiveActivityStream();
});

window.addEventListener("resize", () => updateNavIndicator(false));
document.fonts?.ready.then(() => updateNavIndicator(false));

renderShell();
if (state.view === "home") {
  runPageLoad([
    () => loadTailscale(),
    () => loadClashVerge(),
    () => loadProviders(),
    () => loadOpenRouter(),
  ]);
} else {
  runPageLoad([
    () => loadDashboard(),
    () => loadProviders(),
    () => loadOpenRouter(),
  ]);
}
manageLiveActivityStream();

function refreshCurrentView({ silent = false } = {}) {
  if (state.view === "home") {
    loadTailscale({ silent });
    loadClashVerge();
    loadProviders();
    loadOpenRouter();
    return;
  }
  loadDashboard({ silent });
  loadProviders();
  loadOpenRouter();
}

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    closeLiveActivityStream();
    return;
  }
  refreshCurrentView({ silent: true });
  manageLiveActivityStream();
});

window.setInterval(() => {
  if (document.hidden) return;
  refreshCurrentView({ silent: true });
}, 10_000);

window.setInterval(loadLiveActivity, 1_000);

window.setInterval(tickProviderCountdowns, 1_000);
