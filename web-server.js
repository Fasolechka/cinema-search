const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

function getLocalIpAddress() {
  const ifaces = os.networkInterfaces();

  // проходим по всем интерфейсам сети и находим IPv4-адрес локального узла
  for (const ifaceName in ifaces) {
    const iface = ifaces[ifaceName];
    for (const alias of iface) {
      if (alias.family === 'IPv4' && !alias.internal) {
        return alias.address;
      }
    }
  }

  // если IPv4-адрес не найден, возвращаем null
  return null;
}

const port = 3000; // порт для прослушивания запросов

const server = http.createServer((req, res) => {
  console.log(`Запрос: ${req.url}`);

  // определение пути к файлу
  let filePath = '.' + req.url;
  if (filePath === './') {
    filePath = './index.html'; // по умолчанию загрузить index.html
  }

  // определение типа контента на основе расширения файла
  const extname = path.extname(filePath);
  let contentType = 'text/html';
  switch (extname) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
      contentType = 'image/jpg';
      break;
    case '.gif':
      contentType = 'image/gif';
      break;
  }

  // чтение файла
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') { // файл не найден
        res.writeHead(404);
        res.end('404 Not Found');
      } else { // другая ошибка
        res.writeHead(500);
        res.end(`Ошибка сервера: ${err.code}`);
      }
    } else { // файл найден
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(port, () => {
  console.log(`Url: http://${getLocalIpAddress()}:${port}`);
});
