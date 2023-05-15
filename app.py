from flask import Flask, request, jsonify
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.stem import PorterStemmer
from youtube_transcript_api import YouTubeTranscriptApi

app = Flask(__name__)

@app.route('/api/subtitles/<video_id>', methods=['GET'])
def summarize(video_id):
    srt = YouTubeTranscriptApi.get_transcript(video_id)
    paragraph = ' '.join([caption['text'] for caption in srt])

    # Tokenize the paragraph into sentences
    sentences = sent_tokenize(paragraph)

    # Remove stopwords and stem the words
    stop_words = set(stopwords.words('english')) - {'not', 'no'}
    stemmer = PorterStemmer()
    words = [stemmer.stem(word) for word in word_tokenize(paragraph.lower()) if word.isalnum() and word not in stop_words]

    word_freq = {}
    for word in words:
        if word not in word_freq:
            word_freq[word] = 1
        else:
            word_freq[word] += 1

    # Calculate the sentence scores based on word frequency
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

    summary = [sentence.split('.')[0] for sentence, score in sorted_sentences[:15]]

    return jsonify({'summary_points': summary})

if __name__ == '__main__':
    app.run(port=5001)
