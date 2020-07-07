const https = require('https');
const fs = require('fs');
const path = require('path');

function log(message) {
  console.log(`> [download] ${message}`);
}

function showDownloadingProgress(received, total) {
  const percentage = ((received * 100) / total).toFixed(2);
  // process.stdout.clearLine();
  process.stdout.cursorTo(0);
  process.stdout.write(`${percentage}%`);
}

function downloadFile(url, filename, directory, showProgress) {
  log(`Downloading ${url}`);

  const filePath = path.resolve(directory, filename);
  const file = fs.createWriteStream(filePath);
  let totalBytes = 0;
  let receivedBytes = 0;

  https.get(url, function (response) {
    totalBytes = parseInt(response.headers['content-length']);

    response.on('error', function (err) {
      console.log(err);
    });

    if (showProgress) {
      response.on('data', function (chunk) {
        receivedBytes += chunk.length;
        showDownloadingProgress(receivedBytes, totalBytes);
      });
    }
    // .on('end', function () {
    //   log('Download finished');
    // })
    response.pipe(file);

    file.on('finish', function () {
      file.close(() => {
        log(`Saved ${url} to ${filePath}`);
      });
    });
  });
}

function padFileSequence(index) {
  return index.toString().padStart(4, '0');
}

async function downloadFiles(type, urls, directory) {
  let extension = '';
  switch (type) {
    case 'audio':
      extension = 'mp3';
      break;
    case 'video':
      extension = 'mp4';
      break;
    default:
      break;
  }
  if (extension !== '') {
    extension = `.${extension}`;
  }
  let index = 1;
  for (const url of urls) {
    await downloadFile(
      url,
      `${type}${padFileSequence(index++)}${extension}`,
      directory,
    );
  }
}

async function download(audioUrls, videoUrls, directory) {
  log('Starting');

  await downloadFiles('audio', audioUrls, directory);
  await downloadFiles('video', videoUrls, directory);
}

module.exports = download;
