class TagExplanationConfig {
  public static readonly VERSION = 1;

  public static readonly hitFrameReg = [
    /\s*<!-- version="[\s\S]*?格式化文档\s*<\/a>\s*<\/div>\s*<\/div>\s*<\/div>\s*/,
  ];

  public static genTagExplanationIndexFrame(tag: VO.Tag): string[] {
    const t1 = `<!-- version="${TagExplanationConfig.VERSION}" tag-id="${tag.id}" -->

<link rel="stylesheet" href="../.style/enhance.css">
<link rel="stylesheet" href="../.style/custom-component.css">
<link rel="stylesheet" href="../.style/reader-adapt.css">

<title>${tag.name}</title>

<div id="header"
     class="custom-component">
    <div id="main-image">
        <img src="./icon.jpg">
    </div>
    <div id="content-title">
        <h1>${tag.name}</h1>
        <div id="synonyms">
            <p><span class="inline-list-title">ZH</span>${tag.name_zh}</p>
            <p><span class="inline-list-title">JA</span>${tag.name_ja}</p>
            <p><span class="inline-list-title">EN</span>${tag.name_en}</p>
        </div>
        <div id="op-buttons">
            <a href="/api/tag-explanation/open-in-editor?id=${tag.id}" rel="noopener noreferrer">编辑文档</a>
            <a href="/api/tag-explanation/format?id=${tag.id}" rel="noopener noreferrer">格式化文档</a>
        </div>
    </div>
</div>

`;
    return [t1];
  }

  public static genTagExplanationReferenceFrame(tagId: number, refIndex: number): string[] {
    const t1 = `<!-- version="${TagExplanationConfig.VERSION}" tag-id="${tagId}" -->

<link rel="stylesheet" href="../.style/enhance.css">
<link rel="stylesheet" href="../.style/custom-component.css">
<link rel="stylesheet" href="../.style/reader-adapt.css">

<title></title>

<div id="op-buttons">
    <a href="/api/tag-explanation/open-in-editor?id=${tagId}&ref=${refIndex}" rel="noopener noreferrer">编辑文档</a>
    <a href="/api/tag-explanation/format?id=${tagId}&ref=${refIndex}" rel="noopener noreferrer">格式化文档</a>
</div>

---

平台 :

源链接 : []()

作者 : []()

保存时间 :

---

`;

    return [t1];
  }
}

export default TagExplanationConfig;