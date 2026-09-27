"use strict";

/* =========================================================
   PIXEL SPEED RUN
   JOGO 2D - HTML + CSS + JAVASCRIPT PURO
   ========================================================= */

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

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
        pants: "#4381ae",
        hair: "#30241e",
        accent: "#9fe8ff",
        model: "school",
        role: "Uniforme oficial"
    },

    {
        id: "blue",
        name: "Velocista Pulse",
        cost: 100,
        shirt: "#287ba7",
        pants: "#243f58",
        hair: "#202a32",
        accent: "#8eeaff",
        model: "runner",
        role: "Corrida aerodinâmica"
    },

    {
        id: "red",
        name: "Piloto Orbital",
        cost: 220,
        shirt: "#dceaf0",
        pants: "#526e82",
        hair: "#182b3c",
        accent: "#8be6ff",
        model: "pilot",
        role: "Traje pressurizado"
    },

    {
        id: "purple",
        name: "Ninja Circuito",
        cost: 400,
        shirt: "#34435e",
        pants: "#1b293b",
        hair: "#111a28",
        accent: "#adf1ff",
        model: "ninja",
        role: "Manto furtivo"
    },

    {
        id: "gold",
        name: "Guardião Aurora",
        cost: 700,
        shirt: "#b7cbd4",
        pants: "#38546c",
        hair: "#182636",
        accent: "#f0d598",
        model: "guardian",
        role: "Armadura de elite"
    },

    {
        id: "silver",
        name: "Androide Axiom",
        cost: 480,
        shirt: "#c5d7e0",
        pants: "#5b778b",
        hair: "#8298a5",
        accent: "#7deaff",
        model: "android",
        role: "Chassi sintético"
    },

    {
        id: "cyan",
        name: "Mecânico Volt",
        cost: 640,
        shirt: "#327386",
        pants: "#31495c",
        hair: "#202a32",
        accent: "#a7e6bd",
        model: "mechanic",
        role: "Kit de manutenção"
    },

    {
        id: "black",
        name: "Agente Eclipse",
        cost: 900,
        shirt: "#263448",
        pants: "#162334",
        hair: "#111923",
        accent: "#77ddff",
        model: "shadow",
        role: "Infiltração tática"
    }
];


