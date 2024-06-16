class Urls {
    public static readonly BASE = 'http://localhost:3000';
    public static readonly API = `${Urls.BASE}/api`;

    public static generateTagIconUrl(id: number, addTimestamp = true): string {
        return addTimestamp ?
            `/tag/assets/${id}/images/icon.jpg?${Date.now()}` :
            `/tag/assets/${id}/images/icon.jpg`;
    }
}

export default Urls;