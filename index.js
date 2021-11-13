const TelegramBot = require('node-telegram-bot-api');
const request = require('request')

const token = '2115964153:AAEqQwAyean9K78TFPD7H5eyGfqjCpVOH6E';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

// Matches "/echo [whatever]"
bot.onText(/\/curse/, (msg, match) => {
 

  const chatId = msg.chat.id;
  

  bot.sendMessage(chatId, 'Выберите какая валюта вас интересует', {
      reply_markup: {
          inline_keyboard: [
              [
              {
                  text: '$ USD🇺🇸',
                  callback_data: 'USD'
              },
              {
                text: '€ EUR🇪🇺',
                callback_data: 'EUR'
            },
            {
                text: '₽ RUB🇷🇺',
                callback_data: 'RUB'
            }
           ]
          ]
      }
  });
});


bot.on('callback_query', query=>{
    const id = query.message.chat.id;
    request('https://cbu.uz/ru/arkhiv-kursov-valyut/json/', function (error, response, body){
        const data = JSON.parse(body);
        const result = data.filter(item => item.Ccy === query.data)[0];
        const flag = {
            'EUR' : '🇪🇺',
            'USD' : '🇺🇸',
            'RUB' : '🇷🇺'
        }
        let md = `
        *${flag[result.Ccy]} ${result.Nominal} ${result.Ccy} 💱 ${result.Rate} UZS🇺🇿*
        ${result.CcyNm_RU}
        _${result.Date}_
        `;

        bot.sendMessage(id, md, {parse_mode: 'Markdown'})
    } )
})

 