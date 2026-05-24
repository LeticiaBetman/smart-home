const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

const ESP32_IP = "http://172.20.10.2";

app.post("/comando", async (req, res) => {
    const { led_index, estado, intensidade } = req.body;

    console.log(`Recebido do Front: LED ${led_index}, Estado: ${estado}, Brilho: ${intensidade}`);

    try {
        // Envia o comando via Wi-Fi para a rota /controle do ESP32
        const resposta = await axios.post(`${ESP32_IP}/controle`, {
            led_index: led_index,
            estado: estado,
            intensidade: intensidade
        });

        console.log("Resposta do ESP32:", resposta.data);
        res.send("Comando enviado via Wi-Fi com sucesso!");

    } catch (error) {
        console.error("Erro ao falar com o ESP32:", error.message);
        res.status(500).send("O ESP32 não respondeu na rede.");
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Configurado para controlar o ESP32 em: ${ESP32_IP}`);
});