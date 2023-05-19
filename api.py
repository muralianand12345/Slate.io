from flask import Flask, request, jsonify
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.stem.snowball import SnowballStemmer
from youtube_transcript_api import YouTubeTranscriptApi

app = Flask(__name__)

class TextSummarizer:
    def __init__(self):
        self.stop_words = set(stopwords.words('english')) - {'not', 'no'}
        self.stemmer = SnowballStemmer("english")

    def preprocess_text(self, text):
        words = [self.stemmer.stem(word) for word in word_tokenize(text.lower()) if word.isalnum() and word not in self.stop_words]
        return words

    def calculate_word_frequency(self, words):
        word_freq = {}
        for word in words:
            if word not in word_freq:
                word_freq[word] = 1
            else:
                word_freq[word] += 1
        return word_freq

    def summarize_text(self, text):
        sentences = sent_tokenize(text)
        words = self.preprocess_text(text)
        word_freq = self.calculate_word_frequency(words)
        sentence_scores = {}
        for sentence in sentences:
            for word in word_tokenize(sentence.lower()):
                if word in word_freq:
                    if len(sentence.split()) < 50:
                        if sentence not in sentence_scores:
                            sentence_scores[sentence] = word_freq[word]
                        else:
                            sentence_scores[sentence] += word_freq[word]
        sorted_sentences = sorted(sentence_scores.items(), key=lambda x: x[1], reverse=True)
        summary = [sentence.split('.')[0].replace('\n', ' ').replace('\u201c', ' ').replace('\u201d', ' ') for sentence, score in sorted_sentences[:20]]
        return summary

@app.route('/api/subtitles/<video_id>', methods=['GET'])
def summarize(video_id):
    try:
        srt = YouTubeTranscriptApi.get_transcript(video_id)
        paragraph = ' '.join([caption['text'] for caption in srt])
        ts = TextSummarizer()
        summary = ts.summarize_text(paragraph)
        return jsonify({'summary_points': summary})
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(port=5001)
