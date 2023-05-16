from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, sent_tokenize
from string import punctuation
from nltk.stem.snowball import SnowballStemmer
import nltk



class TextSummarizer:
    stemmer = SnowballStemmer("english")
    stopWords = set(stopwords.words("english")+ list(punctuation))
    text = ""
    sentences = ""
    def tokenize_sentence(self):
        words = word_tokenize(self.text)
        return words;

    def input_text(self):
        while True:
            with open('article.txt', 'r', encoding='utf-8') as file:
                text1 = file.read()
                if len(text1) > 10:
                    self.text = text1
                    break
                else:
                    print("Please input the text with a length of at least 10 characters")



     
    def cal_freq(self,words):
        freqTable = dict()
        for word in words:
            word = word.lower()
            if word in self.stopWords:
                continue
            if word in freqTable:
                freqTable[word] += 1
            else:
                freqTable[word] = 1
        return freqTable;

    def compute_sentence(self,freqTable):
        self.sentences = sent_tokenize(self.text)
        sentenceValue = dict()
        for sentence in self.sentences:    
            for index, wordValue in enumerate(freqTable, start=1):
                if wordValue in sentence.lower():
                    if sentence in sentenceValue:
                        sentenceValue[sentence] += index
                    else:
                        sentenceValue[sentence] = index
        return sentenceValue;

    def sumAvg(self,sentenceValue):
        sumValues = 0
        for sentence in sentenceValue:
            sumValues += sentenceValue[sentence]
            average = int(sumValues / len(sentenceValue))
        return average;

    def print_summary(self,sentenceValue,average):
        summary = ''
        for sentence in self.sentences:
            if (sentence in sentenceValue) and (sentenceValue[sentence] > (1.5 * average)):
                summary += " " + sentence
        return summary
               

ts = TextSummarizer()
ts.input_text()
words = ts.tokenize_sentence()
freqTable = ts.cal_freq(words)
sentenceValue = ts.compute_sentence(freqTable)
avg = ts.sumAvg(sentenceValue)
summary = ts.print_summary(sentenceValue,avg)

print("==========================================================")
print("Final summary is:\n\n")
print(summary)