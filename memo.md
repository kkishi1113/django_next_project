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

# Python Debuggerの設定
/backend/.vscode/launch.jsonを作成する。
```
{
    // IntelliSense を使用して利用可能な属性を学べます。
    // 既存の属性の説明をホバーして表示します。
    // 詳細情報は次を確認してください: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Python デバッガー: Django",
            "type": "debugpy",
            "request": "launch",
            "args": [
                "runserver",
                "0.0.0.0:8888"  //デバッグ用のポート
            ],
            "django": true,
            "autoStartBrowser": false,
            "program": "${workspaceFolder}/manage.py",
            // falseにすることで自分が書いたコード以外の箇所をデバッグできます
            "justMyCode": false
        }
    ]
}
```

VSCodeの拡張機能 Dev Containerをインストールする。
devcontainer.json(コンテナの構成ファイル)をワークスペース(/django_next_project/.devcontainer/)に作成し(VSCodeの左下の「><」をクリックして「開発コンテナ構成ファイルを追加...」を選択する)、下記の通り設定する。
うまくいかないときは、devcontainer.jsonの「"dockerComposeFile":」のパスがあっているかを確認し、それでもだめならDev Containerをアンインストールして、再度インストールする。
```
// For format details, see https://aka.ms/devcontainer.json. For config options, see the
// README at: https://github.com/devcontainers/templates/tree/main/src/docker-existing-docker-compose
{
	"name": "Existing Docker Compose (Extend)",

	// Update the 'dockerComposeFile' list if you have more compose files or use different names.
	// The .devcontainer/docker-compose.yml file contains any overrides you need/want to make.
	"dockerComposeFile": [
		"../docker-compose.yml",
	],

	// The 'service' property is the name of the service for the container that VS Code should
	// use. Update this value and .devcontainer/docker-compose.yml to the real service name.
	"service": "backend",

	// The optional 'workspaceFolder' property is the path VS Code should open by default when
	// connected. This is typically a file mount in .devcontainer/docker-compose.yml
	"workspaceFolder": "/usr/src/app",

	// Features to add to the dev container. More info: https://containers.dev/features.
	// "features": {},

	// Use 'forwardPorts' to make a list of ports inside the container available locally.
	// "forwardPorts": [],

	// Uncomment the next line if you want start specific services in your Docker Compose config.
	// "runServices": [],

	// Uncomment the next line if you want to keep your containers running after VS Code shuts down.
	// "shutdownAction": "none",

	// Uncomment the next line to run commands after the container is created.
	// "postCreateCommand": "cat /etc/os-release",

	// Configure tool-specific properties.
	"customizations": {
		"vscode": {
			// 拡張機能リスト(拡張機能IDを指定)
			"extensions": [
				"MS-CEINTL.vscode-language-pack-ja",
				"ms-python.debugpy",
			]
    }
	},

	// Uncomment to connect as an existing user other than the container default. More info: https://aka.ms/dev-containers-non-root.
	// "remoteUser": "devcontainer"
}

```


フロントエンドのAPI通信エンドポイントのポート番号をlaunch.jsonのデバッグ用ポートの番号に合わせるために、
/frontend/.env.localを下記の通りに設定する。
```
# Mac
# NEXT_PUBLIC_API_BASE_URL=http://0.0.0.0:8000/api
# Windows
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
# debug
NEXT_PUBLIC_API_BASE_URL=http://localhost:8888/api
```

docker-compose.ymlのbackend:commandを下記の通り設定する。
```
backend:
  container_name: backend_container
  build:
    context: ./backend
  tty: true
  ports:
    - "8000:8000"
  volumes:
    - ./backend:/usr/src/app
  # command: sh -c "python manage.py runserver 0.0.0.0:8000"
  command: sh -c "python -m debugpy --listen 0.0.0.0:8080 manage.py runserver 0.0.0.0:8000"
  depends_on:
    - db
```

/backend/requirements.txtにdebugpyを追加し、backendコンテナを再ビルドする。
```
Django>=3.2,<4.0
djangorestframework
django-cors-headers
django-rest-knox
debugpy
psycopg2-binary
```
コンテナを閉じる。
```
docker-compose down
```
backendコンテナを削除する。
```
docker-compose rm backend
```
backendコンテナを再ビルドする。
```
docker-compose build --no-cache backend
```
コンテナを立ち上げる
```
docker-compose up
```
VSCodeで「コンテナーで再度開く」を選択する（コンテナ内をVScodeで開く）。
デバッガーを起動する。


# その他メモ
loggingブランチ作成&コミットプッシュ
loggingブランチ作成&コミットプッシュ2
git ユーザ名　変更
git config email, usernameを変更
windows用のブランチ作成
dashboardブランチ作成
postgresqlブランチコミット
mainブランチコミット
Python Debugger設定完了
devブランチ作成
feature-frontブランチ作成（親：devブランチ）