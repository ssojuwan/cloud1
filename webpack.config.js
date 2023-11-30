const path = require('path');

module.exports = {
  mode: 'development', // 또는 'production'
  entry: './src/index.js', // 실제 entry 파일의 경로로 수정
  output: {
    path: path.resolve(__dirname, 'dist'), // 빌드된 파일의 출력 경로
    filename: 'bundle.js', // 빌드된 파일의 이름
  },
};
