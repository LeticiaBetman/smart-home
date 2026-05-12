const BACKEND_URL = "http://localhost:3000/comando";

// Dicionário: Traduz o nome do cômodo para o índice do LED no ESP32
const mapaLeds = {
    "sala": 0,
    "cozinha": 1,
    "quarto": 2,
    "varanda": 3, // O LED 3 está reservado para os sensores, conforme programado no ESP32.
    "banheiro": 4,  
};

let rooms = {
    sala: { ligado: false, brightness: 0 },
    cozinha: { ligado: false, brightness: 0 },
    quarto: { ligado: false, brightness: 0 },
    varanda: { ligado: false, brightness: 0 },
    banheiro: { ligado: false, brightness: 0 }
};

// =========================================================================
// NOVA FUNÇÃO: Faz a ponte entre o site e o seu Servidor Node.js
// =========================================================================
async function enviarParaBackend(indice, estado, brilhoPercentual) {
    // Converte a porcentagem (0 a 100) para o padrão do ESP32 (0 a 255)
    const intensidadePwm = Math.round((brilhoPercentual / 100) * 255);

    try {
        await fetch(BACKEND_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                led_index: indice,
                estado: estado,
                intensidade: intensidadePwm
            })
        });
    } catch (erro) {
        console.error("Erro de conexão com o Backend local:", erro);
    }
}
// =========================================================================

function atualizarLamp(room) {
    const lamp = document.querySelector(`#${room} .lamp`);
    const intensity = rooms[room].brightness;

    if (rooms[room].ligado) {
        lamp.classList.add("on");
        lamp.style.background = `rgba(255, 235, 59, ${intensity / 100})`;
    } else {
        lamp.classList.remove("on");
        lamp.style.background = "#1e293b";
    }
}

function atualizarUIRoom(room) {
    const roomElement = document.getElementById(room);
    const button = roomElement.querySelector("button");
    const input = roomElement.querySelector("input");
    const valor = document.getElementById(`${room}Valor`);

    button.textContent = rooms[room].ligado ? "Desligar" : "Ligar";
    input.value = rooms[room].brightness;
    valor.textContent = rooms[room].brightness + "%";
}

function toggleRoom(room) {
    // Inverte o estado (Se estava desligado, liga. Se estava ligado, desliga)
    rooms[room].ligado = !rooms[room].ligado;

    // A MÁGICA ACONTECE AQUI:
    if (rooms[room].ligado) {
        // Se está ligando agora, joga o brilho direto para o máximo (100%)
        rooms[room].brightness = 100;
    } else {
        // Se está desligando, zera o brilho
        rooms[room].brightness = 0;
    }

    // Atualiza a tela (muda a cor da lâmpada, o texto do botão e a posição da barrinha)
    atualizarUIRoom(room);
    atualizarLamp(room);
    atualizarGlobalStatus();

    // Envia o comando final e atualizado para o ESP32
    enviarParaBackend(mapaLeds[room], rooms[room].ligado, rooms[room].brightness);
}

function setBrightness(room, value) {
    value = Number(value);
    rooms[room].brightness = value;
    rooms[room].ligado = value > 0;

    atualizarUIRoom(room);
    atualizarLamp(room);
    atualizarGlobalStatus();

    // ENVIA O COMANDO PARA O ESP32
    enviarParaBackend(mapaLeds[room], rooms[room].ligado, rooms[room].brightness);
}

// ==========================================
// NOVAS FUNÇÕES DO CONTROLE GERAL
// ==========================================

function ligarTodas() {
    // Define o brilho para 100%
    document.getElementById("geralValor").textContent = "100%";
    
    // Atualiza a interface da barrinha geral (se ela tiver o id "geralSlider")
    const sliderGeral = document.querySelector('input[onchange*="setAllBrightness"]');
    if (sliderGeral) sliderGeral.value = 100;

    for (let room in rooms) {
        rooms[room].ligado = true;
        rooms[room].brightness = 100;

        atualizarUIRoom(room);
        atualizarLamp(room);
    }

    atualizarGlobalStatus();

    // Envia o comando para o ESP32 (Índice -1, Ligar = true, Brilho = 100)
    enviarParaBackend(-1, true, 100);
}

function desligarTodas() {
    // Define o brilho para 0%
    document.getElementById("geralValor").textContent = "0%";
    
    // Atualiza a interface da barrinha geral
    const sliderGeral = document.querySelector('input[onchange*="setAllBrightness"]');
    if (sliderGeral) sliderGeral.value = 0;

    for (let room in rooms) {
        rooms[room].ligado = false;
        rooms[room].brightness = 0;

        atualizarUIRoom(room);
        atualizarLamp(room);
    }

    atualizarGlobalStatus();

    // Envia o comando para o ESP32 (Índice -1, Ligar = false, Brilho = 0)
    enviarParaBackend(-1, false, 0);
}


function setAllBrightness(value) {
    value = Number(value);
    document.getElementById("geralValor").textContent = value + "%";

    for (let room in rooms) {
        rooms[room].brightness = value;
        rooms[room].ligado = value > 0;

        atualizarUIRoom(room);
        atualizarLamp(room);
    }

    atualizarGlobalStatus();

    // Envia o comando global
    enviarParaBackend(-1, value > 0, value);
}

function atualizarGlobalStatus() {
    const globalLamp = document.getElementById("globalLamp");
    const globalStatus = document.getElementById("globalStatus");

    // Cria uma lista apenas com os nomes dos cômodos que estão com a luz "true" (ligada)
    const comodosLigados = Object.keys(rooms).filter(room => rooms[room].ligado);
    const totalComodos = Object.keys(rooms).length;

    if (comodosLigados.length === 0) {
        // NENHUMA luz acesa
        globalLamp.classList.remove("on");
        globalLamp.style.background = "#1e293b";
        globalStatus.textContent = "Todas luzes desligadas";
        
    } else if (comodosLigados.length === totalComodos) {
        // TODAS as luzes acesas
        globalLamp.classList.add("on");
        globalLamp.style.background = "rgba(255, 235, 59, 0.9)";
        globalStatus.textContent = "Todas luzes ligadas";
        
    } else {
        // ALGUMAS luzes acesas (Lista os nomes)
        globalLamp.classList.add("on");
        globalLamp.style.background = "rgba(255, 235, 59, 0.5)"; // Brilho mais suave
        
        // Pega a lista (ex: ["sala", "varanda"]), coloca a primeira letra maiúscula e junta com vírgula
        const nomesBonitos = comodosLigados.map(nome => {
            return nome.charAt(0).toUpperCase() + nome.slice(1);
        }).join(", ");
        
        globalStatus.textContent = "Luzes acesas: " + nomesBonitos;
    }
}