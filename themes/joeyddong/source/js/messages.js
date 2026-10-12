/* Shared by static templates and browser UI; article text is never translated. */
(function(root) {
  const messages = {
    en: {
      'nav.home':'Home','nav.blog':'Blog','nav.projects':'Projects','nav.photography':'Photography','nav.portfolio':'Portfolio',
      latest:'Latest',categories:'Categories',tags:'Tags',archives:'Archives',search:'Search',posts:'Posts',recents:'Recent posts',
      hero:'Writing code. Learning. Capturing life.',intro:'Notes on programming, things I learn, and ideas worth keeping.',
      all:'All languages',articleLanguage:'Article language',readMore:'Read article',updated:'Updated',minutes:'min read',test:'Test article',
      menu:'Menu',chooseLanguage:'Choose language',mainNav:'Main navigation',blogNav:'Blog navigation',skip:'Skip to content',
      pause:'Pause motion',play:'Play motion',motion:'Background animation',toc:'On this page',noToc:'No section headings',
      previous:'Previous',next:'Next',back:'Back to articles',top:'Back to top',footer:'Thoughts, work, and everyday discoveries.',
      copy:'Copy code',copied:'Copied',copyFailed:'Select and copy the code manually',searchLabel:'Search articles',
      searchPlaceholder:'A topic, a phrase, a line of code…',searchHint:'Search titles, summaries, tags, and full article text.',
      searching:'Loading search index…',searchError:'Search could not load. Please try again.',retry:'Try again',results:'results',
      empty:'No articles found.',searchStart:'Type something to find an article.',filterEmpty:'No articles in this language yet.',
      close:'Close image',previousImage:'Previous image',nextImage:'Next image',imageViewer:'Image viewer',openImage:'Enlarge image',
      'cat.编程':'Programming','cat.学习':'Learning','cat.生活':'Life','cat.思考':'Thoughts',
      testNotice:'Preview content for testing layout and features; these are not personal stories.',
      notFound:'This page isn’t here.',homeBack:'Back to the blog',
    },
    zh: {
      'nav.home':'首页','nav.blog':'博客','nav.projects':'项目','nav.photography':'摄影','nav.portfolio':'关于我',
      latest:'最新',categories:'分类',tags:'标签',archives:'归档',search:'搜索',posts:'文章',recents:'最新文章',
      hero:'记录代码、学习与生活。',intro:'编程笔记、学习记录，以及值得留下来的思考。',
      all:'全部语言',articleLanguage:'文章语言',readMore:'阅读全文',updated:'更新于',minutes:'分钟阅读',test:'测试文章',
      menu:'菜单',chooseLanguage:'选择语言',mainNav:'主导航',blogNav:'博客导航',skip:'跳转到正文',
      pause:'暂停动画',play:'播放动画',motion:'背景动画',toc:'文章目录',noToc:'本文没有章节标题',
      previous:'上一篇',next:'下一篇',back:'返回文章列表',top:'回到顶部',footer:'思考、作品与日常发现。',
      copy:'复制代码',copied:'已复制',copyFailed:'请选中代码手动复制',searchLabel:'搜索文章',
      searchPlaceholder:'主题、关键词，或一行代码…',searchHint:'搜索标题、摘要、标签和完整正文。',
      searching:'正在加载搜索索引…',searchError:'搜索加载失败，请重试。',retry:'重试',results:'条结果',
      empty:'没有找到文章。',searchStart:'输入关键词查找文章。',filterEmpty:'暂时没有该语言的文章。',
      close:'关闭图片',previousImage:'上一张图片',nextImage:'下一张图片',imageViewer:'图片查看器',openImage:'放大图片',
      'cat.编程':'编程','cat.学习':'学习','cat.生活':'生活','cat.思考':'思考',
      testNotice:'以下内容用于验证排版和功能，不是个人经历或正式文章。',
      notFound:'这个页面还不在这里。',homeBack:'返回博客',
    },
    ja: {
      'nav.home':'ホーム','nav.blog':'ブログ','nav.projects':'プロジェクト','nav.photography':'写真','nav.portfolio':'自己紹介',
      latest:'最新',categories:'カテゴリー',tags:'タグ',archives:'アーカイブ',search:'検索',posts:'記事',recents:'最近の記事',
      hero:'コード、学び、日々を記録する。',intro:'プログラミングのメモ、学びの記録、残しておきたい考え。',
      all:'すべての言語',articleLanguage:'記事の言語',readMore:'記事を読む',updated:'更新',minutes:'分で読めます',test:'テスト記事',
      menu:'メニュー',chooseLanguage:'言語を選択',mainNav:'メインナビゲーション',blogNav:'ブログナビゲーション',skip:'本文へスキップ',
      pause:'アニメーションを停止',play:'アニメーションを再生',motion:'背景アニメーション',toc:'目次',noToc:'見出しはありません',
      previous:'前へ',next:'次へ',back:'記事一覧へ戻る',top:'ページの先頭へ',footer:'思考、制作、日々の発見。',
      copy:'コードをコピー',copied:'コピーしました',copyFailed:'コードを選択してコピーしてください',searchLabel:'記事を検索',
      searchPlaceholder:'テーマ、キーワード、コードの一行…',searchHint:'タイトル、要約、タグ、本文を検索します。',
      searching:'検索データを読み込み中…',searchError:'検索データを読み込めません。再試行してください。',retry:'再試行',results:'件',
      empty:'記事が見つかりません。',searchStart:'キーワードを入力してください。',filterEmpty:'この言語の記事はまだありません。',
      close:'画像を閉じる',previousImage:'前の画像',nextImage:'次の画像',imageViewer:'画像ビューアー',openImage:'画像を拡大',
      'cat.编程':'プログラミング','cat.学习':'学び','cat.生活':'日常','cat.思考':'考え',
      testNotice:'レイアウトと機能を確認するためのサンプルです。個人の体験談ではありません。',
      notFound:'ページが見つかりません。',homeBack:'ブログへ戻る',
    }
  };
  if (typeof module !== 'undefined') module.exports = messages;
  else root.JoeyMessages = messages;
})(typeof window !== 'undefined' ? window : {});
