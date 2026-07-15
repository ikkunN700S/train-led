let allPresets = {}; 
let currentTypes = []; 

// ==========================================
// ▼ JSON読み込みと初期化
// ==========================================
window.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch('presets.json');
        allPresets = await response.json();
        
        const presetSelect = document.getElementById("preset-select");
        for (const [key, data] of Object.entries(allPresets)) {
            const option = document.createElement("option");
            option.value = key;
            option.textContent = data.name;
            presetSelect.appendChild(option);
        }

        const firstPresetKey = Object.keys(allPresets)[0];
        currentTypes = JSON.parse(JSON.stringify(allPresets[firstPresetKey].types));
        rebuildTypeSelectUI();

    } catch (error) {
        console.warn("presets.json の読み込みに失敗しました", error);
    }

    document.getElementById('destination-input')?.addEventListener('input', updateDisplay);
    document.getElementById('romaji-input')?.addEventListener('input', updateDisplay);
    document.getElementById('type-select')?.addEventListener('change', updateDisplay);
    // トグルボタンのイベント追加
    document.getElementById('toggle-dest-btn')?.addEventListener('change', updateDisplay);
    
    setupModalEvents();
    updateDisplay();
});

function rebuildTypeSelectUI() {
    const mainTypeSelect = document.getElementById("type-select");
    if (!mainTypeSelect) return;
    const currentValue = mainTypeSelect.value;
    mainTypeSelect.innerHTML = "";
    currentTypes.forEach(type => {
        const option = document.createElement("option");
        option.value = type.ja;
        option.textContent = type.ja;
        mainTypeSelect.appendChild(option);
    });
    if (currentTypes.some(t => t.ja === currentValue)) {
        mainTypeSelect.value = currentValue;
    }
}

// ==========================================
// ▼ テキスト縮小汎用関数
// ==========================================
function shrinkTextToFit(container, textNode, padding = 0, defaultLetterSpacing = 'normal') {
    if (!container || !textNode || typeof textNode.scrollWidth === 'undefined') return;
    
    textNode.style.transform = 'scaleX(1)';
    textNode.style.letterSpacing = defaultLetterSpacing; 
    textNode.style.transformOrigin = 'center center'; 
    
    const maxWidth = container.clientWidth - padding;
    let actualWidth = textNode.scrollWidth;

    if (actualWidth <= maxWidth) return;

    if (actualWidth > maxWidth && actualWidth > 0) {
        const ratio = maxWidth / actualWidth;
        textNode.style.transform = `scaleX(${ratio})`;
    }
}
function adjustDestinationSize() {
    const destArea = document.getElementById("destination-area");
    const destJa = document.getElementById("destination-text-ja");
    const destEn = document.getElementById("destination-text-en");
    const typeArea = document.getElementById("type-area");
    const typeJa = document.getElementById("type-text-ja");
    const typeEn = document.getElementById("type-text-en");

    // 全種別共通の縮小判定（非表示時も内部的に計算可能）
    if(destArea && destJa) shrinkTextToFit(destArea, destJa, 10, '0.1em');
    if(destArea && destEn) shrinkTextToFit(destArea, destEn, 10, 'normal');
    
    // 種別の文字間隔を引き継いで縮小
    if (typeArea && typeJa) {
        const jaSpacing = typeJa.style.letterSpacing || 'normal';
        shrinkTextToFit(typeArea, typeJa, 4, jaSpacing);
    }
    if (typeArea && typeEn) shrinkTextToFit(typeArea, typeEn, 4, 'normal');

    requestLEDRender();
}

