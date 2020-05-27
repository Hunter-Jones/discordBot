// url to invite:  https://discordapp.com/api/oauth2/authorize?client_id=BOT_ID&permissions=8&scope=bot
// Where BOT_ID is should be the client ID found at https://discord.com/developers/applications/
const discordBot = require("./discordBot");

const http = require("http");
const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer();
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
