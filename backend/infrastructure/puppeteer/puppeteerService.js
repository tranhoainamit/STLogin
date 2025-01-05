const puppeteer = require('puppeteer');
let runningBrowsers = {};

exports.startProfile = async (profile) => {
  const browser = await puppeteer.launch({
    headless: false,
    userDataDir: profile.path,
  });

  runningBrowsers[profile.name] = browser;
};

exports.stopProfile = async (profile) => {
  const browser = runningBrowsers[profile.name];
  if (browser) {
    await browser.close();
    delete runningBrowsers[profile.name];
  }
};
