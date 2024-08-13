プロジェクトのディレクトリ構造を表示するコマンド
```
tree -I '.git|node_modules|__pycache__|migrations|tree|memo.*' > ./tree/project001_$(date "+%Y%m%d-%H-%M-%S")_tree.txt
```

Djangoの管理画面のユーザ情報
`python manage.py createsuperuser`でユーザを作成する。
ユーザ名：admin
パスワード：admin

## プロジェクトを立ち上げてから使用したコマンド

### backend
    python manage.py startapp notes
    python manage.py makemigrations
    python manage.py migrate

### frontend
    npx -y create-next-app next_app    #コマンド実行時に色々聞かれるため、DockerfileのCMDで自動で立ち上がらなかった（TypeScriptのインストールなど...）
    #npm install axios
    npm install -D tailwindcss
    npx tailwindcss init -p
    npm install pino pino-pretty        #ロギング用ライブラリ


    
settigns.pyの設定
```
ALLOWED_HOSTS = [0.0.0.0]
INSTALLED_APPLS = [
    ... ,
    'rest_framework',
    'corsheaders',    #フロントからバックへPOSTリクエスト送信時にセキュリティ関係のエラーがでるのを解決するために必要（Djangoの仕様らしい）
    'myapp',          #startappコマンドで作成したアプリ名を追記
]
MIDDLEWARE = [
    ... ,
    'corsheaders.middleware.CorsMiddleware',    #フロントからバックへPOSTリクエスト送信時にセキュリティ関係のエラーがでるのを解決するために必要（Djangoの仕様らしい）
]
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",    #フロントからバックへPOSTリクエスト送信時にセキュリティ関係のエラーがでるのを解決するために必要（Djangoの仕様らしい）
]
```


## tailwindcssの設定

### stylesディレクトリの作成
    mkdir styles
    
### ./styles/globals.cssを作成/設定
```
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### ./pages/_app.jsを作成/設定
```
import '../styles/globals.css'
function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}
export default MyApp
```

### ./next.config.jsを作成/設定
```
// next.config.js
module.exports = {
    // ...
    cssModules: true,
    // ...
};
```

### ./postcss.config.jsを作成/設定
```
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### ./tailwind.config.jsを作成/設定
```
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```


## pinoの設定

### pino.jsファイルをfrontendディレクトリに作成します。
```
// frontend/pino.js
const pino = require('pino');
const pretty = require('pino-pretty');

const logger = pino(
  {
    level: 'info',
    prettyPrint: { colorize: true },
  },
  pretty()
);

module.exports = logger;
```

### pages/_app.jsを開き、Pinoのロガーをインポートし、使用する方法です。
```
// frontend/pages/_app.js
import '../styles/globals.css';
import logger from '../pino';

function MyApp({ Component, pageProps }) {
  logger.info('Rendering page', { page: Component.name });
  return <Component {...pageProps} />;
}

export default MyApp;
```

### ログのカスタマイズ ファイルにログを保存する　※Node.js用（ブラウザ側で使用することはできない）
```
// frontend/pino.js
const pino = require('pino');
const pretty = require('pino-pretty');
const path = require('path');
const logFilePath = path.join(__dirname, 'logs', 'app.log');

const logger = pino(
  {
    level: 'info',
  },
  pino.destination(logFilePath)
);

module.exports = logger;
```

### frontendディレクトリにlogsディレクトリを作成します。
```
mkdir frontend/logs
```

### pino.jsファイルを更新して、ログをファイルに保存するように設定します。　※Node.js用（ブラウザ側で使用することはできない）
frontend/pino.jsファイルを以下の内容に更新します。
```
// frontend/pino.js
const pino = require('pino');
const path = require('path');
const logFilePath = path.join(__dirname, 'logs', 'app.log');

const logger = pino(
  {
    level: 'info',
  },
  pino.destination(logFilePath)
);

module.exports = logger;
```

### Pinoのブラウザ向け設定
frontend/pino.jsファイルを以下の内容に更新します。
```
const pino = require('pino');
import axios from 'axios';

const fetch = async (obj) => {
  const response = await axios.post('http://0.0.0.0:8000/api/logs/', obj);
};

// ブラウザ向け設定
const logger = pino({
  level: 'info', // ログのレベルを設定 (例: info, error, warn)
  timestamp: pino.stdTimeFunctions.isoTime,
  browser: {
    transmit: {
      send: function (level, logEvent) {
        // ここでログを送信する処理を実装する
        console.log(`Sending log to server: ${logEvent.message}`);
        // サーバーにログを送信する処理を実装する
        fetch({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(logEvent),
        }).catch(error => console.error('Failed to send log to server', error));
      },
    },
    // write: {
    //   level: 'info', // ローカルに書き込むログのレベルを設定
    //   timestamp: pino.stdTimeFunctions.isoTime,
    //   destination: '/logs/app.log', // ローカルに保存するファイルのパス
    // },
  },
});

module.exports = logger;


```


# その他メモ
loggingブランチ作成&コミットプッシュ
loggingブランチ作成&コミットプッシュ2
git ユーザ名　変更
git config email, usernameを変更
windows用のブランチ作成
dashboardブランチ作成
postgresqlブランチコミット
mainブランチコミット
