export const joinGroupsData = [
  {
    id: 1,
    name: "株式会社ミツモア",
    imageUrl: "",
  },
  {
    id: 2,
    name: "株式会社Matsusho",
    imageUrl: "",
  },
];

export const chaptersData = [
  {
    id: 1,
    index: "第１章",
    title: "良いコードとは？",
  },
  {
    id: 2,
    index: "第２章",
    title: "良いコードとは？",
  },
  {
    id: 3,
    index: "第３章",
    title: "良いコードとは？",
  },
  {
    id: 4,
    index: "第４章",
    title: "良いコードとは？",
  },
  {
    id: 5,
    index: "第５章",
    title: "良いコードとは？",
  },
  {
    id: 6,
    index: "第６章",
    title: "良いコードとは？",
  },
  {
    id: 7,
    index: "第７章",
    title: "良いコードとは？",
  },
  {
    id: 8,
    index: "第８章",
    title: "良いコードとは？",
  },
];

export const playersData = [
  {
    id: 1,
    userId: "matsushoooo12",
    displayName: "ショウゴ",
    photoUrl: "/images/avatar/avatar_1.jpg",
  },
];

function loopNumber(num) {
  const result = num % 28;
  return result === 0 ? 28 : result;
}

export const imgUrl = (i) => {
  return `https://pub-0fd3f0b301cd430a878c57fa091a563e.r2.dev/${loopNumber(
    i + 1
  )}.webp`;
};

