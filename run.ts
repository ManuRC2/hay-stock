import axios from "axios";
import { sleep } from "bun";
import * as cheerio from "cheerio";

async function fetchStock(url: string){
    var $: cheerio.CheerioAPI;
    var compu: cheerio.Cheerio<cheerio.Element>;
    var currentdate: Date;
    var datestring: string;
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
            console.log(datestring, "- no hay stock")
        }
        else{
            console.log(datestring, "- HAY STOCK!!!!!!!!")
        }
    }).catch((error) => {
        console.log(error);
    })
}
async function main(cooldown:number){
    console.log("Starting...")
    while(true) {
        await fetchStock("https://especiales.tiendabna.com.ar/catalog/promo-argentina-programa");
        await sleep(cooldown);
    }
    console.log("Program finished.")
}

await main(10000)