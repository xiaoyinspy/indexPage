import path from 'path';
import fs from 'fs';
import express from 'express';
import webpack from 'webpack';

const port = 2030;
const app = express();

app.use(express.static(path.resolve(__dirname, '../public')));
app.get('*', (req, res) => {
  fs.readFile(path.resolve(__dirname, '../pubilc/index.html'), (err, data) => {
    res.end(data);
  });
});


app.listen(port, () => {
  console.log(`🚀  题库项目已进入战斗状态，监听端口: ${port}`);
});