// ==========================================
// ▼ メイン表示更新（2段同時出力）
// ==========================================
function updateDisplay() {
    const typeValue = document.getElementById("type-select").value;
    const destJaValue = document.getElementById("destination-input").value;
    const destEnValue = document.getElementById("romaji-input").value;
    const toggleDest = document.getElementById("toggle-dest-btn")?.checked;

    const typeArea = document.getElementById("type-area");
    const typeJa = document.getElementById("type-text-ja");
    const typeEn = document.getElementById("type-text-en");
    
    const destArea = document.getElementById("destination-area");
    const destJa = document.getElementById("destination-text-ja");
    const destEn = document.getElementById("destination-text-en");

    const typeData = currentTypes.find(t => t.ja === typeValue);
    const typeEnglish = typeData ? typeData.en : typeValue;

    // 基本のテキストセット
    destJa.textContent = destJaValue;
    destEn.textContent = destEnValue;
    typeJa.textContent = typeValue;
    typeEn.textContent = typeEnglish;

    // 空白を抜いた判定用文字列
    const cleanType = typeValue.replace(/\s+/g, '');

    // ▼ 1. 特殊フォント（斜体など）の適用制御 ▼
    const specialFontTypes = ["快速", "新快速", "特別快速", "区間快速"];
    if (specialFontTypes.includes(cleanType)) {
        // 日本語のみに適用
        typeJa.classList.add("italic-text");
        typeJa.style.top = "30px";

        // 従来通りの文字間隔微調整
        if (cleanType === "快速") {
            typeJa.style.letterSpacing = "0.3em";
            typeJa.style.textIndent = "0";
            typeJa.style.fontSize = "4em";
        } else if (cleanType === "特別快速" || cleanType === "区間快速") {
            typeJa.style.letterSpacing = "-0.2em";
            typeJa.style.textIndent = "-0.32em";
            typeJa.style.fontSize = "3.2em";
        } else if (cleanType === "新快速") {
            typeJa.style.letterSpacing = "-0.2em";
            typeJa.style.textIndent = "-0.3em";
            typeJa.style.fontSize = "4em";
        } else {
            typeJa.style.letterSpacing = "-0.1em";
            typeJa.style.textIndent = "0";
            typeJa.style.fontSize = "";
        }
    } else {
        // 通常種別の場合はリセット
        typeJa.classList.remove("italic-text");
        typeJa.style.letterSpacing = "normal";
        typeJa.style.textIndent = "0";
        typeJa.style.fontSize = "";
        typeJa.style.top = "20px";
    }
    // 英語は【常に】通常フォント
    typeEn.classList.remove("italic-text");
    typeEn.style.letterSpacing = "normal";

    // ▼ 2. 特殊種別（試運転など）の行先エリア制御 ▼
    const specialTypes = ["試運転", "臨時", "回送"];
    if (specialTypes.includes(cleanType)) {
        if (toggleDest) {
            destArea.style.visibility = "visible"; // ボタンONなら行先を表示
        } else {
            destArea.style.visibility = "hidden"; // デフォルトは隠す
        }
    } else {
        destArea.style.visibility = "visible"; // 通常種別は常に表示
    }

    // ▼ 3. スタイルの設定 (色・縁取り) ▼
    if (typeData) {
        typeArea.style.backgroundColor = typeData.bg;
        typeJa.style.color = typeData.text;
        typeEn.style.color = typeData.text;
        
        const shadow = typeData.outline === false ? "none" : `1px 1px 0 black, -1px 1px 0 black, 1px -1px 0 black, -1px -1px 0 black`;
        typeJa.style.textShadow = shadow;
        typeEn.style.textShadow = shadow;
    } else {
        typeArea.style.backgroundColor = "#444";
        typeJa.style.color = "white";
        typeEn.style.color = "white";
        typeJa.style.textShadow = `1px 1px 0 black, -1px 1px 0 black, 1px -1px 0 black, -1px -1px 0 black`;
        typeEn.style.textShadow = `1px 1px 0 black, -1px 1px 0 black, 1px -1px 0 black, -1px -1px 0 black`;
    }

    adjustDestinationSize();
}

// ==========================================
// ▼ ドット描画エンジン関連
// ==========================================
let dotRenderTimer;

async function renderLEDMatrix() {
    const display = document.querySelector(".led-display");
    const dotCanvas = document.getElementById("dot-canvas");
    const toggleCheckbox = document.getElementById("toggle-dots");

    if (!display || !dotCanvas || !toggleCheckbox) return;
    if (!toggleCheckbox.checked) { dotCanvas.style.opacity = "0"; return; }

    const typeJa = document.getElementById("type-text-ja");
    let outlineCss = "";
    
    if (typeJa && window.getComputedStyle(typeJa).textShadow !== "none") {
        outlineCss = `
            #type-text-ja, #type-text-en { font-weight: 900 !important; -webkit-text-stroke: 0.4px currentColor !important; }
        `;
    } else {
        outlineCss = `
            #type-text-ja, #type-text-en { font-weight: 900 !important; -webkit-text-stroke: 0.8px currentColor !important; }
        `;
    }

    const tempStyle = document.createElement('style');
    tempStyle.innerHTML = `
        ${outlineCss}
        .sub-text { font-weight: 800 !important; -webkit-text-stroke: 0.2px currentColor !important; }
    `;
    document.head.appendChild(tempStyle);

    await new Promise(resolve => setTimeout(resolve, 5));

    const scaleFactor = 2; 
    const baseWidth = display.offsetWidth;
    const baseHeight = display.offsetHeight;

    const tempCanvas = await html2canvas(display, {
        scale: scaleFactor, backgroundColor: "#000", logging: false,
        width: baseWidth, height: baseHeight,
        onclone: (clonedDoc) => {
            const clonedDisplay = clonedDoc.querySelector(".led-display");
            if (clonedDisplay) clonedDisplay.style.transform = "none";
        }
    });
    
    document.head.removeChild(tempStyle);

    dotCanvas.width = tempCanvas.width;
    dotCanvas.height = tempCanvas.height;

    const displayStyle = window.getComputedStyle(display);
    const borderLeft = parseFloat(displayStyle.borderLeftWidth) || 0;
    const borderTop = parseFloat(displayStyle.borderTopWidth) || 0;

    dotCanvas.style.width = baseWidth + "px";
    dotCanvas.style.height = baseHeight + "px";
    dotCanvas.style.left = `-${borderLeft}px`;
    dotCanvas.style.top = `-${borderTop}px`;
    dotCanvas.style.borderRadius = displayStyle.borderRadius;

    const ctx = dotCanvas.getContext("2d", { willReadFrequently: true });
    const imgData = tempCanvas.getContext("2d").getImageData(0, 0, tempCanvas.width, tempCanvas.height);
    const data = imgData.data;

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, dotCanvas.width, dotCanvas.height);

    const verticalDots = 30; 
    const dotSize = tempCanvas.height / verticalDots; 
    const radius = dotSize * 0.45;
    const brightnessBoost = 1.5;

    for (let y = 0; y < tempCanvas.height; y += dotSize) {
        for (let x = 0; x < tempCanvas.width; x += dotSize) {
            const pX = Math.min(Math.floor(x + dotSize / 2), tempCanvas.width - 1);
            const pY = Math.min(Math.floor(y + dotSize / 2), tempCanvas.height - 1);
            const i = (pY * tempCanvas.width + pX) * 4;
            const r = data[i], g = data[i + 1], b = data[i + 2];

            ctx.beginPath();
            ctx.arc(x + dotSize / 2, y + dotSize / 2, radius, 0, Math.PI * 2);
            if (r > 10 || g > 10 || b > 10) {
                ctx.fillStyle = `rgb(${Math.min(255, Math.floor(r * brightnessBoost))}, ${Math.min(255, Math.floor(g * brightnessBoost))}, ${Math.min(255, Math.floor(b * brightnessBoost))})`;
            } else {
                ctx.fillStyle = "#151515"; 
            }
            ctx.fill();
        }
    }
    dotCanvas.style.opacity = "1";
}

