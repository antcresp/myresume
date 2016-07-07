'use strict';

const _ = require('lodash');
const Script = require('smooch-bot').Script;

const scriptRules = require('./script.json');

module.exports = new Script({
    processing: {
        //prompt: (bot) => bot.say('Beep boop...'),
        receive: () => 'processing'
    },

    start: {
        receive: (bot) => {
            return bot.say('Encantado de hablar contigo. Escribe HOLA para comenzar')
                .then(() => 'speak'); // askname
        }
    },

/*   askName: {
        bot.say('¿Cual es tu nombre?');
    //    receive: (bot, message) => {
    //        const name = message.text;
    //        const name= 'Juan';
      //      return bot.setProp('name', name)
        //        .then(() => bot.say('Encantado de hablar contigo ${name} Escribe RETO para comenzar '))
      //     .then(() => 'speak');
        }
    },*/

    speak: {
        
        receive: (bot, message) => {

            let upperText = message.text.trim().toUpperCase();

            function updateSilent() {
                switch (upperText) {
                    case "CONNECT ME":
                        return bot.setProp("silent", true);
                    case "DISCONNECT":
                        return bot.setProp("silent", false);
                    default:
                        return Promise.resolve();
                }
            }

            function getSilent() {
                return bot.getProp("silent");
            }

            function processMessage(isSilent) {
                if (isSilent) {
                    return Promise.resolve("speak");
                }

                if (!_.has(scriptRules, upperText)) {
                    return bot.say(`Lo siento, no te entiendo, Antonio solo me ha configurado para explicarte su proyecto personal. \n Escribe HOLA para comenzar!`).then(() => 'speak');
                }

                var response = scriptRules[upperText];
                var lines = response.split('\n');

                var p = Promise.resolve();
                _.each(lines, function(line) {
                    line = line.trim();
                    p = p.then(function() {
                        console.log(line);
                        return bot.say(line);
                    });
                })

                return p.then(() => 'speak');
            }

            return updateSilent()
                .then(getSilent)
                .then(processMessage);
        }
    }
});
