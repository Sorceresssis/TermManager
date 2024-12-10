class UrlsConfig {
  public static readonly APP_API_BASEURL = import.meta.env.VITE_APP_API_BASEURL;
  public static readonly APP_SERVER_URL = import.meta.env.VITE_APP_SERVER_URL;

  public static getTagIconUrl(tagId: number, addTimestamp = true) {
    const tagIconUrl = `${UrlsConfig.APP_SERVER_URL}/tag/${tagId}/icon.jpg${ addTimestamp ? `?${Date.now()}` : ''}`;
    return tagIconUrl;
  }

  public static getTagExplanationIndexUrl(tagId: number) {
    return `${UrlsConfig.APP_SERVER_URL}/tag/${tagId}/index.md`;
  }

  public static getTagExplanationReferenceUrl(tagId: number, refIndex:number) {
    return `${UrlsConfig.APP_SERVER_URL}/tag/${tagId}/ref_${refIndex}.md`;
  }

  public static getOpenDataFolderInEditorUrl() {
    return `${UrlsConfig.APP_API_BASEURL}/tag-explanation/open-data-folder-in-editor`;
  }

  public static getOpenTagExplanationIndexFileInEditorUrl(id: number) {
    return `${UrlsConfig.APP_API_BASEURL}/tag-explanation/open-in-editor?id=${id}`;
  }

  public static getOpenTagExplanationReferenceFileInEditorUrl(id: number, refIndex: number) {
    return `${UrlsConfig.APP_API_BASEURL}/tag-explanation/open-in-editor?id=${id}&ref=${refIndex}`;
  }
}

export default UrlsConfig;