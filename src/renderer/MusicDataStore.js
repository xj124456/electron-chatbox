import Store from 'electron-store'
import path from 'path'
import uuidv4 from 'uuid/v4'

export class DataStore extends Store {
  constructor (settings) {
    super(settings)
    this.tracks = this.get('tracks') || []
  }
  saveTracks () {
    this.set('tracks', this.tracks)
    return this
  }
  getTracks () {
    return this.get('tracks') || []
  }
  addTracks (tracks) {
    const tracksWithProps = tracks.map(item => {
      return {
        id: uuidv4(),
        path: item,
        fileName: path.basename(item)
      }
    }).filter(item => {
      const currentTracksPath = this.getTracks().map(item => item.path)
      return currentTracksPath.indexOf(item.path) < 0
    })
    this.tracks = [...this.tracks, ...tracksWithProps]
    return this.saveTracks()
  }
}
