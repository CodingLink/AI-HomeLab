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
    resetInMinutes: "{count} 分钟后",
    resetInHours: "{count} 小时后",
    resetInDays: "{count} 天后",
    fiveHourLimit: "5 小时限额",
    dailyLimit: "每日限额",
    weeklyLimit: "7 天限额",
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
    resetInMinutes: "in {count} min",
    resetInHours: "in {count} hr",
    resetInDays: "in {count} days",
    fiveHourLimit: "5-hour limit",
    dailyLimit: "Daily limit",
    weeklyLimit: "7-day limit",
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
};

const elements = {
  navHome: document.querySelector("#nav-home"),
  navAi: document.querySelector("#nav-ai"),
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

function t(key, values = {}) {
  let text = translations[state.language][key] ?? key;
  Object.entries(values).forEach(([name, value]) => {
    text = text.replace(`{${name}}`, value);
  });
  return text;
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
  });
}

function createProviderNode() {
  const node = document.createElement("article");
  node.className = "provider-card";
  node.innerHTML = `
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

  const hasBalance = Boolean(provider.balance);
  const hasLimits = Boolean(provider.limits?.length);
  const balanceBlock = node.querySelector(".provider-balance");
  balanceBlock.hidden = !hasBalance;
  node.querySelector(".provider-balance-label").textContent = t("balance");
  const balanceDetail = node.querySelector(".provider-balance-detail");
  balanceDetail.textContent = formatBalanceDetail(provider.balance?.detail);
  balanceDetail.hidden = !provider.balance?.detail;

  const empty = node.querySelector(".provider-empty");
  empty.hidden = hasBalance || hasLimits;
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

function renderProviders(payload, previousPayload = null, animateChanges = false) {
  const generatedAt = payload?.meta?.generatedAt;
  elements.providerMeta.textContent = payload?.meta?.stale
    ? t("providerDelayed", { time: formatDate(generatedAt, false) })
    : t("providerUpdated", { time: formatDate(generatedAt, false) });

  const providers = (payload?.providers || []).filter(
    (provider) => provider.id !== "openrouter" || !officialOpenRouterCreditsAvailable(),
  );
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
  });
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

function renderShell() {
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

  const isHome = state.view === "home";
  elements.homeProviderSlot.hidden = false;
  elements.homeView.hidden = !isHome;
  elements.aiView.hidden = isHome;
  elements.navHome.classList.toggle("active", isHome);
  elements.navAi.classList.toggle("active", !isHome);
  moveProviderPanel(isHome);
  renderProviderState();
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
  if (state.fetching) return;
  state.fetching = true;
  if (!silent && !state.payload) setConnection("connecting");

  try {
    const params = new URLSearchParams({ range: state.range, app: state.app });
    const response = await fetch(`/api/v1/dashboard?${params}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Dashboard request failed");
    const previousPayload = state.payload;
    state.payload = await response.json();
    if (state.view === "ai" && state.source === "local") {
      renderAI(previousPayload, true, false);
    }
  } catch (_error) {
    if (state.view === "ai") {
      setConnection("offline");
      showNotice(t("databaseUnavailable"), true);
    }
  } finally {
    state.fetching = false;
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

async function loadLiveActivity() {
  if (
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
    const payload = await response.json();
    state.livePayload = payload?.meta?.stale ? null : payload;
  } catch (_error) {
    state.livePayload = null;
  } finally {
    state.liveFetching = false;
  }
  if (state.view === "ai" && state.source === "local" && state.payload) {
    renderActivity(state.payload, state.payload, true);
  }
}

elements.sourceFilter.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-source]");
  if (!button || button.dataset.source === state.source) return;
  state.source = button.dataset.source;
  localStorage.setItem("cc-dashboard-source", state.source);
  state.livePayload = null;
  renderAI(null, false, false);
  if (state.source === "local") {
    loadDashboard();
    loadLiveActivity();
  } else {
    loadOpenRouter();
  }
});

elements.rangeFilter.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-range]");
  if (!button || button.dataset.range === state.range) return;
  state.range = button.dataset.range;
  renderAI(state.payload, false, false);
  loadDashboard();
});

elements.appFilter.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-app]");
  if (!button || button.dataset.app === state.app) return;
  state.app = button.dataset.app;
  renderAI(state.payload, false, false);
  loadDashboard();
});

elements.languageToggle.addEventListener("click", () => {
  state.language = state.language === "zh" ? "en" : "zh";
  localStorage.setItem("cc-dashboard-language", state.language);
  renderShell();
});

window.addEventListener("hashchange", () => {
  state.view = window.location.hash === "#ai" ? "ai" : "home";
  renderShell();
  if (state.view === "home") {
    loadTailscale();
    loadClashVerge();
    loadProviders();
    loadOpenRouter();
  } else {
    loadDashboard();
    loadProviders();
    loadOpenRouter();
  }
});

renderShell();
if (state.view === "home") {
  loadTailscale();
  loadClashVerge();
  loadProviders();
  loadOpenRouter();
} else {
  loadDashboard();
  loadProviders();
  loadOpenRouter();
}
window.setInterval(() => {
  if (state.view === "home") {
    loadTailscale({ silent: true });
    loadClashVerge();
    loadProviders();
    loadOpenRouter();
  } else {
    loadDashboard({ silent: true });
    loadProviders();
    loadOpenRouter();
  }
}, 10_000);

window.setInterval(loadLiveActivity, 1_000);
