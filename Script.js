"use strict";

/* =========================================================
   PIXEL SPEED RUN
   JOGO 2D - HTML + CSS + JAVASCRIPT PURO
   ========================================================= */

const canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");

ctx.imageSmoothingEnabled = true;


/* =========================================================
   SALVAMENTO
   ========================================================= */

const saveKey = "pixelSpeedRunSaveV5";

const defaultSave = {
    totalPoints: 0,
    totalCoins: 0,
    unlockedSkins: ["green"],

    selectedSkin: "green",

    records: {
        easy: 0,
        medium: 0,
        hard: 0
    },

    achievements: {
        firstFinish: false,
        collector: false,
        speedster: false,
        survivor: false,
        mediumFinish: false,
        hardFinish: false
    },

    settings: {
        theme: "dark",
        fontSize: "normal",
        highContrast: false,
        colorBlindMode: false,
        visualAlerts: true,
        eventText: true,
        onScreenControls: false
    }
};


function cloneDefault() {
    return JSON.parse(JSON.stringify(defaultSave));
}


function loadSave() {
    try {
        const data = JSON.parse(localStorage.getItem(saveKey));

        if (!data) {
            return cloneDefault();
        }

        const unlockedSkins = Array.isArray(data.unlockedSkins)
            ? [...new Set(["green", ...data.unlockedSkins])]
            : ["green", data.selectedSkin || "green"];

        const selectedSkin = unlockedSkins.includes(data.selectedSkin)
            ? data.selectedSkin
            : "green";

        return {
            ...cloneDefault(),
            ...data,
            selectedSkin,
            totalCoins: Number.isFinite(data.totalCoins)
                ? data.totalCoins
                : 0,
            unlockedSkins,
            records: {
                ...defaultSave.records,
                ...(data.records || {})
            },
            achievements: {
                ...defaultSave.achievements,
                ...(data.achievements || {})
            },
            settings: {
                ...defaultSave.settings,
                ...(data.settings || {})
            }
        };
    } catch {
        return cloneDefault();
    }
}


let save = loadSave();


function saveGame() {

    localStorage.setItem(
        saveKey,
        JSON.stringify(save)
    );
}


/* Salva o progresso quando o jogador fecha, recarrega ou sai da página. */
window.addEventListener(
    "pagehide",
    saveGame
);

window.addEventListener(
    "beforeunload",
    saveGame
);


/* =========================================================
   TELAS
   ========================================================= */

function showScreen(id) {

    document.querySelectorAll(
        ".screen"
    ).forEach(screen => {

        screen.classList.remove(
            "active"
        );

    });

    const screen =
        document.getElementById(id);

    if (screen) {

        screen.classList.add(
            "active"
        );
    }
}


const playBtn =
    document.getElementById("playBtn");

if (playBtn) {

    playBtn.onclick = () => {

        showScreen(
            "difficultyScreen"
        );
    };
}


const skinsBtn =
    document.getElementById("skinsBtn");

if (skinsBtn) {

    skinsBtn.onclick = () => {

        updateSkinsScreen();

        showScreen(
            "skinsScreen"
        );
    };
}


const recordsBtn =
    document.getElementById("recordsBtn");

if (recordsBtn) {

    recordsBtn.onclick = () => {

        updateRecordsScreen();

        showScreen(
            "recordsScreen"
        );
    };
}


const achievementsBtn =
    document.getElementById("achievementsBtn");

if (achievementsBtn) {

    achievementsBtn.onclick = () => {

        updateAchievementsScreen();

        showScreen(
            "achievementsScreen"
        );
    };
}


const accessibilityBtn =
    document.getElementById(
        "accessibilityBtn"
    );

if (accessibilityBtn) {

    accessibilityBtn.onclick = () => {

        applySettings();

        showScreen(
            "accessibilityScreen"
        );
    };
}


const creatorBtn =
    document.getElementById("creatorBtn");

if (creatorBtn) {

    creatorBtn.onclick = () => {

        showScreen(
            "creatorScreen"
        );
    };
}


const exitBtn =
    document.getElementById("exitBtn");

if (exitBtn) {

    exitBtn.onclick = () => {

        saveGame();

        window.close();


        setTimeout(
            () => {

                const overlay =
                    document.getElementById(
                        "exitOverlay"
                    );


                if (overlay) {

                    overlay.classList.add(
                        "visible"
                    );


                    const backBtn =
                        document.getElementById(
                            "exitBackBtn"
                        );


                    if (backBtn) {

                        backBtn.focus();
                    }
                }
            },
            350
        );
    };
}


const exitBackBtn =
    document.getElementById(
        "exitBackBtn"
    );

if (exitBackBtn) {

    exitBackBtn.onclick = () => {

        const overlay =
            document.getElementById(
                "exitOverlay"
            );


        if (overlay) {

            overlay.classList.remove(
                "visible"
            );
        }
    };
}


document.querySelectorAll(
    "[data-back]"
).forEach(button => {

    button.onclick = () => {

        showScreen(
            button.dataset.back
        );
    };

});


/* =========================================================
   FUNÇÕES SEGURAS PARA EVENTOS
   ========================================================= */

function setClick(id, callback) {

    const element =
        document.getElementById(id);

    if (element) {

        element.onclick =
            callback;
    }
}


function setChange(id, callback) {

    const element =
        document.getElementById(id);

    if (element) {

        element.onchange =
            callback;
    }
}


/* =========================================================
   ACESSIBILIDADE
   ========================================================= */

save.settings =
    save.settings || {};


save.settings.theme =
    save.settings.theme || "dark";


save.settings.fontSize =
    ["normal", "large", "xlarge"].includes(save.settings.fontSize)
        ? save.settings.fontSize
        : "normal";


save.settings.highContrast =
    Boolean(
        save.settings.highContrast
    );


save.settings.colorBlindMode =
    Boolean(
        save.settings.colorBlindMode
    );


save.settings.visualAlerts =
    save.settings.visualAlerts !== false;


save.settings.eventText =
    save.settings.eventText !== false;


save.settings.onScreenControls =
    Boolean(save.settings.onScreenControls);


/* =========================================================
   APLICAR CONFIGURAÇÕES
   ========================================================= */

function applySettings() {

    document.body.classList.toggle(
        "high-contrast",
        save.settings.highContrast
    );


    document.body.classList.toggle(
        "color-blind-mode",
        save.settings.colorBlindMode
    );


    document.body.classList.remove(
        "font-normal",
        "font-large",
        "font-xlarge"
    );


    document.body.classList.add(
        "font-" +
        save.settings.fontSize
    );


    document.body.classList.toggle(
        "light-mode",
        save.settings.theme === "light"
    );


    document.body.classList.toggle(
        "show-accessible-controls",
        save.settings.onScreenControls
    );


    const highContrast =
        document.getElementById(
            "highContrast"
        );

    if (highContrast) {

        highContrast.checked =
            save.settings.highContrast;
    }


    const colorBlindMode =
        document.getElementById(
            "colorBlindMode"
        );

    if (colorBlindMode) {

        colorBlindMode.checked =
            save.settings.colorBlindMode;
    }


    const visualAlerts =
        document.getElementById(
            "visualAlerts"
        );

    if (visualAlerts) {

        visualAlerts.checked =
            save.settings.visualAlerts;
    }


    const eventText =
        document.getElementById(
            "eventText"
        );

    if (eventText) {

        eventText.checked =
            save.settings.eventText;
    }


    const fontSizeSelect =
        document.getElementById("fontSizeSelect");

    if (fontSizeSelect) {
        fontSizeSelect.value = save.settings.fontSize;
    }


    const onScreenControls =
        document.getElementById("onScreenControls");

    if (onScreenControls) {
        onScreenControls.checked = save.settings.onScreenControls;
    }


    const tutorialOnScreenControls =
        document.getElementById(
            "tutorialOnScreenControls"
        );

    if (tutorialOnScreenControls) {
        tutorialOnScreenControls.checked =
            save.settings.onScreenControls;
    }
}


/* =========================================================
   MODO CLARO
   ========================================================= */

setClick(
    "lightModeBtn",
    () => {

        save.settings.theme =
            "light";

        save.settings.highContrast =
            false;

        saveGame();

        applySettings();
    }
);


/* =========================================================
   MODO ESCURO
   ========================================================= */

setClick(
    "darkModeBtn",
    () => {

        save.settings.theme =
            "dark";

        saveGame();

        applySettings();
    }
);


/* =========================================================
   ALTO CONTRASTE
   ========================================================= */

setChange(
    "highContrast",
    event => {

        save.settings.highContrast =
            event.target.checked;

        if (
            save.settings.highContrast
        ) {

            save.settings.theme =
                "dark";
        }

        saveGame();

        applySettings();
    }
);


/* =========================================================
   MODO DALTONISMO
   ========================================================= */

setChange(
    "colorBlindMode",
    event => {

        save.settings.colorBlindMode =
            event.target.checked;

        saveGame();

        applySettings();
    }
);


/* =========================================================
   ALERTAS VISUAIS
   ========================================================= */

setChange(
    "visualAlerts",
    event => {

        save.settings.visualAlerts =
            event.target.checked;

        saveGame();
    }
);


/* =========================================================
   TEXTO DOS EVENTOS
   ========================================================= */

setChange(
    "eventText",
    event => {

        save.settings.eventText =
            event.target.checked;

        saveGame();
    }
);


/* =========================================================
   TAMANHO DA LETRA
   ========================================================= */

setChange(
    "fontSizeSelect",
    event => {
        const selected = event.target.value;

        if (!["normal", "large", "xlarge"].includes(selected)) {
            return;
        }

        save.settings.fontSize = selected;
        saveGame();
        applySettings();
    }
);


setChange(
    "onScreenControls",
    event => {
        save.settings.onScreenControls = event.target.checked;
        saveGame();
        applySettings();
    }
);


setChange(
    "tutorialOnScreenControls",
    event => {
        save.settings.onScreenControls = event.target.checked;
        saveGame();
        applySettings();
    }
);


/* =========================================================
   ALERTA VISUAL
   ========================================================= */

let visualEventTimeout =
    null;


function showVisualEvent(message) {

    if (!save.settings.visualAlerts) {

        return;
    }


    let eventBox =
        document.getElementById(
            "visualEvent"
        );


    if (!eventBox) {

        eventBox =
            document.createElement(
                "div"
            );

        eventBox.id =
            "visualEvent";

        document.body.appendChild(
            eventBox
        );


        Object.assign(
            eventBox.style,
            {

                position: "fixed",

                top: "82px",

                left: "50%",

                transform:
                    "translateX(-50%)",

                minWidth: "240px",

                maxWidth: "80%",

                padding:
                    "11px 18px",

                background:
                    "rgba(12,20,31,0.94)",

                border:
                    "2px solid #8fe4ff",

                color: "#ffffff",

                textAlign: "center",

                fontSize: "13px",

                fontWeight: "800",

                boxShadow:
                    "0 8px 25px rgba(0,0,0,0.35)",

                zIndex: "1000",

                opacity: "0",

                pointerEvents: "none",

                transition:
                    "opacity 0.2s"
            }
        );
    }


    eventBox.setAttribute("role", "status");
    eventBox.setAttribute("aria-live", "polite");
    eventBox.setAttribute("aria-label", message);

    eventBox.textContent =
        save.settings.eventText ? message : "●";

    eventBox.style.opacity =
        "1";


    clearTimeout(
        visualEventTimeout
    );


    visualEventTimeout =
        setTimeout(
            () => {

                eventBox.style.opacity =
                    "0";

            },
            1800
        );
}


/* =========================================================
   SKINS
   ========================================================= */

const skins = [

    {
        id: "green",
        name: "Uniforme Escolar",
        cost: 0,
        shirt: "#f5f8fb",
        pants: "#1765aa",
        hair: "#30241e",
        accent: "#9fe8ff",
        model: "school",
        role: "Uniforme oficial"
    },

    {
        id: "blue",
        name: "Atleta",
        cost: 100,
        shirt: "#e65a43",
        pants: "#293345",
        hair: "#34251f",
        accent: "#ffd166",
        model: "runner",
        role: "Aluno atleta"
    },

    {
        id: "red",
        name: "Professor de Ciências",
        cost: 220,
        shirt: "#edf5ef",
        pants: "#315564",
        hair: "#37291f",
        accent: "#58cbb3",
        model: "pilot",
        role: "Professor"
    },

    {
        id: "purple",
        name: "Músico",
        cost: 400,
        shirt: "#675078",
        pants: "#333044",
        hair: "#2b2025",
        accent: "#f29ac5",
        model: "ninja",
        role: "Aluno músico"
    },

    {
        id: "gold",
        name: "Representante de Turma",
        cost: 700,
        shirt: "#46705e",
        pants: "#354d47",
        hair: "#35251e",
        accent: "#f2cb6b",
        model: "guardian",
        role: "Representante de turma"
    },

    {
        id: "silver",
        name: "Aluno Inteligente",
        cost: 480,
        shirt: "#c7d8cf",
        pants: "#53686b",
        hair: "#657d77",
        accent: "#5bd6b1",
        model: "android",
        role: "Leitura e estudos"
    },

    {
        id: "cyan",
        name: "Artista",
        cost: 640,
        shirt: "#c97b59",
        pants: "#405158",
        hair: "#35251e",
        accent: "#f0c95d",
        model: "mechanic",
        role: "Aluno artista"
    },

    {
        id: "black",
        name: "Aluno Leitor",
        cost: 900,
        shirt: "#48556a",
        pants: "#303b49",
        hair: "#342823",
        accent: "#e9bd72",
        model: "shadow",
        role: "Leitura"
    }
];


function skinUnlocked(skin) {

    return (
        save.unlockedSkins.includes(
            skin.id
        )
    );
}


