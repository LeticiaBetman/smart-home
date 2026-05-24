# 🏠 Smart Home Control

Sistema web para controle inteligente de iluminação residencial integrado com **ESP32** e **Node.js**.

O projeto permite controlar luzes individuais de diferentes cômodos, ajustar intensidade luminosa e realizar comandos globais de forma moderna, responsiva e intuitiva.

---

# ✨ Funcionalidades

- ✅ Controle individual de cômodos
- ✅ Controle global de todas as luzes
- ✅ Ajuste de intensidade (brightness)
- ✅ Interface moderna com efeito glassmorphism
- ✅ Integração com ESP32 via Backend Node.js
- ✅ Atualização dinâmica da interface
- ✅ Indicador visual de status das luzes
- ✅ Responsivo para desktop e mobile
- ✅ Ícones modernos com Lucide Icons

---

# 🖥️ Preview

O sistema possui:

- Dashboard principal
- Status geral das luzes
- Controle global
- Cards individuais para cada cômodo
- Feedback visual de iluminação ativa

---

# 🚀 Tecnologias Utilizadas

## Frontend

- HTML5
- CSS3
- JavaScript Vanilla
- Lucide Icons

## Backend

- Node.js
- Express

## Hardware

- ESP32
- LEDs PWM

---

# 📁 Estrutura do Projeto

```bash
smart-home-control/
│
├── assets/
│   └── logo.png
│
├── css/
│   └── style.css
│
├── js/
│   └── script.js
│
├── index.html
│
└── README.md
```

---

# ⚙️ Como Executar o Projeto

## 1️⃣ Clone o repositório

```bash
git clone https://github.com/seu-usuario/smart-home-control.git
```

---

## 2️⃣ Acesse a pasta do projeto

```bash
cd smart-home-control
```

---

## 3️⃣ Execute o projeto

Basta abrir o arquivo:

```bash
index.html
```

Ou utilize a extensão:

- Live Server (VSCode)

---

# 🔌 Configuração do Backend

O frontend se comunica com o backend através da URL:

```javascript
const BACKEND_URL = "http://localhost:3000/comando";
```

Certifique-se de que seu servidor Node.js esteja rodando na porta:

```bash
3000
```

---

# 📡 Comunicação com ESP32

O sistema envia requisições POST contendo:

```json
{
  "led_index": 0,
  "estado": true,
  "intensidade": 255
}
```

---

# 💡 Controle dos LEDs

| Cômodo   | Índice LED |
|----------|------------|
| Sala     | 0 |
| Cozinha  | 1 |
| Quarto   | 2 |
| Varanda  | 3 |
| Banheiro | 4 |

---

# 🎨 Interface

O projeto utiliza:

- Glassmorphism
- Gradientes modernos
- Sombras suaves
- Ícones SVG dinâmicos
- Layout responsivo

---

# 📱 Responsividade

O sistema se adapta automaticamente para:

- Desktop
- Tablets
- Smartphones

---

# 🧠 Conceitos Aplicados

- Manipulação de DOM
- Eventos JavaScript
- Responsividade
- Integração Frontend + Backend
- Comunicação HTTP
- Controle de estado
- Organização de código
- UI/UX

---

# 👩‍💻 Desenvolvido por

**Letícia Betman**

Projeto desenvolvido para estudos de:

- Frontend
- IoT
- Integração com ESP32
- Interfaces inteligentes