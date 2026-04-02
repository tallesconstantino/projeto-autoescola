// ---- Controle de Login ----
document.addEventListener('DOMContentLoaded', () => {
    const loginSection = document.getElementById('loginSection');
    const homeSection = document.getElementById('homeSection');
    const logoutBtn = document.getElementById('logoutBtn');
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');

    const validEmail = "tallesconstantino7@gmail.com";
    const validPassword = "21032006";

    // Verificar se já está logado
    if (sessionStorage.getItem('loggedIn') === 'true') {
        loginSection.classList.add('hidden');
        homeSection.classList.remove('hidden');
        logoutBtn.classList.remove('hidden');
        initMap();
    }

    // Ação de login
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        if (email === validEmail && password === validPassword) {
            sessionStorage.setItem('loggedIn', 'true');
            loginSection.classList.add('hidden');
            homeSection.classList.remove('hidden');
            logoutBtn.classList.remove('hidden');
            loginError.style.display = 'none';
            initMap();
        } else {
            loginError.style.display = 'block';
        }
    });

    // Ação de logout
    logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem('loggedIn');
        location.reload();
    });
});

// Inicializar mapa com trajeto estendido
function initMap() {
    const map = L.map('map').setView([-22.1165, -45.0545], 16);

    const streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    });

    const satellite = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { attribution: '© Esri' }
    );

    L.control.layers({ Ruas: streets, Satélite: satellite }).addTo(map);
    streets.addTo(map);

    // --- NOVO TRAJETO COM CURVAS ACENTUADAS E RETAS PERFEITAS ---
    // Todos os pontos seguem ruas reais sem cortar casas.

    const route = [
        [-22.11550, -45.05280], // 1 – início em reta (Wenceslau Braz)
        [-22.11630, -45.05370], // 2 – reta longa para desenvolver 2ª
        [-22.11695, -45.05470], // 3 – curva forte à direita (esquina real)
        [-22.11780, -45.05475], // 4 – reta longa adequada para 2ª marcha
        [-22.11860, -45.05500], // 5 – curva acentuada à esquerda (controle embreagem)
        [-22.11910, -45.05590], // 6 – reta curta (retomar 2ª)
        [-22.11980, -45.05685], // 7 – reta longa (3ª marcha)
        [-22.12040, -45.05740], // 8 – curva suave à esquerda
        [-22.12110, -45.05820], // 9 – curva forte + parada (PARE)
        [-22.12180, -45.05910]  // 10 – reta final, parar perto do meio-fio
    ];

    // Instruções originais mantidas 100%
    const steps = [
        '1: Ajuste retrovisores, desative freio de mão, inicie carro, sinalize e comece na 1ª marcha.',
        '2: Desenvolva para 2ª marcha e siga reto.',
        '3: Sinalize, pare na placa "PARE", coloque 1ª marcha, olhe os lados e vire à direita.',
        '4: Desenvolva para 2ª marcha e siga em frente.',
        '5: Dê seta, reduza para 1ª, parada para controle de embreagem, sinalize e prossiga.',
        '6: Desenvolva para 2ª marcha novamente.',
        '7: Desenvolva para 3ª marcha (trecho mais longo).',
        '8: Reduza para 2ª marcha em curva suave à esquerda.',
        '9: Sinalize, pare na placa "PARE", reduza para 1ª, olhe lados e vire novamente.',
        '10: Desenvolva para 2ª, sinalize e pare próximo ao meio-fio. Finalize e ative o freio de mão.'
    ];

    L.polyline(route, { color: 'blue', weight: 5 }).addTo(map);

    route.forEach((point, i) => {
        L.marker(point).addTo(map).bindPopup(
            `<strong>Passo ${i + 1}</strong><br>${steps[i]}`
        );
    });
}

let miniMap = null;
let miniMapMarker = null;