const usersData = [
  {
    displayName: "Alexandra Daddario",
    userId: "AlexandraDaddario1234",
    photoUrl: "/images/avatar/3.png",
    level: 45,
    experiencePoint: 23,
    skillImageUrl: "/images/skill/aws.png",
    backgroundImageUrl: "/images/projects/1.jpeg",
  },
  {
    displayName: "Chris Hemsworth",
    userId: "ChrisHemsworth5678",
    photoUrl: "/images/avatar/4.png",
    level: 67,
    experiencePoint: 89,
    skillImageUrl: "/images/skill/c++.png",
    backgroundImageUrl: "/images/projects/2.jpeg",
  },
  {
    displayName: "Emma Watson",
    userId: "EmmaWatson9101",
    photoUrl: "/images/avatar/5.png",
    level: 78,
    experiencePoint: 56,
    skillImageUrl: "/images/skill/css.png",
    backgroundImageUrl: "/images/projects/3.jpeg",
  },
  {
    displayName: "Robert Downey Jr.",
    userId: "RobertDowneyJr1123",
    photoUrl: "/images/avatar/6.png",
    level: 90,
    experiencePoint: 45,
    skillImageUrl: "/images/skill/dart.jpeg",
    backgroundImageUrl: "/images/projects/4.jpeg",
  },
  {
    displayName: "Scarlett Johansson",
    userId: "ScarlettJohansson4567",
    photoUrl: "/images/avatar/7.png",
    level: 34,
    experiencePoint: 78,
    skillImageUrl: "/images/skill/docker.png",
    backgroundImageUrl: "/images/projects/5.jpeg",
  },
  {
    displayName: "Tom Hiddleston",
    userId: "TomHiddleston7890",
    photoUrl: "/images/avatar/8.png",
    level: 56,
    experiencePoint: 91,
    skillImageUrl: "/images/skill/figma.png",
    backgroundImageUrl: "/images/projects/6.jpeg",
  },
  {
    displayName: "Natalie Portman",
    userId: "NataliePortman2345",
    photoUrl: "/images/avatar/avatar_1.jpg",
    level: 23,
    experiencePoint: 67,
    skillImageUrl: "/images/skill/firebase.png",
    backgroundImageUrl: "/images/projects/7.jpeg",
  },
  {
    displayName: "Leonardo DiCaprio",
    userId: "LeonardoDiCaprio3456",
    photoUrl: "/images/avatar/avatar_2.jpg",
    level: 87,
    experiencePoint: 34,
    skillImageUrl: "/images/skill/flutter.png",
    backgroundImageUrl: "/images/projects/8.jpeg",
  },
  {
    displayName: "Jennifer Lawrence",
    userId: "JenniferLawrence5678",
    photoUrl: "/images/avatar/avatar_3.jpg",
    level: 65,
    experiencePoint: 78,
    skillImageUrl: "/images/skill/git.png",
    backgroundImageUrl: "/images/projects/9.jpeg",
  },
  {
    displayName: "Brad Pitt",
    userId: "BradPitt6789",
    photoUrl: "/images/avatar/avatar_4.jpg",
    level: 54,
    experiencePoint: 89,
    skillImageUrl: "/images/skill/go.png",
    backgroundImageUrl: "/images/projects/10.jpeg",
  },
  {
    displayName: "Angelina Jolie",
    userId: "AngelinaJolie7890",
    photoUrl: "/images/avatar/avatar_5.jpg",
    level: 76,
    experiencePoint: 45,
    skillImageUrl: "/images/skill/html5.png",
    backgroundImageUrl: "/images/projects/11.jpeg",
  },
  {
    displayName: "Johnny Depp",
    userId: "JohnnyDepp8901",
    photoUrl: "/images/avatar/avatar_6.jpg",
    level: 43,
    experiencePoint: 67,
    skillImageUrl: "/images/skill/illustrator.png",
    backgroundImageUrl: "/images/projects/12.jpeg",
  },
  {
    displayName: "Meryl Streep",
    userId: "MerylStreep9012",
    photoUrl: "/images/avatar/avatar_7.jpg",
    level: 92,
    experiencePoint: 23,
    skillImageUrl: "/images/skill/java.png",
    backgroundImageUrl: "/images/projects/13.jpeg",
  },
  {
    displayName: "Tom Cruise",
    userId: "TomCruise0123",
    photoUrl: "/images/avatar/avatar_8.jpg",
    level: 58,
    experiencePoint: 79,
    skillImageUrl: "/images/skill/javascript.png",
    backgroundImageUrl: "/images/projects/14.jpeg",
  },
  {
    displayName: "Nicole Kidman",
    userId: "NicoleKidman1234",
    photoUrl: "/images/avatar/avatar_9.jpg",
    level: 69,
    experiencePoint: 56,
    skillImageUrl: "/images/skill/kotlin.png",
    backgroundImageUrl: "/images/projects/15.jpeg",
  },
  {
    displayName: "Emma Watson",
    userId: "EmmaWatson2345",
    photoUrl: "/images/avatar/avatar_10.jpg",
    level: 72,
    experiencePoint: 48,
    skillImageUrl: "/images/skill/kubrnetes.png",
    backgroundImageUrl: "/images/projects/1.jpeg",
  },
  {
    displayName: "Chris Hemsworth",
    userId: "ChrisHemsworth3456",
    photoUrl: "/images/avatar/avatar_11.jpg",
    level: 83,
    experiencePoint: 37,
    skillImageUrl: "/images/skill/laravel.png",
    backgroundImageUrl: "/images/projects/2.jpeg",
  },
  {
    displayName: "Scarlett Johansson",
    userId: "ScarlettJohansson4567",
    photoUrl: "/images/avatar/avatar_12.jpg",
    level: 91,
    experiencePoint: 29,
    skillImageUrl: "/images/skill/Maya.png",
    backgroundImageUrl: "/images/projects/3.jpeg",
  },
  {
    displayName: "Robert Downey Jr.",
    userId: "RobertDowneyJr5678",
    photoUrl: "/images/avatar/avatar_13.jpg",
    level: 64,
    experiencePoint: 86,
    skillImageUrl: "/images/skill/nextjs.png",
    backgroundImageUrl: "/images/projects/4.jpeg",
  },
  {
    displayName: "Natalie Portman",
    userId: "NataliePortman6789",
    photoUrl: "/images/avatar/avatar_14.jpg",
    level: 78,
    experiencePoint: 72,
    skillImageUrl: "/images/skill/nodejs.png",
    backgroundImageUrl: "/images/projects/5.jpeg",
  },
  {
    displayName: "Hugh Jackman",
    userId: "HughJackman7890",
    photoUrl: "/images/avatar/avatar_15.jpg",
    level: 85,
    experiencePoint: 65,
    skillImageUrl: "/images/skill/photoshop.png",
    backgroundImageUrl: "/images/projects/6.jpeg",
  },
  {
    displayName: "Charlize Theron",
    userId: "CharlizeTheron8901",
    photoUrl: "/images/avatar/avatar_20.jpg",
    level: 53,
    experiencePoint: 97,
    skillImageUrl: "/images/skill/php.png",
    backgroundImageUrl: "/images/projects/7.jpeg",
  },
  {
    displayName: "Will Smith",
    userId: "WillSmith9012",
    photoUrl: "/images/avatar/avatar_21.jpg",
    level: 60,
    experiencePoint: 84,
    skillImageUrl: "/images/skill/premire-pro.png",
    backgroundImageUrl: "/images/projects/8.jpeg",
  },
  {
    displayName: "Keira Knightley",
    userId: "KeiraKnightley0123",
    photoUrl: "/images/avatar/avatar_22.jpg",
    level: 77,
    experiencePoint: 73,
    skillImageUrl: "/images/skill/python.png",
    backgroundImageUrl: "/images/projects/9.jpeg",
  },
  {
    displayName: "Dwayne Johnson",
    userId: "DwayneJohnson1234",
    photoUrl: "/images/avatar/avatar_23.jpg",
    level: 89,
    experiencePoint: 61,
    skillImageUrl: "/images/skill/rails.png",
    backgroundImageUrl: "/images/projects/10.jpeg",
  },
];

