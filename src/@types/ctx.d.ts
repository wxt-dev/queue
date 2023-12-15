interface WxtQueueCtx {
  chrome: ReturnType<
    typeof import("../services/chrome-service").createChromeService
  >;
  firefox: ReturnType<
    typeof import("../services/firefox-service").createFirefoxService
  >;
}
