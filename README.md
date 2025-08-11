# arXiv to Notion Saver (Chrome拡張)

arXivの論文詳細ページ (https://arxiv.org/abs/...) から以下のメタデータを抽出し、指定した Notion データベースへ1クリックで保存する拡張機能です。

- Title
- Authors
- Abstract
- PDFリンク (Article-URL として保存)
- add date (当日の日付; 自動)
- Status ("Ready to Start" を自動設定)

## 特徴
- MV3(Service Worker)構成
- DOM 解析のみで追加の外部API不要 (arXivページから直接抽出)
- Notion API /v1/pages を利用
- 認証情報は Chrome sync storage にのみ保存

## ディレクトリ構成 (抜粋)
```
manifest.json
src/
  js/ (background.js, content.js, popup.js, options.js)
  html/ (popup.html, options.html)
  css/ (popup.css, options.css)
  images/ (生成したアイコン配置先)
.tools/resize_icons.js (icons2.png からリサイズ生成スクリプト)
.github/icons2.png (元画像)
```

## Notion 側準備
1. データベースを作成
2. プロパティを作成
   - Title (Title)
   - Authors (Rich text)
   - Abstract (Rich text)
   - Article-URL (URL)
   - Status (Select) : オプションに "Ready to Start" を追加
   - add date (Date)
3. Internal Integration (トークン) を発行し DB をそのインテグレーションと共有

## アイコン生成 (任意)
`tools/resize_icons.js` は `.github/icons2.png` を 16/32/48/128 にリサイズします。

```bash
npm init -y
npm install sharp --save-dev
node tools/resize_icons.js
```

成功後 `manifest.json` の icons パス (src/images/icon-*.png) に合わせて画像が存在することを確認してください。

## ローカルインストール手順
1. (任意) アイコン生成
2. Chrome で chrome://extensions を開く
3. 右上「デベロッパーモード」ON
4. 「パッケージ化されていない拡張機能を読み込む」→ このリポジトリルートを選択
5. 拡張アイコン > Options で Notion Integration Token と Database ID を入力し保存
6. https://arxiv.org/abs/XXXX.XXXXX にアクセスしてポップアップを開き "Save to Notion" をクリック

## 動作フロー
1. popup.js がアクティブタブへ ARXIV_EXTRACT メッセージ送信
2. content.js が DOM から情報抽出
3. popup が結果表示し NOTION_SAVE を background へ送信
4. background.js が Notion API /v1/pages に POST
5. 成功レスポンスをポップアップへ返却

## トラブルシューティング
| 症状 | 対処 |
|------|------|
| Status の値が設定されない | Notion側で Select に "Ready to Start" を追加 |
| 401/403 | Integration Token & DB共有設定確認 |
| 404 | Database ID の32文字が正しいか確認 (URLのハイフン除去) |
| PDFリンク空 | arXiv DOM変更。content.js のセレクタ更新 |

## セキュリティ / プライバシー
トークンはブラウザ storage にのみ保存し、外部送信は Notion API 呼び出し時のヘッダのみ。

## ライセンス
MIT (LICENSE 参照)。元となる amazon-to-notion の構成に着想を得ています。

## GitHub フォーク/公開手順
元リポジトリ amazon-to-notion (https://github.com/hikarock/amazon-to-notion) をフォークとして位置づける例:

### 1. フォーク作成
GitHub で hikarock/amazon-to-notion を Fork。

### 2. ローカルへクローン
```bash
git clone https://github.com/<YOUR_ACCOUNT>/amazon-to-notion.git arxiv-to-notion
cd arxiv-to-notion
```

### 3. 本拡張コードを反映
現リポジトリを一時リモート追加して同期:
```bash
git remote add work-origin <この拡張のリポジトリURL>
git fetch work-origin
git checkout -b arxiv-extension
rsync -av --delete work-origin/main/ ./ \
  --exclude .git --exclude node_modules --exclude .venv
```

### 4. 差分確認 & コミット
```bash
git add .
git commit -m "Add arXiv to Notion extension implementation"
git push origin arxiv-extension
```

### 5. Pull Request 作成
GitHub 上で `arxiv-extension` ブランチから `main` へ PR。

### 6. upstream 追随 (任意)
```bash
git remote add upstream https://github.com/hikarock/amazon-to-notion.git
git fetch upstream
git checkout main
git merge upstream/main
```

### 7. リリース (任意)
```bash
git tag v0.1.0
git push origin v0.1.0
```
Chrome Web Store へ提出する場合:
- 生成アイコン存在確認
- 不要ファイル (.github など) を除外した zip 作成
- プライバシーポリシー用意

## 今後の改善案
- 重複登録 (Article-URL) チェック
- Rate Limit 時の指数バックオフ
- arXivカテゴリ -> Notion Select 自動付与

---
改善PR歓迎します。