function initMiniMap() {
    // Criar minimapa somente uma vez
    if (!miniMap) {
        miniMap = L.map('miniMap', {
            zoomControl: false,
            dragging: false,
            scrollWheelZoom: false,
            doubleClickZoom: false,
            boxZoom: false,
            keyboard: false,
            attributionControl: false
        }).setView([-22.1165, -45.0545], 15);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
            .addTo(miniMap);

        // Mesma rota do mapa principal
        const miniRoute = [
            [-22.11550, -45.05280],
            [-22.11630, -45.05370],
            [-22.11695, -45.05470],
            [-22.11780, -45.05475],
            [-22.11860, -45.05500],
            [-22.11910, -45.05590],
            [-22.11980, -45.05685],
            [-22.12040, -45.05740],
            [-22.12110, -45.05820],
            [-22.12180, -45.05910]
        ];

        L.polyline(miniRoute, { color: "red", weight: 3 }).addTo(miniMap);

        // Criar marcador azul de posição do carro
        miniMapMarker = L.circleMarker(miniRoute[0], {
            radius: 6,
            color: "blue",
            fillColor: "cyan",
            fillOpacity: 1
        }).addTo(miniMap);
    }
}

// Botões do simulador
document.getElementById('simulatorBtn').addEventListener('click', function() {
    document.getElementById('homeSection').classList.add('hidden');
    document.getElementById('simulatorSection').classList.remove('hidden');
    initMiniMap();
    startSimulator();
});

document.getElementById('backToHomeBtn').addEventListener('click', function() {
    document.getElementById('simulatorSection').classList.add('hidden');
    document.getElementById('homeSection').classList.remove('hidden');
});

// Botão de resetar simulador
document.getElementById('resetSimulatorBtn').addEventListener('click', function() {
    startSimulator(); // Reinicia todo o simulador
});

// Botão tela cheia
document.getElementById('fullscreenBtn').addEventListener('click', function() {
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
    }
});

// Botão toggle instruções
document.getElementById('toggleInstructionsBtn').addEventListener('click', function() {
    const instructions = document.getElementById('simulatorInstructions');
    instructions.classList.toggle('hidden');
});

// Simulador com marchas e trajeto sequencial
const canvas = document.getElementById('simulatorCanvas');
const ctx = canvas.getContext('2d');
let carState = {
    speed: 0, angle: 0, gear: 'N', handbrake: true, seatbelt: false,
    turnSignal: null,
    pedals: { accelerator: false, brake: false, clutch: false }
};
let roadOffset = 0;
let checkpoints = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]; // 10 checkpoints
let passedCheckpoints = [false, false, false, false, false, false, false, false, false, false];
let examFailed = false;
let currentStep = 0; // Passo atual do exame
const steps = [
    'Ajuste retrovisores, desative freio de mão, inicie carro, sinalize e comece na 1ª marcha.',
    'Desenvolva para 2ª marcha e siga reto.',
    'Sinalize, pare na placa "pare", coloque 1ª marcha, olhe lados e vire.',
    'Desenvolva para 2ª marcha.',
    'Dê seta, reduza para 1ª, parada para controle de embreagem, sinalize e prossiga.',
    'Desenvolva para 2ª marcha.',
    'Desenvolva para 3ª marcha.',
    'Reduza para 2ª marcha.',
    'Sinalize, pare na placa "pare", reduza para 1ª, olhe lados e vire.',
    'Desenvolva para 2ª, sinalize e pare próximo ao meio-fio. Finalize e ative freio.'
];

document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

function handleKeyDown(e) {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
    }
    if (e.key === 'z') carState.pedals.accelerator = true;
    if (e.key === 'x') carState.pedals.brake = true;
    if (e.key === 'c') carState.pedals.clutch = true;
    if (e.key === 'ArrowLeft') carState.angle = Math.max(carState.angle - 0.05, -0.5);
    if (e.key === 'ArrowRight') carState.angle = Math.min(carState.angle + 0.05, 0.5);
    if (e.key === 'ArrowUp') carState.turnSignal = 'right';
    if (e.key === 'ArrowDown') carState.turnSignal = 'left';
    if (e.key === 'f') carState.handbrake = !carState.handbrake;
    if (e.key === 'r' || e.key === 'R') carState.gear = 'R';
    if (e.key === '1') carState.gear = 1;
    if (e.key === '2') carState.gear = 2;
    if (e.key === '3') carState.gear = 3;
    if (e.key === '4') carState.gear = 4;
    if (e.key === 'Escape') {
        document.getElementById('simulatorSection').classList.add('hidden');
        document.getElementById('homeSection').classList.remove('hidden');
    }
}

