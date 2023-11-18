import TelegramBot from 'node-telegram-bot-api';
import { agregar_numero, sacar_numero } from './file';
import { sleep } from 'bun';
import axios from "axios";
import * as cheerio from "cheerio";
import { read } from './file';

const TOKEN:string = process.env.TELEGRAM_API_KEY!
export const bot = new TelegramBot(TOKEN, { polling: true });
const COOLDOWN = 600000

var $: cheerio.CheerioAPI;
var compu: cheerio.Cheerio<cheerio.Element>;
var currentdate: Date;
var datestring: string;
var chat_ids: number[]
var mensaje: string

export async function fetchStock(url: string){
    return axios.get(url, {timeout: 1000}).then((response) => {
        $ = cheerio.load(response.data);
        compu = $("#modern-variant-card");
        currentdate = new Date();
        datestring = currentdate.getDate() + "/"
                            + (currentdate.getMonth()+1)  + "/" 
                            + currentdate.getFullYear() + " @ "  
                            + currentdate.getHours() + ":"  
                            + currentdate.getMinutes() + ":" 
                            + currentdate.getSeconds();
        if(compu.html() == null){
            mensaje = datestring + " - no hay stock";
        }
        else {
            mensaje = datestring + " - HAY STOCK!!!!!!!!!!!!!!!!!!!!!!";
        }

        console.log(mensaje)
        chat_ids = read()
        chat_ids.forEach(function (id) {
            bot.sendMessage(id, mensaje);
        })
    }).catch((error) => {
        console.log(error);
    })
}

console.log("Starting...")
while(true) {
    await fetchStock("https://especiales.tiendabna.com.ar/catalog/promo-argentina-programa");
    bot.on('message', (msg) => {
        const chatId = msg.chat.id;
        const messageText = msg.text;
        switch(messageText) { 
            case '/start': { 
                bot.sendMessage(chatId, 'Hola! Mi funcion es notificarte si hay stock de notebooks de Argentina Programa.\n Para ayuda, manda /help');
                break; 
            } 
            case '/help': { 
                bot.sendMessage(chatId, 'Comandos:\n/start: iniciar el bot\n/help: mostrar este mensaje\n/guardar: agregarte a la lista de numeros\n/sacar: sacarte de la lista de numeros');
                break; 
            } 
            case '/guardar': { 
                console.log(agregar_numero(chatId))
                bot.sendMessage(chatId, 'Listo ahi te agregue master');
                break; 
            } 
            case '/sacar': {
                console.log(sacar_numero(chatId))
                bot.sendMessage(chatId, 'Listo loco ya te saque');
                break; 
            } 
            default: { 
                bot.sendMessage(chatId, 'No entendi nada, manda /help para ayuda');
                break; 
            } 
        }
    });
    await sleep(COOLDOWN);
}