export const booksData = [
  {
    tags: [
      {
        name: "フロントエンド",
      },
      {
        name: "テスト",
      },
    ],
    imageUrl:
      "http://books.google.com/books/content?id=uOO9EAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
    title: "フロントエンド開発のためのテスト入門",
    publishedAt: "2023-4-24",
    rating: 4.3,
    description:
      "現場で役立つテスト手法を基礎から解説! 「どこから」「どうやって」手をつければよいかわかる 本書は、Webアプリケーション開発に携わるフロントエンドエンジニアを対象に、「テスト」の基本知識と具体的な実践手法を解説した書籍です。 高度な機能を画面上で提供する現代のWebアプリケーションでは、その品質や保守性を担保するうえで、フロントエンドにおける自動テストが重要な役割を持ちます。 本書はそんな「フロントエンドにおけるテスト」をテーマに、基本的なテストコードの書き方や、目的に応じたテスト手法・ツールの使い分け方を解説します。「UIコンポーネントテスト」や「ビジュアルリグレッションテスト」など、フロントエンドならではの具体的なテスト課題に重点を置いており、基本から実践まで必要な知識を体系的に身につけることができます。 解説はサンプルWebアプリケーション(Next.js)を舞台にしたハンズオン形式で進みます。「アクセシビリティの改善」や「CIでのテスト実行」といったトピックもフォローしているので、開発現場で役立つ実践的な知識・ノウハウがきちんと身につく一冊です。 ■こんな方におすすめ ・テストの必要性は理解しているが着手できていない ・それなりに開発経験はあるがテストを書いたことがない ・現在取り組んでいるテスト手法が最適かわからない ■本書で取り上げるテストツール Jest/Testing Library/Storybook/reg-suit/Playwright...etc ■目次 第1章 テストの目的と障壁 第2章 テスト手法とテスト戦略 第3章 はじめの単体テスト 第4章 モック 第5章 UIコンポーネントテスト 第6章 カバレッジレポートの読み方 第7章 Webアプリケーション結合テスト 第8章 UIコンポーネントエクスプローラー 第9章 ビジュアルリグレッションテスト 第10章 E2E テスト 【ダウンロード付録】 付録A GitHub Actionsで実行するUIコンポーネントテスト 付録B GitHub Actionsで実行するE2Eテスト ※翔泳社の書籍サイトからPDFをダウンロードできます。 ※本電子書籍は同名出版物を底本として作成しました。記載内容は印刷出版当時のものです。 ※印刷出版再現のため電子書籍としては不要な情報を含んでいる場合があります。 ※印刷出版とは異なる表記・表現の場合があります。予めご了承ください。 ※プレビューにてお手持ちの電子端末での表示状態をご確認の上、商品をお買い求めください。 (翔泳社)",
    id: "6CDt05Qz4YUuiAcAiDjl",
  },
  {
    tags: [
      {
        name: "コーディング規則",
      },
    ],
    authors: ["Dustin Boswell", "Trevor Foucher"],
    description:
      "美しいコードを見ると感動する。優れたコードは見た瞬間に何をしているかが伝わってくる。そういうコードは使うのが楽しいし、 自分のコードもそうあるべきだと思わせてくれる。本書の目的は、君のコードを良くすることだ」(本書「はじめに」より)。  コードは理解しやすくなければならない。本書はこの原則を日々のコーディングの様々な場面に当てはめる方法を紹介します。 名前の付け方、コメントの書き方など表面上の改善について。コードを動かすための制御フロー、論理式、変数などループとロジックについて。 またコードを再構成するための方法。さらにテストの書き方などについて、楽しいイラストと共に説明しています。  日本語版ではRubyやgroongaのコミッタとしても著名な須藤功平氏による解説を収録。",
    rating: 4.2,
    chapters: [
      {
        index: "１章",
        title: "理解しやすいコード",
      },
      {
        title: "名前に情報を詰め込む",
        index: "２章",
      },
      {
        title: "誤解されない名前",
        index: "３章",
      },
      {
        title: "美しさ",
        index: "４章",
      },
      {
        title: "コメントすべきことを知る",
        index: "５章",
      },
      {
        index: "６章",
        title: "コメントは正確で簡潔に",
      },
      {
        title: "制御フローを読みやすくする",
        index: "７章",
      },
      {
        index: "８章",
        title: "変数と読みやすさ",
      },
    ],
    publishedAt: "2012-06-01",
    imageUrl:
      "http://books.google.com/books/content?id=Wx1dLwEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
    title: "リーダブルコード",
    id: "7rA1yS3gr3vNrl6HHMUZ",
  },
  {
    description:
      "「ビッグデータ」の登場により、より多くのデータから必要なデータを素早く取り出す必要が出てきました。SQLを用いない「NoSQL」は、より柔軟にデータを取り出すことができます。「MongoDB」は、NoSQLの中でも「ドキュメント指向データベース」と呼ばれるもので、クラウドにおける「大規模分散環境」や「ビッグデータ」「非構造化データ」などを扱うのに適したデータベースとして、注目されています。",
    authors: ["小笠原徳彦"],
    tags: [
      {
        name: "JavaScript",
        imageUrl: "/images/skill/javascript.png",
      },
      {
        name: "MongoDB",
      },
    ],
    rating: 3.8,
    imageUrl:
      "http://books.google.com/books/content?id=awEuvgAACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
    title: "はじめてのMongoDB",
    id: "Ri4QRetgbFsk0mX9XcXa",
  },
  {
    title: "チームトポロジー",
    authors: ["マシュー・スケルトン", "マニュエル・パイス"],
    imageUrl:
      "http://books.google.com/books/content?id=TKtREAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
    tags: [
      {
        name: "チーム開発",
      },
    ],
    rating: 3.3,
    description:
      "DXが進み、ビジネスはIT・オンラインを基準に変化が加速している。この大きな流れを受けるのがソフトウェア開発である。またソフトウェア業界としては、アジャイルやDevOpsなどの手法を開発して、時代の移り変わりの速度に合わせるように、いかに効率的にサービスを提供できるかを試行錯誤してきた。 本書は高速なデリバリーを実現することを目的とした、4つの基本的なチームタイプと3つのインタラクションパターンに基づく、組織設計とチームインタラクションのための実践的な適応モデルを紹介する。これは、ソフトウェアの組織設計における大きな前進であり、チームの相互作用と相互関係を明確に定義した方法を提示することで、チーム間の問題を組織の自己運営のための貴重なシグナルに変え、結果として得られるソフトウェアアーキテクチャをより明確で持続可能なものにする。これにより組織に適したチームパターンを選択して進化させ、ソフトウェアを健全な状態に保つことで、バリューストリームを最適化するのに役立たせることができるだろう。 【目次】 PART I デリバリーの手段としてのチーム Chapter1 組織図の問題 Chapter2 コンウェイの法則が重要な理由 Chapter3 チームファースト思考 PART Ⅱ フローを機能させるチームトポロジー Chapter4 静的なチームトポロジーチームのアンチパターン Chapter5 4つの基本的なチームタイプ Chapter6 チームファーストな境界を決める PART Ⅲ イノベーションと高速なデリバリーのため にチームインタラクションを進化させる Chapter7 チームインタラクションモード Chapter8 組織的センシングでチーム構造を進化させる Chapter9 まとめ:次世代デジタル運用モデル",
    id: "mi5Ib3fWtj9U3d6d2Zuc",
  },
  {
    title: "初めてのThree.js",
    imageUrl:
      "http://books.google.com/books/content?id=5tf4vQAACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
    description:
      "実用的なサンプルを例示しながら、Three.jsによるウェブ3Dコンテンツ作成のすべての側面を解説。",
    tags: [
      {
        name: "JavaScript",
        imageUrl: "/images/skill/javascript.png",
      },
      {
        name: "WebGL",
      },
      {
        name: "Three.js",
      },
    ],
    publishedAt: "2016-07-01",
    authors: ["Jos Dirksen", "ヨスディルクセン"],
    rating: 4.5,
    pageCount: 416,
    id: "qXCXMO4OwWcVANUblU5d",
  },
];