function requestLEDRender() {
    clearTimeout(dotRenderTimer);
    dotRenderTimer = setTimeout(renderLEDMatrix, 5); 
}

document.getElementById('toggle-dots')?.addEventListener('change', requestLEDRender);

// ▼ 画像保存機能
document.getElementById("save-image-button")?.addEventListener("click", () => {
    const toggleCheckbox = document.getElementById("toggle-dots");
    const dotCanvas = document.getElementById("dot-canvas");
    
    if (toggleCheckbox && toggleCheckbox.checked && dotCanvas) {
        const link = document.createElement("a");
        link.download = "led_bilingual_dot.png";
        link.href = dotCanvas.toDataURL("image/png");
        link.click();
    } else {
        const display = document.querySelector(".led-display");
        html2canvas(display, { backgroundColor: null, scale: 2 }).then(canvas => {
            const link = document.createElement("a");
            link.download = "led_bilingual_normal.png";
            link.href = canvas.toDataURL("image/png");
            link.click();
        });
    }
});

// ▼ モーダル設定 UI制御（流用）
function setupModalEvents() {
    const modal = document.getElementById("settings-modal");
    document.getElementById("open-settings-btn")?.addEventListener("click", () => { renderSettingsEditor(); modal.style.display = "flex"; });
    document.getElementById("close-settings-btn")?.addEventListener("click", () => { modal.style.display = "none"; });
    document.getElementById("load-preset-btn")?.addEventListener("click", () => {
        const presetKey = document.getElementById("preset-select").value;
        if (presetKey && allPresets[presetKey]) {
            currentTypes = JSON.parse(JSON.stringify(allPresets[presetKey].types));
            renderSettingsEditor();
        }
    });
    document.getElementById("save-settings-btn")?.addEventListener("click", () => {
        const rows = document.getElementById("type-editor-container").querySelectorAll(".type-edit-row");
        let newTypes = [];
        rows.forEach(row => {
            newTypes.push({
                ja: row.querySelector(".edit-ja").value, en: row.querySelector(".edit-en").value,
                bg: row.querySelector(".edit-bg").value, text: row.querySelector(".edit-text").value,
                outline: row.querySelector(".edit-outline").checked
            });
        });
        currentTypes = newTypes;
        rebuildTypeSelectUI();
        updateDisplay();
        modal.style.display = "none";
    });
}

function renderSettingsEditor() {
    const container = document.getElementById("type-editor-container");
    container.innerHTML = "";
    currentTypes.forEach((type) => {
        const row = document.createElement("div");
        row.className = "type-edit-row";
        row.innerHTML = `
            <input type="text" class="edit-ja" value="${type.ja}" placeholder="日本語">
            <input type="text" class="edit-en" value="${type.en}" placeholder="英語">
            <div class="color-group">
                <label>背景 <input type="color" class="edit-bg" value="${type.bg}"></label>
                <label>文字 <input type="color" class="edit-text" value="${type.text}"></label>
                <label><input type="checkbox" class="edit-outline" ${type.outline !== false ? 'checked' : ''}> 縁取り</label>
            </div>
        `;
        container.appendChild(row);
    });
}