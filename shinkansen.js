// ▼ ローマ字表示用マッピング
const typeRomajiMap = {
    "こだま": "KODAMA",
    "ひかり": "HIKARI",
    "のぞみ": "NOZOMI",
    "みずほ": "MIZUHO",
    "さくら": "SAKURA",
    "つばめ": "TSUBAME",
    "かもめ": "KAMOME",
    "はやぶさ": "HAYABUSA",
    "はやて": "HAYATE",
    "やまびこ": "YAMABIKO",
    "なすの": "NASUNO",
    "こまち": "KOMACHI",
    "つばさ": "TSUBASA",
    "つるぎ": "TSURUGI",
    "あさま": "ASAMA",
    "はくたか": "HAKUTAKA",
    "かがやき": "KAGAYAKI",
    "とき": "TOKI",
    "たにがわ": "TANIGAWA",
    "試運転": "Test Run",
    "臨時": "Temporary",
    "回送": "Out of Service",
    "団体": "Reserved Train",
    "修学旅行": "Reserved Train"
};

let isJapanese = true;  // ▼ 切り替え制御フラグ

// ▼ 行き先や号数テキストを枠に合わせて縮小する関数（汎用化版）
function shrinkTextToFit(container, textNode, padding = 0, defaultLetterSpacing = 'normal', baseTransform = '') {
    if (!container || !textNode || typeof textNode.scrollWidth === 'undefined') {
        return;
    }
    
    // 1. 変形リセット（ベースの移動設定 + scaleX(1) をセット）
    textNode.style.transform = `${baseTransform} scaleX(1)`.trim();
    textNode.style.letterSpacing = defaultLetterSpacing; 
    textNode.style.transformOrigin = 'center center'; 
    
    const maxWidth = container.clientWidth - padding;
    let actualWidth = textNode.scrollWidth;

    // 2. 枠に収まっている場合は終了
    if (actualWidth <= maxWidth) {
        return;
    }

    // 3. 文字間隔が空いている場合は、まず詰める
    if (defaultLetterSpacing !== 'normal') {
        textNode.style.letterSpacing = 'normal';
        actualWidth = textNode.scrollWidth; // 再計測
    }

    // 4. それでもはみ出す場合のみ、横幅を縮小（長体）する
    if (actualWidth > maxWidth && actualWidth > 0) {
        const ratio = maxWidth / actualWidth;
        // ベースの移動設定と、計算した縮小率を合体させる
        textNode.style.transform = `${baseTransform} scaleX(${ratio})`.trim();
    }
}

// ▼ サイズ調整の統合関数
function adjustDestinationSize() {
    const destinationArea = document.getElementById("destination-area");
    const destinationText = document.getElementById("destination-text");
    
    const typeArea = document.getElementById("type-area"); // 号数の親枠
    const numberText = document.getElementById("number-text"); // 号数テキスト
    
    const type = document.getElementById("type-select").value;
    const isSpecialType = ["試運転", "臨時", "回送", "団体", "修学旅行"].includes(type);

    if (!isSpecialType) {
        // ① 行先表示の縮小（行先は absolute による移動がないためベース変形は空文字 ''）
        const destSpacing = isJapanese ? '0.2em' : 'normal';
        shrinkTextToFit(destinationArea, destinationText, 10, destSpacing, '');
        
        // ② 号数表示の縮小（★ ここで 'translateX(-50%)' を渡すことで中央寄せを維持）
        if (numberText && numberText.style.display !== "none") {
            shrinkTextToFit(typeArea, numberText, 4, 'normal', 'translateX(-50%)');
        }
    } else {
        // 特殊種別の場合は縮小をリセット
        if (destinationText) destinationText.style.transform = 'scaleX(1)';
        if (numberText) numberText.style.transform = 'translateX(-50%) scaleX(1)';
    }
}

