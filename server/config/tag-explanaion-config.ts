class TagExplanationConfig {
  public static readonly VERSION = 1;

  public static readonly hitFrameReg = [
    /\s*<!-- version="[\s\S]*?编辑文档\s*<\/a>\s*<\/div>\s*<\/div>\s*<\/div>\s*/,
  ];

  public static genTagExplanationIndexFrame(tag: VO.Tag):string[] {
    const t1 = `<!-- version="${TagExplanationConfig.VERSION}" tag-id="${tag.id}" -->

<meta name="Referrer" content="strict-origin-when-cross-origin">

<link rel="stylesheet" href="../.style/enhance.css">
<link rel="stylesheet" href="../.style/custom-component.css">
<link rel="stylesheet" href="../.style/reader-adapt.css">

<title>${tag.name}</title>

<div id="header"
     class="custom-component">
    <div id="main-image">
        <img src="./icon.jpg">
    </div>
    <div id="content_title">
        <h1>${tag.name}</h1>
        <div id="synonyms">
            <p><span class="inline-list-title">ZH</span>${tag.name_zh}</p>
            <p><span class="inline-list-title">JA</span>${tag.name_ja}</p>
            <p><span class="inline-list-title">EN</span>${tag.name_en}</p>
        </div>
        <div id="op-buttons">
            <a href="/api/open-tag-explanation-file-in-vscode?id=${tag.id}">编辑文档</a>
        </div>
    </div>
</div>

`;

    return [t1];
  }
}

export default TagExplanationConfig;