function skinUnlocked(skin) {

    return (
        save.unlockedSkins.includes(
            skin.id
        )
    );
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


        const card =
            document.createElement(
                "div"
            );


        card.className =
            `skin-card model-${skin.model} ${
                unlocked ? "" : "locked"
            }${
                save.selectedSkin === skin.id ? " selected" : ""
            }`;


        card.innerHTML = `

            <div
                class="skin-preview model-${skin.model}"
                data-model="${skin.model}"

                style="
                    --shirt:${skin.shirt};
                    --pants:${skin.pants};
                    --hair:${skin.hair};
                    --accent:${skin.accent};
                "
            >

                <div class="skin-cape"></div>
                <div class="skin-pack"></div>

                <div class="skin-head">

                    <div class="skin-hair"></div>

                    <div class="skin-visor"></div>

                    <div class="skin-eye one"></div>

                    <div class="skin-eye two"></div>

                </div>

                <div class="skin-body"></div>

                <div class="skin-chest-detail"></div>

                <div class="skin-arm left"></div>

                <div class="skin-arm right"></div>

                <div class="skin-leg left"></div>

                <div class="skin-leg right"></div>

                <div class="skin-emblem"></div>

            </div>

            <span class="skin-model-tag">
                ${skin.role}
            </span>

            <h3>
                ${skin.name}
            </h3>

            <p>
                ${
                    unlocked
                        ? (skin.cost === 0 ? "Padrão · Desbloqueada" : "Desbloqueada")
                        : `${skin.cost.toLocaleString("pt-BR")} moedas`
                }
            </p>

            <button
                ${unlocked || canBuy ? "" : "disabled"}
            >
                ${
                    unlocked
                        ? (save.selectedSkin === skin.id ? "EQUIPADA" : "EQUIPAR")
                        : "COMPRAR"
                }
            </button>

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
            x: 3550,

            y: 70,

            w: 52,

            h: 52,

            type: "saw",

            startX: 3490,

            endX: 3620,

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


function drawMoonBaseBackground(t) {
    const earthGradient = ctx.createRadialGradient(858, 80, 8, 858, 80, 68);
    earthGradient.addColorStop(0, "#e8f7ff");
    earthGradient.addColorStop(0.35, "#77b7dc");
    earthGradient.addColorStop(1, "rgba(46,82,116,0.1)");
    ctx.fillStyle = earthGradient;
    ctx.beginPath();
    ctx.arc(858, 80, 68, 0, Math.PI * 2);
    ctx.fill();
    drawTechLine(815, 52, 888, 96, "rgba(233,249,255,0.45)", 1, 2);

    ctx.fillStyle = "rgba(45,66,83,0.8)";
    ctx.beginPath();
    ctx.moveTo(0, 444);
    ctx.quadraticCurveTo(175, 407, 360, 445);
    ctx.quadraticCurveTo(570, 468, 760, 430);
    ctx.quadraticCurveTo(930, 400, 1100, 444);
    ctx.lineTo(1100, 505);
    ctx.lineTo(0, 505);
    ctx.closePath();
    ctx.fill();

    for (let i = 0; i < 9; i++) {
        const craterX = (i * 157 - game.cameraX * 0.17) % 1280;
        const x = craterX < 0 ? craterX + 1280 : craterX;
        const y = 458 + (i % 3) * 15;
        const radius = 18 + (i % 4) * 7;

        ctx.fillStyle = "rgba(13,29,43,0.3)";
        ctx.beginPath();
        ctx.ellipse(x, y, radius, radius * 0.34, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(194,220,233,0.38)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(x - 2, y - 2, radius, radius * 0.34, 0, Math.PI, Math.PI * 2);
        ctx.stroke();
    }

    const offset = (game.cameraX * 0.1) % 440;
    for (let x = -440 - offset; x < canvas.width + 440; x += 440) {
        ctx.fillStyle = "rgba(27,54,73,0.94)";
        roundRect(x + 66, 350, 205, 83, 10);
        ctx.fill();

        ctx.fillStyle = "rgba(142,203,226,0.28)";
        ctx.beginPath();
        ctx.ellipse(x + 168, 350, 82, 55, 0, Math.PI, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(198,235,248,0.75)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(x + 168, 350, 82, 55, 0, Math.PI, Math.PI * 2);
        ctx.stroke();

        drawTechLine(x + 66, 391, x + 271, 391, t.accent, 2, 11);
        drawTechLine(x + 91, 352, x + 91, 431, "rgba(214,244,255,0.52)", 1, 3);
        drawTechLine(x + 247, 352, x + 247, 431, "rgba(214,244,255,0.52)", 1, 3);
        drawTechNode(x + 168, 350, 4, "#f1fbff");

        ctx.fillStyle = "rgba(193,234,247,0.74)";
        roundRect(x + 310, 416, 64, 19, 6);
        ctx.fill();
        drawTechLine(x + 323, 435, x + 316, 447, t.accent, 2, 5);
        drawTechLine(x + 360, 435, x + 367, 447, t.accent, 2, 5);
    }
}


function drawForestBackground(t) {

    drawSun(880, 85, 42);


    drawMountains(
        t.mountain2,
        t.mountain,
        0.18
    );


    for (let i = 0; i < 5; i++) {
        drawCloud(
            (i * 250 - game.cameraX * 0.08) % 1300 - 100,
            70 + i * 30
        );
    }


    const treeOffset = (game.cameraX * 0.34) % 190;

    for (let treeX = -190 - treeOffset; treeX < canvas.width + 190; treeX += 190) {
        drawPineTree(treeX + 46, 490, 92, "#28493a", 0.66);
        drawPineTree(treeX + 132, 484, 126, "#294b3b", 0.86);
    }
}


/* =========================================================
   CIDADE
   ========================================================= */

function drawParkBackground(t) {
    const offset = (game.cameraX * 0.12) % 420;

    drawSun(850, 86, 38);

    ctx.fillStyle = "rgba(75,132,150,0.4)";
    ctx.beginPath();
    ctx.moveTo(0, 400);
    ctx.quadraticCurveTo(250, 320, 500, 397);
    ctx.quadraticCurveTo(760, 337, 1100, 390);
    ctx.lineTo(1100, 505);
    ctx.lineTo(0, 505);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "rgba(198,228,229,0.15)";
    ctx.beginPath();
    ctx.moveTo(395, 505);
    ctx.lineTo(490, 414);
    ctx.lineTo(605, 414);
    ctx.lineTo(720, 505);
    ctx.closePath();
    ctx.fill();
    drawTechLine(490, 414, 605, 414, "rgba(224,248,247,0.56)", 2, 5);

    for (let x = -420 - offset; x < canvas.width + 420; x += 420) {
        const treeX = x + 90;
        const treeY = 385 + Math.abs(Math.sin(x * 0.02)) * 32;

        ctx.fillStyle = "rgba(30,69,81,0.72)";
        roundRect(treeX + 29, treeY - 65, 12, 75, 5);
        ctx.fill();
        drawCircle(treeX + 35, treeY - 77, 39, "rgba(70,127,139,0.72)");
        drawCircle(treeX + 11, treeY - 55, 25, "rgba(58,110,126,0.74)");
        drawCircle(treeX + 59, treeY - 54, 26, "rgba(82,139,149,0.68)");
        drawTechLine(treeX + 35, treeY - 93, treeX + 35, treeY - 53, "rgba(181,231,235,0.5)", 1, 4);

        const benchX = x + 250;
        ctx.fillStyle = "rgba(24,54,69,0.9)";
        roundRect(benchX, 417, 76, 8, 3);
        ctx.fill();
        drawTechLine(benchX + 8, 427, benchX + 8, 442, t.accent, 2, 4);
        drawTechLine(benchX + 68, 427, benchX + 68, 442, t.accent, 2, 4);
        drawTechLine(benchX + 2, 414, benchX + 74, 414, "#d8f5fb", 1, 3);

        drawTechLine(x + 365, 420, x + 365, 461, t.accent, 2, 7);
        drawTechNode(x + 365, 415, 5, "#e8f8ff");
        drawTechLine(x + 351, 461, x + 379, 461, "rgba(220,245,250,0.7)", 2, 3);
    }

    const fountainX = 850 - (game.cameraX * 0.08 % 900);
    ctx.fillStyle = "rgba(26,62,82,0.88)";
    ctx.beginPath();
    ctx.ellipse(fountainX, 442, 82, 17, 0, 0, Math.PI * 2);
    ctx.fill();
    drawTechLine(fountainX - 73, 439, fountainX + 73, 439, t.accent, 2, 9);
    ctx.fillStyle = "rgba(111,201,220,0.72)";
    ctx.beginPath();
    ctx.moveTo(fountainX - 12, 439);
    ctx.quadraticCurveTo(fountainX, 389, fountainX + 12, 439);
    ctx.closePath();
    ctx.fill();
    drawTechNode(fountainX, 386, 4, "#effcff");
}


/* =========================================================
   RUÍNAS
   ========================================================= */

function drawSchoolBackground(t) {
    const offset = (game.cameraX * 0.22) % 420;

    drawSun(850, 82, 36);

    for (let x = -420 - offset; x < canvas.width + 420; x += 420) {
        ctx.fillStyle = "rgba(116,98,76,0.92)";
        roundRect(x + 18, 218, 382, 248, 8);
        ctx.fill();

        ctx.fillStyle = "rgba(151,91,58,0.86)";
        ctx.beginPath();
        ctx.moveTo(x + 2, 220);
        ctx.lineTo(x + 52, 177);
        ctx.lineTo(x + 365, 177);
        ctx.lineTo(x + 414, 220);
        ctx.closePath();
        ctx.fill();

        drawTechLine(x + 25, 220, x + 393, 220, t.accent, 3, 10);

        for (let row = 0; row < 2; row++) {
            for (let column = 0; column < 5; column++) {
                const windowX = x + 48 + column * 66;
                const windowY = 252 + row * 67;

                ctx.fillStyle = "rgba(239,210,151,0.74)";
                roundRect(windowX, windowY, 42, 38, 4);
                ctx.fill();
                ctx.strokeStyle = "rgba(248,235,201,0.72)";
                ctx.lineWidth = 1;
                ctx.strokeRect(windowX, windowY, 42, 38);
                drawTechLine(windowX + 21, windowY + 2, windowX + 21, windowY + 36, "rgba(217,246,255,0.5)", 1, 2);
                drawTechLine(windowX + 2, windowY + 19, windowX + 40, windowY + 19, "rgba(217,246,255,0.5)", 1, 2);
            }
        }

        ctx.fillStyle = "rgba(77,53,41,0.96)";
        roundRect(x + 174, 365, 74, 101, 5);
        ctx.fill();
        ctx.fillStyle = "rgba(236,190,112,0.9)";
        ctx.fillRect(x + 231, 414, 4, 4);

        ctx.fillStyle = "rgba(107,61,44,0.96)";
        roundRect(x + 126, 229, 168, 25, 5);
        ctx.fill();
        ctx.strokeStyle = "#efcf91";
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 126, 229, 168, 25);
        ctx.fillStyle = "#f2fbff";
        ctx.font = "bold 13px Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("ESCOLA", x + 210, 247);

        ctx.strokeStyle = "rgba(198,234,247,0.42)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x + 20, 481);
        ctx.lineTo(x + 400, 481);
        ctx.moveTo(x + 50, 496);
        ctx.lineTo(x + 370, 496);
        ctx.stroke();

        drawTechLine(x + 27, 466, x + 27, 499, t.accent, 2, 5);
        drawTechLine(x + 391, 466, x + 391, 499, t.accent, 2, 5);
    }
}


/* =========================================================
   MONTANHA
   ========================================================= */

function drawMountainBackground(t) {

    drawSun(840, 92, 34);


    drawMountainPeaks(t);


    for (
        let i = 0;
        i < 5;
        i++
    ) {

        drawCloud(

            (
                i * 240 -
                game.cameraX *
                0.07
            ) %
            1300 -
            100,

            65 +
            i * 36
        );
    }


    const treeOffset = (game.cameraX * 0.14) % 390;

    for (let treeX = -390 - treeOffset; treeX < canvas.width + 390; treeX += 390) {
        drawPineTree(treeX + 92, 475, 112, "#415f55", 0.82);
        drawPineTree(treeX + 215, 482, 78, "#718a7a", 0.68);
    }
}


/* =========================================================
   GALÁXIA
   ========================================================= */

function drawGalaxyBackground(t) {
    const nebula = ctx.createRadialGradient(500, 250, 20, 500, 250, 390);
    nebula.addColorStop(0, "rgba(119,151,216,0.28)");
    nebula.addColorStop(0.5, "rgba(87,113,180,0.14)");
    nebula.addColorStop(1, "rgba(14,31,61,0)");
    ctx.fillStyle = nebula;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < 78; i++) {
        let x = (i * 137 - game.cameraX * (0.025 + (i % 4) * 0.006)) % canvas.width;
        if (x < 0) x += canvas.width;
        const y = (i * 83) % 410 + 22;
        const radius = i % 11 === 0 ? 2.4 : i % 3 === 0 ? 1.5 : 0.9;
        drawTechNode(x, y, radius, i % 5 === 0 ? "#ffffff" : "rgba(190,218,255,0.9)");
    }

    ctx.save();
    ctx.translate(640, 235);
    ctx.rotate(-0.28);
    for (let arm = 0; arm < 3; arm++) {
        ctx.save();
        ctx.rotate(arm * Math.PI * 2 / 3);
        ctx.strokeStyle = "rgba(154,191,255,0.38)";
        ctx.lineWidth = 22;
        ctx.shadowColor = t.accent;
        ctx.shadowBlur = 26;
        ctx.beginPath();
        ctx.ellipse(0, 0, 220, 82, 0.18, 0.25, 2.45);
        ctx.stroke();
        ctx.restore();
    }
    ctx.restore();

    const core = ctx.createRadialGradient(640, 235, 4, 640, 235, 82);
    core.addColorStop(0, "#f4fbff");
    core.addColorStop(0.2, "rgba(190,220,255,0.8)");
    core.addColorStop(1, "rgba(104,143,210,0)");
    ctx.fillStyle = core;
    ctx.beginPath();
    ctx.arc(640, 235, 82, 0, Math.PI * 2);
    ctx.fill();

    drawOrbitalBody(162, 147, 54, t);
    drawOrbitalBody(1000, 102, 30, t);

    ctx.strokeStyle = "rgba(171,206,255,0.38)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(510, 230, 480, 164, -0.2, 3.15, 5.55);
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
                drawPineTree(x + 18, item.y + 52, item.size * 1.8, "#31563f", 0.82);
            } else {
                ctx.fillStyle = "rgba(103,100,77,0.62)";
                ctx.beginPath();
                ctx.moveTo(x + 1, item.y + 29);
                ctx.quadraticCurveTo(x + 4, item.y + 13, x + 16, item.y + 12);
                ctx.quadraticCurveTo(x + 31, item.y + 5, x + 41, item.y + 25);
                ctx.lineTo(x + 37, item.y + 31);
                ctx.closePath();
                ctx.fill();
            }
        } else if (game.theme === 1) {
            if (item.type === "tree") {
                ctx.fillStyle = "rgba(34,73,76,0.86)";
                roundRect(x + 17, item.y + 3, 8, 39, 4);
                ctx.fill();
                drawCircle(x + 21, item.y - 6, item.size * 0.38, "rgba(90,151,126,0.76)");
                drawCircle(x + 8, item.y + 1, item.size * 0.25, "rgba(113,171,137,0.72)");
                drawCircle(x + 34, item.y + 1, item.size * 0.25, "rgba(74,139,121,0.72)");
            } else {
                ctx.fillStyle = "rgba(121,113,85,0.72)";
                ctx.beginPath();
                ctx.ellipse(x + 20, item.y + 28, 22, 7, 0, 0, Math.PI * 2);
                ctx.fill();
            }
        } else if (game.theme === 2 || game.theme === 3) {
            if (item.type === "tree") {
                const foliage = game.theme === 2 ? "#626c48" : "#526a5a";
                drawPineTree(x + 22, item.y + 49, item.size * 1.7, foliage, 0.82);
            } else {
                ctx.fillStyle = game.theme === 2
                    ? "rgba(134,112,83,0.7)"
                    : "rgba(128,139,129,0.72)";
                ctx.beginPath();
                ctx.ellipse(x + 22, item.y + 27, 22, 9, -0.08, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = "rgba(238,232,207,0.3)";
                ctx.beginPath();
                ctx.ellipse(x + 17, item.y + 24, 8, 3, -0.1, 0, Math.PI * 2);
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
    if (["ninja", "guardian", "shadow"].includes(skin.model)) {
        ctx.fillStyle =
            skin.model === "guardian"
                ? "rgba(42,65,82,0.94)"
                : "rgba(18,31,47,0.92)";

        ctx.beginPath();
        ctx.moveTo(x + 8, y + 24);
        ctx.lineTo(x + 30, y + 24);
        ctx.lineTo(x + 36, y + 55);
        ctx.lineTo(x + 21, y + 50);
        ctx.lineTo(x + 3, y + 55);
        ctx.closePath();
        ctx.fill();

        drawTechLine(x + 20, y + 30, x + 20, y + 48, skin.accent, 1, 4);
    }

    if (["pilot", "mechanic"].includes(skin.model)) {
        ctx.fillStyle = skin.model === "pilot" ? "#7895a7" : "#466474";
        roundRect(x + 27, y + 25, 9, 23, 3);
        ctx.fill();
        drawTechLine(x + 29, y + 29, x + 34, y + 29, skin.accent, 1, 4);
    }
}


function drawSkinChestDetails(skin, x, y) {
    switch (skin.model) {
        case "runner":
            drawTechLine(x + 10, y + 24, x + 17, y + 44, skin.accent, 2, 5);
            drawTechLine(x + 15, y + 24, x + 22, y + 44, "#edfaff", 1, 3);
            break;

        case "pilot":
            drawTechLine(x + 10, y + 23, x + 27, y + 44, "#365c73", 3, 3);
            drawTechLine(x + 29, y + 23, x + 13, y + 43, skin.accent, 2, 5);
            drawTechNode(x + 20, y + 34, 3, "#eafaff");
            break;

        case "ninja":
            ctx.fillStyle = "#23364d";
            roundRect(x + 7, y + 35, 25, 6, 3);
            ctx.fill();
            drawTechLine(x + 9, y + 37, x + 29, y + 37, skin.accent, 1, 4);
            break;

        case "guardian":
            ctx.fillStyle = "#8ca9b8";
            roundRect(x + 3, y + 21, 10, 8, 3);
            ctx.fill();
            roundRect(x + 26, y + 21, 9, 8, 3);
            ctx.fill();
            drawTechLine(x + 13, y + 25, x + 20, y + 39, skin.accent, 2, 6);
            drawTechLine(x + 27, y + 25, x + 20, y + 39, skin.accent, 2, 6);
            drawTechNode(x + 20, y + 35, 3, skin.accent);
            break;

        case "android":
            ctx.fillStyle = "#6e8998";
            roundRect(x + 9, y + 25, 22, 20, 4);
            ctx.fill();
            ctx.strokeStyle = skin.accent;
            ctx.lineWidth = 1;
            ctx.strokeRect(x + 11, y + 27, 18, 16);
            drawTechNode(x + 20, y + 35, 4, skin.accent);
            break;

        case "mechanic":
            ctx.fillStyle = "#253f52";
            roundRect(x + 9, y + 29, 8, 10, 2);
            ctx.fill();
            roundRect(x + 23, y + 29, 8, 10, 2);
            ctx.fill();
            drawTechLine(x + 8, y + 42, x + 31, y + 42, skin.accent, 2, 4);
            break;

        case "shadow":
            drawTechLine(x + 11, y + 24, x + 28, y + 44, skin.accent, 2, 8);
            break;
    }
}


function drawSkinHeadwear(skin, x, y) {
    switch (skin.model) {
        case "runner":
            drawTechLine(x + 8, y + 4, x + 31, y + 4, skin.accent, 3, 5);
            break;

        case "pilot":
            ctx.fillStyle = "#839eae";
            roundRect(x + 5, y - 5, 30, 27, 9);
            ctx.fill();
            ctx.strokeStyle = skin.accent;
            ctx.lineWidth = 2;
            ctx.strokeRect(x + 6, y - 4, 28, 25);
            ctx.fillStyle = "#173047";
            roundRect(x + 8, y + 6, 24, 8, 4);
            ctx.fill();
            drawTechLine(x + 11, y + 8, x + 29, y + 8, "#dff8ff", 1, 5);
            break;

        case "ninja":
            ctx.fillStyle = "#1c2b3e";
            ctx.beginPath();
            ctx.moveTo(x + 6, y + 8);
            ctx.quadraticCurveTo(x + 7, y - 8, x + 21, y - 6);
            ctx.quadraticCurveTo(x + 34, y - 5, x + 34, y + 8);
            ctx.lineTo(x + 29, y + 5);
            ctx.lineTo(x + 24, y + 9);
            ctx.lineTo(x + 19, y + 5);
            ctx.lineTo(x + 13, y + 9);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = "#263b52";
            roundRect(x + 8, y + 12, 25, 6, 2);
            ctx.fill();
            drawTechLine(x + 12, y + 14, x + 29, y + 14, skin.accent, 1, 5);
            break;

        case "guardian":
            ctx.fillStyle = "#8aa7b7";
            roundRect(x + 5, y - 4, 30, 24, 8);
            ctx.fill();
            ctx.strokeStyle = skin.accent;
            ctx.lineWidth = 2;
            ctx.strokeRect(x + 7, y - 2, 26, 20);
            ctx.fillStyle = "#203b52";
            roundRect(x + 9, y + 7, 22, 6, 3);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(x + 16, y - 4);
            ctx.lineTo(x + 20, y - 11);
            ctx.lineTo(x + 24, y - 4);
            ctx.fillStyle = skin.accent;
            ctx.fill();
            break;

        case "android":
            ctx.fillStyle = "#a8c1cc";
            roundRect(x + 6, y - 3, 28, 25, 6);
            ctx.fill();
            ctx.strokeStyle = skin.accent;
            ctx.lineWidth = 2;
            ctx.strokeRect(x + 8, y - 1, 24, 21);
            ctx.fillStyle = "#18344a";
            roundRect(x + 9, y + 7, 22, 7, 3);
            ctx.fill();
            drawTechNode(x + 14, y + 10, 2, skin.accent);
            drawTechNode(x + 26, y + 10, 2, skin.accent);
            break;

        case "mechanic":
            ctx.fillStyle = "#30495c";
            roundRect(x + 8, y - 2, 25, 8, 4);
            ctx.fill();
            ctx.strokeStyle = skin.accent;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(x + 14, y + 8, 5, Math.PI, Math.PI * 2);
            ctx.arc(x + 27, y + 8, 5, Math.PI, Math.PI * 2);
            ctx.stroke();
            break;

        case "shadow":
            ctx.fillStyle = "#172436";
            roundRect(x + 5, y - 6, 31, 30, 10);
            ctx.fill();
            ctx.fillStyle = "#203850";
            roundRect(x + 8, y + 10, 25, 8, 3);
            ctx.fill();
            drawTechLine(x + 12, y + 13, x + 29, y + 13, skin.accent, 1, 7);
            break;
    }
}


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
        Math.sin(player.runFrame);


    const y =
        player.y -
        (running ? Math.abs(Math.sin(player.runFrame * 2)) * 1.1 : 0);


    const shirtColor =
        skin.shirt;


    const pantsColor =
        skin.pants;


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


    /* =====================================================
       SOMBRA
       ===================================================== */

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
                ? (player.vy < 0 ? -16 : 12)
                : 0;


    const legTwo =
        running
            ? -anim * 22
            : airborne
                ? (player.vy < 0 ? 14 : -8)
                : 0;


    const legLiftOne =
        running
            ? Math.max(0, Math.cos(player.runFrame)) * 3
            : airborne && player.vy < 0
                ? 4
                : 0;


    const legLiftTwo =
        running
            ? Math.max(0, -Math.cos(player.runFrame)) * 3
            : airborne && player.vy < 0
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
        player.facing
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
        player.facing
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


    if (skin.id === "green") {
        ctx.fillStyle = "#d9e6ed";
        ctx.beginPath();
        ctx.moveTo(x + 13, y + 20);
        ctx.lineTo(x + 19, y + 26);
        ctx.lineTo(x + 20, y + 22);
        ctx.lineTo(x + 24, y + 20);
        ctx.lineTo(x + 21, y + 28);
        ctx.lineTo(x + 18, y + 28);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "#264c69";
        ctx.font = "bold 4px Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Colégio", x + 20, y + 35);
        ctx.fillText("Barbosa", x + 20, y + 41);

        ctx.fillStyle = "#4381ae";
        ctx.fillRect(x + 19, y + 28, 2, 2);
        ctx.fillRect(x + 19, y + 32, 2, 2);
    }


    drawSkinChestDetails(skin, x, y);


    /* =====================================================
       BRAÇOS
       ===================================================== */

    const armOne =
        running
            ? -anim * 28
            : airborne
                ? (player.vy < 0 ? 48 : 24)
                : 0;


    const armTwo =
        running
            ? anim * 28
            : airborne
                ? (player.vy < 0 ? -48 : -24)
                : 0;


    drawArm(
        x + 8,
        y + 22,
        armOne,
        shirtColor,
        skin.model,
        skin.accent
    );


    drawArm(
        x + 31,
        y + 22,
        armTwo,
        shirtColor,
        skin.model,
        skin.accent
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
        player.facing > 0
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
        player.facing > 0
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
        player.facing > 0 ? x + 30 : x + 7,
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

        player.facing > 0
            ? x + 24
            : x + 12,

        y + 17,

        4,
        1
    );


    drawSkinHeadwear(skin, x, y);


    ctx.restore();
}


/* =========================================================
   PERNA
   ========================================================= */

function drawLeg(
    x,
    y,
    color,
    facing = 1
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
    color,
    model = "school",
    accent = "#9fe8ff"
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

    handGradient.addColorStop(0, model === "android" ? "#d5e4ea" : "#f0c59e");
    handGradient.addColorStop(1, model === "android" ? "#718b99" : "#be8664");
    ctx.fillStyle = handGradient;
    ctx.beginPath();
    ctx.ellipse(0, 13, 3.7, 4.2, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = model === "android" ? accent : "rgba(255,255,255,0.34)";
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