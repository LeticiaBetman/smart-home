const BACKEND_URL = "http://localhost:3000/comando";

const mapaLeds = {
    sala: 0,
    cozinha: 1,
    quarto: 2,
    varanda: 3,
    banheiro: 4
};

const rooms = {
    sala: { ligado: false, brightness: 0 },
    cozinha: { ligado: false, brightness: 0 },
    quarto: { ligado: false, brightness: 0 },
    varanda: { ligado: false, brightness: 0 },
    banheiro: { ligado: false, brightness: 0 }
};

/* =========================
   BACKEND
========================= */

async function enviarParaBackend(indice, estado, brilhoPercentual) {

    const intensidadePwm = Math.round(
        (brilhoPercentual / 100) * 255
    );

    try {

        await fetch(BACKEND_URL, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                led_index: indice,
                estado,
                intensidade: intensidadePwm
            })
        });

    } catch (erro) {

        console.error(
            "Erro de conexão com o backend:",
            erro
        );
    }
}

/* =========================
   UI
========================= */

function atualizarLamp(room) {

    const lamp = document.querySelector(`#${room} .lamp`);
    const card = document.getElementById(room);

    const intensity = rooms[room].brightness;

    if (rooms[room].ligado) {

        lamp.classList.add("on");
        card.classList.add("active");

        lamp.style.background =
            `rgba(255, 235, 59, ${intensity / 100})`;

        return;
    }

    lamp.classList.remove("on");

    card.classList.remove("active");

    lamp.style.background = "#1e293b";
}

function atualizarUIRoom(room) {

    const roomElement = document.getElementById(room);

    const button = roomElement.querySelector("button");
    const input = roomElement.querySelector("input");

    const valor = document.getElementById(`${room}Valor`);

    button.textContent =
        rooms[room].ligado
            ? "Desligar"
            : "Ligar";

    input.value = rooms[room].brightness;

    valor.textContent =
        `${rooms[room].brightness}%`;
}

function atualizarSliderGeral(value) {

    const sliderGeral = document.querySelector(
        'input[oninput*="setAllBrightness"]'
    );

    const valorGeral =
        document.getElementById("geralValor");

    if (sliderGeral) {
        sliderGeral.value = value;
    }

    valorGeral.textContent = `${value}%`;
}

/* =========================
   CONTROLES INDIVIDUAIS
========================= */

function toggleRoom(room) {

    rooms[room].ligado =
        !rooms[room].ligado;

    rooms[room].brightness =
        rooms[room].ligado ? 100 : 0;

    atualizarUIRoom(room);
    atualizarLamp(room);
    atualizarGlobalStatus();

    enviarParaBackend(
        mapaLeds[room],
        rooms[room].ligado,
        rooms[room].brightness
    );
}

function setBrightness(room, value) {

    value = Number(value);

    rooms[room].brightness = value;
    rooms[room].ligado = value > 0;

    atualizarUIRoom(room);
    atualizarLamp(room);
    atualizarGlobalStatus();

    enviarParaBackend(
        mapaLeds[room],
        rooms[room].ligado,
        value
    );
}

/* =========================
   CONTROLES GERAIS
========================= */

function ligarTodas() {

    const brilho = 100;

    atualizarSliderGeral(brilho);

    for (const room in rooms) {

        rooms[room].ligado = true;
        rooms[room].brightness = brilho;

        atualizarUIRoom(room);
        atualizarLamp(room);
    }

    atualizarGlobalStatus();

    enviarParaBackend(-1, true, brilho);
}

function desligarTodas() {

    const brilho = 0;

    atualizarSliderGeral(brilho);

    for (const room in rooms) {

        rooms[room].ligado = false;
        rooms[room].brightness = brilho;

        atualizarUIRoom(room);
        atualizarLamp(room);
    }

    atualizarGlobalStatus();

    enviarParaBackend(-1, false, brilho);
}

function setAllBrightness(value) {

    value = Number(value);

    atualizarSliderGeral(value);

    for (const room in rooms) {

        rooms[room].brightness = value;
        rooms[room].ligado = value > 0;

        atualizarUIRoom(room);
        atualizarLamp(room);
    }

    atualizarGlobalStatus();

    enviarParaBackend(
        -1,
        value > 0,
        value
    );
}

/* =========================
   STATUS GLOBAL
========================= */

function atualizarGlobalStatus() {

    const globalLamp =
        document.getElementById("globalLamp");

    const globalStatus =
        document.getElementById("globalStatus");

    const comodosLigados = Object.keys(rooms)
        .filter(room => rooms[room].ligado);

    const totalComodos =
        Object.keys(rooms).length;

    // Nenhum ligado
    if (comodosLigados.length === 0) {

        globalLamp.classList.remove("on");

        globalLamp.style.background = "#1e293b";

        globalStatus.textContent =
            "Todas luzes desligadas";

        return;
    }

    // Todos ligados
    if (comodosLigados.length === totalComodos) {

        globalLamp.classList.add("on");

        globalLamp.style.background =
            "rgba(255, 235, 59, 0.9)";

        globalStatus.textContent =
            "Todas luzes ligadas";

        return;
    }

    // Alguns ligados
    globalLamp.classList.add("on");

    globalLamp.style.background =
        "rgba(255, 235, 59, 0.5)";

    const nomesBonitos = comodosLigados
        .map(nome =>
            nome.charAt(0).toUpperCase() +
            nome.slice(1)
        )
        .join(", ");

    globalStatus.textContent =
        `Luzes acesas: ${nomesBonitos}`;
}