const path = require('path');
const fs = require('fs');
const sanitize = require('sanitize-filename');
const removeAccents = require('remove-accents');
require('log-timestamp');

const parseUrls = require('./robots/parseUrls');
const download = require('./robots/download');
const createVideo = require('./robots/createVideo');

const downloadPath = path.resolve(__dirname, 'downloads');

function sanitizeLessonName(lessonName) {
  const lessonNameSanitized = removeAccents(
    lessonName.replace(new RegExp('(, )|( e )|( )', 'g'), '-'),
  );

  return lessonNameSanitized;
}

function checkDirectory(lessonName) {
  const directory = path.resolve(downloadPath, lessonName);
  const result = [directory, true];

  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  } else {
    const content = fs.readdirSync(directory);
    result[1] = content.length === 0;
  }

  return result;
}

const lessons = [
  [
    'Mercado Cervejeiro',
    'https://www.lectorlive.com/viewer/watch/9590f6c7-813e-462c-9e41-f4b44c7da72f',
  ],
  [
    'Compras, distribuição e brewpub',
    'https://www.lectorlive.com/viewer/watch/c26249da-8824-40d4-af42-fd87be5055c2',
  ],
  [
    'Cervejarias Ciganas (parte 02)',
    'https://www.lectorlive.com/viewer/watch/d899365e-d21b-4f74-9f28-d6773d867fbc',
  ],
  [
    'Cervejarias Ciganas (parte 01)',
    'https://www.lectorlive.com/viewer/watch/080f563d-978c-4997-af8c-fde4d3d22882',
  ],
  [
    'Gestão Financeira',
    'https://www.lectorlive.com/viewer/watch/729e8db0-59bd-4da6-83f2-0cce1727157a',
  ],
  [
    'Aspectos tributários, custo e precificação',
    'https://www.lectorlive.com/viewer/watch/1749357a-af6b-496d-84b9-77e553d1ffe0',
  ],
  [
    'Aspectos legais',
    'https://www.lectorlive.com/viewer/watch/32cb3483-44c6-4b0d-9b1b-4307cc7656f0',
  ],
  [
    'Dimensionamento e layout',
    'https://www.lectorlive.com/viewer/watch/7ee567e9-ee18-4283-adfe-9205afcbcbdf',
  ],
  [
    'Planejamento estratégico e inovação em cervejarias (parte 2)',
    'https://www.lectorlive.com/viewer/watch/5c40ca8d-c54b-4a21-a83e-af1640b65ce8',
  ],
  [
    'Planejamento estratégico e inovação em cervejarias (parte 1)',
    'https://www.lectorlive.com/viewer/watch/bae5707d-6459-4b74-8cf5-110658e07be2',
  ],
  [
    'Canais de distribuição e gestão comercial',
    'https://www.lectorlive.com/viewer/watch/b891c653-9868-448f-ad92-50ebf0e2ab6c',
  ],
  [
    'Pesquisa de mercado e comunicação cervejeira',
    'https://www.lectorlive.com/viewer/watch/db40478c-ccad-47a9-958c-ab3bb8633d88',
  ],
];

async function start() {
  const [lessonName, url] = lessons[1];

  try {
    const [directory, isEmpty] = checkDirectory(sanitizeLessonName(lessonName));
    console.log(directory);

    if (isEmpty) {
      const [audios, videos] = await parseUrls(url);
      await download(audios, videos, directory);
    }
    // won't be used as it takes a lot of space and time
    // await createVideo(directory);
  } catch (err) {
    console.log(err);
  }
}

start();
