interface WxtQueueCtx {
  chrome: ReturnType<
    typeof import("../services/chrome-service").createChromeService
  >;
}
