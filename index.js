//what's needed to access document
const fs = require('fs');
const Discord = require('discord.js');
const bot = new Discord.Client();


//Reads file with token
const info = JSON.parse(fs.readFileSync('./token.JSON'))
const token = info.token
//regex for splitting message into multiple words (excludes numbers)
const findRegex = /[a-zA-Z]+/g;
//converts file into string
var words = fs.readFileSync('.\\words.txt').toString();
//console.log(words);


//test for javascript code, replies to every bruh with blink
bot.on('message', msg=> {
    //check for bruh
    if (msg.content.toLowerCase() === 'bruh') {
        //blink
        msg.channel.send(':neutral_face: :expressionless: :neutral_face:')
    }
})


//checks if any words are not in words.txt and if they are, mocks discord
bot.on('message', msg=> {
    //makes sure it doesn't correct bots
    if (!msg.author.bot) {
        //checks words.txt file to update list
        words = fs.readFileSync('.\\words.txt').toString();
        //makes sure it doesn't correct a word being added
        if (msg.content.slice(0, 4) === '.add') 
        {} else {
            //makes sure it doesn't correct links
            if (msg.content.slice(0, 8) === 'https://') {} else {   
                //checks if word is in words.txt
                const mWords = msg.content.toLowerCase().match(findRegex);
                var correct;
                for (word in mWords) {
                    //looks in words.txt for a line break before the word
                    //new regex for finding indiv characters
                    regex = new RegExp('\\b' + mWords[word] + '\\b');
                    correct = words.search(regex);
                    // if (mWords[word][mWords[word].length + 1] = undefined) {
                    // }
                    // console.log(mWords[word][mWords[word].length + 1]);
                    if (correct == -1) {
                        //setting up mockery
                        var sarcasm = '';
                        var i;
                        //loops through word making every other letter capitalized
                        for (i = 0; i <= mWords[word].length -1; i++) {
                            if (i % 2 == 0) {
                                sarcasm = sarcasm + mWords[word][i].toLowerCase();
                            } else {
                                sarcasm = sarcasm + mWords[word][i].toUpperCase();
                            }
                        }
                        //sends final product
                        msg.channel.send(sarcasm);
                    }
                }  
            }
        }
    }
})


//adding words
bot.on('message', msg=> {
    //gets word after .add and sets it to messageDiscord
    var messageDiscord = msg.content.slice(5, msg.content.length);
    //checks if .add begins sentence
    if(msg.content.slice(0, 4) === '.add') {
        //checks if word being added is in words.txt
        const mWords = messageDiscord.toLowerCase().match(findRegex);
        var correct;
        for (word in mWords) {
            regex = new RegExp('\\b' + mWords[word] + '\\b');
            correct = words.search(regex);
            if (correct == -1) {
                //if word is not in words.txt, it updates words.txt with word, and lets console know that it has done so
                fs.writeFile('.\\words.txt', words + '\n' + messageDiscord, (err) => {
                    if (err) throw err;
                    console.log('The file has been saved with ' + messageDiscord + '!');
                });
                //let's discord know that words.txt was updated
                msg.channel.send(messageDiscord + ' added to list of acceptable words.');
            } else {
                //If word is already in words.txt, then lets discord know and does not update
                msg.channel.send(messageDiscord + ' is already in the list of words.')
            }
        }
    }
})

bot.on('ready', () => {
    console.log('This bot is online');
})

bot.login(token);