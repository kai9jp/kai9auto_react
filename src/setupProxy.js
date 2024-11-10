//-----------------------------------------------------------------------------
//プロキシ設定の機能概要
//-----------------------------------------------------------------------------
//package.jsonで指定したプロキシをデフォルトとし起動する
//但し、起動時の環境変数にプロキシが指定されていれば、そちらで起動する
//-----------------------------------------------------------------------------
//このインストールが必要
//npm install http-proxy-middleware
//
//使用する際のコマンド例
//set REACT_APP_PROXY_URL=https://kai9.com:9443 && set PORT=3447 && npm start
//set "REACT_APP_PROXY_URL=https://kai9.com:9443" && set "PORT=3447" && set "BROWSER=none" && npm start
//
//-----------------------------------------------------------------------------


// 必要なモジュールをインポート
const { createProxyMiddleware } = require("http-proxy-middleware");
const fs = require("fs");
const path = require("path");

// package.json から proxy 設定を読み込むための関数
function readProxyFromPackageJson() {
  // package.json ファイルのパスを生成
  const packageJsonPath = path.join(__dirname, "..", "package.json");
  // package.json ファイルの内容を読み込み
  const packageJsonData = fs.readFileSync(packageJsonPath);
  // JSONデータをオブジェクトに変換
  const packageJson = JSON.parse(packageJsonData);
  // proxy 設定を返す
  return packageJson.proxy;
}

// エクスポートする関数
module.exports = function (app) {
  // 環境変数か package.json の proxy 設定を用いる
  const target = process.env.REACT_APP_PROXY_URL || readProxyFromPackageJson();

  console.log("target: ", target); // target の値をコンソールに出力
  // ログを出力するファイルのパスを指定
  const logFilePath = "proxy_log.txt";
  // プロキシのログをファイルに出力する関数
  const logProxyInfo = (log) => {
    fs.appendFileSync(logFilePath, log + "\n");
  };
  // プロキシ情報をログに出力
  logProxyInfo("target: " + target);

  // プロキシミドルウェアを設定
  app.use(
    "/api", // プロキシするエンドポイント（必要に応じて変更）
    createProxyMiddleware({
      target, // プロキシ先のURL
      changeOrigin: true, // プロキシ先のホストヘッダーを変更
      secure: false, // 証明書の検証を無効にする
    })
  );
};