function drawSkinPreview(previewCanvas, skin) {

    const previewContext =
        previewCanvas.getContext("2d");

    const previousContext = ctx;


    ctx = previewContext;


    try {

        const width = previewCanvas.width;

        const height = previewCanvas.height;

        const scale = Math.min(
            width / 52,
            height / 74
        );


        ctx.clearRect(
            0,
            0,
            width,
            height
        );


        ctx.save();

        ctx.translate(
            width / 2,
            height * 0.55
        );

        ctx.scale(
            scale,
            scale
        );


        /* Sombra de contato para firmar o personagem no enquadramento. */
        ctx.fillStyle = "rgba(3, 14, 24, 0.34)";

        ctx.beginPath();

        ctx.ellipse(
            0,
            29,
            21,
            4,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();


        drawCharacter(
            skin,
            -19,
            -27,
            {
                facing: 1,
                frame: 0,
                anim: 0,
                idlePose: 1
            }
        );


        ctx.restore();

    } finally {

        ctx = previousContext;
    }
}


function updateSkinsScreen() {

    const display =
        document.getElementById(
            "totalPointsDisplay"
        );

    if (display) {

        display.textContent =
            save.totalCoins.toLocaleString(
                "pt-BR"
            );
    }


    const container =
        document.getElementById(
            "skinsContainer"
        );

    if (!container) {
        return;
    }


    container.innerHTML = "";


    skins.forEach(skin => {

        const unlocked =
            skinUnlocked(skin);

        const canBuy =
            save.totalCoins >= skin.cost;

        const isEquipped =
            save.selectedSkin === skin.id;


        const card =
            document.createElement(
                "div"
            );


        card.className =
            `skin-card model-${skin.model} ${
                unlocked ? "" : "locked"
            }${
                isEquipped ? " selected" : ""
            }`;


        card.innerHTML = `

            <div class="skin-stage">

                ${
                    isEquipped
                        ? '<span class="skin-flag">EM USO</span>'
                        : !unlocked
                            ? '<span class="skin-flag locked">BLOQUEADA</span>'
                            : ""
                }

                <canvas
                    class="skin-avatar"
                    width="320"
                    height="360"
                    role="img"
                    aria-label="Prévia do personagem ${skin.name}">
                </canvas>

            </div>

            <div class="skin-info">

                <span class="skin-model-tag">
                    ${skin.role}
                </span>

                <h3>
                    ${skin.name}
                </h3>

                <span class="skin-price ${unlocked ? "is-owned" : "is-locked"}">
                    ${
                        unlocked
                            ? (skin.cost === 0 ? "Padrão do jogo" : "Desbloqueada")
                            : `${skin.cost.toLocaleString("pt-BR")} moedas`
                    }
                </span>

                <button
                    class="skin-cta"
                    ${unlocked || canBuy ? "" : "disabled"}
                    ${!unlocked && !canBuy ? 'title="Moedas insuficientes"' : ""}>
                    ${
                        unlocked
                            ? (isEquipped ? "EQUIPADA" : "EQUIPAR")
                            : "COMPRAR"
                    }
                </button>

            </div>

        `;


        if (unlocked || canBuy) {

            const button =
                card.querySelector(
                    "button"
                );

            if (button) {

                button.onclick =
                    () => {

                        if (!skinUnlocked(skin)) {
                            if (save.totalCoins < skin.cost) {
                                return;
                            }

                            save.totalCoins -= skin.cost;
                            save.unlockedSkins.push(skin.id);
                        }

                        save.selectedSkin =
                            skin.id;

                        saveGame();

                        updateSkinsScreen();

                        showVisualEvent(
                            `Skin ${skin.name} equipada!`
                        );
                    };
            }
        }


        container.appendChild(
            card
        );


        drawSkinPreview(
            card.querySelector(
                ".skin-avatar"
            ),
            skin
        );

    });
}


/* =========================================================
   CONQUISTAS
   ========================================================= */

const achievements = [

    {
        id: "firstFinish",
        title: "Primeiro Passo",
        description:
            "Conclua sua primeira fase."
    },

    {
        id: "collector",
        title: "Caçador de Moedas",
        description:
            "Colete 10 moedas na mesma partida."
    },

    {
        id: "speedster",
        title: "Velocista",
        description:
            "Conclua uma fase em até 35 segundos."
    },

    {
        id: "survivor",
        title: "Sobrevivente",
        description:
            "Termine uma fase sem perder vidas."
    },

    {
        id: "mediumFinish",
        title: "Subindo o Nível",
        description:
            "Conclua uma fase no Médio."
    },

    {
        id: "hardFinish",
        title: "Mestre do Parkour",
        description:
            "Conclua uma fase no Difícil."
    }
];


function unlockAchievement(id) {

    if (
        save.achievements[id]
    ) {

        return;
    }


    save.achievements[id] =
        true;


    saveGame();


    const achievement =
        achievements.find(
            item =>
                item.id === id
        );


    if (achievement) {

        showVisualEvent(
            `🏆 ${achievement.title}`
        );
    }
}


function updateAchievementsScreen() {

    const container =
        document.getElementById(
            "achievementsContainer"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    achievements.forEach(
        achievement => {

            const unlocked =
                save.achievements[
                    achievement.id
                ];


            const element =
                document.createElement(
                    "div"
                );


            element.className =
                "achievement " +
                (
                    unlocked
                        ? "unlocked"
                        : "locked"
                );


            element.innerHTML = `

                <h3>

                    ${
                        unlocked
                            ? "★"
                            : "□"
                    }

                    ${achievement.title}

                </h3>

                <p>
                    ${achievement.description}
                </p>

            `;


            container.appendChild(
                element
            );

        }
    );
}


/* =========================================================
   RECORDES
   ========================================================= */

function updateRecordsScreen() {

    const easy =
        document.getElementById(
            "easyRecord"
        );

    const medium =
        document.getElementById(
            "mediumRecord"
        );

    const hard =
        document.getElementById(
            "hardRecord"
        );


    if (easy) {

        easy.textContent =
            save.records.easy.toLocaleString(
                "pt-BR"
            );
    }


    if (medium) {

        medium.textContent =
            save.records.medium.toLocaleString(
                "pt-BR"
            );
    }


    if (hard) {

        hard.textContent =
            save.records.hard.toLocaleString(
                "pt-BR"
            );
    }
}


/* =========================================================
   DIFICULDADES
   ========================================================= */

const difficulties = {

    easy: {

        name: "Fácil",

        speed: 0.92,

        gravity: 0.60,

        jump: -12.4,

        coyoteFrames: 12,

        invulnerabilityFrames: 100,

        hazardSpeed: 0.82,

        platformSpeed: 0.78,

        maxFallSpeed: 14
    },

    medium: {

        name: "Médio",

        speed: 1,

        gravity: 0.66,

        jump: -12.4,

        coyoteFrames: 8,

        invulnerabilityFrames: 75,

        hazardSpeed: 1,

        platformSpeed: 1,

        maxFallSpeed: 15
    },

    hard: {

        name: "Difícil",

        speed: 1.08,

        gravity: 0.72,

        jump: -12.4,

        coyoteFrames: 5,

        invulnerabilityFrames: 50,

        hazardSpeed: 1.2,

        platformSpeed: 1.18,

        maxFallSpeed: 17
    }
};


let selectedDifficulty =
    "easy";


document.querySelectorAll(
    ".difficulty-btn"
).forEach(button => {

    button.onclick = () => {

        selectedDifficulty =
            button.dataset.difficulty;

        startGame();
    };

});


/* =========================================================
   CENÁRIOS
   ========================================================= */

const themes = [

    {
        name: "FLORESTA",

        sky1: "#263d35",
        sky2: "#a9c88a",

        mountain: "#63775b",
        mountain2: "#3d5847",

        ground: "#344b38",
        grass: "#849e58",

        platform: "#64513a",
        platformTop: "#d5dc8e",

        wood: "#574734",

        accent: "#d9eb8b"
    },

    {
        name: "PARQUE",

        sky1: "#82b8ca",
        sky2: "#e9d6ad",

        mountain: "#82968b",
        mountain2: "#5b746a",

        ground: "#4c5c43",
        grass: "#87a45d",

        platform: "#715f49",
        platformTop: "#e5d8ae",

        wood: "#785b39",

        accent: "#f2c66d"
    },

    {
        name: "ESCOLA",

        sky1: "#99c5d4",
        sky2: "#efd4aa",

        mountain: "#969780",
        mountain2: "#77745f",

        ground: "#55574a",
        grass: "#98915f",

        platform: "#66736b",
        platformTop: "#e5c98f",

        wood: "#8c6646",

        accent: "#df8c56"
    },

    {
        name: "MONTANHA",

        sky1: "#78b4d2",
        sky2: "#e0e6dc",

        mountain: "#92a8ab",
        mountain2: "#566f78",

        ground: "#64715f",
        grass: "#dde6cf",

        platform: "#6b7773",
        platformTop: "#f1f3dc",

        wood: "#7c6042",

        accent: "#c5e9ed"
    },

    {
        name: "GALÁXIA",

        sky1: "#0a1b32",
        sky2: "#1d4650",

        mountain: "#396278",
        mountain2: "#183243",

        ground: "#142b37",
        grass: "#4f7f7a",

        platform: "#31505a",
        platformTop: "#aee5cb",

        wood: "#263d47",

        accent: "#ffb86b"
    },

    {
        name: "BASE LUNAR",

        sky1: "#17232d",
        sky2: "#657578",

        mountain: "#78858a",
        mountain2: "#46545b",

        ground: "#414b4a",
        grass: "#7c8580",

        platform: "#596761",
        platformTop: "#d4d6c6",

        wood: "#574c3e",

        accent: "#f0aa6e"
    }
];


function getCurrentTheme() {

    return themes[
        game.theme
    ];
}


/* =========================================================
   ESTADO DO JOGO
   ========================================================= */

const game = {

    running: false,

    paused: false,

    level: 0,

    score: 0,

    coins: 0,

    lives: 3,

    cameraX: 0,

    worldWidth: 4200,

    finishX: 3950,

    platforms: [],

    movingPlatforms: [],

    hazards: [],

    coinsObjects: [],

    decorations: [],

    levelStartTime: 0,

    theme: 0
};


const player = {

    x: 100,

    y: 400,

    width: 37,

    height: 60,

    vx: 0,

    vy: 0,

    maxSpeed: 4.2,

    acceleration: 0.55,

    onGround: false,

    wantJump: false,

    coyote: 0,

    facing: 1,

    invulnerable: 0,

    runFrame: 0
};


/* =========================================================
   CRIAÇÃO DE PLATAFORMAS
   ========================================================= */

function platform(
    x,
    y,
    w,
    h = 22
) {

    return {
        x,
        y,
        w,
        h
    };
}


/* =========================================================
   CRIAÇÃO DAS FASES
   ========================================================= */

function createLevel(level) {

    const platforms = [];

    const movingPlatforms = [];

    const hazards = [];

    const coins = [];

    const decorations = [];

    const groundY = 505;


    /* =====================================================
       GRANDES PLATAFORMAS
       ===================================================== */

    platforms.push(

        platform(
            0,
            groundY,
            650,
            95
        ),

        platform(
            820,
            groundY,
            390,
            95
        ),

        platform(
            1380,
            groundY,
            430,
            95
        ),

        platform(
            2020,
            groundY,
            360,
            95
        ),

        platform(
            2570,
            groundY,
            340,
            95
        ),

        platform(
            3180,
            groundY,
            340,
            95
        ),

        platform(
            3750,
            groundY,
            450,
            95
        )
    );


    /* =====================================================
       PLATAFORMAS ALTAS
       ===================================================== */

    platforms.push(

        platform(
            520,
            420,
            120
        ),

        platform(
            690,
            345,
            110
        ),

        platform(
            880,
            410,
            115
        ),

        platform(
            1030,
            330,
            125
        ),

        platform(
            1210,
            380,
            105
        ),

        platform(
            1410,
            395,
            110
        ),

        platform(
            1560,
            320,
            125
        ),

        platform(
            1730,
            255,
            125
        ),

        platform(
            1900,
            350,
            110
        ),

        platform(
            2070,
            420,
            105
        ),

        platform(
            2230,
            340,
            125
        ),

        platform(
            2390,
            275,
            120
        ),

        platform(
            2620,
            380,
            120
        ),

        platform(
            2780,
            290,
            130
        ),

        platform(
            2960,
            370,
            120
        ),

        platform(
            3220,
            400,
            110
        ),

        platform(
            3380,
            315,
            120
        ),

        platform(
            3540,
            240,
            135
        ),

        platform(
            3770,
            390,
            115
        )
    );


    /* =====================================================
       PLATAFORMAS MÓVEIS
       ===================================================== */

    movingPlatforms.push(

        {
            x: 745,
            y: 440,
            w: 90,
            h: 20,

            baseX: 745,

            range: 105,

            speed: 1.35,

            direction: 1,

            dx: 0
        },

        {
            x: 1280,
            y: 440,
            w: 100,
            h: 20,

            baseX: 1280,

            range: 120,

            speed: 1.45,

            direction: -1,

            dx: 0
        },

        {
            x: 1930,
            y: 440,
            w: 100,
            h: 20,

            baseX: 1930,

            range: 120,

            speed: 1.55,

            direction: 1,

            dx: 0
        },

        {
            x: 2400,
            y: 435,
            w: 100,
            h: 20,

            baseX: 2400,

            range: 120,

            speed: 1.65,

            direction: -1,

            dx: 0
        },

        {
            x: 3020,
            y: 440,
            w: 100,
            h: 20,

            baseX: 3020,

            range: 130,

            speed: 1.7,

            direction: 1,

            dx: 0
        }
    );


    /* =====================================================
       ESPINHOS
       ===================================================== */

    const spikes = [

        [650, 475, 72],

        [1190, 497, 55, "laser"],

        [1805, 475, 65],

        [2375, 497, 70, "laser"],

        [2900, 475, 75],

        [3520, 475, 65]
    ];


    spikes.forEach(
        ([x, y, w, type = "spike"]) => {

            hazards.push({

                x,

                y,

                w,

                h: type === "laser" ? 8 : 30,

                type
            });
        }
    );


    /* =====================================================
       CAIXAS
       ===================================================== */

    hazards.push({
        x: 930,
        y: 445,
        w: 42,
        h: 60,
        type: "shield"
    });


    if (selectedDifficulty !== "easy") {
        hazards.push(
        {
            x: 2170,
            y: 427,
            w: 44,
            h: 44,
            type: "drone",
            startX: 2145,
            endX: 2205,
            direction: 1,
            speed: 1.1,
            baseY: 427,
            phase: 0,
            floatAmplitude: 7
        },

        {
            x: 3310,
            y: 340,
            w: 44,
            h: 44,
            type: "drone",
            startX: 3295,
            endX: 3335,
            direction: -1,
            speed: 0.9,
            baseY: 340,
            phase: Math.PI,
            floatAmplitude: 5
        }
        );
    }


    /* =====================================================
       SERRAS
       ===================================================== */

    hazards.push(

        {
            x: 1330,

            y: 330,

            w: 50,

            h: 50,

            type: "saw",

            startX: 1300,

            endX: 1400,

            direction: 1,

            speed: 2.4
        },

        {
            x: 1940,

            y: 285,

            w: 50,

            h: 50,

            type: "saw",

            startX: 1900,

            endX: 2010,

            direction: 1,

            speed: 2.8
        },

        {
            x: 2750,

            y: 225,

            w: 52,

            h: 52,

            type: "saw",

            startX: 2700,

            endX: 2810,

            direction: 1,

            speed: 3
        },

        {
            /*
             * Esta serra ficava em x=3550, exatamente sobre a plataforma
             * alta que antecede o portal. Ela foi deslocada para depois
             * da linha de chegada para não cobrir o salto final.
             */
            x: 4040,

            y: 70,

            w: 52,

            h: 52,

            type: "saw",

            startX: 3980,

            endX: 4100,

            direction: 1,

            speed: 3.2
        }
    );


    /* =====================================================
       OBSTÁCULOS EXTRAS
       ===================================================== */

    if (
        selectedDifficulty !==
        "easy"
    ) {

        hazards.push(

            {
                x: 1120,

                y: 370,

                w: 38,

                h: 38,

                type: "saw",

                startX: 1080,

                endX: 1170,

                direction: 1,

                speed: 2.7
            },

            {
                x: 2460,

                y: 215,

                w: 42,

                h: 42,

                type: "saw",

                startX: 2410,

                endX: 2510,

                direction: -1,

                speed: 3
            }
        );
    }


    if (
        selectedDifficulty ===
        "hard"
    ) {

        hazards.push(

            {
                x: 1600,

                y: 270,

                w: 38,

                h: 38,

                type: "saw",

                startX: 1560,

                endX: 1680,

                direction: 1,

                speed: 3.5
            },

            {
                x: 3060,

                y: 310,

                w: 44,

                h: 44,

                type: "saw",

                startX: 3020,

                endX: 3130,

                direction: -1,

                speed: 3.7
            }
        );
    }


    /* =====================================================
       MOEDAS
       ===================================================== */

    const coinPositions = [

        [560, 385],

        [730, 310],

        [920, 370],

        [1060, 295],

        [1240, 340],

        [1455, 350],

        [1600, 275],

        [1765, 210],

        [1940, 305],

        [2110, 375],

        [2265, 295],

        [2425, 230],

        [2660, 335],

        [2830, 245],

        [3000, 325],

        [3260, 350],

        [3400, 270],

        [3575, 195],

        [3810, 340]
    ];


    coinPositions.forEach(
        ([x, y]) => {

            coins.push({

                x,

                y,

                radius: 11,

                collected: false,

                angle:
                    Math.random() *
                    Math.PI *
                    2
            });
        }
    );


    /* =====================================================
       DECORAÇÃO
       ===================================================== */

    for (
        let i = 0;
        i < 35;
        i++
    ) {

        decorations.push({

            x:
                i * 125 +
                20,

            y:
                430 +
                Math.random() *
                45,

            size:
                20 +
                Math.random() *
                35,

            type:
                Math.random() >
                0.55
                    ? "tree"
                    : "rock"
        });
    }


    const stageLayouts = [
        null,
        {
            remove: [520, 690, 880, 1030, 1210, 2230, 2390],
            add: [
                [500, 430, 125], [645, 360, 110], [785, 405, 110],
                [925, 315, 105], [1060, 375, 110], [1200, 300, 105],
                [2180, 385, 105], [2310, 300, 100], [2440, 365, 110]
            ]
        },
        {
            remove: [1410, 1560, 1730, 1900, 2620, 2780, 2960],
            add: [
                [1395, 405, 100], [1515, 335, 100], [1640, 270, 105],
                [1765, 355, 100], [1890, 290, 105],
                [2600, 370, 95], [2715, 285, 95], [2835, 345, 100], [2960, 255, 110]
            ]
        },
        {
            remove: [520, 690, 880, 1030, 1210, 3220, 3380, 3540, 3770],
            add: [
                [500, 410, 125], [650, 325, 105], [785, 390, 105],
                [920, 305, 100], [1050, 380, 110], [1190, 315, 100],
                [3200, 420, 100], [3325, 340, 95], [3450, 265, 100],
                [3575, 350, 100], [3700, 290, 110]
            ]
        },
        {
            remove: [880, 1030, 1210, 1560, 1730, 1900, 2780, 2960],
            add: [
                [865, 395, 105], [995, 325, 100], [1120, 405, 95], [1240, 330, 100],
                [1545, 355, 105], [1675, 275, 100], [1800, 345, 100], [1925, 270, 100],
                [2760, 365, 100], [2890, 275, 100], [3020, 350, 105]
            ]
        },
        {
            remove: [1210, 1410, 1560, 1730, 2230, 2390, 3380, 3540, 3770],
            add: [
                [1190, 350, 100], [1315, 420, 95], [1435, 340, 100],
                [1560, 270, 100], [1685, 350, 105], [1815, 285, 100],
                [2210, 365, 100], [2335, 280, 100], [2460, 355, 100],
                [3360, 350, 100], [3485, 275, 100], [3610, 365, 100], [3735, 300, 110]
            ]
        }
    ];


    const stageLayout =
        stageLayouts[level % stageLayouts.length];


    if (stageLayout) {
        for (let index = platforms.length - 1; index >= 0; index--) {
            if (stageLayout.remove.includes(platforms[index].x)) {
                platforms.splice(index, 1);
            }
        }

        stageLayout.add.forEach(([x, y, width]) => {
            platforms.push(platform(x, y, width));
        });
    }


    const platformMotionByStage = [
        ["linear", "sine", "vertical", "linear", "sine"],
        ["vertical", "linear", "vertical", "sine", "linear"],
        ["sine", "vertical", "linear", "vertical", "sine"],
        ["vertical", "sine", "vertical", "linear", "sine"],
        ["sine", "vertical", "sine", "vertical", "linear"],
        ["vertical", "sine", "vertical", "sine", "vertical"]
    ];


    movingPlatforms.forEach((movingPlatform, index) => {
        movingPlatform.motion = platformMotionByStage[level % platformMotionByStage.length][index];
        movingPlatform.baseY = movingPlatform.y;
        movingPlatform.dy = 0;
        movingPlatform.phase = movingPlatform.motion === "sine" ? 0 : index * 0.9 + level * 0.6;
        movingPlatform.range =
            Math.round(movingPlatform.range * (1 + (level % 3) * 0.12));

        if (movingPlatform.motion === "vertical") {
            movingPlatform.range = Math.min(
                movingPlatform.range,
                58,
                movingPlatform.baseY - movingPlatform.h,
                groundY - movingPlatform.h - movingPlatform.baseY
            );
        }
    });


    const sawMotionByStage = [
        ["linear", "diagonal", "vertical", "orbit", "diagonal", "vertical", "orbit", "diagonal"],
        ["vertical", "diagonal", "vertical", "diagonal", "vertical", "diagonal", "vertical", "diagonal"],
        ["orbit", "vertical", "orbit", "vertical", "orbit", "vertical", "orbit", "vertical"],
        ["diagonal", "orbit", "diagonal", "vertical", "diagonal", "orbit", "vertical", "diagonal"],
        ["vertical", "diagonal", "orbit", "diagonal", "vertical", "orbit", "diagonal", "vertical"],
        ["orbit", "diagonal", "vertical", "orbit", "diagonal", "vertical", "orbit", "diagonal"]
    ];


    let sawIndex = 0;


    hazards.forEach(hazard => {
        if (hazard.type !== "saw") {
            return;
        }

        hazard.motion = sawMotionByStage[level % sawMotionByStage.length][sawIndex] || "diagonal";
        hazard.baseX = hazard.x;
        hazard.baseY = hazard.y;
        hazard.phase = 0;
        hazard.amplitudeX = Math.max(24, (hazard.endX - hazard.startX) / 2);
        hazard.amplitudeY = 24 + ((sawIndex + level) % 3) * 10;

        if (hazard.motion === "orbit") {
            hazard.y = hazard.baseY + hazard.amplitudeY;
        }

        sawIndex++;
    });


    return {

        platforms,

        movingPlatforms,

        hazards,

        coins,

        decorations
    };
}


/* =========================================================
   INICIAR JOGO
   ========================================================= */

function startGame() {

    game.running = true;

    game.paused = false;

    game.level = 0;

    game.score = 0;

    game.coins = 0;

    game.lives = 3;

    loadLevel();

    showScreen(
        "gameScreen"
    );


    const pauseOverlay =
        document.getElementById(
            "pauseOverlay"
        );

    const finishOverlay =
        document.getElementById(
            "finishOverlay"
        );

    const gameOverOverlay =
        document.getElementById(
            "gameOverOverlay"
        );


    if (pauseOverlay) {

        pauseOverlay.classList.remove(
            "visible"
        );
    }


    if (finishOverlay) {

        finishOverlay.classList.remove(
            "visible"
        );
    }


    if (gameOverOverlay) {

        gameOverOverlay.classList.remove(
            "visible"
        );
    }


    showVisualEvent(
        `Modo ${
            difficulties[
                selectedDifficulty
            ].name
        }`
    );
}


/* =========================================================
   CARREGAR FASE
   ========================================================= */

function loadLevel() {

    const data =
        createLevel(
            game.level
        );


    game.platforms =
        data.platforms;

    game.movingPlatforms =
        data.movingPlatforms;

    game.hazards =
        data.hazards;

    game.coinsObjects =
        data.coins;

    game.decorations =
        data.decorations;


    game.theme =
        game.level %
        themes.length;


    game.levelStartTime =
        performance.now();


    player.x = 100;

    player.y = 400;

    player.vx = 0;

    player.vy = 0;

    player.onGround = false;

    player.wantJump = false;

    player.coyote = 0;

    player.invulnerable = 0;

    player.runFrame = 0;


    game.cameraX = 0;


    updateHUD();
}


/* =========================================================
   CONTROLES
   ========================================================= */

const keys = {};


window.addEventListener(
    "keydown",
    event => {

        keys[event.code] =
            true;


        if (
            [
                "Space",
                "ArrowLeft",
                "ArrowRight",
                "ArrowUp"
            ].includes(
                event.code
            )
        ) {

            event.preventDefault();
        }


        if (
            event.code ===
            "Space" ||

            event.code ===
            "ArrowUp" ||

            event.code ===
            "KeyW"
        ) {

            if (
                game.running &&
                !game.paused
            ) {

                player.wantJump =
                    true;
            }
        }


        if (
            event.code ===
            "Escape" ||

            event.code ===
            "KeyP"
        ) {

            if (game.running) {

                togglePause();
            }
        }
    }
);


window.addEventListener(
    "keyup",
    event => {

        keys[event.code] =
            false;
    }
);


/* =========================================================
   CONTROLES DE CELULAR
   ========================================================= */

function holdButton(
    id,
    key
) {

    const button =
        document.getElementById(
            id
        );


    if (!button) {
        return;
    }


    const down =
        event => {

            event.preventDefault();

            keys[key] = true;
        };


    const up =
        event => {

            event.preventDefault();

            keys[key] = false;
        };


    button.addEventListener(
        "pointerdown",
        down
    );


    button.addEventListener(
        "pointerup",
        up
    );


    button.addEventListener(
        "pointercancel",
        up
    );


    button.addEventListener(
        "pointerleave",
        up
    );
}


holdButton(
    "leftBtn",
    "ArrowLeft"
);


holdButton(
    "rightBtn",
    "ArrowRight"
);


const jumpButton =
    document.getElementById(
        "jumpBtn"
    );


if (jumpButton) {

    jumpButton.addEventListener(
        "pointerdown",
        event => {

            event.preventDefault();

            player.wantJump =
                true;
        }
    );
}


/* =========================================================
   VELOCIDADE
   ========================================================= */

function getSpeedMultiplier() {

    return difficulties[
        selectedDifficulty
    ].speed;
}


/* =========================================================
   ATUALIZAR JOGADOR
   ========================================================= */

function updatePlayer(dt) {

    const difficulty =
        difficulties[selectedDifficulty];


    player.carriedPlatformThisFrame = false;


    if (player.onGround) {
        for (const movingPlatform of game.movingPlatforms) {
            const previousX = movingPlatform.x - movingPlatform.dx;
            const previousY = movingPlatform.y - movingPlatform.dy;
            const playerWasOverPlatform =
                player.x + player.width > previousX &&
                player.x < previousX + movingPlatform.w &&
                Math.abs(player.y + player.height - previousY) <= 8;

            if (playerWasOverPlatform) {
                player.x += movingPlatform.dx;
                player.y += movingPlatform.dy;
                player.carriedPlatformThisFrame = true;
                break;
            }
        }
    }

    const direction =
        (
            keys.ArrowRight ||
            keys.KeyD
                ? 1
                : 0
        ) -

        (
            keys.ArrowLeft ||
            keys.KeyA
                ? 1
                : 0
        );


    const maxSpeed =
        player.maxSpeed *
        difficulty.speed;


    if (
        direction !== 0
    ) {

        player.vx +=
            direction *
            player.acceleration *
            dt;


        player.vx =
            Math.max(
                -maxSpeed,
                Math.min(
                    maxSpeed,
                    player.vx
                )
            );


        player.facing =
            direction;

    } else {

        player.vx *=
            Math.pow(
                0.75,
                dt
            );


        if (
            Math.abs(
                player.vx
            ) < 0.04
        ) {

            player.vx = 0;
        }
    }


    if (
        player.onGround
    ) {

        player.coyote = difficulty.coyoteFrames;

    } else {

        player.coyote -= dt;
    }


    if (
        player.wantJump &&
        player.coyote > 0
    ) {

        player.vy = difficulty.jump;

        player.onGround =
            false;

        player.wantJump =
            false;

        player.coyote =
            0;

    } else {

        player.wantJump =
            false;
    }


    player.vy += difficulty.gravity * dt;


    if (
        player.vy > 15
    ) {

        player.vy = difficulty.maxFallSpeed;
    }


    moveHorizontal(dt);

    moveVertical(dt);


    if (
        player.y >
        canvas.height +
        100
    ) {

        loseLife();
    }


    if (
        player.invulnerable >
        0
    ) {

        player.invulnerable -=
            dt;
    }


    if (
        Math.abs(
            player.vx
        ) > 0.15 &&
        player.onGround
    ) {

        player.runFrame +=
            dt *
            0.28 *
            getSpeedMultiplier();
    }
}


/* =========================================================
   MOVIMENTO HORIZONTAL
   ========================================================= */

function moveHorizontal(dt) {

    const oldX =
        player.x;


    player.x +=
        player.vx *
        dt;


    if (
        player.x < 0
    ) {

        player.x = 0;

        player.vx = 0;
    }


    for (
        const p
        of getAllPlatforms()
    ) {

        if (
            !rectsOverlap(
                player,
                p
            )
        ) {

            continue;
        }


        if (
            player.vx > 0 &&
            oldX +
            player.width
            <=
            p.x + 4
        ) {

            player.x =
                p.x -
                player.width;

            player.vx =
                0;
        }

        else if (
            player.vx < 0 &&
            oldX >=
            p.x +
            p.w -
            4
        ) {

            player.x =
                p.x +
                p.w;

            player.vx =
                0;
        }
    }
}


/* =========================================================
   MOVIMENTO VERTICAL
   ========================================================= */

function moveVertical(dt) {

    const oldY =
        player.y;


    player.y +=
        player.vy *
        dt;


    player.onGround =
        false;


    for (
        const p
        of getAllPlatforms()
    ) {

        if (
            !rectsOverlap(
                player,
                p
            )
        ) {

            continue;
        }


        const oldBottom =
            oldY +
            player.height;


        const oldTop =
            oldY;


        /* ================================================
           COLISÃO SOBRE A PLATAFORMA
           ================================================ */

        if (
            player.vy >= 0 &&
            oldBottom <=
            p.y + 8
        ) {

            player.y =
                p.y -
                player.height;

            player.vy =
                0;

            player.onGround =
                true;


            if (p.moving && !player.carriedPlatformThisFrame) {

                player.x +=
                    p.dx;
            }


            continue;
        }


        /* ================================================
           COLISÃO POR BAIXO
           ================================================ */

        if (
            player.vy < 0 &&
            oldTop >=
            p.y +
            p.h -
            8
        ) {

            player.y =
                p.y +
                p.h;

            player.vy =
                0;
        }
    }
}


/* =========================================================
   TODAS AS PLATAFORMAS
   ========================================================= */

function getAllPlatforms() {

    const normal =
        game.platforms.map(
            p => ({

                ...p,

                moving: false,

                dx: 0
            })
        );


    const moving =
        game.movingPlatforms.map(
            p => ({

                ...p,

                moving: true
            })
        );


    return normal.concat(
        moving
    );
}


/* =========================================================
   COLISÃO
   ========================================================= */

function rectsOverlap(
    a,
    b
) {

    return (

        a.x <
            b.x +
            b.w &&

        a.x +
            a.width >
            b.x &&

        a.y <
            b.y +
            b.h &&

        a.y +
            a.height >
            b.y
    );
}


/* =========================================================
   OBJETOS MÓVEIS
   ========================================================= */

function updateMovingObjects(
    dt
) {

    for (
        const p
        of game.movingPlatforms
    ) {

        const oldX =
            p.x;


        const oldY =
            p.y;


        const movementScale =
            difficulties[selectedDifficulty].platformSpeed;


        if (p.motion === "sine") {
            p.phase += p.speed * dt * 0.025 * movementScale;
            p.x = p.baseX + Math.sin(p.phase) * p.range;
        } else {
            const movingVertically = p.motion === "vertical";
            const basePosition = movingVertically ? p.baseY : p.baseX;

            if (movingVertically) {
                p.y += p.speed * p.direction * dt * movementScale;
            } else {
                p.x += p.speed * p.direction * dt * movementScale;
            }

            const updatedPosition = movingVertically ? p.y : p.x;

            if (updatedPosition > basePosition + p.range) {
                if (movingVertically) p.y = basePosition + p.range;
                else p.x = basePosition + p.range;
                p.direction = -1;
            }

            if (updatedPosition < basePosition - p.range) {
                if (movingVertically) p.y = basePosition - p.range;
                else p.x = basePosition - p.range;
                p.direction = 1;
            }
        }

        p.dx =
            p.x -
            oldX;


        p.dy =
            p.y -
            oldY;
    }


    for (
        const hazard
        of game.hazards
    ) {

        if (hazard.type === "drone") {
            hazard.phase +=
                dt *
                0.06 *
                difficulties[selectedDifficulty].hazardSpeed;
            hazard.y =
                hazard.baseY +
                Math.sin(hazard.phase) * hazard.floatAmplitude;
        }


        if (hazard.type !== "saw" && hazard.type !== "drone") {

            continue;
        }


        if (hazard.type === "saw" && hazard.motion !== "linear") {
            hazard.phase +=
                dt *
                0.035 *
                difficulties[selectedDifficulty].hazardSpeed;

            if (hazard.motion === "vertical") {
                hazard.x = hazard.baseX;
                hazard.y = hazard.baseY + Math.sin(hazard.phase) * hazard.amplitudeY;
                continue;
            }

            if (hazard.motion === "orbit") {
                hazard.x = hazard.baseX + Math.sin(hazard.phase) * hazard.amplitudeX;
                hazard.y = hazard.baseY + Math.cos(hazard.phase) * hazard.amplitudeY;
                continue;
            }

            hazard.y = hazard.baseY + Math.sin(hazard.phase) * hazard.amplitudeY;
        }


        if (hazard.type === "saw" && hazard.motion === "vertical") {
            continue;
        }


        if (hazard.type === "saw" && hazard.motion === "orbit") {
            continue;
        }


        hazard.x +=
            hazard.speed *
            hazard.direction *
            dt *
            difficulties[selectedDifficulty].hazardSpeed;


        if (
            hazard.x >
            hazard.endX
        ) {

            hazard.x =
                hazard.endX;

            hazard.direction =
                -1;
        }


        if (
            hazard.x <
            hazard.startX
        ) {

            hazard.x =
                hazard.startX;

            hazard.direction =
                1;
        }
    }
}


/* =========================================================
   MOEDAS
   ========================================================= */

function updateCoins() {

    for (
        const coin
        of game.coinsObjects
    ) {

        if (
            coin.collected
        ) {

            continue;
        }


        const box = {

            x:
                coin.x -
                coin.radius,

            y:
                coin.y -
                coin.radius,

            w:
                coin.radius *
                2,

            h:
                coin.radius *
                2
        };


        if (
            rectsOverlap(
                player,
                box
            )
        ) {

            coin.collected =
                true;

            game.coins++;

            save.totalCoins += 10;

            saveGame();

            game.score +=
                10;


            showVisualEvent(
                "🪙 MOEDA +10"
            );
        }
    }
}


/* =========================================================
   PERIGOS
   ========================================================= */

function checkHazards() {

    if (
        player.invulnerable >
        0
    ) {

        return;
    }


    for (
        const hazard
        of game.hazards
    ) {

        let collision = false;


        if (hazard.type === "saw" || hazard.type === "drone") {
            const radius =
                Math.min(hazard.w, hazard.h) *
                (hazard.type === "saw" ? 0.5 : 0.46);

            const centerX = hazard.x + hazard.w / 2;
            const centerY = hazard.y + hazard.h / 2;
            const nearestX = Math.max(player.x, Math.min(centerX, player.x + player.width));
            const nearestY = Math.max(player.y, Math.min(centerY, player.y + player.height));
            const offsetX = centerX - nearestX;
            const offsetY = centerY - nearestY;

            collision = offsetX * offsetX + offsetY * offsetY < radius * radius;
        } else if (hazard.type === "spike") {
            const amount = Math.max(2, Math.floor(hazard.w / 15));
            const segment = hazard.w / amount;

            for (let index = 0; index < amount; index++) {
                const triangleLeft = hazard.x + index * segment;
                const overlapLeft = Math.max(player.x, triangleLeft);
                const overlapRight = Math.min(player.x + player.width, triangleLeft + segment);

                if (overlapLeft > overlapRight) {
                    continue;
                }

                const apexX = triangleLeft + segment / 2;
                const nearestX = Math.max(overlapLeft, Math.min(apexX, overlapRight));
                const surfaceY =
                    hazard.y +
                    hazard.h * Math.abs(nearestX - apexX) / (segment / 2);

                if (
                    player.y + player.height > surfaceY &&
                    player.y < hazard.y + hazard.h
                ) {
                    collision = true;
                    break;
                }
            }
        } else {
            collision = rectsOverlap(player, hazard);
        }


        if (collision) {

            loseLife();

            return;
        }
    }
}


/* =========================================================
   PERDER VIDA
   ========================================================= */

function loseLife() {

    if (
        player.invulnerable >
        0
    ) {

        return;
    }


    game.lives--;


    updateHUD();


    if (
        game.lives <= 0
    ) {

        gameOver();

        return;
    }


    player.x = 100;

    player.y = 400;

    player.vx = 0;

    player.vy = 0;

    player.invulnerable =
        difficulties[selectedDifficulty].invulnerabilityFrames;


    game.cameraX = 0;


    showVisualEvent(
        `⚠ VIDA PERDIDA — RESTAM ${game.lives}`
    );
}


/* =========================================================
   CÂMERA
   ========================================================= */

function updateCamera() {

    const target =
        player.x -
        canvas.width *
        0.35;


    game.cameraX +=
        (
            target -
            game.cameraX
        ) *
        0.11;


    game.cameraX =
        Math.max(
            0,
            Math.min(
                game.worldWidth -
                canvas.width,
                game.cameraX
            )
        );
}


/* =========================================================
   FUNÇÕES GRÁFICAS
   ========================================================= */

function drawCircle(
    x,
    y,
    radius,
    color
) {

    ctx.fillStyle =
        color;


    ctx.beginPath();


    ctx.arc(
        x,
        y,
        radius,
        0,
        Math.PI * 2
    );


    ctx.fill();
}


function roundRect(
    x,
    y,
    width,
    height,
    radius
) {

    ctx.beginPath();

    ctx.moveTo(
        x + radius,
        y
    );

    ctx.lineTo(
        x +
        width -
        radius,
        y
    );

    ctx.quadraticCurveTo(
        x + width,
        y,
        x + width,
        y + radius
    );

    ctx.lineTo(
        x + width,
        y +
        height -
        radius
    );

    ctx.quadraticCurveTo(
        x + width,
        y + height,
        x +
        width -
        radius,
        y + height
    );

    ctx.lineTo(
        x + radius,
        y + height
    );

    ctx.quadraticCurveTo(
        x,
        y + height,
        x,
        y +
        height -
        radius
    );

    ctx.lineTo(
        x,
        y + radius
    );

    ctx.quadraticCurveTo(
        x,
        y,
        x + radius,
        y
    );

    ctx.closePath();
}


function adjustColor(
    hex,
    amount
) {

    const clean =
        hex.replace(
            "#",
            ""
        );

    const num =
        parseInt(
            clean,
            16
        );


    const r =
        Math.max(
            0,
            Math.min(
                255,
                (num >> 16) +
                amount
            )
        );


    const g =
        Math.max(
            0,
            Math.min(
                255,
                ((num >> 8) &
                    255) +
                amount
            )
        );


    const b =
        Math.max(
            0,
            Math.min(
                255,
                (num & 255) +
                amount
            )
        );


    return `rgb(${r},${g},${b})`;
}


/* =========================================================
   FUNDO DOS CENÁRIOS
   ========================================================= */

function drawBackground() {

    const t =
        getCurrentTheme();


    const gradient =
        ctx.createLinearGradient(
            0,
            0,
            0,
            canvas.height
        );


    gradient.addColorStop(
        0,
        t.sky1
    );


    gradient.addColorStop(
        1,
        t.sky2
    );


    ctx.fillStyle =
        gradient;


    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    drawDigitalSky(t);


    if (
        game.theme === 0
    ) {

        drawForestBackground(t);

    } else if (
        game.theme === 1
    ) {

        drawParkBackground(t);

    } else if (
        game.theme === 2
    ) {

        drawSchoolBackground(t);

    } else if (
        game.theme === 3
    ) {

        drawMountainBackground(t);

    } else if (
        game.theme === 4
    ) {

        drawGalaxyBackground(t);

    } else {

        drawMoonBaseBackground(t);
    }


    drawSceneVignette();


    /*
       A identificação é desenhada no fundo,
       antes das plataformas e do personagem.
    */

    drawCourseBackgroundSign();
}


function drawTechLine(
    startX,
    startY,
    endX,
    endY,
    color,
    width = 2,
    glow = 8
) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.shadowColor = color;
    ctx.shadowBlur = glow;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    ctx.restore();
}


function drawTechNode(
    x,
    y,
    radius,
    color
) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}


