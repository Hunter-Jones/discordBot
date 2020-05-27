const secretToken      = "";  // Can be obtained after you create the bot at https://discord.com/developers/applications/ 
// Will be the client secret

const Discord          = require("discord.js");
var client             = new Discord.Client();
const commander        = require("./commands.js").commands;
var startKey = require("./commands.js").startKey;  // What you need to type before calling the bot in discord

client.on("ready", connected);

// Pre: Runs when the bot joins the server
// Post: Logs to console connected, sets status, creates a role if needed, and waits for commands
function connected() {
    console.log("Connected to server as " + client.user.tag);
    client.user.setActivity("for " + startKey + "help", {type: "LISTENING"});
    // checkMessageForCommand();
    module.exports = client;

    client.guilds.forEach(function(guild){
        createRole(guild);
    })
}

client.on("message", (message) => {
    if (message.content.split("")[0] === startKey) {
        checkMessageForCommand(message.content, message.channel, message, client.guilds.get(message.channel.guild.id))

        // Used incase user uses change-start command to modify the activity
        client.user.setActivity("for " + startKey + "help", {type: "LISTENING"});
    }
});

// Post: Creates and returns an array of command names
function listCommands(){ 
    var commandsNameList = [];
    commander.forEach(function(command){
        commandsNameList.push(command["name"]);
    })
    return commandsNameList;
}
// Saves the variables created to the variable
listCommandsVar = listCommands();

// Pre: Runs whenever a message is sent to check for and run commands
// Requires the actual message content, the channel is sent in, the messageID, and the guildID
function checkMessageForCommand(messageText, channel, message, guild){  

    messageText = messageText.toLowerCase().split(" "); // Gets the lower case version of the first word in message

    commander.forEach(function(command){  // Checks if any commands are called and runs them if so
        startKey = require("./commands.js").startKey;  // What you need to type before calling the bot in discord (updates startkey each time)
        if(messageText[0] === startKey + command["name"] || messageText[0] === "/" + command["name"]) {  // Checks if the user uses the startKey or / (default)

            if (command["requiresAdmin"]){  // Command requires admin

                if (!message.member.hasPermission("ADMINISTRATOR")) {//User isnt admin
                    channel.send("You need to be stronger to do that. Come back and use this command when you are at least" +
                    " admin or stronger");
                    return;
                }
            }
            command["command"](messageText.slice(1), channel, guild);  // If all works, runs the command
        }
    })
}

// Pre: Requires the guild to be run in
// Runs once the first time the bot joins a server, and then never again (unless the role is deleted)
// Post: Creates a role for the bot
function createRole(guild) {
    var roleName = "";
    var alreadyCreated = guild.roles.some(function(role){  // checks if the role is already created
        // Only runs if the bot has not entered the server before
        return roleName === role.name;
    });

    if (!alreadyCreated) {  // Only runs if the role does not exist
        guild.createRole({
            name: roleName,
            color: "#00ecce",
            mentionable: true,  // Whether or not you can @ the role
            hoist: true, // whether or not it shows up on right side as seperate category
            permissions: ["ADMINISTRATOR"],
        })

        .then(function(){
            guild.members.forEach(function(member){
                if (client.user.id === member.id){ // Checks for the bot
                    guild.roles.forEach(function(role){
                        if(role.name === roleName) {
                            member.addRole(role)
                        }
                    });
                }
            });
        });
    }

}

client.login(secretToken);
module.exports = client;
