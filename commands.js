var startKey = "/"
var client = require("./discordBot.js");

var commands = [
    {
        name: "help",
        command: function helpCommand(message, channel){
            var commandIndex = listCommandsVar.indexOf(message[0]);
            if(message.length === 0) {  // If the user just typed help
                commands.forEach(function(command){
                    channel.send(command["name"] + ": " + command["description"]);
                })
            } else if (commandIndex != -1) {  // If the user wants a specific comand
                channel.send(commands[commandIndex]["description"] + "\n");
            } else {  // If the user makes a mistake
                channel.send("I was not able to find the command you were searching for, if you need a list of commands" +
                "try typing ***help***")
            }
        },
        description: "Will give a description of a command when you type ***help*** *command name* or if you" +
         "just type ***help***, it will list all commands that you can use",
         requiresAdmin: false
    },
    {
        name: "vote",
        command: function voteCommand(message, channel){
            if (message.length === 0) {
              message.push(" do something");
            }
            timeLimit = minsToMs(60); // currently 60 minutes
            message = message.join(" ");

            channel.send("A vote has been started to: " + message)
              .then(function(newMessage){
                newMessage.react("👍")
                  .then(function(){  // makes sure goes in correct order
                      newMessage.react("👎");
                    });
                // message.react(":thumbsdown:");
                var upReaction = 0;
                var downReaction = 0;
                ('messageReactionAdd', (reaction) => {
                    if(reaction.emoji.name === "👍") {
                      upReaction++;
                    }
                    if(reaction.emoji.name === "👎") {
                      downReaction++;
                    }

                })
                setTimeout(function(){
                    if (upReaction + downReaction < 5) {
                      channel.send("Not enough people voted to " + message);
                    } else if(upReaction > downReaction) {
                      channel.send("The vote to" + message + " has been passed");
                    } else if (upReaction === downReaction && upReaction === 1) {
                      channel.send("Nobody voted to " + message + " ...");
                    } else if (upReaction === downReaction) {
                        channel.send("The vote is tied to " + message);
                    } else {
                      channel.send("The vote to " + message +  " failed");
                    }
                }, timeLimit);
            })
        },
        description: "Allows you to call a vote by typing ***vote*** *name of issue* and it will call a" +
        "vote that lasts for 1 hour. REQUIRES THE BOT TO HAVE AN ADMIN ROLE!",
        requiresAdmin: true
    },
    {
        name: "vote-kick",
        command: function voteKickCommand(message, channel, guild){
            if(message[0] === undefined) {
              message.push("")
            }

            var user = message[0].split("").slice(2, -1).join("");
            user = guild.member(user);

            if (!user) {  // Checks if their is a users
                channel.send("You need the first thing to be the person you want banned")
                return;
            } else {
                if (user.hasPermission("ADMINISTRATOR")) {  // Checks if the user is an admin
                    channel.send("This person is too powerful!");
                    return;
                }
            }

            timeLimit = minsToMs(60); // currently 60 minutes
            message = message.join(" ")

            channel.send("A vote has been started to kick: " + message)
              .then(function(newMessage){
                newMessage.react("👍")
                  .then(function(){  // makes sure goes in correct order
                      newMessage.react("👎");
                    });
                // message.react(":thumbsdown:");
                var upReaction = 0;
                var downReaction = 0;
                ('messageReactionAdd', (reaction) => {
                    if(reaction.emoji.name === "👍") {
                      upReaction++;
                    }
                    if(reaction.emoji.name === "👎") {
                      downReaction++;
                    }

                })
                setTimeout(function(){
                    if (upReaction + downReaction < 5) {
                      channel.send("Not enough people voted to kick" + message);
                    } else if(upReaction > downReaction) {
                        guild.ban(user);
                        channel.send(message + " has been kicked");
                    } else if (upReaction === downReaction && upReaction === 1) {
                      channel.send("Nobody voted to kick " + message + " ...");
                    } else if (upReaction === downReaction) {
                        channel.send("The vote to kick was tied " + message + " is tied");
                    } else {
                      channel.send("The vote to " + message +  " failed");
                    }
                }, timeLimit);
            });
        },
        description: "Allows admins to create a vote to kick a user by typing ***vote-kick***" +
        "*@username*, If you want to vote to kick multiple users you can @ multiple people",
        requiresAdmin: true
    },
    {
        name: "delay",
        command: function delayedMessageCommand(message, channel){
            var timeDelay = message[0];
            const timeMultiplier = 60000; // converts ms to minutes

            if (isNaN(timeDelay)) {  // If the user doesnt have a time limit
                timeDelay === 1;
                channel.send("The first thing in your message needs to be the number of minutes you want to wait before the message sends");
                return; // way to exit the function
            }
            if (message[1] === undefined) {  // If the user doesnt have a message
                message.push("MESSAGE MESSAGE MESSAGE!!!");
            }

            setTimeout(function(){
                channel.send(message.slice(1).join(" "));  // removes the time to send, then joins it together
            }, minsToMs(timeDelay));
        },
        description: "Allows you to send message, that will @ everyone whatever the message is after a certain" +
        "amount of time by typing ***delay*** *minutes_until_message_sends message content",
        requiresAdmin: true
    },
    {
        name: "repeat",
        command: function repeatMessageCommand(message, channel){
            var repeatTimes = message[0];
            var delayTime = message[1]
            var messageText = message.slice(2).join(" ");
            var runTimes = 0; // how many times a message is run
            const maxRepeatTimes = 100;
            const timeMultiplier = 60000;
            const minDelayTime = .05; // 3 seconds

            if (isNaN(repeatTimes)) {  // If the user doesnt have a number of repeat times
                channel.send("The first thing after delay needs to be the number of times you want the message to repeat");
                return; // way to exit the function
            }
            if (isNaN(delayTime)) {  // If the user doesnt have a number of repeat times
                channel.send("The second thing after delay needs to be the amount of minutes you want to wait between message");
                return; // way to exit the function
            }
            if (repeatTimes > maxRepeatTimes) {  // Sets the max repeat times
                repeatTimes === maxRepeatTimes;
            }
            if (delayTime < minDelayTime) {  // Makes sure it doesnt resond quicker than min
                delayTime = minDelayTime;
            }
            if (messageText.trim() === "") {  // If the user doesnt have a message
                messageText = "MESSAGE MESSAGE MESSAGE!!!";
            }

            var repeatInterval = setInterval(function(){
                runTimes += 1;
                channel.send(messageText);
                if (runTimes >= repeatTimes) {  // Stops running when after runtimes amount of time
                    clearInterval(repeatInterval);
                }
            }, minsToMs(delayTime))
        },
        description: "Sends a message x amount of times with a 1 minute delay by typing ***delay***" +
        "*number_of_times_sent message context*",
        requiresAdmin: true,
    },
    {
        name: "change-start",
        command: function changeStartCommand(message, channel){
            var symbolList = "/ . < > ! # $ % ^ & * - + = ~";
            if (message.length !== 1 || symbolList.split(" ").indexOf(message[0]) === -1) {
                channel.send("I wasn't able to change the command start because you need to use one of these symbols: " + symbolList)
            } else {
                startKey = message[0];
                module.exports.startKey = startKey;
                channel.send("The new start key is " + startKey + " for more help type " + startKey + "help")
            }
        },
        description: "Changes the start command used to activate the bot from " + startKey + " another" +
        "symbol  by typing ***change-start*** *character*",
        requiresAdmin: true
    },
    {
        name: "math",
        command: function mathCommand(message, channel){
            message = message.join(" ")
            var errorMessage = commands[listCommandsVar.indexOf("math")].errorMessage;
            try {  // Catches if the user types something other than a math equation
                channel.send(eval(message))
            } catch (err) {
                channel.send(errorMessage)
            }
            if(message.trim().length === 0) {
                channel.send(errorMessage)
            }
        },
        description: "When you type ***math*** then a math equation (ex: 2 + 2) it will reply the answer to the equation",
        errorMessage: "It appears you typed something wrong in your math equation, try typing something like *2+2*",
        requiresAdmin: false
    }

];

function minsToMs(time) { // converts minutes to ms
    return time * 60000;
}

module.exports.commands = commands;
module.exports.startKey = startKey;
