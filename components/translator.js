const e = require('cors');
const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')

class Translator {
    translate (text, locale)
    {
        if (!text && !locale)
        {
            return "Required field(s) missing";
        }
        else if (!text)
        {
            return "No text to translate";
        }
        else if (!locale)
        {
            return "Invalid value for locale field";
        }
        let textArray = text.toLowerCase().split(' ');
        let translatedTextArray = [];

        textArray.forEach((word, index) => {
            let newWord;
            //Handle three words convert
            if (index > 2)
            {
                let wholeWord = textArray[index - 2] + " " + textArray[index - 1] + " " + textArray[index];
                newWord = this.findWords(wholeWord, locale);
            }
            //Handle two words convert
            if (index > 1)
            {
                let wholeWord = textArray[index - 1] + " " + textArray[index];
                newWord = this.findWords(wholeWord, locale);
            }
            //Handle one word convert
            newWord = this.findWords(word, locale)
            if (newWord)
            {
                translatedTextArray.push('<span class="highlight">'+ newWord + '</span>')
                return;
            }
            else
            {
                translatedTextArray.push(word);
                return;
            }
        });

        return text.toLowerCase() === translatedTextArray.join(' ') ? "Everything looks good to me!" : translatedTextArray.join(' ') 
    }

    findWords (text, locale)
    {
        let result;

        if (locale === "american-to-british")
        {
            if (americanOnly.hasOwnProperty(text))
            {
                result = americanOnly[key];
                return; 
            } else if (americanToBritishSpelling.hasOwnProperty(text))
            {
                result = americanToBritishSpelling[key];
                return;
            } 
            else if (americanToBritishTitles.hasOwnProperty(text))
            {
                result = americanToBritishTitles[key];
                return;
            }
        }
        else if (locale === "british-to-american")
        {
            if (britishOnly.hasOwnProperty(text))
            {
                result = britishOnly[key];
                return;
            } 
            else if (Object.keys(americanToBritishSpelling).find(key => americanToBritishSpelling[key] === text))
            {
                result = Object.keys(americanToBritishSpelling).find(key => americanToBritishSpelling[key] === text)
            } 
            else if (Object.keys(americanToBritishTitles).find(key => americanToBritishTitles[key] === text))
            {
                result = Object.keys(americanToBritishTitles).find(key => americanToBritishTitles[key] === text)
            }
        }
        
        return result;
    }
}

module.exports = Translator;