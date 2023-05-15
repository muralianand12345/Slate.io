from flask import Flask, jsonify
from youtube_transcript_api import YouTubeTranscriptApi

app = Flask(__name__)

@app.route('/api/subtitles/<video_id>', methods=['GET'])
def get_subtitles(video_id):
    try:
        srt = YouTubeTranscriptApi.get_transcript(video_id)
        subtitles = ' '.join([caption['text'] for caption in srt])
        return jsonify({'subtitles': subtitles})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run()