function drawDigitalSky(t) {
    if (game.theme >= 4) {
        return;
    }


    const hazeColors = [
        "rgba(236,233,173,0.18)",
        "rgba(255,226,172,0.20)",
        "rgba(255,220,172,0.18)",
        "rgba(239,248,239,0.16)"
    ];

    const haze = ctx.createRadialGradient(
        825,
        105,
        8,
        825,
        105,
        470
    );

    haze.addColorStop(0, hazeColors[game.theme]);
    haze.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = haze;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}


function drawSun(sunX, sunY, radius) {
    const halo = ctx.createRadialGradient(
        sunX,
        sunY,
        radius * 0.45,
        sunX,
        sunY,
        radius * 2.7
    );

    halo.addColorStop(0, "rgba(255,235,178,0.35)");
    halo.addColorStop(1, "rgba(255,235,178,0)");
    ctx.fillStyle = halo;
    ctx.fillRect(
        sunX - radius * 2.7,
        sunY - radius * 2.7,
        radius * 5.4,
        radius * 5.4
    );

    const sun = ctx.createRadialGradient(
        sunX - radius * 0.3,
        sunY - radius * 0.35,
        2,
        sunX,
        sunY,
        radius
    );

    sun.addColorStop(0, "#fff8dd");
    sun.addColorStop(1, "#f4d58e");
    ctx.fillStyle = sun;
    ctx.beginPath();
    ctx.arc(sunX, sunY, radius, 0, Math.PI * 2);
    ctx.fill();
}


function drawPineTree(treeX, baseY, treeHeight, foliageColor, opacity = 1) {
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.fillStyle = "#594b38";
    ctx.fillRect(
        treeX - treeHeight * 0.035,
        baseY - treeHeight * 0.22,
        treeHeight * 0.07,
        treeHeight * 0.22
    );

    ctx.fillStyle = foliageColor;

    for (let tier = 0; tier < 3; tier++) {
        const tierTop = baseY - treeHeight + tier * treeHeight * 0.24;
        const tierWidth = treeHeight * (0.24 + tier * 0.105);

        ctx.beginPath();
        ctx.moveTo(treeX, tierTop);
        ctx.lineTo(treeX - tierWidth, tierTop + treeHeight * 0.38);
        ctx.lineTo(treeX + tierWidth, tierTop + treeHeight * 0.38);
        ctx.closePath();
        ctx.fill();
    }

    ctx.restore();
}


