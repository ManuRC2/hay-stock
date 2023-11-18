import fs from 'fs';

const PATH = 'numeros.json'

export function write(array: number[]) {
    fs.writeFileSync(PATH, JSON.stringify(array));
}

export function read() {
    const fileContent = fs.readFileSync(PATH, 'utf-8');
    const array = JSON.parse(fileContent);
    return array;
}

export function agregar_numero(numero: number){
    const numeros = read();
    if(!numeros.includes(numero)){
        numeros.push(numero);
        write(numeros);
    }
    return numeros;
}

export function sacar_numero(numero: number){
    const numeros = read();
    if(numeros.includes(numero)){
        numeros.splice(numeros.indexOf(numero, 0), 1);
        write(numeros);
    }
    return numeros;
}