function updateDisplay() {
    const type = document.getElementById("type-select").value;
    const destination = document.getElementById("destination-input").value;

    const typeArea = document.getElementById("type-area");
    const typeText = document.getElementById("type-text");
    const destinationArea = document.getElementById("destination-area");
    const destinationText = document.getElementById("destination-text");

    const number = document.getElementById("number-input")?.value; // 号数の取得
    const numberText = document.getElementById("number-text");
    
    // 号数の表示制御
    if (!number || number.trim() === "") {
        numberText.style.display = "none";
        typeText.style.marginBottom = "0em"; 
    } else {
        numberText.textContent = number;
        numberText.style.display = "inline-block";
        typeText.style.marginBottom = "0.9em"; 
    }

    const romaji = document.getElementById("romaji-input")?.value || "Romaji";

    // 表示内容の保持
    typeText.setAttribute("data-ja", type.replace(/[BRH]$/, "")); 
    typeText.setAttribute("data-en", typeRomajiMap[type.replace(/[BRH]$/, "")] || type);
    destinationText.setAttribute("data-ja", destination);
    destinationText.setAttribute("data-en", romaji);
    numberText.setAttribute("data-ja", number);
    numberText.setAttribute("data-en", number);

    if (type === "試運転") {
        const formatted = "試　運　転";
        typeArea.style.display = "none";
        destinationText.setAttribute("data-ja", formatted);
        destinationText.setAttribute("data-en", typeRomajiMap[type]);

        if(isJapanese){
            destinationText.textContent = destinationText.getAttribute("data-ja");
            destinationText.style.letterSpacing = "0.3em"; 
            destinationText.style.fontSize = ""; 
        }else{
            destinationText.textContent = destinationText.getAttribute("data-en");
            destinationText.style.letterSpacing = "normal"; 
            destinationText.style.fontSize = "0.8em"; 
        }
        destinationText.style.backgroundColor = "black";
        destinationText.style.color = "white";
        destinationText.style.width = "8.5em";
        destinationText.style.height = "1.5em";
        
    } else if (["臨時", "回送", "団体"].includes(type)) {
        const formatted = type.split("").join("　 　");
        typeArea.style.display = "none";
        destinationText.setAttribute("data-ja", formatted);
        destinationText.setAttribute("data-en", typeRomajiMap[type]);

        if(isJapanese){
            destinationText.textContent = destinationText.getAttribute("data-ja");
            destinationText.style.letterSpacing = ""; 
            destinationText.style.fontSize = ""; 
        }else{
            destinationText.textContent = destinationText.getAttribute("data-en");
            destinationText.style.letterSpacing = "normal"; 
            destinationText.style.fontSize = "0.8em"; 
        }
        destinationText.style.backgroundColor = "black";
        destinationText.style.color = "white";
        destinationText.style.width = "8.5em";
        destinationText.style.height = "1.5em";
        
    } else if (type === "修学旅行") {
        const formatted = type.split("").join("　"); 
        typeArea.style.display = "none";
        destinationText.setAttribute("data-ja", formatted);
        destinationText.setAttribute("data-en", typeRomajiMap[type]);

        if(isJapanese){
            destinationText.textContent = destinationText.getAttribute("data-ja");
            destinationText.style.letterSpacing = ""; 
            destinationText.style.fontSize = ""; 
        } else {
            destinationText.textContent = destinationText.getAttribute("data-en");
            destinationText.style.letterSpacing = "normal"; 
            destinationText.style.fontSize = "0.8em"; 
        }
        destinationText.style.backgroundColor = "black";
        destinationText.style.color = "white";
        destinationText.style.width = "8.5em";
        destinationText.style.height = "1.5em";
        
    } else {
        // 通常の種別表示
        typeArea.style.display = ""; 

        if(isJapanese){
            typeText.textContent = typeText.getAttribute("data-ja");
            destinationText.textContent = destinationText.getAttribute("data-ja");
            destinationText.style.letterSpacing = "0.2em"; // 新幹線日本語の基本間隔
            typeText.style.fontSize = ""; 
            numberText.style.fontSize = ""; 
            destinationText.style.fontSize = ""; 
        }else{
            typeText.textContent = typeText.getAttribute("data-en");
            destinationText.textContent = destinationText.getAttribute("data-en");
            destinationText.style.letterSpacing = "normal"; 
            typeText.style.fontSize = "0.8em"; 
            numberText.style.fontSize = "0.8em"; 
            destinationText.style.fontSize = "0.8em"; 
        }
        
        numberText.textContent = numberText.getAttribute("data-ja");
        destinationText.style.flex = ""; 
        destinationText.style.backgroundColor = "";
        destinationText.style.color = "";
        destinationText.style.width = "";
        destinationText.style.height = "";

        // 種別ごとの色設定
        switch (type) {
            case "こだま":
            case "かもめB":
                typeArea.style.backgroundColor = "#3050ff";
                typeText.style.color = "white";
                numberText.style.color = "white";
                break;
            case "ひかり":
            case "かもめR":
                typeArea.style.backgroundColor = "#ff0000";
                typeText.style.color = "white";
                numberText.style.color = "white";
                break;
            case "のぞみ":
                typeArea.style.backgroundColor = "#ffff00";
                typeText.style.color = "black";
                numberText.style.color = "black";
                break;
            case "みずほ":
                typeArea.style.backgroundColor = "#ffa500";
                typeText.style.color = "black";
                numberText.style.color = "black";
                break;
            case "さくら":
                typeArea.style.backgroundColor = "#ff69b4";
                typeText.style.color = "white";
                numberText.style.color = "white";
                break;
            case "つばめ":
                typeArea.style.backgroundColor = "#40e0d0";
                typeText.style.color = "white";
                numberText.style.color = "white";
                break;
            case "はやぶさ":
            case "はやて":
            case "やまびこ":
            case "なすの":
                typeArea.style.backgroundColor = "#41934C";
                typeText.style.color = "white";
                numberText.style.color = "white";
                break;
            case "こまち":
                typeArea.style.backgroundColor = "#ED4399";
                typeText.style.color = "white";
                numberText.style.color = "white";
                break;
            case "つばさ":
                typeArea.style.backgroundColor = "#F36221";
                typeText.style.color = "white";
                numberText.style.color = "white";
                break;
            case "はやぶさH":
            case "はやてH":
                typeArea.style.backgroundColor = "#9ACD32";
                typeText.style.color = "white";
                numberText.style.color = "white";
                break;
            case "とき":
            case "たにがわ":
                typeArea.style.backgroundColor = "#F58D79";
                typeText.style.color = "white";
                numberText.style.color = "white";
                break;
            case "あさま":
            case "はくたか":
            case "かがやき":
            case "つるぎ":
                typeArea.style.backgroundColor = "#856f9bff";
                typeText.style.color = "white";
                numberText.style.color = "white";
                break;
            default:
                typeArea.style.backgroundColor = "#444";
                typeText.style.color = "white";
                numberText.style.color = "white";
        }
    }

    // ▼ 表示更新の最後に、必ずサイズ調整（縮小判定）を実行する
    adjustDestinationSize();
}