export const membersData = [
  {
    id: "4NeaEXwBTO8xNbhRRgF3",
    status: "participant",
    experiencePoint: 23,
    bookIds: ["6CDt05Qz4YUuiAcAiDjl", "7rA1yS3gr3vNrl6HHMUZ"],
    userId: "MerylStreep9012",
    displayName: "Meryl Streep",
    level: 92,
    backgroundImageUrl: "/images/projects/13.jpeg",
    photoUrl: "/images/avatar/avatar_7.jpg",
    skillImageUrl: "/images/skill/java.png",
    books: [],
  },
  {
    id: "54Tr2kVQvbhdeqs3muiX",
    status: "participant",
    level: 58,
    bookIds: [
      "Ri4QRetgbFsk0mX9XcXa",
      "6CDt05Qz4YUuiAcAiDjl",
      "mi5Ib3fWtj9U3d6d2Zuc",
    ],
    displayName: "Tom Cruise",
    experiencePoint: 79,
    photoUrl: "/images/avatar/avatar_8.jpg",
    backgroundImageUrl: "/images/projects/14.jpeg",
    userId: "TomCruise0123",
    skillImageUrl: "/images/skill/javascript.png",
    books: [],
  },
  {
    id: "6FUY55ByBRHtaoLp3pCu",
    status: "participant",
    userId: "DwayneJohnson1234",
    backgroundImageUrl: "/images/projects/10.jpeg",
    photoUrl: "/images/avatar/avatar_23.jpg",
    displayName: "Dwayne Johnson",
    level: 89,
    experiencePoint: 61,
    skillImageUrl: "/images/skill/rails.png",
    bookIds: ["qXCXMO4OwWcVANUblU5d"],
    books: [],
  },
  {
    id: "qeknR2Dhx0gO3tRGN2wM8vngmWh2",
    status: "manager",
    skillImageUrl: "/images/skill/nextjs.png",
    updatedAt: {
      seconds: 1695345085,
      nanoseconds: 997000000,
    },
    backgroundImageUrl: "/images/projects/2.jpeg",
    bookIds: ["7rA1yS3gr3vNrl6HHMUZ"],
    photoUrl: "/images/avatar/avatar_5.jpg",
    createdAt: {
      seconds: 1695345085,
      nanoseconds: 997000000,
    },
    experiencePoint: 0,
    level: 0,
    providerId: "qeknR2Dhx0gO3tRGN2wM8vngmWh2",
    displayName: "Chris Hemsworth",
    email: "shogo.matsumoto.412@gmail.com",
    userId: "ChrisHemsworth5678",
    provider: "google",
    books: [],
  },
];

