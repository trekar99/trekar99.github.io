// Este módulo obtiene miniaturas de shorts de YouTube de un canal
// Requiere una API Key de YouTube

export async function fetchShortsThumbnails({ apiKey, channelId, maxResults = 12 }) {
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=${maxResults}&type=video`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();
    const shorts = [];
    for (const item of searchData.items) {
        if (!item.id.videoId) continue;
        // Filtrar por duración < 60s
        const videoUrl = `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&id=${item.id.videoId}&part=contentDetails`;
        const videoRes = await fetch(videoUrl);
        const videoData = await videoRes.json();
        const duration = videoData.items[0]?.contentDetails?.duration;
        if (duration && /^PT([0-5]?[0-9])S$/.test(duration)) {
            shorts.push({
                videoId: item.id.videoId,
                thumb: item.snippet.thumbnails.medium.url,
                title: item.snippet.title
            });
        }
    }
    return shorts;
}
