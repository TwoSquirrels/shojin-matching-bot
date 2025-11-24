# shojin-matching-bot

精進マッチング Discord BOT

## 概要

このプロジェクトは、pnpm と TypeScript を使用した Discord Bot のモダンなテンプレートです。

## 技術スタック

- **Runtime**: Node.js 18+
- **Package Manager**: pnpm
- **Language**: TypeScript 5.x
- **Framework**: discord.js v14
- **Code Quality**: ESLint + Prettier
- **Development**: tsx (TypeScript runner with hot reload)

## セットアップ

### 前提条件

- Node.js 18.0.0 以上
- pnpm (インストールされていない場合: `npm install -g pnpm`)

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

`.env` ファイルを編集して、Discord Bot のトークンとクライアント ID を設定してください。

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
├── src/
│   ├── commands/         # スラッシュコマンド
│   │   └── ping.ts       # サンプルコマンド
│   ├── events/           # Discord イベントハンドラー
│   │   ├── ready.ts      # Bot 起動時のイベント
│   │   └── interactionCreate.ts  # インタラクション処理
│   ├── utils/            # ユーティリティ関数
│   │   └── loader.ts     # モジュールローダー
│   ├── config.ts         # 設定ファイル
│   ├── index.ts          # エントリーポイント
│   └── deploy-commands.ts # コマンドデプロイスクリプト
├── dist/                 # ビルド出力 (gitignore)
├── .env                  # 環境変数 (gitignore)
├── .env.example          # 環境変数のサンプル
├── eslint.config.js      # ESLint 設定
├── .prettierrc           # Prettier 設定
├── tsconfig.json         # TypeScript 設定
└── package.json          # プロジェクト設定
```

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

