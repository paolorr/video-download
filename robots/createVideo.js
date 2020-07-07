const fs = require('fs');
const concat = require('ffmpeg-concat');
const path = require('path');

function log(message) {
  console.log(`> [createVideo] ${message}`);
}

async function createVideo(directory) {
  log('Starting');

  const directoryContent = fs.readdirSync(directory);
  const audios = directoryContent
    .filter(
      filename => filename.startsWith('audio') && filename.endsWith('.mp3'),
    )
    .sort();
  const videos = directoryContent
    .filter(
      filename =>
        filename.startsWith('video') &&
        filename.endsWith('.mp4') &&
        filename !== 'video.mp4',
    )
    .sort()
    .map(filename => path.resolve(directory, filename));

  if (audios.length > 1) {
    throw Error('Only one audio file allowed');
  }

  const audio = path.resolve(directory, audios[0]);

  console.log(audio);
  console.log(videos);

  await concat({
    output: 'video.mp4',
    videos,
    audio,
    transition: {
      name: 'fade',
      duration: 1000,
    },
    log: console.log,
  });
}

module.exports = createVideo;