function handleKeyUp(e) {
    if (e.key === 'z') carState.pedals.accelerator = false;
    if (e.key === 'x') carState.pedals.brake = false;
    if (e.key === 'c') carState.pedals.clutch = false;
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') carState.turnSignal = null;
}

function startSimulator() {
    carState = { speed: 0, angle: 0, gear: 'N', handbrake: true, seatbelt: false, turnSignal: null, pedals: { accelerator: false, brake: false, clutch: false } };
    roadOffset = 0;
    passedCheckpoints = [false, false, false, false, false, false, false, false, false, false];
    examFailed = false;
    currentStep = 0;
    updateSimulator();
}

function updateSimulator() {
    // Lógica de velocidade baseada na marcha
    let accelFactor = 0;
    if (carState.pedals.accelerator && carState.pedals.clutch) {
        if (carState.gear === 1) accelFactor = 0.2;
        else if (carState.gear === 2) accelFactor = 0.4;
        else if (carState.gear === 3) accelFactor = 0.6;
        else if (carState.gear === 4) accelFactor = 0.8;
        else if (carState.gear === 'R') accelFactor = -0.3; // Ré
    }
    carState.speed = Math.max(carState.speed + accelFactor, carState.gear === 'R' ? -10 : 0);
    if (carState.pedals.brake) carState.speed = Math.max(carState.speed - 1, 0);
    if (carState.handbrake) carState.speed = 0;
    roadOffset += carState.speed * 0.1;

	// --- ATUALIZA O PONTINHO NO MINIMAPA ---
	// Encontrar qual checkpoint está mais próximo do carro
	let nearest = 0;
	let smallestDist = Infinity;

	checkpoints.forEach((cp, i) => {
    		const dist = Math.abs(roadOffset - cp);
    		if (dist < smallestDist) {
       			 smallestDist = dist;
      			  nearest = i;
    			}
	});

	// Atualiza posição no minimapa
	if (miniMap && miniMapMarker) {
  		  const miniRoute = [
        		    [-22.11550, -45.05280],
        		    [-22.11630, -45.05370],
     			    [-22.11695, -45.05470],
    			    [-22.11780, -45.05475],
    			    [-22.11860, -45.05500],
        		    [-22.11910, -45.05590],
        		    [-22.11980, -45.05685],
     			    [-22.12040, -45.05740],
    			    [-22.12110, -45.05820],
    			    [-22.12180, -45.05910]
   		 ];

   		 miniMapMarker.setLatLng(miniRoute[nearest]);
    		 miniMap.setView(miniRoute[nearest], miniMap.getZoom());
	}

    // Lógica sequencial do exame
    if (!carState.seatbelt) {
        document.getElementById('simulatorStatus').textContent = 'Status: Coloque o cinto! Pressione C.';
        if (carState.pedals.clutch) carState.seatbelt = true;
    } else {
        document.getElementById('simulatorStatus').textContent = `Passo ${currentStep + 1}: ${steps[currentStep]}`;
        // Verificações por passo (simplificadas para protótipo)
        if (currentStep === 0 && !carState.handbrake && carState.gear === 1 && carState.turnSignal) {
            currentStep++;
        } else if (currentStep === 1 && carState.gear === 2 && roadOffset > checkpoints[1]) {
            currentStep++;
        } else if (currentStep === 2 && carState.speed === 0 && carState.gear === 1 && carState.turnSignal) {
            currentStep++;
        } else if (currentStep === 3 && carState.gear === 2) {
            currentStep++;
        } else if (currentStep === 4 && carState.speed === 0 && carState.gear === 1 && carState.turnSignal) {
            currentStep++;
        } else if (currentStep === 5 && carState.gear === 2) {
            currentStep++;
        } else if (currentStep === 6 && carState.gear === 3) {
            currentStep++;
        } else if (currentStep === 7 && carState.gear === 2) {
            currentStep++;
        } else if (currentStep === 8 && carState.speed === 0 && carState.gear === 1 && carState.turnSignal) {
            currentStep++;
        } else if (currentStep === 9 && carState.gear === 2 && carState.speed === 0 && carState.handbrake) {
            document.getElementById('simulatorStatus').textContent = 'Status: Exame aprovado!';
            return;
        }
        if (Math.abs(carState.angle) > 0.3) examFailed = true;
        if (examFailed) {
            document.getElementById('simulatorStatus').textContent = 'Status: Exame falhado!';
            return;
        }
    }

    drawSimulator();
    requestAnimationFrame(updateSimulator);
}

