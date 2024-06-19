import {inject, injectable} from 'inversify';
import {SongMetadata, QueuedPlaylist, MediaSource} from './player.js';
import {TYPES} from '../types.js';
import ffmpeg from 'fluent-ffmpeg';
import YoutubeAPI from './youtube-api.js';

@injectable()
export default class {
  private readonly youtubeAPI: YoutubeAPI;

  constructor(@inject(TYPES.Services.YoutubeAPI) youtubeAPI: YoutubeAPI) {
    this.youtubeAPI = youtubeAPI;
  }

  async youtubeVideoSearch(query: string, shouldSplitChapters: boolean): Promise<SongMetadata[]> {
    return this.youtubeAPI.search(query, shouldSplitChapters);
  }

  async youtubeVideo(url: string, shouldSplitChapters: boolean): Promise<SongMetadata[]> {
    return this.youtubeAPI.getVideo(url, shouldSplitChapters);
  }

  async youtubePlaylist(listId: string, shouldSplitChapters: boolean): Promise<SongMetadata[]> {
    return this.youtubeAPI.getPlaylist(listId, shouldSplitChapters);
  }

  async httpLiveStream(url: string): Promise<SongMetadata> {
    return new Promise((resolve, reject) => {
      ffmpeg(url).ffprobe((err, _) => {
        if (err) {
          reject();
        }

        resolve({
          url,
          source: MediaSource.HLS,
          isLive: true,
          title: url,
          artist: url,
          length: 0,
          offset: 0,
          playlist: null,
          thumbnailUrl: null,
        });
      });
    });
  }
}
