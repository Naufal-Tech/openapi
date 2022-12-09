require('dotenv').config()

const qrcode = require('qrcode-terminal');
const fs = require("fs");
const { Client, LocalAuth } = require('whatsapp-web.js');
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);
async function responsePrompt (prompt) {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompt,
    temperature: 0.6,
    max_tokens: 2048,
  });
  return response.data.choices[0].text;
}
const SESSION_PATH = './wh_Session.json';
let sessionData;
if (fs.existsSync(SESSION_PATH)) {
    sessionData = require(SESSION_PATH);}
const clientWA = new Client({ authStrategy: new LocalAuth(), session: sessionData} );
clientWA.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});
clientWA.on('ready', () => {
    console.log('Client is ready!');
});
clientWA.on("message", async msg => {
    const prefix = "!";
    const args = msg.body.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    if (msg.body[0] === prefix) { 
        if (command == "ask"){
            const prompt = args.join(" ");
            const response = await responsePrompt(prompt);
            msg.reply(response);
          }}})
clientWA.initialize();
