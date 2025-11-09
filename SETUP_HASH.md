# 🔒 BeEngineer 合宿案内サイト - セキュア認証システム セットアップガイド
## クライアントサイドハッシュ認証版（GitHub Pages対応）

このガイドでは、GitHub Pagesで動作するハッシュ化認証システムのセットアップ方法を説明します。

---

## 📋 目次

1. [システム概要](#システム概要)
2. [セットアップ手順](#セットアップ手順)
3. [パスワードの変更方法](#パスワードの変更方法)
4. [GitHub Pagesへのデプロイ](#github-pagesへのデプロイ)
5. [セキュリティについて](#セキュリティについて)
6. [トラブルシューティング](#トラブルシューティング)

---

## 🎯 システム概要

### セキュリティの改善

**以前の問題:**
- パスワードがJavaScriptファイルに平文で記述
- デベロッパーツールで簡単に確認できた

**現在のシステム:**
- ✅ パスワードはSHA-256でハッシュ化
- ✅ デベロッパーツールで見てもハッシュ値しか分からない
- ✅ 元のパスワードを推測することは困難
- ✅ GitHub Pagesで完全に動作
- ✅ サーバー不要、完全静的サイト

### 仕組み

1. 管理者が設定したパスワードをハッシュ化
2. ハッシュ値を `auth.js` に記述
3. ユーザーがパスワードを入力
4. 入力されたパスワードを同じ方法でハッシュ化
5. 2つのハッシュ値を比較して認証

---

## 🚀 セットアップ手順

### ステップ1: パスワードハッシュの生成

パスワードのハッシュ値を生成する必要があります。以下のいずれかの方法で生成してください。

#### 方法A: オンラインツールを使用（最も簡単）⭐

1. ブラウザで以下のHTMLファイルを開く（または直接コピペして `hash-generator.html` として保存）

```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>パスワードハッシュ生成ツール</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        }
        h1 {
            color: #333;
            text-align: center;
            margin-bottom: 30px;
        }
        .form-group {
            margin-bottom: 20px;
        }
        label {
            display: block;
            margin-bottom: 8px;
            color: #555;
            font-weight: bold;
        }
        input[type="text"] {
            width: 100%;
            padding: 12px;
            border: 2px solid #ddd;
            border-radius: 5px;
            font-size: 16px;
            box-sizing: border-box;
        }
        input[type="text"]:focus {
            outline: none;
            border-color: #667eea;
        }
        button {
            width: 100%;
            padding: 12px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            cursor: pointer;
            font-weight: bold;
            transition: transform 0.2s;
        }
        button:hover {
            transform: translateY(-2px);
        }
        button:active {
            transform: translateY(0);
        }
        .result {
            margin-top: 20px;
            padding: 15px;
            background: #f0f0f0;
            border-radius: 5px;
            display: none;
        }
        .result.show {
            display: block;
        }
        .hash-value {
            word-break: break-all;
            font-family: 'Courier New', monospace;
            background: #fff;
            padding: 10px;
            border-radius: 3px;
            margin-top: 10px;
            border: 1px solid #ddd;
        }
        .copy-btn {
            margin-top: 10px;
            background: #28a745;
            padding: 8px 15px;
            width: auto;
            font-size: 14px;
        }
        .copy-btn:hover {
            background: #218838;
        }
        .instructions {
            background: #e7f3ff;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
            border-left: 4px solid #667eea;
        }
        .instructions h3 {
            margin-top: 0;
            color: #667eea;
        }
        .success-msg {
            color: #28a745;
            font-weight: bold;
            text-align: center;
            margin-top: 10px;
            display: none;
        }
        .success-msg.show {
            display: block;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔒 パスワードハッシュ生成ツール</h1>
        
        <div class="instructions">
            <h3>使い方</h3>
            <ol>
                <li>下のフィールドに設定したいパスワードを入力</li>
                <li>「ハッシュを生成」ボタンをクリック</li>
                <li>生成されたハッシュ値をコピー</li>
                <li><code>staff/auth.js</code> の <code>PASSWORD_HASH</code> に貼り付け</li>
            </ol>
        </div>

        <div class="form-group">
            <label for="password">パスワードを入力:</label>
            <input type="text" id="password" placeholder="例: beengineercamp2025">
        </div>

        <button onclick="generateHash()">ハッシュを生成</button>

        <div class="result" id="result">
            <strong>生成されたハッシュ値:</strong>
            <div class="hash-value" id="hashValue"></div>
            <button class="copy-btn" onclick="copyHash()">📋 コピー</button>
            <div class="success-msg" id="successMsg">✓ コピーしました！</div>
        </div>
    </div>

    <script>
        async function generateHash() {
            const password = document.getElementById('password').value;
            
            if (!password) {
                alert('パスワードを入力してください');
                return;
            }

            // SHA-256でハッシュ化
            const msgBuffer = new TextEncoder().encode(password);
            const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

            // 結果を表示
            document.getElementById('hashValue').textContent = hashHex;
            document.getElementById('result').classList.add('show');
            document.getElementById('successMsg').classList.remove('show');
        }

        function copyHash() {
            const hashValue = document.getElementById('hashValue').textContent;
            navigator.clipboard.writeText(hashValue).then(() => {
                document.getElementById('successMsg').classList.add('show');
                setTimeout(() => {
                    document.getElementById('successMsg').classList.remove('show');
                }, 2000);
            });
        }

        // Enterキーでハッシュ生成
        document.getElementById('password').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                generateHash();
            }
        });
    </script>
</body>
</html>
```

2. ブラウザでこのファイルを開く
3. パスワードを入力して「ハッシュを生成」をクリック
4. 生成されたハッシュ値をコピー

#### 方法B: ブラウザのコンソールを使用

1. 任意のページでブラウザのコンソールを開く（F12キー → Consoleタブ）
2. 以下のコードを実行（`YOUR_PASSWORD` を実際のパスワードに変更）:

```javascript
(async function() {
    const password = 'YOUR_PASSWORD'; // ← ここにパスワードを入力
    const msgBuffer = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    console.log('ハッシュ値:', hashHex);
})();
```

3. 出力されたハッシュ値をコピー

---

### ステップ2: ハッシュ値をauth.jsに設定

1. `staff/auth.js` ファイルを開く

2. 19行目付近の `PASSWORD_HASH` を探す:

```javascript
const PASSWORD_HASH = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'; // 初期値（変更してください）
```

3. シングルクォート `'...'` の中身を、ステップ1で生成したハッシュ値に置き換える:

```javascript
const PASSWORD_HASH = 'あなたのハッシュ値をここに貼り付け';
```

4. ファイルを保存

---

### ステップ3: 動作確認

1. ブラウザでスタッフページを開く:
   ```
   staff/items.html
   ```

2. ステップ1で設定した**元のパスワード**を入力

3. 「ログイン」ボタンをクリック

4. ✅ 認証成功すると、スタッフページが表示されます

---

## 🔄 パスワードの変更方法

パスワードを変更したい場合：

1. [ステップ1](#ステップ1-パスワードハッシュの生成) の手順で新しいパスワードのハッシュを生成
2. `staff/auth.js` の `PASSWORD_HASH` を新しいハッシュ値に更新
3. ファイルを保存

**注意**: GitHubにプッシュ後、変更が反映されるまで数分かかる場合があります。

---

## 🌐 GitHub Pagesへのデプロイ

### 初回デプロイ

1. GitHubリポジトリを作成

2. ファイルをコミット:
   ```bash
   git add .
   git commit -m "Add secure hash authentication"
   git push origin main
   ```

3. GitHubリポジトリの「Settings」→「Pages」を開く

4. 「Source」で `main` ブランチを選択

5. 「Save」をクリック

6. 数分後、URLが表示されます:
   ```
   https://your-username.github.io/your-repo-name/
   ```

### 更新時

パスワードやファイルを変更した場合：

```bash
git add .
git commit -m "Update password hash"
git push origin main
```

数分後、GitHub Pagesに反映されます。

---

## 🔐 セキュリティについて

### ✅ 実装されているセキュリティ対策

1. **パスワードのハッシュ化**
   - SHA-256を使用して一方向ハッシュ化
   - ハッシュ値から元のパスワードを推測することは困難

2. **クライアント側にパスワード情報なし**
   - JavaScriptファイルにはハッシュ値のみ
   - デベロッパーツールで見ても元のパスワードは分からない

3. **セッション管理**
   - 一度認証すると、タブを閉じるまで有効
   - sessionStorageを使用

---

### ⚠️ セキュリティレベル

**中程度のセキュリティ**

- 🟢 平文パスワードよりも遥かに安全
- 🟢 一般的な攻撃者には十分な防御
- 🟡 高度な攻撃者には突破される可能性あり
- 🟡 ブルートフォース攻撃（総当たり）に対しては脆弱

**このシステムが適している場合:**
- 内部スタッフページの簡易的な保護
- GitHub Pagesで動作させたい
- サーバーを使いたくない

**より高いセキュリティが必要な場合:**
- バックエンドサーバー + データベースでの認証
- Firebase Authentication などの認証サービス
- OAuth、JWT トークンベース認証

---

### 🛡️ セキュリティのベストプラクティス

1. **強力なパスワードを使用**
   - 12文字以上
   - 英数字 + 記号を混在
   - 推測されにくい文字列

2. **定期的なパスワード変更**
   - 3〜6ヶ月ごとに変更を推奨

3. **HTTPSを必ず使用**
   - GitHub Pagesは自動的にHTTPSを提供
   - カスタムドメインでも必ずHTTPSを有効に

4. **パスワードの共有に注意**
   - 必要最小限の人にのみ共有
   - メールやチャットでの共有は避ける

5. **Gitのコミット履歴に注意**
   - パスワードのハッシュ値は公開されても問題ない
   - しかし、過去のコミットで平文パスワードが含まれていないか確認

---

## 🔧 トラブルシューティング

### ❌ パスワードが正しいのにログインできない

**原因1**: ハッシュ値が正しく設定されていない

**解決方法**:
1. `staff/auth.js` の `PASSWORD_HASH` を確認
2. ハッシュ生成時と同じパスワードを使用しているか確認
3. ハッシュ値に余分なスペースや改行が含まれていないか確認

---

**原因2**: ファイルが保存されていない

**解決方法**:
1. `staff/auth.js` を保存したか確認
2. ブラウザのキャッシュをクリア（Ctrl+Shift+R または Cmd+Shift+R）

---

### ❌ GitHub Pagesで動作しない

**原因**: ファイルがプッシュされていない、またはPagesが有効になっていない

**解決方法**:
1. `git status` で変更がコミットされているか確認
2. `git push` でプッシュされているか確認
3. GitHub リポジトリの Settings → Pages で有効になっているか確認
4. 数分待ってから再度アクセス

---

### ❌ デベロッパーツールでハッシュ値が見える

**これは正常です！** ハッシュ値は見えても問題ありません。

- ハッシュ値から元のパスワードを推測することは計算上困難
- これがハッシュ化の目的です

---

## 💡 よくある質問

### Q: ハッシュ値が見えてしまうのは安全ですか？

A: はい、安全です。SHA-256は一方向ハッシュ関数なので、ハッシュ値から元のパスワードを復元することは計算上不可能です。

---

### Q: 複数のパスワードを設定できますか？

A: 現在のシステムでは1つのパスワードのみです。複数のパスワードを設定したい場合は、auth.jsを以下のように修正できます：

```javascript
const PASSWORD_HASHES = [
    'ハッシュ値1',
    'ハッシュ値2',
    'ハッシュ値3'
];

// checkPassword関数内で
if (PASSWORD_HASHES.includes(inputHash)) {
    // 認証成功
}
```

---

### Q: パスワードを忘れた場合はどうすればいいですか？

A: 新しいパスワードを設定してください：
1. [ステップ1](#ステップ1-パスワードハッシュの生成) で新しいパスワードのハッシュを生成
2. `staff/auth.js` の `PASSWORD_HASH` を更新

元のパスワードを知る必要はありません。

---

## 📚 参考資料

- [SHA-256とは](https://ja.wikipedia.org/wiki/SHA-2)
- [GitHub Pages ドキュメント](https://docs.github.com/ja/pages)
- [Web Crypto API](https://developer.mozilla.org/ja/docs/Web/API/Web_Crypto_API)

---

**🎉 セットアップ完了！安全でGitHub Pages対応のスタッフ認証システムをお楽しみください。**

ご不明な点がございましたら、お気軽にお問い合わせください。

