class TagExplanationV1Constant {
    private static readonly VERSION = 1;

    public static readonly frame_regex = [
        /\s*<info[\s\S]*?编辑文档\s*<\/a>\s*<\/div>\s*<\/div>\s*<\/div>\s*/
    ]

    public static getTagExplanationFrame(tag: VO.Tag): string[] {
        const s1 = `<info version="${TagExplanationV1Constant.VERSION}" tag-id="${tag.id}">

<meta name="Referrer" content="strict-origin-when-cross-origin">

<link rel="stylesheet" href="./style/enhance.css">
<link rel="stylesheet" href="./style/custom-component.css">
<link rel="stylesheet" href="./style/reader-adapt.css">

<title>${tag.name}</title>

<div id="header"
     class="custom-component">
    <div id="main-image">
        <img src="./assets/${tag.id}/images/icon.jpg">
    </div>
    <div id="content_title">
        <h1> ${tag.name} </h1>
        <div id="synonyms">
            <p><span class="inline-list-title">ZH</span>${tag.name_zh}</p>
            <p><span class="inline-list-title">JA</span>${tag.name_ja}</p>
            <p><span class="inline-list-title">EN</span>${tag.name_en}</p>
        </div>
        <div id="op-buttons">
            <a href="/api/tag-explanation/vscode-open-url">编辑文档</a>
        </div>
    </div>
</div>

`

        return [
            s1
        ]
    }
}


export default TagExplanationV1Constant;