function drawSimulator() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fundo (interior do carro)
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // ---- Movimentação da câmera lateral com base na direção do volante ----
    // Se o ângulo for positivo (→), desloca a visão para a esquerda, e vice-versa
    const cameraShift = carState.angle * 150; // quanto maior, mais nítido o desvio

    // Céu com sol
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(150 + cameraShift, 50, 700, 150);
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(800 + cameraShift, 100, 40, 0, 2 * Math.PI);
    ctx.fill();

    // Horizonte com prédios
    ctx.fillStyle = '#666';
    for (let i = 0; i < 8; i++) {
        const x = 150 + i * 80 + cameraShift;
        const h = 60 + Math.random() * 40;
        ctx.fillRect(x, 200 - h, 70, h);
        ctx.fillStyle = '#fff';
        for (let j = 0; j < 3; j++) {
            ctx.fillRect(x + 10, 200 - h + 10 + j * 15, 10, 10);
        }
        ctx.fillStyle = '#666';
    }

    // Postes e sinais
    ctx.fillStyle = '#888';
    ctx.fillRect(300 + cameraShift, 150, 10, 50);
    ctx.fillRect(600 + cameraShift, 150, 10, 50);
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.arc(305 + cameraShift, 140, 8, 0, 2 * Math.PI);
    ctx.fill();

    // Estrada principal
    ctx.fillStyle = '#555';
    ctx.fillRect(150 + cameraShift, 200, 700, 150);

    // Faixa central
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 5;
    ctx.setLineDash([20, 20]);
    ctx.beginPath();
    ctx.moveTo(500 + cameraShift, 200);
    ctx.lineTo(500 + cameraShift, 350);
    ctx.stroke();
    ctx.setLineDash([]);

    // Carros parados (cenário)
    ctx.fillStyle = '#f00';
    ctx.fillRect(250 + cameraShift, 250, 40, 20);
    ctx.fillStyle = '#00f';
    ctx.fillRect(650 + cameraShift, 270, 40, 20);

    // Grama lateral
    ctx.fillStyle = '#228B22';
    ctx.fillRect(150 + cameraShift, 350, 350, 50);
    ctx.fillRect(500 + cameraShift, 350, 350, 50);

    // Checkpoints
    ctx.fillStyle = 'green';
    checkpoints.forEach((cp, i) => {
        if (!passedCheckpoints[i]) {
            const y = 350 - (cp - roadOffset) * 2;
            if (y > 200 && y < 350) ctx.fillRect(480 + cameraShift, y, 40, 20);
        }
    });

    // Painel
    ctx.fillStyle = '#000';
    ctx.fillRect(200, 450, 600, 150);
    ctx.fillStyle = '#fff';
    ctx.font = '16px Arial';
    ctx.fillText(`Velocímetro: ${Math.round(carState.speed)} km/h`, 220, 480);
    ctx.fillText(`Tacômetro: ${carState.gear}`, 220, 500);
    ctx.fillText(`Freio de Mão: ${carState.handbrake ? 'Ligado' : 'Desligado'}`, 420, 480);
    ctx.fillText(`Cinto: ${carState.seatbelt ? 'Colocado' : 'Não'}`, 420, 500);
    ctx.fillText(`Seta: ${carState.turnSignal || 'Nenhuma'}`, 620, 480);

    // ---- Volante gira conforme o ângulo ----
    ctx.save();
    ctx.translate(500, 350);
    ctx.rotate(carState.angle * 2);
    ctx.beginPath();
    ctx.arc(0, 0, 80, 0, 2 * Math.PI);
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 10;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, 20, 0, 2 * Math.PI);
    ctx.fillStyle = '#000';
    ctx.fill();
    ctx.restore();

    // Retrovisores
    ctx.fillStyle = '#000';
    ctx.fillRect(50, 150, 100, 80);
    ctx.fillRect(850, 150, 100, 80);
    ctx.fillStyle = '#fff';
    ctx.font = '12px Arial';
    ctx.fillText('Retrovisor Esq.', 60, 180);
    ctx.fillText('Retrovisor Dir.', 860, 180);
}