export const presentImages = [
  "/images/present/1.png",
  "/images/present/2.png",
  "/images/present/3.png",
  "/images/present/4.png",
  "/images/present/5.png",
  "/images/present/6.png",
  "/images/present/7.png",
  "/images/present/8.png",
  "/images/present/9.png",
];

export const userGames = [
  {
    id: "W0DqYhGqyaFjyFMfMv8z",
    name: "今日の朝ごはん",
    imageUrl: "/images/icebreak/undraw_breakfast_psiw.svg",
  },
  {
    id: "n25LjnJRpGPTI7V8SH6x",
    imageUrl: "/images/icebreak/undraw_questions_re_1fy7.svg",
    description:
      "エンジニアリングの専門知識を使い、技術的な真実と嘘を巧妙に組み合わせて他のプレーヤーを惑わすことが目的です。このゲームはコミュニケーションスキルを高め、同時に参加者間の知識と経験を共有する楽しい方法です。",
    name: "２つの真実と１つの嘘",
  },
  {
    id: "CLaZJvwWgR9kyn8huX8v",
    name: "エンジニアビンゴ",
    imageUrl: "/images/icebreak/undraw_search_engines_ij7q.svg",
  },
  {
    id: "MebSO132J5jmuUGoV56E",
    imageUrl: "/images/icebreak/undraw_about_me_re_82bv.svg",
    name: "私の名前は？",
  },
];
