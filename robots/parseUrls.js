/* eslint-disable no-use-before-define */
const url = require('url');
const { Builder, By, until } = require('selenium-webdriver');

const parsers = [{ host: 'www.lectorlive.com', parser: parseLectorVideos }];

function log(message) {
  console.log(`> [parseUrls] ${message}`);
}

async function loadChromeDriver() {
  log('Loading Chrome');
  const driver = await new Builder().forBrowser('chrome').build();
  log('Chrome loaded');
  return driver;
}

async function parseLectorVideos(playerUrl) {
  const driver = await loadChromeDriver();

  try {
    await driver.get(playerUrl);

    log('Parsing video URLs');
    const videoElements = await driver.wait(
      until.elementsLocated(
        By.css(
          '.recording-container-content > #side-bar > .cams-panel-content .cams-panel-list > div > video',
        ),
      ),
    );
    const videoSrc = await Promise.all(
      videoElements.map(async element => element.getAttribute('src')),
    );
    log(`Total ${videoSrc.length} video${videoSrc.length > 1 ? 's' : ''}`);

    log('Parsing audio URLs');
    const audioElements = await driver.wait(
      until.elementsLocated(
        By.css(
          '.recording-container-content > .audio.recording-content > audio',
        ),
      ),
    );
    const audioSrc = await Promise.all(
      audioElements.map(async element => element.getAttribute('src')),
    );
    log(`Total ${audioSrc.length} audio${audioSrc.length > 1 ? 's' : ''}`);

    return [audioSrc, videoSrc];
  } finally {
    await driver.quit();
  }
}

async function parseUrls(playerUrl) {
  log('Starting');

  const { host } = url.parse(playerUrl);

  const index = parsers.findIndex(parser => parser.host === host);

  if (index === -1) {
    throw Error('Invalid domain');
  }

  log(`Reading from ${parsers[index].host}`);
  return parsers[index].parser(playerUrl);
}

module.exports = parseUrls;
