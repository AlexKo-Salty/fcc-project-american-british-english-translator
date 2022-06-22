const e = require('cors');
const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')

class Translator {
    translate (text, locale)
    {
        if (text === '')
        {
            return "No text to translate";
        }
        else if (!text || !locale)
        {
            return "Required field(s) missing";
        }
        else if (locale !== "american-to-british" && locale !== "british-to-american")
        {
            return "Invalid value for locale field";
        }
        let textArray = text.toLowerCase().split(' ');
        let translatedTextArray = [];

        textArray.forEach((word, index) => {
            let newWord;
            let isLastWithDot = false;
            if (textArray.length === index + 1 && word.charAt(word.length - 1) === ".")
            {
                word = word.slice(0, word.length -1);
                isLastWithDot = true;
            }
            //Handle three words convert
            if (index > 2 && !newWord)
            {
                let wholeWord = textArray[index - 2] + " " + textArray[index - 1] + " " + word;
                newWord = this.findWords(wholeWord, locale);
                if (index -2 === 0)
                {
                    newWord = newWord.charAt(0).toUpperCase() + newWord.slice(1)
                }
                if (newWord)
                {
                    translatedTextArray.push("");
                    translatedTextArray.push("");
                    translatedTextArray.splice(index -2, 2)
                }
            }
            //Handle two words convert
            if (index > 1 && !newWord)
            {
                let wholeWord = textArray[index - 1] + " " + word;
                newWord = this.findWords(wholeWord, locale);
                if (index -1 === 0)
                {
                    newWord = newWord.charAt(0).toUpperCase() + newWord.slice(1)
                }
                if (newWord)
                {
                    translatedTextArray.push("");
                    translatedTextArray.splice(index - 1, 1)
                }
            }
            //Handle one word convert
            if (!newWord)
            {
                newWord = this.findWords(word, locale)
            }
            if (index === 0 && newWord)
            {
                newWord = newWord.charAt(0).toUpperCase() + newWord.slice(1)
            }
            if (newWord)
            {
                translatedTextArray.push('<span class="highlight">'+ newWord + '</span>' + (isLastWithDot ? "." : ""))
                return;
            }
            else
            {
                translatedTextArray.push(text.split(' ')[index]);
                return;
            }
        });

        translatedTextArray = translatedTextArray.filter((a) => a);
        return text.toLowerCase() === translatedTextArray.join(' ').toLowerCase() ? "Everything looks good to me!" : translatedTextArray.join(' ') 
    }

    findWords (text, locale)
    {
        let USRegex = /^(0?[1-9]|1[0-2]):([0-5]\d)\s?$/
        let UKRegex = /^(0?[1-9]|1[0-2])[.]([0-5]\d)\s?$/
        let result;

        if (locale === "american-to-british")
        {
            if (americanOnly.hasOwnProperty(text))
            {
                result = americanOnly[text];
            } else if (americanToBritishSpelling.hasOwnProperty(text))
            {
                result = americanToBritishSpelling[text];
            } 
            else if (americanToBritishTitles.hasOwnProperty(text))
            {
                result = americanToBritishTitles[text];
                result = result.charAt(0).toUpperCase() + result.slice(1);
            }
            else if (USRegex.test(text))
            {
                result = text.replace(":", ".")
            }
            
        }
        else if (locale === "british-to-american")
        {
            if (britishOnly.hasOwnProperty(text))
            {
                result = britishOnly[text];
            } 
            else if (Object.keys(americanToBritishSpelling).find(key => americanToBritishSpelling[key] === text))
            {
                result = Object.keys(americanToBritishSpelling).find(key => americanToBritishSpelling[key] === text)
            } 
            else if (Object.keys(americanToBritishTitles).find(key => americanToBritishTitles[key] === text))
            {
                result = Object.keys(americanToBritishTitles).find(key => americanToBritishTitles[key] === text)
                result = result.charAt(0).toUpperCase() + result.slice(1);
            }
            else if (UKRegex.test(text))
            {
                result = text.replace(".", ":")
            }
        }
        
        return result;
    }
}

module.exports = Translator;