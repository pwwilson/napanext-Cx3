self.__BUILD_MANIFEST = {
  "/": [
    "static/chunks/pages/index.js"
  ],
  "/[type]": [
    "static/chunks/pages/[type].js"
  ],
  "/display": [
    "static/chunks/pages/display.js"
  ],
  "/feed": [
    "static/chunks/pages/feed.js"
  ],
  "__rewrites": {
    "afterFiles": [],
    "beforeFiles": [],
    "fallback": []
  },
  "sortedPages": [
    "/",
    "/_app",
    "/_error",
    "/api/entries",
    "/display",
    "/feed",
    "/[type]"
  ]
};self.__BUILD_MANIFEST_CB && self.__BUILD_MANIFEST_CB()