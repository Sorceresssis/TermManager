class UrlsConfig {
  public static readonly APP_API_BASEURL = import.meta.env.VITE_APP_API_BASEURL;
  public static readonly APP_SERVER_URL = import.meta.env.VITE_APP_SERVER_URL;


  public static getOpenDataFolderInVscodeUrl() {
    return `${UrlsConfig.APP_API_BASEURL}/open-data-folder-in-vscode`;
  }

  public static getOpenTagExplanationFileInVscodeUrl(id: number) {
    return `${UrlsConfig.APP_API_BASEURL}/open-tag-explanation-file-in-vscode?id=${id}`;
  }

  public static getTagIconUrl(tagId: number, addTimestamp = true) {
    const tagIconUrl = `${UrlsConfig.APP_SERVER_URL}/tag/${tagId}/icon.jpg${ addTimestamp ? `?${Date.now()}` : ''}`;
    return tagIconUrl;
  }

  public static getTagExplanationUrl(tagId: number) {
    return `${UrlsConfig.APP_SERVER_URL}/tag/${tagId}/index.md`;
  }
}

export default UrlsConfig;