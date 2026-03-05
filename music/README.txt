================================
BACKGROUND MUSIC
================================

Place your background music file here with the name:
- song.mp3

TIPS:
- Use MP3 format for best browser compatibility
- Choose a romantic, soft instrumental or love song
- The music will loop continuously
- Music starts playing when the user clicks the envelope

To change the music file name:
1. Open index.html
2. Find the <audio> element near the bottom
3. Update the src attribute:
   <source src="music/your-song-name.mp3" type="audio/mpeg">

VOLUME:
The default volume is set to 50%. To change it:
1. Open script.js
2. Find the playBackgroundMusic() function
3. Change the bgMusic.volume value (0.0 to 1.0)