function switchLanguage() {
    // まず状態を反転させる
    isJapanese = !isJapanese;
    
    const typeArea = document.getElementById("type-area");
    const typeText = document.getElementById("type-text");
    const destinationArea = document.getElementById("destination-area");
    const destinationText = document.getElementById("destination-text");
    const numberText = document.getElementById("number-text");

    if (!typeArea || !typeText || !destinationArea || !destinationText) return;

    const typeTextData = typeText.getAttribute("data-ja");
    const type = document.getElementById("type-select").value;
    const isSpecialType = ["試運転", "臨時", "回送", "団体", "修学旅行"].includes(type);

    if (isJapanese) {
        if (isSpecialType) {
            destinationText.textContent = destinationText.getAttribute("data-ja");
            destinationText.style.letterSpacing = (type === "試運転") ? "0.3em" : "";
            destinationText.style.fontSize = ""; 
        } else {
            typeText.textContent = typeText.getAttribute("data-ja");
            destinationText.textContent = destinationText.getAttribute("data-ja");
            destinationText.style.letterSpacing = "0.2em"; // 新幹線用の文字間隔
            destinationText.style.fontSize = ""; 
            typeText.style.fontSize = ""; 
        }
    } else {
        if (isSpecialType) {
            destinationText.textContent = destinationText.getAttribute("data-en");
            destinationText.style.letterSpacing = "normal";
            destinationText.style.fontSize = "0.8em"; 
        } else {
            typeText.textContent = typeText.getAttribute("data-en");
            destinationText.textContent = destinationText.getAttribute("data-en");
            destinationText.style.letterSpacing = "normal";
            destinationText.style.fontSize = "0.8em"; 
            typeText.style.fontSize = "0.8em"; 
        }
    }

    // ▼ 切り替え完了時にも必ずサイズ調整を実行する
    adjustDestinationSize();
}

// ▼ 3秒ごとに切り替える
setInterval(switchLanguage, 3500);

// ▼ 初期化時のイベントリスナー登録（リアルタイム反映 input に変更・追加）
window.addEventListener("DOMContentLoaded", () => {
    updateDisplay();

    // 入力欄に input イベントをバインド（リアルタイム反映）
    const destInput = document.getElementById('destination-input');
    if (destInput) destInput.addEventListener('input', updateDisplay);

    const romajiInput = document.getElementById('romaji-input');
    if (romajiInput) romajiInput.addEventListener('input', updateDisplay);

    const numberInput = document.getElementById('number-input');
    if (numberInput) numberInput.addEventListener('input', updateDisplay);

    const typeSelect = document.getElementById('type-select');
    if (typeSelect) typeSelect.addEventListener('change', updateDisplay);
});

// ▼ 画像保存
document.addEventListener("DOMContentLoaded", () => {
    const saveButton = document.getElementById("save-image-button");
    if (saveButton) {
        saveButton.addEventListener("click", () => {
            const display = document.querySelector(".led-display");
            if (!display) return;
            html2canvas(display, {
                backgroundColor: null, 
                scale: 2              
            }).then(canvas => {
                const link = document.createElement("a");
                link.download = "shinkansen_display.png";
                link.href = canvas.toDataURL("image/png");
                link.click();
            });
        });
    }
});

// ▼ ドット枠の制御
const toggleDotsCheckbox = document.getElementById('toggle-dots');
const displayElement = document.querySelector('.led-display'); 
if (toggleDotsCheckbox && displayElement) {
    toggleDotsCheckbox.addEventListener('change', function() {
        if (this.checked) {
            displayElement.classList.add('show-dots');
        } else {
            displayElement.classList.remove('show-dots');
        }
    });
}