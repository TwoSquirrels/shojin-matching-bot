# shojin-matching-bot

精進マッチング Discord BOT

## 概要

このプロジェクトは、pnpm と TypeScript を使用した Discord Bot のモダンなテンプレートです。

## 技術スタック

- **Runtime**: Node.js 18+
- **Package Manager**: pnpm
- **Language**: TypeScript 5.x
- **Framework**: discord.js v14
- **Database**: MongoDB + Prisma ORM
- **Code Quality**: ESLint + Prettier
- **Development**: tsx (TypeScript runner with hot reload)

## セットアップ

### 前提条件

- Node.js 18.0.0 以上
- pnpm (インストールされていない場合: `npm install -g pnpm`)
- MongoDB (ローカルまたは MongoDB Atlas)

### インストール

1. リポジトリをクローン:
```bash
git clone https://github.com/TwoSquirrels/shojin-matching-bot.git
cd shojin-matching-bot
```

2. 依存関係をインストール:
```bash
pnpm install
```

3. 環境変数を設定:
```bash
cp .env.example .env
```

`.env` ファイルを編集して、Discord Bot のトークンとクライアント ID、そして MongoDB の接続 URL を設定してください。

### MongoDB のセットアップ

#### ローカル MongoDB を使用する場合

1. MongoDB をインストール（まだの場合）
2. MongoDB を起動
3. `.env` ファイルの `DATABASE_URL` を以下のように設定:
```
DATABASE_URL=mongodb://localhost:27017/shojin-matching-bot
```

#### MongoDB Atlas を使用する場合

1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) でアカウントを作成
2. 無料の M0 クラスターを作成
3. Database Access でユーザーを作成
4. Network Access で IP アドレスを許可（開発時は 0.0.0.0/0 で全て許可可能）
5. Cluster の「Connect」から接続文字列を取得
6. `.env` ファイルの `DATABASE_URL` に接続文字列を設定:
```
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/shojin-matching-bot?retryWrites=true&w=majority
```

### Discord Bot の作成

1. [Discord Developer Portal](https://discord.com/developers/applications) にアクセス
2. 「New Application」をクリックして新しいアプリケーションを作成
3. 「Bot」セクションに移動して Bot を追加
4. Bot Token を `.env` ファイルの `DISCORD_TOKEN` に設定
5. 「OAuth2」セクションから「Client ID」を `.env` ファイルの `DISCORD_CLIENT_ID` に設定
6. 「Bot」セクションで必要な権限を有効化:
   - MESSAGE CONTENT INTENT (メッセージ内容を読む場合)
   - SERVER MEMBERS INTENT (必要に応じて)

## 使用方法

### データベースのセットアップ

初回セットアップ時に Prisma Client を生成:
```bash
pnpm db:generate
```

データベーススキーマを MongoDB に同期:
```bash
pnpm db:push
```

Prisma Studio でデータベースを GUI で管理:
```bash
pnpm db:studio
```

### 開発モード

ホットリロード付きで開発:
```bash
pnpm dev
```

### コマンドのデプロイ

Discord にスラッシュコマンドを登録:
```bash
pnpm deploy
```

### ビルド

TypeScript コードを JavaScript にコンパイル:
```bash
pnpm build
```

### 本番環境での起動

```bash
pnpm start
```

### コード品質

Lint チェック:
```bash
pnpm lint
```

自動修正:
```bash
pnpm lint:fix
```

コードフォーマット:
```bash
pnpm format
```

フォーマットチェック:
```bash
pnpm format:check
```

## プロジェクト構成

```
shojin-matching-bot/
├── prisma/
│   └── schema.prisma     # Prisma スキーマ定義
├── src/
│   ├── commands/         # スラッシュコマンド
│   │   ├── ping.ts       # サンプルコマンド
│   │   └── stats.ts      # ユーザー統計コマンド
│   ├── events/           # Discord イベントハンドラー
│   │   ├── ready.ts      # Bot 起動時のイベント
│   │   └── interactionCreate.ts  # インタラクション処理
│   ├── lib/              # ライブラリ
│   │   └── database.ts   # Prisma クライアント設定
│   ├── utils/            # ユーティリティ関数
│   │   └── loader.ts     # モジュールローダー
│   ├── config.ts         # 設定ファイル
│   ├── index.ts          # エントリーポイント
│   └── deploy-commands.ts # コマンドデプロイスクリプト
├── dist/                 # ビルド出力 (gitignore)
├── .env                  # 環境変数 (gitignore)
├── .env.example          # 環境変数のサンプル
├── prisma.config.ts      # Prisma 設定
├── eslint.config.js      # ESLint 設定
├── .prettierrc           # Prettier 設定
├── tsconfig.json         # TypeScript 設定
└── package.json          # プロジェクト設定
```

## データベースモデル

プロジェクトには以下のデータモデルが含まれています：

### Guild (サーバー設定)
- Discord サーバーごとの設定を保存
- JSON フィールドでカスタム設定を柔軟に保存可能

### User (ユーザーデータ)
- Discord ユーザーごとのデータを保存
- JSON フィールドでユーザー固有のデータを保存可能

### CommandLog (コマンド使用ログ)
- コマンドの実行履歴を記録
- 統計分析やデバッグに使用可能
- `stats` コマンドで自分の使用統計を確認できます

## コマンドの追加方法

1. `src/commands/` に新しい `.ts` ファイルを作成
2. 以下の構造でコマンドを実装:

```typescript
import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('commandname')
    .setDescription('Command description'),
  
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply('Response!');
  },
};
```

3. `pnpm deploy` でコマンドを Discord に登録

## イベントの追加方法

1. `src/events/` に新しい `.ts` ファイルを作成
2. 以下の構造でイベントを実装:

```typescript
import { Events } from 'discord.js';

export default {
  name: Events.EventName,
  once: false, // true の場合は一度だけ実行
  execute(...args) {
    // イベント処理
  },
};
```

## ライセンス

ISC

