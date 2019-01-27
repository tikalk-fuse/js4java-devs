module.exports = require('e2e-helper').exports({
  svc:  "bin/id-svc",
  readyNotice: "server started",
  term_ipc: "IPCTERM",
  term_code: "SIGTERM",
  term_timeout: 10000,
  suites: [
    "test-e2e/no-such-path.GET.test.js",
    "test-e2e/auth.{sessid}.GET.test.js",
    "test-e2e/hello.GET.test.js",
    "test-e2e/user.POST.test.js",
    "test-e2e/user.{usr}.GET.test.js",
    "test-e2e/login.POST.test.js",
  ]
})