function drawOrbitalBody(x, y, radius, t) {
    ctx.save();

    const orbGradient =
        ctx.createRadialGradient(
            x - radius * 0.35,
            y - radius * 0.35,
            2,
            x,
            y,
            radius
        );

    orbGradient.addColorStop(0, "#f5fcff");
    orbGradient.addColorStop(0.35, t.accent);
    orbGradient.addColorStop(1, "rgba(62,137,184,0.18)");

    ctx.fillStyle = orbGradient;
    ctx.shadowColor = t.accent;
    ctx.shadowBlur = 28;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = "rgba(226,248,255,0.82)";
    ctx.lineWidth = 2;
    ctx.shadowColor = t.accent;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.ellipse(x, y, radius * 1.75, radius * 0.42, -0.24, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    drawTechNode(x + radius * 1.42, y - radius * 0.48, 3, "#f5fcff");
}


/* =========================================================
   PLACA DE FUNDO
   "2° DESENVOLVIMENTO DE SISTEMAS"
   ========================================================= */

function drawCourseBackgroundSign() {

    /*
       Paralaxe para a placa parecer parte
       do cenário.
    */

    const parallax =
        game.cameraX *
        0.30;


    const spacing =
        980;


    const startX =
        460 -
        (
            parallax %
            spacing
        );


    for (
        let i = 0;
        i < 6;
        i++
    ) {

        const signX =
            startX +
            i *
            spacing;


        const signY =
            135;


        const signWidth =
            500;


        const signHeight =
            118;


        if (
            signX +
            signWidth <
            0 ||
            signX >
            canvas.width
        ) {

            continue;
        }


        /* ==============================================
           BRILHO EXTERNO
           ============================================== */

        ctx.save();

        ctx.shadowColor =
            "#4db7ff";

        ctx.shadowBlur =
            32;

        ctx.fillStyle =
            "rgba(8,29,53,0.88)";


        roundRect(
            signX,
            signY,
            signWidth,
            signHeight,
            16
        );


        ctx.fill();

        ctx.restore();


        /* ==============================================
           PAINEL AZUL
           ============================================== */

        const panelGradient =
            ctx.createLinearGradient(
                signX,
                signY,
                signX,
                signY +
                signHeight
            );


        panelGradient.addColorStop(
            0,
            "#234b72"
        );


        panelGradient.addColorStop(
            0.5,
            "#173b5f"
        );


        panelGradient.addColorStop(
            1,
            "#102d49"
        );


        ctx.fillStyle =
            panelGradient;


        roundRect(
            signX,
            signY,
            signWidth,
            signHeight,
            16
        );


        ctx.fill();


        /* ==============================================
           BORDA LED AZUL
           ============================================== */

        ctx.save();

        ctx.shadowColor =
            "#58bdff";

        ctx.shadowBlur =
            19;

        ctx.strokeStyle =
            "#58bdff";

        ctx.lineWidth =
            5;


        roundRect(
            signX + 2,
            signY + 2,
            signWidth - 4,
            signHeight - 4,
            15
        );


        ctx.stroke();

        ctx.restore();


        /* ==============================================
           BORDA INTERNA BRANCA
           ============================================== */

        ctx.strokeStyle =
            "rgba(255,255,255,0.82)";

        ctx.lineWidth =
            2;


        roundRect(
            signX + 10,
            signY + 10,
            signWidth - 20,
            signHeight - 20,
            10
        );


        ctx.stroke();


        /* ==============================================
           LEDs NOS CANTOS
           ============================================== */

        const leds = [

            [
                signX + 16,
                signY + 16
            ],

            [
                signX +
                signWidth -
                16,

                signY + 16
            ],

            [
                signX + 16,

                signY +
                signHeight -
                16
            ],

            [
                signX +
                signWidth -
                16,

                signY +
                signHeight -
                16
            ]
        ];


        leds.forEach(
            ([ledX, ledY]) => {

                ctx.save();

                ctx.shadowColor =
                    "#8bd5ff";

                ctx.shadowBlur =
                    15;

                ctx.fillStyle =
                    "#b6e7ff";


                ctx.beginPath();

                ctx.arc(
                    ledX,
                    ledY,
                    4,
                    0,
                    Math.PI * 2
                );

                ctx.fill();

                ctx.restore();
            }
        );


        /* ==============================================
           TEXTO
           ============================================== */

        ctx.save();

        ctx.textAlign =
            "center";

        ctx.textBaseline =
            "middle";


        /* Sombra */

        ctx.font =
            "900 29px Arial, sans-serif";

        ctx.fillStyle =
            "rgba(0,0,0,0.85)";


        ctx.fillText(
            "2° DESENVOLVIMENTO",

            signX +
            signWidth /
            2 +
            2,

            signY +
            42 +
            2
        );


        /* Primeira linha */

        ctx.fillStyle =
            "#ffffff";

        ctx.shadowColor =
            "rgba(255,255,255,0.45)";

        ctx.shadowBlur =
            10;


        ctx.fillText(
            "2° DESENVOLVIMENTO",

            signX +
            signWidth /
            2,

            signY +
            40
        );


        /* Segunda linha */

        ctx.font =
            "900 28px Arial, sans-serif";

        ctx.fillStyle =
            "#ffffff";

        ctx.shadowColor =
            "#55bfff";

        ctx.shadowBlur =
            14;


        ctx.fillText(
            "DE SISTEMAS",

            signX +
            signWidth /
            2,

            signY +
            79
        );


        ctx.restore();


        /* ==============================================
           LED INFERIOR
           ============================================== */

        ctx.save();

        ctx.shadowColor =
            "#58bdff";

        ctx.shadowBlur =
            10;

        ctx.fillStyle =
            "#58bdff";


        roundRect(
            signX + 70,
            signY + 99,
            signWidth - 140,
            3,
            2
        );


        ctx.fill();

        ctx.restore();
    }
}


/* =========================================================
   FLORESTA
   ========================================================= */

function drawMountainPeaks(t) {
    const offset = (game.cameraX * 0.12) % 360;

    for (let layer = 0; layer < 2; layer++) {
        const baseY = layer === 0 ? 438 : 455;
        const color = layer === 0 ? t.mountain : t.mountain2;
        const shift = layer === 0 ? offset : (game.cameraX * 0.18) % 360;

        for (let x = -360 - shift; x < canvas.width + 360; x += 360) {
            const peakX = x + 160 + Math.sin(x * 0.013) * 35;
            const peakY = 155 + Math.abs(Math.sin(x * 0.009)) * 88 + layer * 40;

            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.moveTo(x, baseY);
            ctx.lineTo(peakX - 103, peakY + 95);
            ctx.lineTo(peakX, peakY);
            ctx.lineTo(peakX + 89, peakY + 115);
            ctx.lineTo(x + 360, baseY);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = "rgba(235,249,255,0.9)";
            ctx.beginPath();
            ctx.moveTo(peakX, peakY);
            ctx.lineTo(peakX - 39, peakY + 56);
            ctx.lineTo(peakX - 12, peakY + 48);
            ctx.lineTo(peakX + 18, peakY + 83);
            ctx.lineTo(peakX + 38, peakY + 91);
            ctx.closePath();
            ctx.fill();
        }
    }

    const ridgeOffset = (game.cameraX * 0.2) % 520;
    for (let x = -520 - ridgeOffset; x < canvas.width + 520; x += 520) {
        ctx.fillStyle = "rgba(20,48,70,0.92)";
        roundRect(x + 70, 355, 102, 63, 7);
        ctx.fill();
        drawTechLine(x + 70, 355, x + 172, 355, t.accent, 2, 8);
        drawTechLine(x + 121, 355, x + 121, 418, "rgba(188,231,250,0.55)", 1, 4);
        drawTechNode(x + 121, 347, 4, "#e8f8ff");
    }
}


/* =========================================================
   ELEMENTOS DE CENÁRIO
   ========================================================= */

function wrapSceneValue(value, size) {
    return ((value % size) + size) % size;
}


function sceneHash(index, salt = 0) {
    const value = Math.sin(index * 127.1 + salt * 311.7) * 43758.5453;
    return value - Math.floor(value);
}


function drawSoftCloud(x, y, scale = 1, alpha = 0.7) {
    ctx.save();
    ctx.globalAlpha = alpha;

    const gradient = ctx.createLinearGradient(0, y - 32 * scale, 0, y + 20 * scale);
    gradient.addColorStop(0, "rgba(255,252,239,0.96)");
    gradient.addColorStop(0.55, "rgba(237,240,225,0.88)");
    gradient.addColorStop(1, "rgba(202,215,204,0.34)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(x + 46 * scale, y + 10 * scale, 62 * scale, 16 * scale, 0, 0, Math.PI * 2);
    ctx.ellipse(x + 24 * scale, y + 2 * scale, 28 * scale, 21 * scale, 0, 0, Math.PI * 2);
    ctx.ellipse(x + 54 * scale, y - 5 * scale, 34 * scale, 26 * scale, 0, 0, Math.PI * 2);
    ctx.ellipse(x + 84 * scale, y + 3 * scale, 24 * scale, 17 * scale, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(255,255,247,0.38)";
    ctx.beginPath();
    ctx.ellipse(x + 54 * scale, y - 9 * scale, 20 * scale, 9 * scale, -0.08, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}


function drawBird(x, y, scale, color, alpha, phase) {
    const flap = Math.sin(performance.now() / 190 + phase) * 4.2;

    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.6;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(-10, 0);
    ctx.quadraticCurveTo(-5, -3 - flap, -0.5, 0);
    ctx.quadraticCurveTo(4, -3 - flap, 9, 0);
    ctx.stroke();
    ctx.restore();
}


function drawBroadleafTree(x, baseY, height, canopyColor, trunkColor, alpha = 1, seed = 0) {
    const trunkWidth = Math.max(5, height * 0.055);
    const crownY = baseY - height * 0.67;

    ctx.save();
    ctx.globalAlpha = alpha;

    ctx.fillStyle = trunkColor;
    ctx.beginPath();
    ctx.moveTo(x - trunkWidth * 0.58, baseY);
    ctx.lineTo(x - trunkWidth * 0.26, baseY - height * 0.52);
    ctx.lineTo(x + trunkWidth * 0.2, baseY - height * 0.55);
    ctx.lineTo(x + trunkWidth * 0.58, baseY);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = trunkColor;
    ctx.lineWidth = Math.max(2, height * 0.014);
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x, baseY - height * 0.34);
    ctx.lineTo(x - height * 0.2, baseY - height * 0.54);
    ctx.lineTo(x - height * 0.27, baseY - height * 0.63);
    ctx.moveTo(x, baseY - height * 0.42);
    ctx.lineTo(x + height * 0.17, baseY - height * 0.59);
    ctx.lineTo(x + height * 0.24, baseY - height * 0.68);
    ctx.stroke();

    ctx.globalAlpha = alpha * 0.24;
    ctx.fillStyle = trunkColor;
    for (let i = 0; i < 5; i++) {
        const shadowX = x + (sceneHash(i, seed + 13) - 0.5) * height * 0.36;
        const shadowY = crownY + height * (0.05 + sceneHash(i + 7, seed + 13) * 0.12);
        ctx.beginPath();
        ctx.ellipse(shadowX, shadowY, height * 0.18, height * 0.1, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.globalAlpha = alpha;
    ctx.fillStyle = canopyColor;
    const crownSpecs = [
        [-0.24, 0.01, 0.18, 0.15],
        [-0.08, -0.15, 0.21, 0.18],
        [0.13, -0.16, 0.19, 0.16],
        [0.28, 0.02, 0.16, 0.13],
        [-0.16, 0.16, 0.15, 0.12],
        [0.06, 0.13, 0.18, 0.14],
        [0.35, 0.15, 0.11, 0.1],
        [-0.35, -0.06, 0.12, 0.1],
        [0.2, -0.31, 0.12, 0.1]
    ];

    for (let i = 0; i < crownSpecs.length; i++) {
        const crown = crownSpecs[i];
        const jitterX = (sceneHash(i, seed + 3) - 0.5) * height * 0.035;
        const jitterY = (sceneHash(i + 9, seed + 3) - 0.5) * height * 0.035;
        const radius = height * crown[2] * (0.9 + sceneHash(i + 17, seed) * 0.2);

        ctx.beginPath();
        ctx.ellipse(
            x + height * crown[0] + jitterX,
            crownY + height * crown[1] + jitterY,
            radius,
            height * crown[3] * (0.9 + sceneHash(i + 25, seed) * 0.16),
            (sceneHash(i + 33, seed) - 0.5) * 0.55,
            0,
            Math.PI * 2
        );
        ctx.fill();
    }

    ctx.globalAlpha = alpha * 0.9;
    ctx.fillStyle = canopyColor;
    for (let i = 0; i < 7; i++) {
        const angle = sceneHash(i + 4, seed + 21) * Math.PI * 2;
        const distance = height * (0.26 + sceneHash(i + 8, seed + 21) * 0.14);
        ctx.beginPath();
        ctx.ellipse(
            x + Math.cos(angle) * distance,
            crownY + Math.sin(angle) * distance * 0.55,
            height * (0.045 + sceneHash(i + 2, seed) * 0.025),
            height * (0.025 + sceneHash(i + 1, seed) * 0.018),
            angle,
            0,
            Math.PI * 2
        );
        ctx.fill();
    }

    ctx.globalAlpha = alpha * 0.2;
    ctx.fillStyle = "#efffce";
    for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.ellipse(
            x - height * 0.15 + i * height * 0.055,
            crownY - height * 0.11 + (i % 3) * height * 0.045,
            height * (0.035 + sceneHash(i, seed + 31) * 0.025),
            height * (0.018 + sceneHash(i + 5, seed + 31) * 0.015),
            -0.25,
            0,
            Math.PI * 2
        );
        ctx.fill();
    }

    ctx.globalAlpha = alpha * 0.24;
    ctx.fillStyle = "#d8e8a6";
    for (let i = 0; i < 10; i++) {
        ctx.beginPath();
        ctx.arc(
            x + (sceneHash(i, seed + 41) - 0.5) * height * 0.48,
            crownY + (sceneHash(i + 6, seed + 41) - 0.5) * height * 0.29,
            height * 0.009,
            0,
            Math.PI * 2
        );
        ctx.fill();
    }

    ctx.restore();
}


function drawBush(x, baseY, size, color, flowerColor = null) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(x - size * 0.52, baseY - size * 0.18, size * 0.52, size * 0.34, 0, 0, Math.PI * 2);
    ctx.ellipse(x + size * 0.12, baseY - size * 0.31, size * 0.44, size * 0.42, 0, 0, Math.PI * 2);
    ctx.ellipse(x + size * 0.58, baseY - size * 0.14, size * 0.42, size * 0.28, 0, 0, Math.PI * 2);
    ctx.fill();

    if (flowerColor) {
        ctx.fillStyle = flowerColor;
        for (let i = 0; i < 4; i++) {
            ctx.beginPath();
            ctx.arc(
                x + (sceneHash(i, size) - 0.5) * size * 1.15,
                baseY - size * (0.25 + sceneHash(i + 5, size) * 0.35),
                2.2,
                0,
                Math.PI * 2
            );
            ctx.fill();
        }
    }

    ctx.restore();
}


function drawMistBand(y, height, color, parallax = 0.1, seed = 0) {
    const offset = (game.cameraX * parallax) % 520;

    ctx.save();

    const gradient = ctx.createLinearGradient(0, y - height * 0.55, 0, y + height * 0.55);
    gradient.addColorStop(0, "rgba(255,255,255,0)");
    gradient.addColorStop(0.48, color);
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, y - height * 0.55, canvas.width, height * 1.1);

    ctx.globalAlpha = 0.5;
    ctx.fillStyle = color;
    for (let i = 0; i < 5; i++) {
        const cloudX =
            wrapSceneValue(i * 260 - offset + sceneHash(i, seed) * 120, canvas.width + 420) - 210;
        ctx.beginPath();
        ctx.ellipse(
            cloudX,
            y + (sceneHash(i + 7, seed) - 0.5) * height * 0.34,
            220 + sceneHash(i + 13, seed) * 70,
            height * (0.18 + sceneHash(i + 19, seed) * 0.12),
            0,
            0,
            Math.PI * 2
        );
        ctx.fill();
    }

    ctx.restore();
}


function drawFallingLeaves(count, colors, top, bottom, seed = 0) {
    const time = performance.now() / 1000;

    ctx.save();
    for (let i = 0; i < count; i++) {
        const x =
            wrapSceneValue(
                sceneHash(i, seed) * canvas.width -
                game.cameraX * 0.42 +
                Math.sin(time * 0.55 + i) * 26,
                canvas.width + 120
            ) - 60;
        const y =
            top +
            wrapSceneValue(
                sceneHash(i + 5, seed) * (bottom - top) +
                time * (12 + sceneHash(i + 8, seed) * 15),
                bottom - top
            );

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(time * 0.8 + i * 1.7);
        ctx.globalAlpha = 0.38 + sceneHash(i + 12, seed) * 0.22;
        ctx.fillStyle = colors[i % colors.length];
        ctx.beginPath();
        ctx.ellipse(0, 0, 4.8, 2.1, 0.35, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
    ctx.restore();
}


function drawStarField(count, maxY, alpha, parallax, seed) {
    const time = performance.now() / 1000;

    ctx.save();
    for (let i = 0; i < count; i++) {
        const x =
            wrapSceneValue(
                sceneHash(i, seed) * canvas.width - game.cameraX * parallax,
                canvas.width + 40
            ) - 20;
        const y = 8 + sceneHash(i + 7, seed) * maxY;
        const size = 0.8 + sceneHash(i + 13, seed) * 1.7;
        const twinkle =
            0.58 +
            Math.sin(time * (0.7 + sceneHash(i + 19, seed) * 1.3) + i * 2.1) * 0.35;

        ctx.globalAlpha = alpha * twinkle;
        ctx.fillStyle =
            i % 9 === 0
                ? "rgba(255,235,197,0.95)"
                : i % 4 === 0
                    ? "rgba(174,211,255,0.92)"
                    : "rgba(236,246,255,0.88)";
        ctx.fillRect(x, y, size, size);
    }
    ctx.restore();
}


function drawShootingStar(seed, y, delay = 0, length = 90) {
    const time = performance.now() / 1000;
    const cycle = wrapSceneValue(time * 0.075 + seed + delay, 1);

    if (cycle > 0.2) {
        return;
    }

    const progress = cycle / 0.2;
    const startX = canvas.width * (0.72 + sceneHash(seed, 2) * 0.2);
    const x = startX - progress * 210;
    const starY = y + progress * 72;
    const fade = Math.sin(progress * Math.PI);

    ctx.save();
    ctx.globalAlpha = fade * 0.9;
    ctx.strokeStyle = "rgba(220,241,255,0.95)";
    ctx.lineWidth = 2;
    ctx.shadowColor = "#cde8ff";
    ctx.shadowBlur = 9;
    ctx.beginPath();
    ctx.moveTo(x + length, starY - length * 0.34);
    ctx.lineTo(x, starY);
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(x, starY, 1.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}


function drawRingedPlanet(x, y, radius, baseColor, highlightColor, ringColor, tilt = -0.28, alpha = 1) {
    ctx.save();
    ctx.globalAlpha = alpha;

    const halo = ctx.createRadialGradient(x, y, radius * 0.4, x, y, radius * 2.65);
    halo.addColorStop(0, "rgba(151,196,255,0.18)");
    halo.addColorStop(0.55, "rgba(103,159,226,0.06)");
    halo.addColorStop(1, "rgba(15,28,58,0)");
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(x, y, radius * 2.65, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = ringColor;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.ellipse(x, y, radius * 1.92, radius * 0.54, tilt, 0, Math.PI * 2);
    ctx.stroke();

    ctx.globalAlpha = alpha * 0.5;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(x, y, radius * 1.66, radius * 0.43, tilt, 0, Math.PI * 2);
    ctx.stroke();

    ctx.globalAlpha = alpha;
    const planet = ctx.createRadialGradient(
        x - radius * 0.4,
        y - radius * 0.45,
        radius * 0.08,
        x,
        y,
        radius
    );
    planet.addColorStop(0, highlightColor);
    planet.addColorStop(0.45, baseColor);
    planet.addColorStop(1, "rgba(5,12,29,0.96)");

    ctx.fillStyle = planet;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = "rgba(4,10,26,0.34)";
    ctx.beginPath();
    ctx.arc(x + radius * 0.72, y + radius * 0.26, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.strokeStyle = ringColor;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.ellipse(x, y, radius * 1.92, radius * 0.54, tilt, 0, Math.PI);
    ctx.stroke();

    ctx.fillStyle = "rgba(255,255,255,0.38)";
    ctx.beginPath();
    ctx.arc(x - radius * 0.36, y - radius * 0.42, radius * 0.1, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}


function drawCitySkyline(baseY, color, windowColor) {
    const offset = (game.cameraX * 0.11) % 280;

    ctx.save();
    for (let i = -1; i < 9; i++) {
        const x = i * 140 - offset + sceneHash(i, 4) * 34;
        const width = 54 + sceneHash(i + 3, 4) * 42;
        const height = 55 + sceneHash(i + 7, 4) * 118;

        ctx.fillStyle = color;
        ctx.fillRect(x, baseY - height, width, height);

        if (i % 3 === 0) {
            ctx.fillRect(x + width * 0.22, baseY - height - 12, width * 0.56, 12);
            ctx.fillRect(x + width * 0.31, baseY - height - 21, width * 0.38, 9);
        } else if (i % 4 === 0) {
            ctx.beginPath();
            ctx.moveTo(x - 3, baseY - height);
            ctx.lineTo(x + width * 0.5, baseY - height - 19);
            ctx.lineTo(x + width + 3, baseY - height);
            ctx.closePath();
            ctx.fill();
        } else if (i % 5 === 0) {
            ctx.fillRect(x + width * 0.36, baseY - height - 16, width * 0.24, 16);
        }

        ctx.fillRect(x + width * 0.2, baseY - height - 13, 3, 13);
        ctx.fillStyle = "rgba(255,236,191,0.46)";
        ctx.fillRect(x + width * 0.8, baseY - height - 9, 2.5, 9);

        ctx.fillStyle = windowColor;
        for (let row = 0; row < 5; row++) {
            for (let column = 0; column < 3; column++) {
                if (sceneHash(i * 13 + row * 3 + column, 8) > 0.55) {
                    ctx.fillRect(
                        x + 10 + column * (width - 22) / 3,
                        baseY - height + 12 + row * 15,
                        4,
                        5
                    );
                }
            }
        }
    }
    ctx.restore();
}


function drawParkLamp(x, baseY, height, accent) {
    const lampY = baseY - height;

    ctx.save();
    ctx.strokeStyle = "rgba(48,58,49,0.82)";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x, baseY);
    ctx.lineTo(x, lampY + 12);
    ctx.quadraticCurveTo(x + 8, lampY, x + 20, lampY);
    ctx.stroke();

    const glow = ctx.createRadialGradient(x + 20, lampY + 4, 1, x + 20, lampY + 4, 28);
    glow.addColorStop(0, "rgba(255,232,168,0.58)");
    glow.addColorStop(1, "rgba(255,221,139,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x + 20, lampY + 4, 28, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.arc(x + 20, lampY + 2, 4.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(56,63,49,0.76)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + 8, lampY + 2);
    ctx.lineTo(x + 32, lampY + 2);
    ctx.stroke();
    ctx.restore();
}


function drawAlpineLayer(baseY, topMin, topMax, color, snowColor, parallax, seed, spacing = 460) {
    const offset = (game.cameraX * parallax) % spacing;

    ctx.save();
    for (let i = -1; i < Math.ceil(canvas.width / spacing) + 2; i++) {
        const x = i * spacing - offset;
        const peakX = x + spacing * (0.44 + sceneHash(i, seed) * 0.16);
        const peakY = topMin + sceneHash(i + 5, seed) * (topMax - topMin);

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(x, baseY);
        ctx.lineTo(x + spacing * 0.27, peakY + (baseY - peakY) * 0.48);
        ctx.lineTo(peakX, peakY);
        ctx.lineTo(x + spacing * 0.76, peakY + (baseY - peakY) * 0.35);
        ctx.lineTo(x + spacing, baseY);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "rgba(16,32,41,0.12)";
        ctx.beginPath();
        ctx.moveTo(peakX, peakY);
        ctx.lineTo(x + spacing * 0.76, peakY + (baseY - peakY) * 0.35);
        ctx.lineTo(x + spacing, baseY);
        ctx.lineTo(peakX, baseY);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = "rgba(232,244,247,0.14)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(peakX, peakY);
        ctx.lineTo(x + spacing * 0.27, peakY + (baseY - peakY) * 0.48);
        ctx.stroke();

        const snowDepth = (baseY - peakY) * (0.22 + sceneHash(i + 12, seed) * 0.12);
        ctx.fillStyle = snowColor;
        ctx.beginPath();
        ctx.moveTo(peakX, peakY);
        ctx.lineTo(peakX - spacing * 0.13, peakY + snowDepth * 0.82);
        ctx.lineTo(peakX - spacing * 0.04, peakY + snowDepth * 0.58);
        ctx.lineTo(peakX + spacing * 0.03, peakY + snowDepth * 0.92);
        ctx.lineTo(peakX + spacing * 0.12, peakY + snowDepth * 0.66);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = "rgba(239,249,251,0.16)";
        ctx.beginPath();
        ctx.moveTo(peakX - spacing * 0.04, peakY + snowDepth * 0.58);
        ctx.lineTo(peakX - spacing * 0.09, peakY + snowDepth * 1.5);
        ctx.moveTo(peakX + spacing * 0.03, peakY + snowDepth * 0.92);
        ctx.lineTo(peakX + spacing * 0.06, peakY + snowDepth * 1.7);
        ctx.stroke();
    }
    ctx.restore();
}


function drawAlpineCabin(x, baseY, scale, accent) {
    const time = performance.now() / 1000;

    ctx.save();
    ctx.translate(x, baseY);
    ctx.scale(scale, scale);

    ctx.fillStyle = "rgba(57,49,43,0.86)";
    ctx.beginPath();
    ctx.ellipse(0, 4, 76, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#6b4a36";
    roundRect(-54, -58, 108, 60, 4);
    ctx.fill();

    ctx.fillStyle = "#50382d";
    ctx.beginPath();
    ctx.moveTo(-68, -56);
    ctx.lineTo(0, -101);
    ctx.lineTo(68, -56);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "rgba(238,245,239,0.9)";
    ctx.beginPath();
    ctx.moveTo(-69, -56);
    ctx.lineTo(-54, -66);
    ctx.lineTo(0, -101);
    ctx.lineTo(51, -67);
    ctx.lineTo(68, -56);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "rgba(255,210,124,0.92)";
    ctx.shadowColor = "#ffc36c";
    ctx.shadowBlur = 14;
    ctx.fillRect(-32, -44, 22, 21);
    ctx.fillRect(13, -44, 22, 21);
    ctx.fillStyle = "#49352b";
    ctx.fillRect(-2, -42, 20, 42);
    ctx.shadowBlur = 0;

    ctx.fillStyle = "#49352b";
    ctx.fillRect(26, -90, 9, 25);
    ctx.fillStyle = "rgba(218,222,218,0.36)";
    for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(31 + Math.sin(time * 0.55 + i) * 7, -102 - i * 13, 5 + i * 2.6, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.fillStyle = accent;
    ctx.fillRect(-54, -60, 108, 2);
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = "#dfe9e6";
    ctx.fillRect(-49, -57, 98, 4);
    ctx.restore();
}


function drawLunarModule(x, baseY, scale, accent, seed) {
    const time = performance.now() / 1000;

    ctx.save();
    ctx.translate(x, baseY);
    ctx.scale(scale, scale);

    ctx.fillStyle = "rgba(7,14,23,0.42)";
    ctx.beginPath();
    ctx.ellipse(0, 7, 117, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#3b5160";
    roundRect(-66, -34, 132, 38, 6);
    ctx.fill();

    ctx.fillStyle = "rgba(57,82,97,0.96)";
    ctx.beginPath();
    ctx.arc(0, -31, 55, Math.PI, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(176,225,239,0.58)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(0, -31, 55, Math.PI, Math.PI * 2);
    ctx.stroke();

    for (let i = 0; i < 4; i++) {
        const angle = Math.PI + i * Math.PI / 4;
        ctx.beginPath();
        ctx.moveTo(Math.cos(angle) * 55, -31 + Math.sin(angle) * 55);
        ctx.lineTo(Math.cos(angle) * 17, -31 + Math.sin(angle) * 17);
        ctx.stroke();
    }

    ctx.strokeStyle = "rgba(148,198,216,0.34)";
    ctx.beginPath();
    ctx.arc(0, -31, 35, Math.PI, Math.PI * 2);
    ctx.stroke();

    for (let i = 0; i < 5; i++) {
        ctx.fillStyle = i === 2 ? accent : "rgba(255,206,132,0.86)";
        ctx.shadowColor = accent;
        ctx.shadowBlur = 9;
        ctx.fillRect(-43 + i * 20, -26, 10, 8);
    }
    ctx.shadowBlur = 0;

    ctx.fillStyle = "#293c49";
    roundRect(65, -18, 42, 22, 5);
    ctx.fill();
    ctx.fillStyle = "rgba(111,192,210,0.58)";
    ctx.beginPath();
    ctx.ellipse(86, -19, 21, 11, 0, Math.PI, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(155,217,235,0.48)";
    ctx.beginPath();
    ctx.moveTo(-52, -46);
    ctx.lineTo(-78, -78);
    ctx.stroke();

    ctx.fillStyle = "#2e4350";
    ctx.save();
    ctx.translate(-80, -54);
    ctx.rotate(-0.22);
    roundRect(0, 0, 48, 24, 3);
    ctx.fill();
    ctx.strokeStyle = "rgba(139,205,226,0.48)";
    ctx.lineWidth = 1;
    for (let i = 1; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(i * 16, 1);
        ctx.lineTo(i * 16, 23);
        ctx.stroke();
    }
    for (let i = 1; i < 2; i++) {
        ctx.beginPath();
        ctx.moveTo(1, i * 12);
        ctx.lineTo(47, i * 12);
        ctx.stroke();
    }
    ctx.restore();

    ctx.strokeStyle = "rgba(212,240,248,0.7)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(24, -78);
    ctx.lineTo(24, -118);
    ctx.stroke();

    const blink = 0.55 + Math.sin(time * 3.2 + seed) * 0.35;
    ctx.globalAlpha = blink;
    ctx.fillStyle = accent;
    ctx.shadowColor = accent;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(24, -120, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;

    ctx.fillStyle = "rgba(165,220,236,0.7)";
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.arc(-54 + i * 27, 5, 2.2, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.restore();
}


function drawSceneVignette() {
    const strength = game.theme >= 4 ? 0.3 : 0.16;
    const vignette = ctx.createRadialGradient(
        canvas.width * 0.5,
        canvas.height * 0.4,
        canvas.width * 0.2,
        canvas.width * 0.5,
        canvas.height * 0.52,
        canvas.width * 0.72
    );
    vignette.addColorStop(0, "rgba(0,0,0,0)");
    vignette.addColorStop(1, `rgba(0,0,0,${strength})`);
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}


function drawMoonBaseBackground(t) {
    const time = performance.now() / 1000;

    const sky = ctx.createLinearGradient(0, 0, 0, 520);
    sky.addColorStop(0, "rgba(3,10,23,0.9)");
    sky.addColorStop(0.55, "rgba(14,32,47,0.4)");
    sky.addColorStop(1, "rgba(42,57,64,0.22)");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawStarField(64, 470, 0.88, 0.028, 7.7);
    drawStarField(26, 300, 0.55, 0.06, 12.4);
    drawShootingStar(3.2, 84, 0.16, 96);
    drawShootingStar(8.7, 142, 0.54, 72);

    const earthX = 925;
    const earthY = 92;
    const earthRadius = 58;

    const atmosphere = ctx.createRadialGradient(
        earthX,
        earthY,
        earthRadius * 0.5,
        earthX,
        earthY,
        earthRadius * 2.15
    );
    atmosphere.addColorStop(0, "rgba(139,210,245,0.3)");
    atmosphere.addColorStop(0.55, "rgba(76,154,209,0.1)");
    atmosphere.addColorStop(1, "rgba(20,54,89,0)");
    ctx.fillStyle = atmosphere;
    ctx.beginPath();
    ctx.arc(earthX, earthY, earthRadius * 2.15, 0, Math.PI * 2);
    ctx.fill();

    const earth = ctx.createRadialGradient(
        earthX - earthRadius * 0.38,
        earthY - earthRadius * 0.4,
        earthRadius * 0.08,
        earthX,
        earthY,
        earthRadius
    );
    earth.addColorStop(0, "#f4fdff");
    earth.addColorStop(0.22, "#80c9e7");
    earth.addColorStop(0.5, "#347cae");
    earth.addColorStop(1, "rgba(16,45,76,0.96)");
    ctx.fillStyle = earth;
    ctx.beginPath();
    ctx.arc(earthX, earthY, earthRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.beginPath();
    ctx.arc(earthX, earthY, earthRadius, 0, Math.PI * 2);
    ctx.clip();

    ctx.fillStyle = "rgba(87,150,102,0.62)";
    ctx.beginPath();
    ctx.ellipse(earthX - 21, earthY - 15, 17, 9, -0.55, 0, Math.PI * 2);
    ctx.ellipse(earthX + 20, earthY + 16, 12, 17, 0.52, 0, Math.PI * 2);
    ctx.ellipse(earthX - 30, earthY + 27, 7, 10, -0.3, 0, Math.PI * 2);
    ctx.ellipse(earthX + 5, earthY - 31, 9, 5, 0.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(171,151,96,0.32)";
    ctx.beginPath();
    ctx.ellipse(earthX - 9, earthY + 3, 8, 11, 0.2, 0, Math.PI * 2);
    ctx.ellipse(earthX + 31, earthY - 8, 6, 8, -0.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(244,252,255,0.74)";
    ctx.beginPath();
    ctx.ellipse(earthX, earthY - earthRadius + 5, earthRadius * 0.8, 8, 0, 0, Math.PI);
    ctx.fill();

    ctx.strokeStyle = "rgba(255,255,255,0.38)";
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.ellipse(earthX - 2, earthY - 5, 43, 9, 0.3, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(earthX + 12, earthY + 25, 28, 6.5, -0.2, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(earthX - 18, earthY + 11, 26, 5, -0.45, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = "rgba(3,16,34,0.38)";
    ctx.beginPath();
    ctx.arc(earthX + 69, earthY + 19, earthRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.strokeStyle = "rgba(175,231,255,0.48)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(earthX, earthY, earthRadius + 2, 0, Math.PI * 2);
    ctx.stroke();

    drawTechLine(earthX - 76, earthY - 82, earthX - 20, earthY - 53, "rgba(219,243,255,0.26)", 1, 3);

    ctx.fillStyle = "rgba(38,54,67,0.62)";
    ctx.beginPath();
    ctx.moveTo(0, 425);
    ctx.quadraticCurveTo(135, 380, 292, 420);
    ctx.quadraticCurveTo(470, 458, 625, 404);
    ctx.quadraticCurveTo(790, 364, 925, 414);
    ctx.quadraticCurveTo(1030, 438, 1100, 408);
    ctx.lineTo(1100, 505);
    ctx.lineTo(0, 505);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "rgba(51,68,80,0.82)";
    ctx.beginPath();
    ctx.moveTo(0, 458);
    ctx.quadraticCurveTo(160, 427, 340, 457);
    ctx.quadraticCurveTo(525, 487, 710, 445);
    ctx.quadraticCurveTo(915, 413, 1100, 458);
    ctx.lineTo(1100, 505);
    ctx.lineTo(0, 505);
    ctx.closePath();
    ctx.fill();

    for (let i = 0; i < 12; i++) {
        const x =
            wrapSceneValue(i * 129 - game.cameraX * 0.14 + 40, canvas.width + 180) - 90;
        const y = 462 + (i % 4) * 11 + sceneHash(i, 4) * 8;
        const radius = 13 + sceneHash(i + 5, 4) * 21;

        ctx.fillStyle = "rgba(13,27,38,0.34)";
        ctx.beginPath();
        ctx.ellipse(x, y, radius, radius * 0.28, -0.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(163,193,207,0.24)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(x - 2, y - 2, radius, radius * 0.28, -0.1, Math.PI, Math.PI * 2);
        ctx.stroke();
    }

    const moduleOffset = (game.cameraX * 0.14) % 620;
    for (let i = -1; i < 4; i++) {
        const moduleX = i * 620 - moduleOffset + 210;

        drawLunarModule(moduleX, 456, 0.92, t.accent, i * 2.1);
        drawLunarModule(moduleX + 176, 476, 0.54, t.accent, i * 2.1 + 3.2);

        ctx.strokeStyle = "rgba(117,174,197,0.34)";
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.moveTo(moduleX + 62, 447);
        ctx.lineTo(moduleX + 160, 464);
        ctx.stroke();

        drawTechLine(
            moduleX - 30,
            447,
            moduleX + 160,
            464,
            "rgba(168,220,237,0.24)",
            1,
            3
        );

        const roverX = moduleX + 278;
        ctx.fillStyle = "rgba(93,124,137,0.92)";
        roundRect(roverX, 448, 36, 15, 4);
        ctx.fill();
        ctx.fillStyle = "rgba(30,43,51,0.95)";
        ctx.beginPath();
        ctx.arc(roverX + 8, 465, 6, 0, Math.PI * 2);
        ctx.arc(roverX + 29, 465, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = t.accent;
        ctx.beginPath();
        ctx.arc(roverX + 33, 451, 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(201,232,242,0.58)";
        ctx.beginPath();
        ctx.moveTo(roverX + 17, 448);
        ctx.lineTo(roverX + 17, 436);
        ctx.stroke();
    }

    ctx.save();
    for (let i = 0; i < 18; i++) {
        const x =
            wrapSceneValue(
                sceneHash(i, 21) * canvas.width -
                game.cameraX * 0.3 +
                Math.sin(time * 0.35 + i) * 18,
                canvas.width + 50
            ) - 25;
        const y =
            320 +
            wrapSceneValue(
                sceneHash(i + 8, 21) * 190 + time * (4 + sceneHash(i, 9) * 5),
                190
            );

        ctx.globalAlpha = 0.18 + sceneHash(i + 4, 9) * 0.25;
        ctx.fillStyle = "rgba(215,235,241,0.8)";
        ctx.fillRect(x, y, 1.4, 1.4);
    }
    ctx.restore();
}


function drawForestBackground(t) {
    const time = performance.now() / 1000;

    const atmosphere = ctx.createLinearGradient(0, 0, 0, 505);
    atmosphere.addColorStop(0, "rgba(26,61,50,0.18)");
    atmosphere.addColorStop(0.52, "rgba(213,194,133,0.06)");
    atmosphere.addColorStop(1, "rgba(24,56,41,0.34)");
    ctx.fillStyle = atmosphere;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawSun(888, 82, 39);

    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.fillStyle = "#ffe8ae";
    ctx.globalAlpha = 0.062;
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(872, 98);
        ctx.lineTo(480 + i * 142, 600);
        ctx.lineTo(586 + i * 142, 600);
        ctx.closePath();
        ctx.fill();
    }
    ctx.restore();

    ctx.save();
    ctx.fillStyle = "rgba(27,65,44,0.58)";
    for (let i = 0; i < 7; i++) {
        ctx.beginPath();
        ctx.ellipse(
            92 + i * 13,
            66 + (i % 4) * 18,
            17,
            7,
            0.7,
            0,
            Math.PI * 2
        );
        ctx.ellipse(
            canvas.width - 102 - i * 12,
            54 + (i % 5) * 16,
            16,
            6,
            -0.65,
            0,
            Math.PI * 2
        );
        ctx.fill();
    }
    ctx.restore();

    drawMountains(
        "rgba(92,119,97,0.52)",
        "rgba(44,76,58,0.76)",
        0.1
    );

    drawMistBand(350, 92, "rgba(222,230,193,0.17)", 0.08, 3);
    drawMistBand(444, 54, "rgba(190,214,176,0.12)", 0.14, 8);

    ctx.save();
    for (let i = 0; i < 4; i++) {
        drawSoftCloud(
            (i * 300 - game.cameraX * 0.055) % 1250 - 120,
            92 + (i % 2) * 42,
            0.65 + (i % 3) * 0.12,
            0.22
        );
    }
    ctx.restore();

    const farOffset = (game.cameraX * 0.12) % 310;
    for (let i = -1; i < 5; i++) {
        const x = i * 310 - farOffset + 96;
        drawBroadleafTree(
            x,
            486,
            145 + sceneHash(i, 2) * 82,
            "rgba(61,93,71,0.38)",
            "rgba(46,67,51,0.34)",
            0.82,
            i
        );
    }

    const midOffset = (game.cameraX * 0.26) % 355;
    for (let i = -1; i < 4; i++) {
        const x = i * 355 - midOffset + 118;
        drawBroadleafTree(
            x,
            505,
            205 + sceneHash(i + 4, 5) * 92,
            "rgba(40,75,56,0.72)",
            "rgba(42,57,43,0.72)",
            0.92,
            i + 7
        );
    }

    const pineOffset = (game.cameraX * 0.38) % 440;
    for (let i = -1; i < 4; i++) {
        const x = i * 440 - pineOffset + 58;
        drawPineTree(x, 516, 166 + sceneHash(i, 9) * 72, "#203f32", 0.82);
        drawPineTree(x + 190, 520, 118 + sceneHash(i + 2, 9) * 54, "#29493a", 0.68);
    }

    const bushOffset = (game.cameraX * 0.44) % 270;
    for (let i = -1; i < 5; i++) {
        const x = i * 270 - bushOffset + 70;
        drawBush(x, 507, 26 + sceneHash(i, 13) * 18, "rgba(35,70,50,0.9)", "rgba(230,210,126,0.76)");
    }

    const mushroomOffset = (game.cameraX * 0.5) % 330;
    for (let i = -1; i < 5; i++) {
        if (sceneHash(i, 43) < 0.35) {
            continue;
        }

        const x = i * 330 - mushroomOffset + 150 + sceneHash(i, 44) * 70;
        const size = 3 + sceneHash(i, 45) * 4;

        ctx.fillStyle = "rgba(216,204,164,0.72)";
        ctx.fillRect(x - size * 0.26, 490, size * 0.52, size * 1.5);
        ctx.fillStyle = "rgba(205,121,79,0.82)";
        ctx.beginPath();
        ctx.ellipse(x, 490, size * 1.3, size * 0.58, 0, Math.PI, Math.PI * 2);
        ctx.fill();
    }

    drawBird(175, 116, 0.9, "rgba(27,53,43,0.72)", 0.7, 0.8);
    drawBird(228, 100, 0.65, "rgba(27,53,43,0.58)", 0.58, 2.2);
    drawBird(985, 128, 0.72, "rgba(27,53,43,0.62)", 0.6, 4.1);

    drawFallingLeaves(
        12,
        ["rgba(226,206,128,0.8)", "rgba(173,196,117,0.75)", "rgba(208,150,91,0.7)"],
        105,
        470,
        11
    );

    ctx.save();
    for (let i = 0; i < 17; i++) {
        const x =
            wrapSceneValue(
                sceneHash(i, 17) * canvas.width -
                game.cameraX * 0.48 +
                Math.sin(time * 0.8 + i * 1.4) * 24,
                canvas.width + 70
            ) - 35;
        const y =
            290 +
            sceneHash(i + 4, 17) * 170 +
            Math.sin(time * 1.3 + i) * 8;
        const pulse = 0.45 + Math.sin(time * 2.2 + i * 1.7) * 0.3;

        ctx.globalAlpha = Math.max(0.12, pulse);
        ctx.fillStyle = "rgba(237,244,157,0.9)";
        ctx.shadowColor = "#e8f58f";
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(x, y, 1.6 + sceneHash(i, 6) * 1.2, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = "rgba(20,51,37,0.62)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(34, 0);
    ctx.bezierCurveTo(52, 88, 30, 162, 48, 222);
    ctx.moveTo(canvas.width - 44, 0);
    ctx.bezierCurveTo(canvas.width - 74, 86, canvas.width - 38, 170, canvas.width - 62, 238);
    ctx.stroke();

    ctx.fillStyle = "rgba(26,61,43,0.66)";
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.ellipse(38 + i * 4, 34 + i * 38, 10, 4, 0.45, 0, Math.PI * 2);
        ctx.ellipse(canvas.width - 50 - i * 4, 42 + i * 39, 9, 3.7, -0.45, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();
}


/* =========================================================
   CIDADE
   ========================================================= */

function drawParkBackground(t) {
    const time = performance.now() / 1000;

    const sunset = ctx.createLinearGradient(0, 160, 0, 505);
    sunset.addColorStop(0, "rgba(255,218,162,0)");
    sunset.addColorStop(0.52, "rgba(255,205,139,0.12)");
    sunset.addColorStop(1, "rgba(81,107,70,0.28)");
    ctx.fillStyle = sunset;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawSun(872, 88, 37);

    for (let i = 0; i < 4; i++) {
        drawSoftCloud(
            (i * 285 - game.cameraX * 0.07) % 1270 - 110,
            78 + (i % 2) * 42,
            0.7 + (i % 3) * 0.13,
            0.42
        );
    }

    drawCitySkyline(
        390,
        "rgba(83,103,101,0.48)",
        "rgba(255,221,157,0.48)"
    );

    const treeLineOffset = (game.cameraX * 0.09) % 220;
    for (let i = -1; i < 7; i++) {
        const x = i * 220 - treeLineOffset + 60;
        drawBush(
            x,
            422,
            38 + sceneHash(i, 3) * 18,
            "rgba(60,104,74,0.48)"
        );
    }

    ctx.fillStyle = "rgba(90,132,92,0.4)";
    ctx.beginPath();
    ctx.moveTo(0, 402);
    ctx.quadraticCurveTo(210, 342, 430, 398);
    ctx.quadraticCurveTo(710, 344, 1100, 390);
    ctx.lineTo(1100, 505);
    ctx.lineTo(0, 505);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "rgba(58,104,73,0.36)";
    ctx.beginPath();
    ctx.moveTo(0, 462);
    ctx.quadraticCurveTo(250, 422, 510, 462);
    ctx.quadraticCurveTo(760, 489, 1100, 448);
    ctx.lineTo(1100, 505);
    ctx.lineTo(0, 505);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "rgba(229,205,160,0.22)";
    ctx.beginPath();
    ctx.moveTo(470, 505);
    ctx.bezierCurveTo(505, 460, 600, 432, 670, 402);
    ctx.bezierCurveTo(714, 384, 766, 382, 792, 398);
    ctx.bezierCurveTo(690, 437, 620, 468, 594, 505);
    ctx.closePath();
    ctx.fill();

    const pondX = wrapSceneValue(360 - game.cameraX * 0.09, 1220) - 60;
    const pondGradient = ctx.createLinearGradient(0, 434, 0, 468);
    pondGradient.addColorStop(0, "rgba(150,205,199,0.58)");
    pondGradient.addColorStop(0.55, "rgba(76,149,152,0.62)");
    pondGradient.addColorStop(1, "rgba(39,93,105,0.74)");
    ctx.fillStyle = pondGradient;
    ctx.beginPath();
    ctx.ellipse(pondX, 450, 118, 22, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(235,245,230,0.34)";
    ctx.lineWidth = 1.4;
    for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.ellipse(
            pondX - 35 + i * 24,
            447 + (i % 2) * 7,
            20 + i * 5,
            2.5,
            0,
            0,
            Math.PI * 2
        );
        ctx.stroke();
    }

    ctx.fillStyle = "rgba(44,91,64,0.76)";
    for (let i = 0; i < 5; i++) {
        ctx.fillRect(pondX - 84 + i * 38, 438 - (i % 3) * 4, 2, 24 + (i % 2) * 8);
    }

    for (let i = 0; i < 2; i++) {
        const duckX = pondX - 20 + i * 42;
        const duckY = 442 + i * 5;
        ctx.fillStyle = "rgba(243,235,201,0.8)";
        ctx.beginPath();
        ctx.ellipse(duckX, duckY, 9, 4.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(duckX + 7, duckY - 4, 3.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(211,150,83,0.9)";
        ctx.beginPath();
        ctx.moveTo(duckX + 10, duckY - 4);
        ctx.lineTo(duckX + 14, duckY - 3);
        ctx.lineTo(duckX + 10, duckY - 1);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = "rgba(233,245,235,0.26)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(duckX, duckY + 4, 15, 2.5, 0, 0, Math.PI * 2);
        ctx.stroke();
    }

    const treeOffset = (game.cameraX * 0.23) % 330;
    for (let i = -1; i < 4; i++) {
        const x = i * 330 - treeOffset + 92;
        drawBroadleafTree(
            x,
            505,
            164 + sceneHash(i, 6) * 72,
            "rgba(66,113,75,0.78)",
            "rgba(65,71,53,0.78)",
            0.9,
            i + 4
        );
    }

    const gazeboOffset = (game.cameraX * 0.17) % 1120;
    for (let i = -1; i < 2; i++) {
        const x = i * 1120 - gazeboOffset + 800;

        if (x < -180 || x > canvas.width + 180) {
            continue;
        }

        ctx.fillStyle = "rgba(137,117,82,0.42)";
        ctx.beginPath();
        ctx.ellipse(x, 474, 82, 13, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "rgba(225,211,175,0.54)";
        for (let column = 0; column < 4; column++) {
            ctx.fillRect(x - 57 + column * 38, 406, 7, 63);
        }

        ctx.fillStyle = "rgba(184,120,75,0.68)";
        ctx.beginPath();
        ctx.moveTo(x - 78, 408);
        ctx.lineTo(x - 25, 368);
        ctx.lineTo(x, 350);
        ctx.lineTo(x + 25, 368);
        ctx.lineTo(x + 78, 408);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = "rgba(253,223,157,0.44)";
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(x - 72, 410);
        ctx.lineTo(x, 410);
        ctx.lineTo(x + 72, 410);
        ctx.stroke();

        ctx.fillStyle = "rgba(255,219,145,0.68)";
        ctx.shadowColor = "#ffd27b";
        ctx.shadowBlur = 9;
        ctx.beginPath();
        ctx.arc(x, 396, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }

    const propOffset = (game.cameraX * 0.34) % 440;
    for (let i = -1; i < 4; i++) {
        const x = i * 440 - propOffset + 120;

        drawParkLamp(x, 505, 102 + (i % 2) * 12, t.accent);

        ctx.fillStyle = "rgba(100,78,55,0.82)";
        roundRect(x + 66, 468, 68, 7, 3);
        ctx.fill();
        ctx.fillStyle = "rgba(58,54,42,0.86)";
        ctx.fillRect(x + 75, 475, 4, 19);
        ctx.fillRect(x + 121, 475, 4, 19);
    }

    const flowerOffset = (game.cameraX * 0.54) % 350;
    for (let i = -1; i < 5; i++) {
        const x = i * 350 - flowerOffset + 90;
        drawBush(x, 509, 14 + sceneHash(i, 16) * 8, "rgba(44,91,63,0.88)", "rgba(241,199,112,0.86)");
    }

    drawBird(206, 120, 0.82, "rgba(52,74,66,0.68)", 0.68, 0.7);
    drawBird(258, 104, 0.62, "rgba(52,74,66,0.54)", 0.56, 2.4);
    drawBird(886, 132, 0.7, "rgba(52,74,66,0.62)", 0.62, 4.5);

    drawFallingLeaves(
        10,
        ["rgba(232,184,103,0.8)", "rgba(178,193,111,0.7)", "rgba(212,144,91,0.72)"],
        98,
        470,
        19
    );

    ctx.save();
    for (let i = 0; i < 10; i++) {
        const x =
            wrapSceneValue(
                sceneHash(i, 31) * canvas.width -
                game.cameraX * 0.5 +
                Math.sin(time * 0.5 + i) * 20,
                canvas.width + 60
            ) - 30;
        const y = 350 + sceneHash(i + 4, 31) * 105;

        ctx.globalAlpha = 0.22 + sceneHash(i, 6) * 0.18;
        ctx.fillStyle = "rgba(255,232,169,0.85)";
        ctx.fillRect(x, y, 1.5, 1.5);
    }
    ctx.restore();
}


/* =========================================================
   RUÍNAS
   ========================================================= */

function drawSchoolBackground(t) {
    const time = performance.now() / 1000;

    const afternoon = ctx.createLinearGradient(0, 120, 0, 505);
    afternoon.addColorStop(0, "rgba(255,226,178,0)");
    afternoon.addColorStop(0.55, "rgba(255,213,154,0.12)");
    afternoon.addColorStop(1, "rgba(111,112,70,0.2)");
    ctx.fillStyle = afternoon;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawSun(858, 84, 35);

    for (let i = 0; i < 4; i++) {
        drawSoftCloud(
            (i * 292 - game.cameraX * 0.065) % 1280 - 120,
            76 + (i % 2) * 38,
            0.68 + (i % 3) * 0.14,
            0.38
        );
    }

    ctx.fillStyle = "rgba(104,121,88,0.38)";
    ctx.beginPath();
    ctx.moveTo(0, 420);
    ctx.quadraticCurveTo(210, 364, 440, 414);
    ctx.quadraticCurveTo(700, 456, 1100, 402);
    ctx.lineTo(1100, 505);
    ctx.lineTo(0, 505);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "rgba(75,98,67,0.42)";
    ctx.beginPath();
    ctx.moveTo(0, 463);
    ctx.quadraticCurveTo(260, 430, 515, 463);
    ctx.quadraticCurveTo(810, 492, 1100, 450);
    ctx.lineTo(1100, 505);
    ctx.lineTo(0, 505);
    ctx.closePath();
    ctx.fill();

    const offset = (game.cameraX * 0.18) % 760;

    for (let i = -1; i < 3; i++) {
        const x = i * 760 - offset + 33;
        const litWindow = (row, column) =>
            sceneHash(i * 29 + row * 9 + column, 15) > 0.24;

        drawBroadleafTree(
            x + 22,
            505,
            146 + sceneHash(i, 3) * 46,
            "rgba(59,100,66,0.76)",
            "rgba(64,62,46,0.76)",
            0.82,
            i + 6
        );

        ctx.fillStyle = "rgba(168,143,108,0.8)";
        roundRect(x + 46, 440, 690, 65, 8);
        ctx.fill();

        ctx.fillStyle = "rgba(214,198,164,0.88)";
        roundRect(x + 68, 258, 420, 214, 6);
        ctx.fill();

        ctx.fillStyle = "rgba(177,157,123,0.62)";
        ctx.fillRect(x + 68, 414, 420, 58);

        ctx.fillStyle = "#7f4c3b";
        ctx.beginPath();
        ctx.moveTo(x + 47, 260);
        ctx.lineTo(x + 93, 218);
        ctx.lineTo(x + 469, 218);
        ctx.lineTo(x + 512, 260);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "rgba(219,150,103,0.85)";
        ctx.beginPath();
        ctx.moveTo(x + 48, 260);
        ctx.lineTo(x + 96, 221);
        ctx.lineTo(x + 468, 221);
        ctx.lineTo(x + 511, 260);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "rgba(127,72,54,0.9)";
        ctx.beginPath();
        ctx.moveTo(x + 205, 220);
        ctx.lineTo(x + 272, 183);
        ctx.lineTo(x + 339, 220);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "rgba(239,205,145,0.82)";
        roundRect(x + 219, 226, 108, 22, 3);
        ctx.fill();
        ctx.strokeStyle = "rgba(255,244,210,0.72)";
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 219, 226, 108, 22);
        ctx.fillStyle = "#3c3028";
        ctx.font = "bold 12px Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("ESCOLA", x + 273, 242);
        ctx.textAlign = "left";

        ctx.fillStyle = "rgba(128,116,91,0.78)";
        roundRect(x + 482, 300, 166, 172, 5);
        ctx.fill();

        ctx.fillStyle = "rgba(177,91,61,0.92)";
        ctx.beginPath();
        ctx.moveTo(x + 470, 302);
        ctx.lineTo(x + 506, 270);
        ctx.lineTo(x + 655, 270);
        ctx.lineTo(x + 678, 302);
        ctx.closePath();
        ctx.fill();

        for (let row = 0; row < 2; row++) {
            for (let column = 0; column < 7; column++) {
                const windowX = x + 91 + column * 54;
                const windowY = 275 + row * 64;
                const lit = litWindow(row, column);

                ctx.fillStyle = lit
                    ? "rgba(246,207,139,0.82)"
                    : "rgba(93,112,113,0.54)";
                roundRect(windowX, windowY, 37, 34, 3);
                ctx.fill();
                ctx.strokeStyle = lit
                    ? "rgba(255,239,203,0.74)"
                    : "rgba(196,208,195,0.36)";
                ctx.lineWidth = 1;
                ctx.strokeRect(windowX, windowY, 37, 34);
                ctx.fillStyle = lit ? "rgba(255,244,210,0.6)" : "rgba(43,59,67,0.34)";
                ctx.fillRect(windowX + 17, windowY + 2, 1, 30);
                ctx.fillRect(windowX + 2, windowY + 16, 33, 1);
            }
        }

        for (let row = 0; row < 2; row++) {
            for (let column = 0; column < 2; column++) {
                const windowX = x + 505 + column * 57;
                const windowY = 326 + row * 53;
                ctx.fillStyle = "rgba(240,204,139,0.72)";
                roundRect(windowX, windowY, 35, 30, 3);
                ctx.fill();
                ctx.strokeStyle = "rgba(247,232,197,0.58)";
                ctx.strokeRect(windowX, windowY, 35, 30);
            }
        }

        ctx.fillStyle = "rgba(80,54,42,0.95)";
        roundRect(x + 226, 365, 70, 107, 4);
        ctx.fill();
        ctx.fillStyle = "rgba(224,183,111,0.88)";
        ctx.fillRect(x + 287, 414, 4, 4);
        ctx.fillStyle = "rgba(214,184,139,0.8)";
        ctx.fillRect(x + 206, 472, 110, 7);
        ctx.fillRect(x + 218, 463, 86, 9);

        ctx.fillStyle = "rgba(93,121,118,0.62)";
        ctx.beginPath();
        ctx.arc(x + 273, 205, 13, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(255,239,208,0.72)";
        ctx.lineWidth = 1.4;
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x + 273, 205);
        ctx.lineTo(x + 273, 197);
        ctx.moveTo(x + 273, 205);
        ctx.lineTo(x + 279, 208);
        ctx.stroke();

        ctx.strokeStyle = "rgba(80,78,63,0.72)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x + 35, 473);
        ctx.lineTo(x + 35, 334);
        ctx.stroke();
        ctx.fillStyle = "rgba(79,133,81,0.9)";
        ctx.beginPath();
        ctx.moveTo(x + 36, 335);
        ctx.lineTo(x + 96, 345 + Math.sin(time * 1.6) * 3);
        ctx.lineTo(x + 36, 368);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "rgba(241,203,100,0.9)";
        ctx.beginPath();
        ctx.moveTo(x + 55, 342);
        ctx.lineTo(x + 75, 346 + Math.sin(time * 1.6) * 2);
        ctx.lineTo(x + 55, 354);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = "rgba(88,105,87,0.58)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x + 20, 490);
        ctx.lineTo(x + 706, 490);
        ctx.stroke();

        for (let post = 0; post < 12; post++) {
            ctx.fillStyle = "rgba(88,105,87,0.4)";
            ctx.fillRect(x + 28 + post * 59, 478, 2, 20);
        }

        drawBroadleafTree(
            x + 620,
            504,
            154 + sceneHash(i + 4, 4) * 44,
            "rgba(80,121,79,0.74)",
            "rgba(72,63,46,0.76)",
            0.88,
            i + 12
        );

        if (i % 2 === 0) {
            const busX = x + 602;
            ctx.fillStyle = "rgba(226,176,72,0.94)";
            roundRect(busX, 426, 102, 43, 6);
            ctx.fill();
            ctx.fillStyle = "rgba(239,224,184,0.78)";
            roundRect(busX + 8, 432, 86, 14, 3);
            ctx.fill();
            ctx.fillStyle = "rgba(86,121,119,0.64)";
            for (let window = 0; window < 4; window++) {
                ctx.fillRect(busX + 13 + window * 19, 434, 12, 10);
            }
            ctx.fillStyle = "rgba(40,47,44,0.92)";
            ctx.beginPath();
            ctx.arc(busX + 24, 469, 8, 0, Math.PI * 2);
            ctx.arc(busX + 78, 469, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "rgba(240,227,171,0.9)";
            ctx.fillRect(busX - 2, 435, 3, 7);
        }
    }

    drawBird(196, 108, 0.8, "rgba(53,72,58,0.68)", 0.66, 1.2);
    drawBird(244, 94, 0.62, "rgba(53,72,58,0.52)", 0.52, 3.4);
    drawBird(908, 132, 0.7, "rgba(53,72,58,0.6)", 0.58, 5.1);

    drawFallingLeaves(
        8,
        ["rgba(227,186,112,0.7)", "rgba(185,165,98,0.65)"],
        116,
        460,
        27
    );
}


/* =========================================================
   MONTANHA
   ========================================================= */

function drawMountainBackground(t) {
    const time = performance.now() / 1000;

    const dawn = ctx.createLinearGradient(0, 110, 0, 505);
    dawn.addColorStop(0, "rgba(255,223,170,0)");
    dawn.addColorStop(0.46, "rgba(255,211,153,0.17)");
    dawn.addColorStop(1, "rgba(64,91,93,0.24)");
    ctx.fillStyle = dawn;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawSun(862, 91, 36);

    for (let i = 0; i < 5; i++) {
        drawSoftCloud(
            (i * 248 - game.cameraX * 0.06) % 1280 - 120,
            70 + (i % 2) * 36,
            0.64 + (i % 3) * 0.14,
            0.36
        );
    }

    drawAlpineLayer(
        448,
        92,
        196,
        "rgba(146,166,176,0.46)",
        "rgba(241,249,250,0.58)",
        0.06,
        2,
        480
    );

    drawMistBand(352, 94, "rgba(232,239,233,0.23)", 0.08, 5);

    drawAlpineLayer(
        472,
        142,
        272,
        "rgba(101,128,138,0.66)",
        "rgba(240,248,249,0.72)",
        0.12,
        8,
        455
    );

    drawAlpineLayer(
        505,
        204,
        326,
        "rgba(60,87,88,0.92)",
        "rgba(223,240,244,0.82)",
        0.19,
        14,
        425
    );

    drawMistBand(430, 58, "rgba(216,231,228,0.16)", 0.16, 9);

    const cabinOffset = (game.cameraX * 0.21) % 740;
    for (let i = -1; i < 3; i++) {
        const x = i * 740 - cabinOffset + 300;

        if (x > -100 && x < canvas.width + 100) {
            drawAlpineCabin(x, 474, 0.78, t.accent);
        }
    }

    const treeOffset = (game.cameraX * 0.28) % 330;
    for (let i = -1; i < 5; i++) {
        const x = i * 330 - treeOffset + 44;
        drawPineTree(x, 512, 126 + sceneHash(i, 7) * 66, "#38564e", 0.86);
        drawPineTree(x + 142, 516, 92 + sceneHash(i + 3, 7) * 48, "#557467", 0.7);
    }

    ctx.save();
    for (let i = 0; i < 30; i++) {
        const x =
            wrapSceneValue(
                sceneHash(i, 23) * canvas.width -
                game.cameraX * 0.34 +
                Math.sin(time * 0.5 + i) * 13,
                canvas.width + 50
            ) - 25;
        const y =
            40 +
            wrapSceneValue(
                sceneHash(i + 6, 23) * 430 + time * (7 + sceneHash(i, 10) * 8),
                430
            );

        ctx.globalAlpha = 0.2 + sceneHash(i + 9, 23) * 0.38;
        ctx.fillStyle = "rgba(250,254,255,0.92)";
        ctx.beginPath();
        ctx.arc(x, y, 0.9 + sceneHash(i + 2, 10) * 1.3, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();

    drawBird(188, 122, 0.78, "rgba(39,61,65,0.62)", 0.58, 1.8);
    drawBird(238, 104, 0.58, "rgba(39,61,65,0.48)", 0.45, 3.7);
    drawBird(936, 142, 0.66, "rgba(39,61,65,0.54)", 0.5, 5.4);
}


/* =========================================================
   GALÁXIA
   ========================================================= */

function drawGalaxyBackground(t) {
    const space = ctx.createLinearGradient(0, 0, 0, 520);
    space.addColorStop(0, "rgba(3,8,25,0.78)");
    space.addColorStop(0.55, "rgba(9,22,45,0.36)");
    space.addColorStop(1, "rgba(23,54,65,0.2)");
    ctx.fillStyle = space;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawStarField(92, 500, 0.86, 0.03, 4.2);
    drawStarField(36, 305, 0.62, 0.08, 9.7);

    const tealNebula = ctx.createRadialGradient(188, 352, 12, 188, 352, 315);
    tealNebula.addColorStop(0, "rgba(85,184,193,0.2)");
    tealNebula.addColorStop(0.42, "rgba(49,124,165,0.11)");
    tealNebula.addColorStop(1, "rgba(10,27,57,0)");
    ctx.fillStyle = tealNebula;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const roseNebula = ctx.createRadialGradient(895, 286, 8, 895, 286, 300);
    roseNebula.addColorStop(0, "rgba(206,126,178,0.17)");
    roseNebula.addColorStop(0.46, "rgba(113,72,156,0.1)");
    roseNebula.addColorStop(1, "rgba(17,20,55,0)");
    ctx.fillStyle = roseNebula;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const blueNebula = ctx.createRadialGradient(570, 470, 10, 570, 470, 330);
    blueNebula.addColorStop(0, "rgba(73,112,199,0.15)");
    blueNebula.addColorStop(0.5, "rgba(43,79,158,0.08)");
    blueNebula.addColorStop(1, "rgba(9,18,45,0)");
    ctx.fillStyle = blueNebula;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(585, 292);
    ctx.rotate(-0.3);
    const band = ctx.createLinearGradient(0, -120, 0, 120);
    band.addColorStop(0, "rgba(167,191,255,0)");
    band.addColorStop(0.34, "rgba(157,185,255,0.075)");
    band.addColorStop(0.5, "rgba(221,232,255,0.12)");
    band.addColorStop(0.66, "rgba(145,173,255,0.07)");
    band.addColorStop(1, "rgba(111,144,230,0)");
    ctx.fillStyle = band;
    ctx.fillRect(-760, -120, 1520, 240);

    ctx.fillStyle = "rgba(232,241,255,0.4)";
    for (let i = 0; i < 38; i++) {
        const starX = -650 + sceneHash(i, 14) * 1300;
        const starY = (sceneHash(i + 4, 14) - 0.5) * 150;
        ctx.globalAlpha = 0.16 + sceneHash(i + 8, 14) * 0.3;
        ctx.fillRect(starX, starY, 1.2, 1.2);
    }
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = "rgba(169,204,255,0.19)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(326, 76);
    ctx.lineTo(384, 98);
    ctx.lineTo(431, 74);
    ctx.lineTo(409, 132);
    ctx.lineTo(470, 156);
    ctx.stroke();

    ctx.fillStyle = "rgba(230,243,255,0.82)";
    const constellation = [
        [326, 76],
        [384, 98],
        [431, 74],
        [409, 132],
        [470, 156]
    ];
    for (let i = 0; i < constellation.length; i++) {
        ctx.beginPath();
        ctx.arc(constellation[i][0], constellation[i][1], 1.8, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = "rgba(196,189,255,0.16)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(760, 208);
    ctx.lineTo(814, 184);
    ctx.lineTo(864, 211);
    ctx.lineTo(897, 174);
    ctx.stroke();

    ctx.fillStyle = "rgba(237,239,255,0.78)";
    for (const point of [[760, 208], [814, 184], [864, 211], [897, 174]]) {
        ctx.beginPath();
        ctx.arc(point[0], point[1], 1.5, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();

    drawRingedPlanet(
        151,
        151,
        46,
        "#4a7fae",
        "#b9e9ff",
        "rgba(255,197,124,0.5)",
        -0.34,
        1
    );

    drawRingedPlanet(
        1001,
        105,
        25,
        "#795b9b",
        "#efb8ff",
        "rgba(159,205,255,0.44)",
        0.29,
        0.82
    );

    ctx.save();
    const moonGlow = ctx.createRadialGradient(829, 346, 2, 829, 346, 35);
    moonGlow.addColorStop(0, "rgba(209,241,255,0.25)");
    moonGlow.addColorStop(1, "rgba(147,192,255,0)");
    ctx.fillStyle = moonGlow;
    ctx.beginPath();
    ctx.arc(829, 346, 35, 0, Math.PI * 2);
    ctx.fill();

    const moon = ctx.createRadialGradient(824, 340, 2, 829, 346, 12);
    moon.addColorStop(0, "#eefaff");
    moon.addColorStop(0.5, "#8ba9ba");
    moon.addColorStop(1, "rgba(45,66,84,0.92)");
    ctx.fillStyle = moon;
    ctx.beginPath();
    ctx.arc(829, 346, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    drawShootingStar(1.4, 74, 0.08, 112);
    drawShootingStar(6.2, 172, 0.53, 74);

    ctx.strokeStyle = "rgba(165,199,255,0.13)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(500, 235, 480, 166, -0.19, 3.15, 5.58);
    ctx.stroke();
}


/* =========================================================
   CIDADE NEON
   ========================================================= */

function drawNeonBackground(t) {

    const offset =
        (
            game.cameraX *
            0.25
        ) %
        180;


    for (
        let x =
            -180 -
            offset;

        x <
            canvas.width +
            180;

        x += 180
    ) {

        const h =
            160 +
            Math.abs(
                Math.sin(x)
            ) *
            140;


        ctx.fillStyle =
            t.mountain2;


        ctx.fillRect(
            x,
            460 - h,
            135,
            h
        );


        ctx.fillStyle =
            t.accent;


        for (
            let yy =
                340 - h;

            yy <
                440;

            yy += 35
        ) {

            ctx.fillRect(
                x + 18,
                yy,
                20,
                5
            );


            ctx.fillRect(
                x + 63,
                yy + 13,
                30,
                5
            );
        }


        drawTechLine(
            x + 12,
            460 - h,
            x + 123,
            460 - h,
            "#e8f8ff",
            1,
            8
        );


        drawTechLine(
            x + 112,
            460 - h - 25,
            x + 112,
            460 - h,
            t.accent,
            2,
            10
        );


        drawTechNode(
            x + 112,
            460 - h - 25,
            4,
            "#e8f8ff"
        );
    }


    for (
        let i = 0;
        i < 4;
        i++
    ) {
        const vehicleX =
            (i * 330 - game.cameraX * 0.42) % 1450 - 100;

        const vehicleY =
            190 + (i % 2) * 42;

        ctx.fillStyle = "rgba(38,75,108,0.92)";
        roundRect(vehicleX, vehicleY, 58, 15, 6);
        ctx.fill();

        drawTechLine(
            vehicleX + 12,
            vehicleY + 15,
            vehicleX + 46,
            vehicleY + 15,
            t.accent,
            2,
            10
        );

        drawTechNode(vehicleX + 10, vehicleY + 8, 2, "#e8f8ff");
        drawTechNode(vehicleX + 48, vehicleY + 8, 2, "#e8f8ff");
    }


    ctx.fillStyle =
        "rgba(157,231,255,0.52)";


    ctx.fillRect(
        0,
        452,
        canvas.width,
        4
    );
}


/* =========================================================
    HORIZONTE TECNOLÓGICO
    ========================================================= */

function drawMountains(
    backColor,
    frontColor,
    parallax
) {

    for (let layer = 0; layer < 2; layer++) {
        const layerParallax = parallax + layer * 0.08;
        const offset = (game.cameraX * layerParallax) % 420;
        const mountainColor = layer === 0 ? backColor : frontColor;
        const baseY = layer === 0 ? 452 : 474;

        for (let mountainX = -420 - offset; mountainX < canvas.width + 420; mountainX += 420) {
            const peakX = mountainX + 190 + Math.sin(mountainX * 0.014) * 28;
            const peakY = 150 + Math.abs(Math.sin(mountainX * 0.009)) * 112 + layer * 42;

            ctx.fillStyle = mountainColor;
            ctx.beginPath();
            ctx.moveTo(mountainX, baseY);
            ctx.lineTo(peakX - 145, peakY + 112);
            ctx.lineTo(peakX - 38, peakY + 46);
            ctx.lineTo(peakX, peakY);
            ctx.lineTo(peakX + 49, peakY + 62);
            ctx.lineTo(peakX + 142, baseY);
            ctx.closePath();
            ctx.fill();
        }
    }
}


/* =========================================================
   NUVEM
   ========================================================= */

function drawCloud(cloudX, cloudY) {

    ctx.fillStyle = "rgba(246,248,231,0.72)";
    ctx.beginPath();
    ctx.ellipse(cloudX + 48, cloudY + 8, 50, 13, 0, 0, Math.PI * 2);
    ctx.ellipse(cloudX + 34, cloudY + 1, 22, 17, 0, 0, Math.PI * 2);
    ctx.ellipse(cloudX + 59, cloudY - 5, 27, 21, 0, 0, Math.PI * 2);
    ctx.ellipse(cloudX + 80, cloudY + 4, 21, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(255,255,247,0.32)";
    ctx.beginPath();
    ctx.ellipse(cloudX + 56, cloudY - 7, 17, 9, -0.1, 0, Math.PI * 2);
    ctx.fill();
}


/* =========================================================
   DECORAÇÕES
   ========================================================= */

function drawDecorations() {

    const t =
        getCurrentTheme();


    for (
        const item
        of game.decorations
    ) {

        const x =
            item.x -
            game.cameraX *
            (game.theme === 0 ? 0.42 : 0.87);


        if (
            x < -100 ||
            x >
                canvas.width +
                100
        ) {

            continue;
        }


        if (game.theme === 0) {
            if (item.type === "tree") {
                drawBroadleafTree(
                    x + 22,
                    item.y + 52,
                    item.size * 1.65,
                    "rgba(43,83,58,0.9)",
                    "rgba(56,53,38,0.9)",
                    0.88,
                    item.x
                );
            } else {
                ctx.fillStyle = "rgba(92,103,72,0.7)";
                ctx.beginPath();
                ctx.moveTo(x + 1, item.y + 29);
                ctx.quadraticCurveTo(x + 4, item.y + 13, x + 16, item.y + 12);
                ctx.quadraticCurveTo(x + 31, item.y + 5, x + 41, item.y + 25);
                ctx.lineTo(x + 37, item.y + 31);
                ctx.closePath();
                ctx.fill();
                ctx.fillStyle = "rgba(213,190,123,0.56)";
                ctx.beginPath();
                ctx.arc(x + 12, item.y + 22, 2.2, 0, Math.PI * 2);
                ctx.arc(x + 27, item.y + 18, 1.8, 0, Math.PI * 2);
                ctx.fill();
            }
        } else if (game.theme === 1) {
            if (item.type === "tree") {
                drawBroadleafTree(
                    x + 22,
                    item.y + 48,
                    item.size * 1.9,
                    "rgba(66,119,78,0.86)",
                    "rgba(55,58,39,0.9)",
                    0.9,
                    item.x + 7
                );
            } else {
                drawBush(
                    x + 20,
                    item.y + 34,
                    item.size * 0.72,
                    "rgba(51,100,64,0.76)",
                    "rgba(247,207,124,0.88)"
                );
            }
        } else if (game.theme === 2) {
            if (item.type === "tree") {
                drawBroadleafTree(
                    x + 22,
                    item.y + 48,
                    item.size * 1.85,
                    "rgba(92,114,67,0.86)",
                    "rgba(66,57,42,0.9)",
                    0.9,
                    item.x + 9
                );
            } else {
                drawBush(
                    x + 20,
                    item.y + 34,
                    item.size * 0.62,
                    "rgba(100,121,71,0.7)",
                    "rgba(242,197,110,0.84)"
                );
            }
        } else if (game.theme === 3) {
            if (item.type === "tree") {
                drawPineTree(x + 22, item.y + 49, item.size * 1.7, "#526a5a", 0.82);
            } else {
                ctx.fillStyle = "rgba(128,139,129,0.72)";
                ctx.beginPath();
                ctx.ellipse(x + 22, item.y + 27, 22, 9, -0.08, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = "rgba(238,232,207,0.42)";
                ctx.beginPath();
                ctx.ellipse(x + 17, item.y + 24, 11, 3.5, -0.1, 0, Math.PI * 2);
                ctx.fill();
            }
        } else if (game.theme === 4) {
            ctx.fillStyle = "rgba(48,68,105,0.82)";
            ctx.beginPath();
            ctx.ellipse(x + 20, item.y + 18, item.size * 0.38, item.size * 0.27, -0.2, 0, Math.PI * 2);
            ctx.fill();
            drawTechLine(x + 9, item.y + 16, x + 22, item.y + 12, "rgba(209,226,255,0.62)", 1, 3);
            drawTechNode(x + 31, item.y + 14, 2, t.accent);
        } else if (game.theme === 5) {
            ctx.fillStyle = "rgba(66,83,94,0.88)";
            ctx.beginPath();
            ctx.moveTo(x + 1, item.y + 31);
            ctx.lineTo(x + 7, item.y + 16);
            ctx.lineTo(x + 18, item.y + 9);
            ctx.lineTo(x + 30, item.y + 15);
            ctx.lineTo(x + 41, item.y + 30);
            ctx.closePath();
            ctx.fill();
            drawTechLine(x + 7, item.y + 18, x + 18, item.y + 12, "rgba(201,225,235,0.48)", 1, 2);
        } else if (
            item.type ===
            "tree"
        ) {

            ctx.fillStyle = "rgba(20,49,73,0.94)";
            roundRect(x + 5, item.y - 37, 40, 91, 8);
            ctx.fill();

            ctx.fillStyle = "rgba(113,198,232,0.28)";
            roundRect(x + 10, item.y - 29, 30, 22, 4);
            ctx.fill();

            ctx.fillStyle = "rgba(113,198,232,0.18)";
            roundRect(x + 10, item.y + 1, 30, 27, 4);
            ctx.fill();

            drawTechLine(
                x + 25,
                item.y - 34,
                x + 25,
                item.y + 48,
                t.accent,
                2,
                12
            );

            drawTechLine(
                x + 5,
                item.y - 4,
                x + 45,
                item.y - 4,
                "#e8f8ff",
                1,
                6
            );

            drawTechNode(x + 25, item.y - 37, 4, "#e8f8ff");

        } else {

            ctx.fillStyle = "rgba(24,57,83,0.95)";
            roundRect(x - 3, item.y + 7, 48, 26, 8);
            ctx.fill();

            drawTechLine(
                x + 2,
                item.y + 20,
                x + 40,
                item.y + 20,
                t.accent,
                2,
                10
            );

            drawTechNode(x + 6, item.y + 20, 3, "#e8f8ff");
            drawTechNode(x + 36, item.y + 20, 3, "#e8f8ff");
        }
    }
}


/* =========================================================
   PLATAFORMAS
   ========================================================= */

function drawPlatforms() {

    const t =
        getCurrentTheme();


    for (
        const p
        of getAllPlatforms()
    ) {

        const x =
            p.x -
            game.cameraX;


        if (
            x + p.w < 0 ||
            x > canvas.width
        ) {

            continue;
        }


        /* Corpo */

        const platformGradient =
            ctx.createLinearGradient(
                x,
                p.y,
                x,
                p.y +
                p.h
            );


        platformGradient.addColorStop(
            0,
            adjustColor(
                t.platform,
                12
            )
        );


        platformGradient.addColorStop(
            1,
            t.platform
        );


        ctx.fillStyle =
            platformGradient;


        ctx.fillRect(
            x,
            p.y,
            p.w,
            p.h
        );


        /* Topo */

        ctx.fillStyle =
            t.platformTop;


        ctx.fillRect(
            x,
            p.y,
            p.w,
            7
        );


        ctx.fillStyle =
            t.accent;


        ctx.fillRect(
            x,
            p.y,
            p.w,
            2
        );


        /* Painéis modulares */

        for (let xx = x + 10; xx < x + p.w - 12; xx += 56) {
            const panelWidth = Math.min(44, x + p.w - 12 - xx);

            ctx.fillStyle = "rgba(213,242,255,0.08)";
            roundRect(xx, p.y + 10, panelWidth, Math.max(4, p.h - 20), 3);
            ctx.fill();

            ctx.fillStyle = "rgba(201,241,255,0.48)";
            ctx.fillRect(xx + 5, p.y + 14, Math.max(6, panelWidth - 10), 2);

            drawTechLine(
                xx + panelWidth + 5,
                p.y + 9,
                xx + panelWidth + 5,
                p.y + p.h - 9,
                "rgba(157,231,255,0.38)",
                1,
                3
            );
        }


        /* Sombra */

        ctx.fillStyle =
            "rgba(0,0,0,0.20)";


        ctx.fillRect(
            x,
            p.y +
            p.h -
            6,
            p.w,
            6
        );


        /* Plataforma móvel */

        if (p.moving) {

            ctx.strokeStyle =
                t.accent;

            ctx.lineWidth =
                2;


            ctx.strokeRect(
                x + 1,
                p.y + 1,
                p.w - 2,
                p.h - 2
            );
        }


        /* =================================================
           IDENTIFICAÇÃO NA PLATAFORMA
           ================================================= */

        if (
            p.h >= 70 &&
            p.w >= 300
        ) {

            const bannerWidth =
                Math.min(
                    p.w - 40,
                    390
                );


            const bannerHeight =
                48;


            const bannerX =
                x +
                (
                    p.w -
                    bannerWidth
                ) /
                2;


            const bannerY =
                p.y + 25;


            /* Placa */

            ctx.save();


            ctx.shadowColor =
                "rgba(77,183,255,0.55)";


            ctx.shadowBlur =
                10;


            ctx.fillStyle =
                "rgba(7,15,24,0.90)";


            roundRect(
                bannerX,
                bannerY,
                bannerWidth,
                bannerHeight,
                8
            );


            ctx.fill();


            ctx.restore();


            /* Borda LED */

            ctx.save();


            ctx.shadowColor =
                "#4db7ff";


            ctx.shadowBlur =
                8;


            ctx.strokeStyle =
                "#4db7ff";


            ctx.lineWidth =
                2;


            roundRect(
                bannerX,
                bannerY,
                bannerWidth,
                bannerHeight,
                8
            );


            ctx.stroke();


            ctx.restore();


            /* Texto */

            ctx.save();


            ctx.textAlign =
                "center";


            ctx.textBaseline =
                "middle";


            ctx.font =
                "900 16px Arial, sans-serif";


            ctx.fillStyle =
                "#ffffff";


            ctx.shadowColor =
                "#4db7ff";


            ctx.shadowBlur =
                7;


            ctx.fillText(
                "2° DESENVOLVIMENTO",
                x +
                p.w /
                2,
                bannerY +
                16
            );


            ctx.font =
                "900 16px Arial, sans-serif";


            ctx.fillStyle =
                "#ffffff";


            ctx.fillText(
                "DE SISTEMAS",
                x +
                p.w /
                2,
                bannerY +
                35
            );


            ctx.restore();
        }
    }
}


/* =========================================================
   OBSTÁCULOS
   ========================================================= */

function drawHazards() {

    for (
        const hazard
        of game.hazards
    ) {

        const x =
            hazard.x -
            game.cameraX;


        if (
            x +
            hazard.w <
            0 ||
            x >
            canvas.width
        ) {

            continue;
        }


        if (
            hazard.type ===
            "spike"
        ) {

            drawSpikes(
                x,
                hazard.y,
                hazard.w,
                hazard.h
            );
        }


        else if (hazard.type === "shield") {
            drawShield(x, hazard.y, hazard.w, hazard.h);
        }


        else if (hazard.type === "laser") {
            drawLaser(
                x,
                hazard.y,
                hazard.w,
                hazard.h
            );
        }


        else if (hazard.type === "drone") {
            drawDrone(
                x + hazard.w / 2,
                hazard.y + hazard.h / 2,
                Math.min(hazard.w, hazard.h) / 2
            );
        }


        else if (
            hazard.type ===
            "saw"
        ) {

            drawSaw(

                x +
                hazard.w /
                2,

                hazard.y +
                hazard.h /
                2,

                hazard.w /
                2
            );
        }
    }
}


/* =========================================================
   ESPINHOS
   ========================================================= */

function drawSpikes(
    x,
    y,
    width,
    height
) {

    const accent =
        getCurrentTheme().accent;

    const amount =
        Math.max(
            2,
            Math.floor(
                width /
                15
            )
        );


    const segment =
        width /
        amount;


    for (
        let i = 0;
        i < amount;
        i++
    ) {

        const gradient =
            ctx.createLinearGradient(
                x +
                i *
                segment,

                y,

                x +
                i *
                segment +
                segment,

                y +
                height
            );


        gradient.addColorStop(
            0,
            "#e9f4fa"
        );


        gradient.addColorStop(
            0.5,
            "#93aabb"
        );


        gradient.addColorStop(
            1,
            "#435d70"
        );


        ctx.fillStyle =
            gradient;


        ctx.beginPath();


        ctx.moveTo(
            x +
            i *
            segment,

            y +
            height
        );


        ctx.lineTo(
            x +
            i *
            segment +
            segment /
            2,

            y
        );


        ctx.lineTo(
            x +
            (
                i + 1
            ) *
            segment,

            y +
            height
        );


        ctx.closePath();


        ctx.fill();
    }


    ctx.fillStyle = "#1d394f";
    ctx.fillRect(x, y + height - 4, width, 4);

    drawTechLine(
        x,
        y + height - 2,
        x + width,
        y + height - 2,
        accent,
        2,
        7
    );
}


function drawLaser(
    x,
    y,
    width,
    height
) {
    const centerY = y + height / 2;
    const accent = getCurrentTheme().accent;

    ctx.fillStyle = "#294a62";
    roundRect(x, y - 5, 9, height + 10, 3);
    ctx.fill();
    roundRect(x + width - 9, y - 5, 9, height + 10, 3);
    ctx.fill();

    drawTechLine(x + 8, centerY, x + width - 8, centerY, accent, 5, 16);
    drawTechLine(x + 8, centerY, x + width - 8, centerY, "#f3fcff", 1, 8);

    drawTechNode(x + 4, centerY, 3, "#f3fcff");
    drawTechNode(x + width - 4, centerY, 3, "#f3fcff");
}


function drawDrone(
    x,
    y,
    radius
) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(performance.now() / 700);

    for (let armIndex = 0; armIndex < 4; armIndex++) {
        ctx.fillStyle = "#527891";
        roundRect(
            radius * 0.34,
            -radius * 0.11,
            radius * 0.55,
            radius * 0.22,
            radius * 0.1
        );
        ctx.fill();

        ctx.fillStyle = "#d8f5ff";
        ctx.beginPath();
        ctx.arc(radius * 0.82, 0, radius * 0.13, 0, Math.PI * 2);
        ctx.fill();

        ctx.rotate(Math.PI / 2);
    }

    ctx.shadowColor = "#8fe4ff";
    ctx.shadowBlur = 14;
    ctx.fillStyle = "#254b68";
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.56, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#b7efff";
    ctx.lineWidth = Math.max(1, radius * 0.09);
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.43, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = getCurrentTheme().accent;
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.22, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}


/* =========================================================
   BARREIRA DE ENERGIA
   ========================================================= */

function drawShield(
    x,
    y,
    width,
    height
) {
    const accent = getCurrentTheme().accent;
    const pulse = 0.78 + Math.sin(performance.now() / 240) * 0.12;

    ctx.save();
    ctx.globalAlpha = pulse;
    ctx.shadowColor = accent;
    ctx.shadowBlur = 18;
    ctx.fillStyle = "rgba(83,185,225,0.3)";
    ctx.fillRect(x + 2, y + 2, width - 4, height - 4);

    ctx.strokeStyle = accent;
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 2, y + 2, width - 4, height - 4);

    ctx.fillStyle = "rgba(228,249,255,0.82)";
    ctx.fillRect(x + width / 2 - 1, y + 7, 2, height - 14);

    for (let segmentY = y + 12; segmentY < y + height - 8; segmentY += 16) {
        drawTechLine(
            x + 7,
            segmentY,
            x + width - 7,
            segmentY,
            "rgba(205,243,255,0.68)",
            1,
            4
        );
    }

    ctx.fillStyle = "#eaf8ff";
    ctx.fillRect(x + 5, y + 3, width - 10, 3);
    ctx.fillRect(x + 5, y + height - 6, width - 10, 3);
    ctx.restore();
}


/* =========================================================
   SERRA
   ========================================================= */

function drawSaw(
    x,
    y,
    radius
) {

    const rotation =
        performance.now() /
        130;


    ctx.save();


    ctx.translate(
        x,
        y
    );


    ctx.rotate(
        rotation
    );


    ctx.shadowColor = "#8fe4ff";
    ctx.shadowBlur = 12;


    const teeth = 12;


    ctx.fillStyle =
        "#d5e2e9";


    ctx.beginPath();


    for (
        let i = 0;
        i <
        teeth *
        2;
        i++
    ) {

        const angle =
            (
                i /
                (
                    teeth *
                    2
                )
            ) *
            Math.PI *
            2;


        const r =
            i % 2 === 0
                ? radius
                : radius *
                  0.66;


        const px =
            Math.cos(
                angle
            ) *
            r;


        const py =
            Math.sin(
                angle
            ) *
            r;


        if (
            i === 0
        ) {

            ctx.moveTo(
                px,
                py
            );

        } else {

            ctx.lineTo(
                px,
                py
            );
        }
    }


    ctx.closePath();


    ctx.fill();


    ctx.fillStyle =
        "#42647d";


    ctx.beginPath();


    ctx.arc(
        0,
        0,
        radius *
        0.45,
        0,
        Math.PI *
        2
    );


    ctx.fill();


    ctx.strokeStyle = "#9ceaff";
    ctx.lineWidth = Math.max(1, radius * 0.08);
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.31, 0, Math.PI * 2);
    ctx.stroke();


    ctx.fillStyle =
        "#19334a";


    ctx.beginPath();


    ctx.arc(
        0,
        0,
        radius *
        0.15,
        0,
        Math.PI *
        2
    );


    ctx.fill();


    ctx.restore();
}


/* =========================================================
   MOEDAS
   ========================================================= */

function drawCoins() {

    for (
        const coin
        of game.coinsObjects
    ) {

        if (
            coin.collected
        ) {

            continue;
        }


        const x =
            coin.x -
            game.cameraX;


        const bob =
            Math.sin(
                performance.now() /
                170 +
                coin.angle
            ) *
            4;


        if (
            x < -30 ||
            x >
                canvas.width +
                30
        ) {

            continue;
        }


        const scale =
            0.73 +
            Math.abs(
                Math.sin(
                    performance.now() /
                    190 +
                    coin.angle
                )
            ) *
            0.27;


        ctx.save();


        ctx.translate(
            x,
            coin.y +
            bob
        );


        ctx.scale(
            scale,
            1
        );


        const gradient =
            ctx.createLinearGradient(
                -10,
                -10,
                10,
                10
            );


        gradient.addColorStop(
            0,
            "#fff19a"
        );


        gradient.addColorStop(
            0.4,
            "#ffd64c"
        );


        gradient.addColorStop(
            1,
            "#d89e1f"
        );


        ctx.fillStyle =
            gradient;


        ctx.beginPath();


        ctx.arc(
            0,
            0,
            11,
            0,
            Math.PI * 2
        );


        ctx.fill();


        ctx.strokeStyle =
            "#9e6f19";


        ctx.lineWidth =
            2;


        ctx.stroke();


        ctx.fillStyle =
            "rgba(255,255,255,0.7)";


        ctx.fillRect(
            -4,
            -7,
            3,
            7
        );


        ctx.restore();
    }
}


/* =========================================================
   CHEGADA
   ========================================================= */

function drawFinish() {

    const x =
        game.finishX -
        game.cameraX;


    if (
        x < -100 ||
        x >
            canvas.width +
            100
    ) {

        return;
    }


    ctx.fillStyle =
        "#e9e9e9";


    ctx.fillRect(
        x,
        230,
        10,
        275
    );


    ctx.fillStyle =
        "#cfd5da";


    ctx.fillRect(
        x - 4,
        220,
        18,
        10
    );


    const cell =
        15;


    for (
        let row = 0;
        row < 4;
        row++
    ) {

        for (
            let col = 0;
            col < 6;
            col++
        ) {

            ctx.fillStyle =
                (
                    row +
                    col
                ) %
                2 === 0
                    ? "#ffffff"
                    : "#1c2229";


            ctx.fillRect(
                x + 10 +
                col *
                cell,

                220 +
                row *
                cell,

                cell,
                cell
            );
        }
    }


    ctx.fillStyle =
        "#ffffff";


    ctx.font =
        "bold 14px Arial";


    ctx.textAlign =
        "center";


    ctx.fillText(
        "FINISH",
        x + 42,
        205
    );
}


/* =========================================================
   PERSONAGEM
   ========================================================= */

function getSelectedSkin() {

    return skins.find(
        skin =>
            skin.id ===
            save.selectedSkin
    ) || skins[0];
}


function drawSkinBackLayer(skin, x, y) {
    if (["pilot", "mechanic", "shadow", "android"].includes(skin.model)) {
        ctx.fillStyle = adjustColor(skin.pants, -12);
        roundRect(x + 27, y + 27, 9, 22, 3);
        ctx.fill();
        ctx.strokeStyle = skin.accent;
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 28, y + 30, 7, 15);
        drawTechLine(x + 29, y + 33, x + 34, y + 33, skin.accent, 1, 0);
    }
}


function drawSkinChestDetails(skin, x, y) {
    switch (skin.model) {
        case "runner":
            drawTechLine(x + 10, y + 24, x + 17, y + 44, skin.accent, 2, 5);
            drawTechLine(x + 15, y + 24, x + 22, y + 44, "#edfaff", 1, 3);
            break;

        case "pilot":
            drawTechLine(x + 20, y + 23, x + 20, y + 46, adjustColor(skin.pants, -10), 2, 0);
            ctx.fillStyle = "#f7fbf7";
            roundRect(x + 10, y + 31, 8, 10, 2);
            ctx.fill();
            ctx.strokeStyle = skin.accent;
            ctx.lineWidth = 1;
            ctx.strokeRect(x + 10.5, y + 31.5, 7, 9);
            drawTechLine(x + 12, y + 34, x + 16, y + 34, skin.accent, 1, 0);
            break;

        case "ninja":
            ctx.fillStyle = skin.accent;
            ctx.fillRect(x + 19, y + 26, 2, 12);
            ctx.fillRect(x + 19, y + 26, 9, 2);
            ctx.beginPath();
            ctx.ellipse(x + 16, y + 39, 4, 2, 0, 0, Math.PI * 2);
            ctx.ellipse(x + 25, y + 37, 4, 2, 0, 0, Math.PI * 2);
            ctx.fill();
            break;

        case "guardian":
            drawTechLine(x + 10, y + 23, x + 29, y + 45, skin.accent, 3, 0);
            drawTechLine(x + 11, y + 23, x + 30, y + 45, "#f5f8fb", 1, 0);
            drawTechNode(x + 14, y + 28, 3, skin.accent);
            break;

        case "android":
            ctx.fillStyle = adjustColor(skin.pants, -10);
            roundRect(x + 10, y + 30, 20, 14, 2);
            ctx.fill();
            ctx.strokeStyle = skin.accent;
            ctx.lineWidth = 1;
            ctx.strokeRect(x + 11, y + 31, 18, 12);
            drawTechLine(x + 20, y + 32, x + 20, y + 42, skin.accent, 1, 0);
            drawTechLine(x + 13, y + 34, x + 18, y + 35, skin.accent, 1, 0);
            drawTechLine(x + 22, y + 35, x + 27, y + 34, skin.accent, 1, 0);
            break;

        case "mechanic":
            ctx.fillStyle = adjustColor(skin.pants, -10);
            roundRect(x + 10, y + 29, 20, 17, 3);
            ctx.fill();
            ctx.strokeStyle = skin.accent;
            ctx.lineWidth = 1;
            ctx.strokeRect(x + 11, y + 30, 18, 15);
            drawTechNode(x + 20, y + 36, 3, skin.accent);
            break;

        case "shadow":
            ctx.fillStyle = adjustColor(skin.pants, -10);
            roundRect(x + 11, y + 27, 18, 14, 2);
            ctx.fill();
            ctx.strokeStyle = skin.accent;
            ctx.lineWidth = 1;
            ctx.strokeRect(x + 12, y + 28, 16, 12);
            drawTechLine(x + 20, y + 29, x + 20, y + 39, skin.accent, 1, 0);
            break;
    }
}


function drawFaceGlasses(skin, x, y, facing, options = {}) {
    const direction =
        facing > 0 ? 1 : -1;

    const lensCenterX =
        facing > 0
            ? x + 27
            : x + 12;

    const lensCenterY =
        y + (options.offsetY ?? 11);

    const radiusX =
        options.radiusX ?? 4.3;

    const radiusY =
        options.radiusY ?? 3.4;

    const frameColor =
        options.color || skin.accent;

    const lineWidth =
        options.lineWidth ?? 1.3;

    const armStartX =
        lensCenterX - direction * (radiusX - 0.3);

    const armEndX =
        lensCenterX - direction * (radiusX + 4.2);

    const bridgeStartX =
        lensCenterX + direction * (radiusX - 0.3);

    const bridgeEndX =
        lensCenterX + direction * (radiusX + 1.4);


    ctx.save();


    if (options.tint) {
        ctx.fillStyle = options.tint;

        ctx.beginPath();

        ctx.ellipse(
            lensCenterX,
            lensCenterY,
            radiusX,
            radiusY,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }


    /* Haste discreta em direção à lateral do rosto. */
    ctx.strokeStyle = frameColor;
    ctx.globalAlpha = 0.78;
    ctx.lineWidth = Math.max(0.8, lineWidth * 0.7);

    ctx.beginPath();

    ctx.moveTo(
        armStartX,
        lensCenterY - 0.2
    );

    ctx.lineTo(
        armEndX,
        lensCenterY - 1.2
    );

    ctx.stroke();

    ctx.globalAlpha = 1;


    /* Aro principal centralizado no olho visível. */
    ctx.strokeStyle = frameColor;
    ctx.lineWidth = lineWidth;

    ctx.beginPath();

    ctx.ellipse(
        lensCenterX,
        lensCenterY,
        radiusX,
        radiusY,
        0,
        0,
        Math.PI * 2
    );

    ctx.stroke();


    /* Ponte curta em direção à frente do rosto. */
    ctx.lineWidth = Math.max(0.8, lineWidth * 0.85);

    ctx.beginPath();

    ctx.moveTo(
        bridgeStartX,
        lensCenterY - 0.3
    );

    ctx.lineTo(
        bridgeEndX,
        lensCenterY - 0.7
    );

    ctx.stroke();


    /* Parafuso no encontro da haste com o aro. */
    ctx.fillStyle = frameColor;

    ctx.beginPath();

    ctx.arc(
        armStartX,
        lensCenterY,
        Math.max(0.55, lineWidth * 0.42),
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* Reflexo discreto no canto da lente. */
    ctx.strokeStyle = "rgba(255,255,255,0.55)";
    ctx.lineWidth = Math.max(0.55, lineWidth * 0.45);

    ctx.beginPath();

    ctx.arc(
        lensCenterX - radiusX * 0.65,
        lensCenterY - radiusY * 0.4,
        1.1,
        Math.PI * 1.08,
        Math.PI * 1.52
    );

    ctx.stroke();


    ctx.restore();
}


function drawSkinHeadwear(skin, x, y, facing = 1) {
    switch (skin.model) {
        case "runner":
            drawTechLine(x + 8, y + 4, x + 31, y + 4, skin.accent, 3, 5);
            break;

        case "pilot":
            drawFaceGlasses(
                skin,
                x,
                y,
                facing,
                {
                    offsetY: 11,
                    radiusX: 4.35,
                    radiusY: 3.45,
                    lineWidth: 1.45,
                    tint: "rgba(218,255,247,0.08)"
                }
            );
            break;

        case "ninja": {
            ctx.save();

            /* Arco do fone passando por cima do cabelo. */
            ctx.strokeStyle = adjustColor(skin.pants, 12);
            ctx.lineWidth = 3;
            ctx.lineCap = "round";

            ctx.beginPath();
            ctx.moveTo(x + 6.5, y + 6);
            ctx.quadraticCurveTo(x + 20, y - 19, x + 33.5, y + 6);
            ctx.stroke();


            ctx.strokeStyle = skin.accent;
            ctx.lineWidth = 0.9;
            ctx.globalAlpha = 0.82;

            ctx.beginPath();
            ctx.moveTo(x + 6.8, y + 7);
            ctx.quadraticCurveTo(x + 20, y - 17, x + 33.2, y + 7);
            ctx.stroke();

            ctx.globalAlpha = 1;


            /* Conchas posicionadas sobre as orelhas. */
            ctx.fillStyle = adjustColor(skin.pants, 10);

            roundRect(x + 3.8, y + 6, 6.4, 10, 2.6);
            ctx.fill();

            roundRect(x + 29.8, y + 6, 6.4, 10, 2.6);
            ctx.fill();


            ctx.strokeStyle = skin.accent;
            ctx.lineWidth = 1;

            roundRect(x + 4.8, y + 7.2, 4.4, 7.6, 1.8);
            ctx.stroke();

            roundRect(x + 30.8, y + 7.2, 4.4, 7.6, 1.8);
            ctx.stroke();


            ctx.fillStyle = adjustColor(skin.pants, 30);

            ctx.beginPath();

            ctx.ellipse(x + 7, y + 11, 1.5, 2.3, 0, 0, Math.PI * 2);
            ctx.ellipse(x + 33, y + 11, 1.5, 2.3, 0, 0, Math.PI * 2);

            ctx.fill();

            ctx.restore();
            break;
        }

        case "guardian":
            ctx.fillStyle = adjustColor(skin.pants, -12);
            roundRect(x + 7, y + 1, 28, 5, 2);
            ctx.fill();
            drawTechLine(x + 8, y + 3, x + 34, y + 3, skin.accent, 1, 0);
            break;

        case "android":
            drawFaceGlasses(
                skin,
                x,
                y,
                facing,
                {
                    offsetY: 11,
                    radiusX: 4.15,
                    radiusY: 3.55,
                    lineWidth: 1.25,
                    tint: "rgba(190,255,235,0.08)"
                }
            );
            break;

        case "mechanic":
            ctx.fillStyle = adjustColor(skin.shirt, -18);
            roundRect(x + 9, y - 4, 24, 9, 5);
            ctx.fill();
            roundRect(x + 7, y + 2, 27, 3, 2);
            ctx.fill();
            break;

        case "shadow":
            drawFaceGlasses(
                skin,
                x,
                y,
                facing,
                {
                    offsetY: 11.1,
                    radiusX: 4.2,
                    radiusY: 3.35,
                    lineWidth: 1.1,
                    tint: "rgba(255,230,160,0.07)"
                }
            );
            break;
    }
}


function drawCharacter(
    skin,
    x,
    y,
    {
        facing = 1,
        running = false,
        airborne = false,
        vy = 0,
        frame = 0,
        anim = Math.sin(frame),
        bodyLean = 0,
        idlePose = 0
    } = {}
) {

    const shirtColor =
        skin.shirt;


    const pantsColor =
        skin.pants;


    ctx.save();


    ctx.translate(x + 19, y + 30);
    ctx.rotate(bodyLean);
    ctx.translate(-(x + 19), -(y + 30));


    drawSkinBackLayer(skin, x, y);


    /* =====================================================
       PERNAS
       ===================================================== */

    const legOne =
        running
            ? anim * 22
            : airborne
                ? (vy < 0 ? -16 : 12)
                : -4 * idlePose;


    const legTwo =
        running
            ? -anim * 22
            : airborne
                ? (vy < 0 ? 14 : -8)
                : 3 * idlePose;


    const legLiftOne =
        running
            ? Math.max(0, Math.cos(frame)) * 3
            : airborne && vy < 0
                ? 4
                : 0;


    const legLiftTwo =
        running
            ? Math.max(0, -Math.cos(frame)) * 3
            : airborne && vy < 0
                ? 1
                : 0;


    ctx.save();


    ctx.translate(
        x + 14,
        y + 38 + legLiftOne
    );


    ctx.rotate(
        legOne *
        Math.PI /
        180
    );


    drawLeg(
        0,
        0,
        pantsColor,
        facing,
        skin.model
    );


    ctx.restore();


    ctx.save();


    ctx.translate(
        x + 26,
        y + 38 + legLiftTwo
    );


    ctx.rotate(
        legTwo *
        Math.PI /
        180
    );


    drawLeg(
        0,
        0,
        pantsColor,
        facing,
        skin.model
    );


    ctx.restore();


    /* =====================================================
       CORPO
       ===================================================== */

    const bodyGradient =
        ctx.createLinearGradient(
            x + 6,
            y + 19,
            x + 31,
            y + 49
        );


    bodyGradient.addColorStop(
        0,
        adjustColor(
            shirtColor,
            25
        )
    );


    bodyGradient.addColorStop(
        0.5,
        shirtColor
    );


    bodyGradient.addColorStop(
        1,
        adjustColor(
            shirtColor,
            -22
        )
    );


    ctx.fillStyle =
        bodyGradient;


    roundRect(
        x + 7,
        y + 19,
        25,
        29,
        8
    );


    ctx.fill();


    ctx.fillStyle = "rgba(18,35,47,0.2)";
    ctx.beginPath();
    ctx.moveTo(x + 25, y + 21);
    ctx.lineTo(x + 31, y + 24);
    ctx.lineTo(x + 31, y + 42);
    ctx.quadraticCurveTo(x + 29, y + 47, x + 24, y + 48);
    ctx.closePath();
    ctx.fill();


    ctx.fillStyle =
        "rgba(255,255,255,0.18)";


    ctx.fillRect(
        x + 11,
        y + 23,
        4,
        18
    );


    ctx.strokeStyle = "rgba(20,43,61,0.32)";
    ctx.lineWidth = 1;
    ctx.stroke();


    if (skin.model === "guardian") {
        const armorGradient = ctx.createLinearGradient(x + 2, y + 20, x + 13, y + 33);
        armorGradient.addColorStop(0, adjustColor(skin.shirt, 35));
        armorGradient.addColorStop(1, adjustColor(skin.shirt, -28));
        ctx.fillStyle = armorGradient;
        roundRect(x + 3, y + 21, 11, 10, 4);
        ctx.fill();
        roundRect(x + 25, y + 21, 11, 10, 4);
        ctx.fill();
        ctx.strokeStyle = "rgba(24,39,51,0.45)";
        ctx.lineWidth = 1;
        ctx.stroke();
    }


    drawTechLine(x + 9, y + 43, x + 16, y + 45, "rgba(35,65,82,0.28)", 1, 0);
    drawTechLine(x + 24, y + 37, x + 28, y + 40, "rgba(255,255,255,0.25)", 1, 0);


    if (skin.model === "school") {
        ctx.save();
        roundRect(x + 7, y + 19, 25, 29, 8);
        ctx.clip();

        ctx.fillStyle = "#1765aa";
        ctx.beginPath();
        ctx.moveTo(x + 7, y + 19);
        ctx.lineTo(x + 17, y + 19);
        ctx.lineTo(x + 15, y + 26);
        ctx.lineTo(x + 7, y + 31);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(x + 22, y + 19);
        ctx.lineTo(x + 32, y + 19);
        ctx.lineTo(x + 32, y + 31);
        ctx.lineTo(x + 24, y + 26);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        drawTechLine(x + 17, y + 21, x + 14, y + 27, "#dcecf5", 1, 0);
        drawTechLine(x + 23, y + 21, x + 26, y + 27, "#dcecf5", 1, 0);

        ctx.fillStyle = "#1d5c97";
        roundRect(x + 11, y + 31, 5, 7, 1);
        ctx.fill();
        drawTechLine(x + 12, y + 33, x + 15, y + 33, "#f5f8fb", 1, 0);

        ctx.fillStyle = "#1765aa";
        ctx.fillRect(x + 19, y + 28, 1, 16);
    }


    drawSkinChestDetails(skin, x, y);


    /* =====================================================
       BRAÇOS
       ===================================================== */

    const armOne =
        running
            ? -anim * 28
            : airborne
                ? (vy < 0 ? 48 : 24)
                : -8 * idlePose;


    const armTwo =
        running
            ? anim * 28
            : airborne
                ? (vy < 0 ? -48 : -24)
                : 6 * idlePose;


    const sleeveColor =
        skin.model === "school"
            ? "#1765aa"
            : shirtColor;


    drawArm(
        x + 8,
        y + 22,
        armOne,
        sleeveColor
    );


    drawArm(
        x + 31,
        y + 22,
        armTwo,
        sleeveColor
    );


    /* =====================================================
       PESCOÇO
       ===================================================== */

    const neckGradient =
        ctx.createLinearGradient(x + 15, y + 15, x + 24, y + 23);

    neckGradient.addColorStop(0, "#f0c59e");
    neckGradient.addColorStop(1, "#be8664");
    ctx.fillStyle = neckGradient;


    roundRect(
        x + 15,
        y + 15,
        9,
        9,
        3
    );


    ctx.fill();


    /* =====================================================
       CABEÇA
       ===================================================== */

    const headGradient =
        ctx.createLinearGradient(
            x + 8,
            y - 2,
            x + 29,
            y + 19
        );


    headGradient.addColorStop(
        0,
        "#f4cfaa"
    );


    headGradient.addColorStop(
        0.75,
        "#e1ad7d"
    );


    headGradient.addColorStop(
        1,
        "#c98e67"
    );


    ctx.fillStyle =
        headGradient;


    roundRect(
        x + 7,
        y - 1,
        26,
        22,
        8
    );


    ctx.fill();


    ctx.fillStyle = "rgba(123,72,51,0.12)";
    ctx.beginPath();
    ctx.moveTo(x + 24, y + 1);
    ctx.lineTo(x + 32, y + 6);
    ctx.lineTo(x + 32, y + 14);
    ctx.lineTo(x + 27, y + 20);
    ctx.lineTo(x + 23, y + 18);
    ctx.closePath();
    ctx.fill();


    ctx.fillStyle = "rgba(255,236,214,0.28)";
    ctx.beginPath();
    ctx.ellipse(x + 14, y + 5, 5, 2, -0.35, 0, Math.PI * 2);
    ctx.fill();


    /* =====================================================
       CABELO
       ===================================================== */

    const hairGradient = ctx.createLinearGradient(x + 9, y - 5, x + 29, y + 8);
    hairGradient.addColorStop(0, adjustColor(skin.hair, 24));
    hairGradient.addColorStop(0.55, skin.hair);
    hairGradient.addColorStop(1, adjustColor(skin.hair, -22));
    ctx.fillStyle = hairGradient;


    ctx.beginPath();


    ctx.moveTo(x + 7, y + 8);
    ctx.quadraticCurveTo(x + 7, y - 3, x + 17, y - 5);
    ctx.quadraticCurveTo(x + 28, y - 7, x + 33, y + 4);
    ctx.quadraticCurveTo(x + 30, y + 7, x + 25, y + 6);
    ctx.quadraticCurveTo(x + 18, y + 4, x + 12, y + 9);


    ctx.closePath();


    ctx.fill();


    ctx.strokeStyle = adjustColor(skin.hair, 28);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + 13, y + 2);
    ctx.quadraticCurveTo(x + 20, y - 3, x + 28, y + 2);
    ctx.stroke();


    /* =====================================================
       ORELHA
       ===================================================== */

    ctx.fillStyle =
        "#dfa77d";


    ctx.fillRect(
        facing > 0
            ? x + 29
            : x + 5,

        y + 8,

        4,
        7
    );


    /* =====================================================
       OLHO
       ===================================================== */

    const eyeX =
        facing > 0
            ? x + 25
            : x + 10;


    drawTechLine(
        eyeX - 1,
        y + 7,
        eyeX + 4,
        y + 7,
        adjustColor(skin.hair, 18),
        1,
        0
    );


    ctx.fillStyle = "#f4e9dc";
    roundRect(eyeX, y + 8, 4, 6, 2);
    ctx.fill();


    ctx.fillStyle = "#392b27";
    ctx.fillRect(eyeX + 1, y + 9, 2, 4);


    ctx.fillStyle =
        "#ffffff";


    ctx.fillRect(
        eyeX + 1,
        y + 9,
        1,
        1
    );


    ctx.fillStyle = "rgba(151,92,68,0.48)";
    ctx.beginPath();
    ctx.ellipse(
        facing > 0 ? x + 30 : x + 7,
        y + 13,
        1.2,
        1,
        0,
        0,
        Math.PI * 2
    );
    ctx.fill();


    /* =====================================================
       BOCA
       ===================================================== */

    ctx.fillStyle =
        "#9a5f55";


    ctx.fillRect(

        facing > 0
            ? x + 24
            : x + 12,

        y + 17,

        4,
        1
    );


    drawSkinHeadwear(skin, x, y, facing);


    ctx.restore();
}


/* =========================================================
   PERSONAGEM NO JOGO
   ========================================================= */

function drawPlayer() {

    if (
        player.invulnerable >
        0 &&
        Math.floor(
            player.invulnerable /
            8
        ) % 2 === 0
    ) {

        return;
    }


    const skin =
        getSelectedSkin();


    const x =
        player.x -
        game.cameraX;


    const running =
        player.onGround &&
        Math.abs(
            player.vx
        ) > 0.15;


    const airborne =
        !player.onGround;


    const anim =
        Math.sin(
            player.runFrame
        );


    const y =
        player.y -
        (running ? Math.abs(Math.sin(player.runFrame * 2)) * 1.1 : 0);


    const bodyLean =
        running
            ? player.facing * 0.07
            : airborne
                ? player.facing * (player.vy < 0 ? 0.09 : -0.04)
                : 0;


    let shadowFloor =
        canvas.height;


    for (const platform of getAllPlatforms()) {
        if (
            player.x + player.width > platform.x &&
            player.x < platform.x + platform.w &&
            platform.y >= player.y + player.height - 4
        ) {
            shadowFloor = Math.min(shadowFloor, platform.y);
        }
    }


    const shadowDistance =
        Math.max(0, shadowFloor - (player.y + player.height));


    const shadowScale =
        Math.max(0.28, 1 - shadowDistance / 220);


    ctx.save();


    ctx.fillStyle =
        `rgba(0,0,0,${Math.max(0.06, 0.24 - shadowDistance / 900)})`;


    ctx.beginPath();


    ctx.ellipse(
        x + 19,
        shadowFloor + 2,
        20 * shadowScale,
        6 * shadowScale,
        0,
        0,
        Math.PI * 2
    );


    ctx.fill();


    ctx.restore();


    drawCharacter(
        skin,
        x,
        y,
        {
            facing: player.facing,
            running,
            airborne,
            vy: player.vy,
            frame: player.runFrame,
            anim,
            bodyLean
        }
    );
}


/* =========================================================
   PERNA
   ========================================================= */

function drawLeg(
    x,
    y,
    color,
    facing = 1,
    model = ""
) {

    const denimGradient =
        ctx.createLinearGradient(
            x - 5,
            y,
            x + 6,
            y
        );


    denimGradient.addColorStop(0, adjustColor(color, -18));
    denimGradient.addColorStop(0.42, adjustColor(color, 10));
    denimGradient.addColorStop(1, adjustColor(color, -12));


    ctx.fillStyle = denimGradient;
    ctx.beginPath();
    ctx.moveTo(x - 4, y + 1);
    ctx.quadraticCurveTo(x, y - 1, x + 5, y + 2);
    ctx.lineTo(x + 4, y + 9);
    ctx.quadraticCurveTo(x + 5, y + 12, x + 3, y + 14);
    ctx.lineTo(x + 2, y + 18);
    ctx.lineTo(x - 3, y + 18);
    ctx.lineTo(x - 4, y + 13);
    ctx.quadraticCurveTo(x - 6, y + 10, x - 5, y + 7);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "rgba(18,43,63,0.22)";
    ctx.lineWidth = 0.8;
    ctx.stroke();

    if (model === "school") {
        const stripeX = facing > 0 ? x + 2 : x - 2;
        drawTechLine(stripeX, y + 3, stripeX, y + 10, "#f5f8fb", 1, 0);
    }


    ctx.fillStyle =
        "rgba(222,241,252,0.42)";


    ctx.fillRect(
        x - 1,
        y + 3,
        1,
        7
    );


    drawTechLine(
        x - 3,
        y + 11,
        x + 3,
        y + 11,
        "rgba(18,43,63,0.48)",
        1,
        0
    );


    ctx.fillStyle = adjustColor(color, -12);
    roundRect(x - 3, y + 12, 7, 6, 3);
    ctx.fill();


    ctx.fillStyle = "#263f56";
    ctx.beginPath();
    if (facing > 0) {
        ctx.moveTo(x - 4, y + 16);
        ctx.lineTo(x + 2, y + 16);
        ctx.quadraticCurveTo(x + 8, y + 17, x + 8, y + 21);
        ctx.lineTo(x + 7, y + 22);
        ctx.lineTo(x - 5, y + 22);
    } else {
        ctx.moveTo(x + 4, y + 16);
        ctx.lineTo(x - 2, y + 16);
        ctx.quadraticCurveTo(x - 8, y + 17, x - 8, y + 21);
        ctx.lineTo(x - 7, y + 22);
        ctx.lineTo(x + 5, y + 22);
    }
    ctx.closePath();
    ctx.fill();


    ctx.fillStyle = "#eef6fa";
    roundRect(facing > 0 ? x - 5 : x - 8, y + 20, 13, 2, 1);
    ctx.fill();


    drawTechLine(x - 1, y + 18, x + 2, y + 19, "#dceaf1", 1, 0);
    drawTechLine(x + 1, y + 18, x + 4, y + 19, "#dceaf1", 1, 0);
}


/* =========================================================
   BRAÇO
   ========================================================= */

function drawArm(
    x,
    y,
    rotation,
    color
) {

    ctx.save();


    ctx.translate(
        x,
        y
    );


    ctx.rotate(
        rotation *
        Math.PI /
        180
    );


    const armGradient =
        ctx.createLinearGradient(-5, 0, 5, 0);

    armGradient.addColorStop(0, adjustColor(color, -18));
    armGradient.addColorStop(0.48, adjustColor(color, 16));
    armGradient.addColorStop(1, adjustColor(color, -10));

    ctx.fillStyle = armGradient;
    roundRect(-5, 0, 10, 12, 4);
    ctx.fill();
    drawTechLine(-3, 3, 3, 3, "rgba(255,255,255,0.38)", 1, 0);

    ctx.fillStyle = adjustColor(color, -6);
    ctx.beginPath();
    ctx.ellipse(0, 12, 4.2, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.translate(0, 12);
    ctx.rotate((rotation < 0 ? 1 : -1) * 9 * Math.PI / 180);

    ctx.fillStyle = armGradient;
    roundRect(-3.5, 0, 7, 10, 3);
    ctx.fill();

    ctx.fillStyle = "#dcecf5";
    roundRect(-4, 8, 8, 2, 1);
    ctx.fill();

    const handGradient =
        ctx.createLinearGradient(-3, 10, 3, 16);

    handGradient.addColorStop(0, "#f0c59e");
    handGradient.addColorStop(1, "#be8664");
    ctx.fillStyle = handGradient;
    ctx.beginPath();
    ctx.ellipse(0, 13, 3.7, 4.2, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(255,255,255,0.34)";
    ctx.fillRect(-1, 10, 2, 1);
    ctx.restore();


    ctx.restore();
}


/* =========================================================
   HUD
   ========================================================= */

function updateHUD() {

    const level =
        document.getElementById(
            "levelText"
        );

    const score =
        document.getElementById(
            "scoreText"
        );

    const coins =
        document.getElementById(
            "coinsText"
        );

    const lives =
        document.getElementById(
            "livesText"
        );

    const mapName =
        document.getElementById(
            "mapNameText"
        );


    if (level) {

        level.textContent =
            game.level + 1;
    }


    if (score) {

        score.textContent =
            game.score.toLocaleString(
                "pt-BR"
            );
    }


    if (coins) {

        coins.textContent =
            game.coins;
    }


    if (lives) {

        lives.textContent =
            game.lives;
    }


    if (mapName) {

        mapName.textContent =
            getCurrentTheme().name;
    }
}


/* =========================================================
   TEMPO
   ========================================================= */

function formatTime(ms) {

    const seconds =
        ms / 1000;


    const minutes =
        Math.floor(
            seconds /
            60
        );


    const secs =
        Math.floor(
            seconds %
            60
        );


    const tenths =
        Math.floor(
            (
                seconds %
                1
            ) *
            10
        );


    return (

        String(minutes)
            .padStart(
                2,
                "0"
            ) +

        ":" +

        String(secs)
            .padStart(
                2,
                "0"
            ) +

        "." +

        tenths
    );
}


/* =========================================================
   FINAL DA FASE
   ========================================================= */

function checkFinish() {

    if (
        player.x >=
        game.finishX
    ) {

        finishLevel();
    }
}


function finishLevel() {

    if (!game.running) {
        return;
    }


    game.running =
        false;


    const elapsed =
        performance.now() -
        game.levelStartTime;


    const seconds =
        elapsed /
        1000;


    const timeBonus =
        Math.max(
            0,
            Math.floor(
                (
                    120 -
                    seconds
                ) *
                8
            )
        );


    const lifeBonus =
        game.lives *
        150;


    const levelScore =
        game.score +
        timeBonus +
        lifeBonus;


    save.totalPoints +=
        levelScore;


    if (
        levelScore >
        save.records[
            selectedDifficulty
        ]
    ) {

        save.records[
            selectedDifficulty
        ] =
            levelScore;
    }


    unlockAchievement(
        "firstFinish"
    );


    if (
        game.coins >=
        10
    ) {

        unlockAchievement(
            "collector"
        );
    }


    if (
        seconds <=
        35
    ) {

        unlockAchievement(
            "speedster"
        );
    }


    if (
        game.lives ===
        3
    ) {

        unlockAchievement(
            "survivor"
        );
    }


    if (
        selectedDifficulty ===
        "medium"
    ) {

        unlockAchievement(
            "mediumFinish"
        );
    }


    if (
        selectedDifficulty ===
        "hard"
    ) {

        unlockAchievement(
            "hardFinish"
        );
    }


    saveGame();


    const finishScore =
        document.getElementById(
            "finishScore"
        );

    const finishTime =
        document.getElementById(
            "finishTime"
        );

    const finishCoins =
        document.getElementById(
            "finishCoins"
        );


    if (finishScore) {

        finishScore.textContent =
            levelScore.toLocaleString(
                "pt-BR"
            );
    }


    if (finishTime) {

        finishTime.textContent =
            formatTime(
                elapsed
            );
    }


    if (finishCoins) {

        finishCoins.textContent =
            game.coins;
    }


    const finishTitle =
        document.getElementById(
            "finishTitle"
        );


    if (finishTitle) {

        finishTitle.textContent =

            game.level >= 5

                ? "VOCÊ COMPLETOU O JOGO!"

                : `FASE ${
                    game.level + 1
                } CONCLUÍDA!`;
    }


    const nextLevel =
        document.getElementById(
            "nextLevelBtn"
        );


    if (nextLevel) {

        nextLevel.style.display =
            game.level >= 5
                ? "none"
                : "block";
    }


    const finishOverlay =
        document.getElementById(
            "finishOverlay"
        );


    if (finishOverlay) {

        finishOverlay.classList.add(
            "visible"
        );
    }


    showVisualEvent(
        "🏁 FASE CONCLUÍDA!"
    );
}


/* =========================================================
   GAME OVER
   ========================================================= */

function gameOver() {

    if (!game.running) {
        return;
    }


    game.running =
        false;

    saveGame();


    const overlay =
        document.getElementById(
            "gameOverOverlay"
        );


    if (overlay) {

        overlay.classList.add(
            "visible"
        );
    }


    showVisualEvent(
        "GAME OVER"
    );
}


/* =========================================================
   PAUSA
   ========================================================= */

function togglePause() {

    if (
        !game.running &&
        !game.paused
    ) {

        return;
    }


    game.paused =
        !game.paused;


    const overlay =
        document.getElementById(
            "pauseOverlay"
        );


    if (overlay) {

        overlay.classList.toggle(
            "visible",
            game.paused
        );
    }
}


/* =========================================================
   BOTÕES DO JOGO
   ========================================================= */

setClick(
    "pauseBtn",
    togglePause
);


setClick(
    "resumeBtn",
    togglePause
);


setClick(
    "restartBtn",
    () => {

        game.paused =
            false;

        game.running =
            true;


        const overlay =
            document.getElementById(
                "pauseOverlay"
            );


        if (overlay) {

            overlay.classList.remove(
                "visible"
            );
        }


        loadLevel();


        showVisualEvent(
            "FASE REINICIADA"
        );
    }
);


setClick(
    "quitBtn",
    () => {

        game.running =
            false;

        game.paused =
            false;


        saveGame();


        const overlay =
            document.getElementById(
                "pauseOverlay"
            );


        if (overlay) {

            overlay.classList.remove(
                "visible"
            );
        }


        showScreen(
            "menuScreen"
        );
    }
);


setClick(
    "nextLevelBtn",
    () => {

        game.level++;

        game.running =
            true;

        game.paused =
            false;


        const overlay =
            document.getElementById(
                "finishOverlay"
            );


        if (overlay) {

            overlay.classList.remove(
                "visible"
            );
        }


        loadLevel();


        showVisualEvent(
            `FASE ${
                game.level + 1
            } — ${
                getCurrentTheme().name
            }`
        );
    }
);


setClick(
    "finishMenuBtn",
    () => {

        const overlay =
            document.getElementById(
                "finishOverlay"
            );


        if (overlay) {

            overlay.classList.remove(
                "visible"
            );
        }


        showScreen(
            "menuScreen"
        );
    }
);


setClick(
    "tryAgainBtn",
    () => {

        const overlay =
            document.getElementById(
                "gameOverOverlay"
            );


        if (overlay) {

            overlay.classList.remove(
                "visible"
            );
        }


        startGame();
    }
);


setClick(
    "gameOverMenuBtn",
    () => {

        const overlay =
            document.getElementById(
                "gameOverOverlay"
            );


        if (overlay) {

            overlay.classList.remove(
                "visible"
            );
        }


        showScreen(
            "menuScreen"
        );
    }
);


/* =========================================================
   RENDERIZAÇÃO
   ========================================================= */

function render() {

    drawBackground();

    drawDecorations();

    drawPlatforms();

    drawHazards();

    drawCoins();

    drawFinish();

    drawPlayer();
}


/* =========================================================
   LOOP PRINCIPAL
   ========================================================= */

let lastTime =
    performance.now();


function gameLoop(now) {

    let dt =
        (
            now -
            lastTime
        ) /
        16.6667;


    lastTime =
        now;


    dt =
        Math.min(
            dt,
            1.7
        );


    if (
        game.running &&
        !game.paused
    ) {

        updateMovingObjects(
            dt
        );


        updatePlayer(
            dt
        );


        updateCoins();


        checkHazards();


        updateCamera();


        checkFinish();


        const elapsed =
            performance.now() -
            game.levelStartTime;


        const timer =
            document.getElementById(
                "timerText"
            );


        if (timer) {

            timer.textContent =
                formatTime(
                    elapsed
                );
        }


        updateHUD();
    }


    render();


    requestAnimationFrame(
        gameLoop
    );
}


/* =========================================================
   INICIALIZAÇÃO
   ========================================================= */

updateSkinsScreen();

updateRecordsScreen();

updateAchievementsScreen();

applySettings();

requestAnimationFrame(
    gameLoop
);