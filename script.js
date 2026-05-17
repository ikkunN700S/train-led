// ▼ ローマ字表示用マッピング
const typeRomajiMap = {
    "普　通": "Local",
    "区間快速": "Semi Rapid",
    "快速": "Rapid",
    "新快速": "New Rapid",
    "特別快速": "Special Rapid",
    "試運転": "Test Run",
    "臨時": "Extra",
    "回送": "Out of Service",
    "各停": "Local",
    "各駅停車": "Local",
    "準急": "Semi Exp.",
    "急行": "Express",
    "快速急行": "Rapid Exp.",
    "特急": "Limited Exp.",
    "快速特急": "Rapid Ltd. Exp."
};

let isJapanese = true;  // ▼ 切り替え制御フラグ
let rapidType = false; // 快速系統のフラグ

// 上位種別リスト（斜体にしたい種別）
const italicTypes = ["区間快速", "快速", "新快速", "特別快速"];

// ▼ 行き先や号数テキストを枠に合わせて縮小する関数（汎用化版）
function shrinkTextToFit(container, textNode, padding = 0, defaultLetterSpacing = '0.1em') {
    if (!container || !textNode || typeof textNode.scrollWidth === 'undefined') {
        return;
    }
    
    // 変形リセット
    textNode.style.transform = 'scaleX(1)';
    textNode.style.letterSpacing = defaultLetterSpacing; 
    textNode.style.transformOrigin = 'center center'; 
    
    const maxWidth = container.clientWidth - padding;
    let actualWidth = textNode.scrollWidth;

    if (actualWidth <= maxWidth) {
        return;
    }

    if (defaultLetterSpacing !== 'normal') {
        textNode.style.letterSpacing = 'normal';
        actualWidth = textNode.scrollWidth; // 再計測
    }

    if (actualWidth > maxWidth && actualWidth > 0) {
        const ratio = maxWidth / actualWidth;
        textNode.style.transform = `scaleX(${ratio})`;
    }
}

// ▼ サイズ調整の統合関数
function adjustDestinationSize() {
    const destinationArea = document.getElementById("destination-area");
    const destinationText = document.getElementById("destination-text");
    
    const carNumberArea = document.getElementById("car-number"); // 号数の親枠
    const carDigit = document.getElementById("car-digit"); // 号数の数字テキスト
    
    // 試運転などの全画面表示時は幅計算を除外
    const typeTextData = destinationText.getAttribute("data-ja");
    const isSpecialType = ["試　運　転", "臨　 　時", "回　 　送"].includes(typeTextData);

    if (!isSpecialType) {
        // ① 行先表示の縮小（基本の文字間隔は 0.1em）
        shrinkTextToFit(destinationArea, destinationText, 10, '0.1em');
    } else {
        destinationText.style.transform = 'scaleX(1)';
    }

    // ② 号数表示の縮小（基本の文字間隔は normal）
    if (carNumberArea && carDigit && carNumberArea.style.display !== "none") {
        // paddingは左右の余白（0.5em）を考慮して 10 程度確保します
        shrinkTextToFit(carNumberArea, carDigit, 10, 'normal');
    }
}
function updateDisplay() {
    const carNumber = document.getElementById("car-input").value;
    const carNumberArea = document.getElementById("car-number");
    const carDigit = document.getElementById("car-digit");
    const type = document.getElementById("type-select").value;
    const destination = document.getElementById("destination-input").value;

    const typeArea = document.getElementById("type-area");
    const typeText = document.getElementById("type-text");
    const destinationArea = document.getElementById("destination-area");
    const destinationText = document.getElementById("destination-text");

    const romaji = document.getElementById("romaji-input")?.value || "Romaji";

    // ▼ 表示内容の切り替えに備えて保持（属性として保持しておく）
    typeText.setAttribute("data-ja", type);
    typeText.setAttribute("data-en", typeRomajiMap[type] || type);

    // 行先入力欄の値を即座にセット
    destinationText.setAttribute("data-ja", destination);
    destinationText.setAttribute("data-en", romaji);

    if (carNumber.trim() === "") {
        carNumberArea.style.display = "none"; // 空なら非表示
    } else {
        carNumberArea.style.display = "flex"; // 表示（元に戻す）
        carDigit.textContent = carNumber;
    }

    // 普通の場合は四角で囲む
    const roundedbox = document.getElementById("rounded-box");
    if(type === "普　通"){
        roundedbox.style.borderColor = "#fff";
    }else{
        roundedbox.style.borderColor = "transparent";
    }

    // ← ここで斜体クラスを切り替え
    if (italicTypes.includes(type) && isJapanese) {
        typeText.classList.add("italic-text");
        rapidType = true;
    } else {
        typeText.classList.remove("italic-text");
        rapidType = false;
    }

    if (type === "試運転") {
        // 試運転モード
        const formatted = "試　運　転";
        typeArea.style.display = "none";
        destinationText.setAttribute("data-ja", formatted);
        destinationText.setAttribute("data-en", typeRomajiMap[type]);

        // 日本語なら日本語をセット
        if(isJapanese) {
            destinationText.textContent = destinationText.getAttribute("data-ja");
            destinationText.style.letterSpacing = "0.3em";
            destinationText.style.fontSize = ""; // 特殊用リセット
        } else {
            destinationText.textContent = destinationText.getAttribute("data-en");
            destinationText.style.letterSpacing = "normal"; // 英語は通常の文字間隔
            destinationText.style.fontSize = "0.8em"; // 英語縮小
        }
        
        destinationText.style.backgroundColor = "black";
        destinationText.style.color = "white";
        destinationText.style.width = "8.5em";    // 幅を広げる
        destinationText.style.height = "1.5em"; // フレックスを無効化
        
    }else if(type === "臨時" || type === "回送") {
        // 臨時・回送モード
        const formatted = type.split("").join("　 　"); // ← 全角スペース2個
        typeArea.style.display = "none"; // 非表示にする
        destinationText.setAttribute("data-ja", formatted);
        destinationText.setAttribute("data-en", typeRomajiMap[type]);

        // 日本語なら日本語をセット
        if(isJapanese) {
            destinationText.textContent = destinationText.getAttribute("data-ja");
            destinationText.style.letterSpacing = "";
            destinationText.style.fontSize = "";
        } else {
            destinationText.textContent = destinationText.getAttribute("data-en");
            destinationText.style.letterSpacing = "normal"; // 英語は通常の文字間隔
            destinationText.style.fontSize = "0.8em"; // 英語縮小
        }

        destinationText.style.backgroundColor = "black";
        destinationText.style.color = "white";
        destinationText.style.width = "8.5em";    // 幅を広げる
        destinationText.style.height = "1.5em"; // フレックスを無効化

    } else {
        // 通常の種別表示に戻す
        typeArea.style.display = ""; // 表示に戻す
        const typeTextData = typeText.getAttribute("data-ja");

        // 日本語なら日本語をセット
        if(isJapanese) {
            typeText.textContent = typeText.getAttribute("data-ja");
            destinationText.textContent = destinationText.getAttribute("data-ja");
            destinationText.style.letterSpacing = ""; // 日本語は少し文字間隔を広げる
            destinationText.style.fontSize = ""; // 通常サイズに戻す
            
            // 特別フォントの場合は上記よりフォントサイズを大きく
            if(rapidType){
                // 快速・新快速はより大きく
                if(typeTextData === "快速" || typeTextData === "新快速"){
                    typeText.style.fontSize = "1.5em";
                }else{
                    typeText.style.fontSize = "1.2em";
                }
                typeText.style.fontWeight = "normal";
                // 快速は文字間隔を広く
                if(typeTextData === "快速"){
                    typeText.style.letterSpacing = "0.5em";
                    typeText.style.marginLeft = "0.5em";
                }else if(typeTextData === "新快速"){
                    typeText.style.letterSpacing = "-0.2em";
                    typeText.style.marginLeft = "-0.2em";
                }else{
                    typeText.style.letterSpacing = "-0.2em";
                    typeText.style.marginLeft = "-0.25em";
                }
                
                if (window.innerWidth <= 600) {
                    typeText.style.marginTop = "10px";
                } else {
                    typeText.style.marginTop = "30px";
                }
                
            }else{
                typeText.style.fontSize = "";
                typeText.style.fontWeight = ""; // その他は通常サイズに戻す
                typeText.style.letterSpacing = "";
                typeText.style.marginTop = "";
                typeText.style.marginLeft = "";
            }
        } else {
            typeText.textContent = typeText.getAttribute("data-en");
            destinationText.textContent = destinationText.getAttribute("data-en");
            destinationText.style.letterSpacing = "normal"; // 英語は通常の文字間隔

            if(typeTextData === "各停" || typeTextData === "各駅停車" || typeTextData === "普　通" || typeTextData === "快速" || typeTextData === "急行"){
                // 各停・各駅停車・普通・快速ローマ字表示
                destinationText.style.letterSpacing = "normal";
                destinationText.style.fontSize = "0.8em"; // 英語小さく
                typeText.style.fontSize = "0.8em"; // 通常サイズ
            }else if(typeTextData === "新快速"){
                // 新快速ローマ字表示
                destinationText.style.letterSpacing = "normal";
                destinationText.style.fontSize = "0.8em"; // 英語縮小
                typeText.style.fontSize = "0.7em"; // 通常サイズ
            }else{
                // ▼ ローマ字表示
                destinationText.style.letterSpacing = "normal";
                destinationText.style.fontSize = "0.8em"; // 英語縮小
                typeText.style.fontSize = "0.5em"; // 英語縮小
            }
        }
        destinationText.style.flex = ""; 
        destinationText.style.backgroundColor = "";
        destinationText.style.color = "";
        destinationText.style.width = "";
        destinationText.style.height = "";
        
        // 縁取りをonに戻す
        typeText.style.textShadow = `
            1px 1px 0 black,
            -1px 1px 0 black,
            1px -1px 0 black,
            -1px -1px 0 black
            `;

        // 種別ごとの色設定
        switch (type) {
            case "普　通":
                typeArea.style.backgroundColor = "#000000";
                typeText.style.color = "white";
                break;
            case "各停":
            case "各駅停車":
                typeArea.style.backgroundColor = "#787878ff";
                typeText.style.color = "white";
                break;
            case "区間快速":
                typeArea.style.backgroundColor = "#00cc44";
                typeText.style.color = "white";
                break;
            case "快速":
                typeArea.style.backgroundColor = "#0052cc";
                typeText.style.color = "white";
                break;
            case "新快速":
                typeArea.style.backgroundColor = "#ff4400";
                typeText.style.color = "white";
                break;
            case "特別快速":
                typeArea.style.backgroundColor = "#ffff00ff";
                typeText.style.color = "black";
                typeText.style.textShadow = "none"; // 黒文字の時は縁取りoff
                break;
            case "準急":
                typeArea.style.backgroundColor = "#32cd32";
                typeText.style.color = "white";
                break;
            case "急行":
                typeArea.style.backgroundColor = "#00bfff";
                typeText.style.color = "white";
                break;
            case "快速急行":
                typeArea.style.backgroundColor = "white";
                typeText.style.color = "#00bfff";
                break;
            case "特急":
                typeArea.style.backgroundColor = "#ff0000";
                typeText.style.color = "white";
                break;
            case "快速特急":
                typeArea.style.backgroundColor = "white";
                typeText.style.color = "#ff0000";
                break;
            default:
                typeArea.style.backgroundColor = "#444";
                typeText.style.color = "white";
        }
    }
    
    // 表示更新の最後に、必ずはみ出しチェック（縮小処理）を実行する
    adjustDestinationSize();
}

function switchLanguage() {
    // 状態を反転
    isJapanese = !isJapanese;
    
    const typeArea = document.getElementById("type-area");
    const typeText = document.getElementById("type-text");
    const destinationArea = document.getElementById("destination-area");
    const destinationText = document.getElementById("destination-text");
    const carNumberArea = document.getElementById("car-number");
    const carDigit = document.getElementById("car-digit");
    const carLabel = carNumberArea?.querySelector(".car-label");

    if (!typeArea || !typeText || !destinationArea || !destinationText || !carLabel || !carDigit) return;

    // 現在の表示モード取得
    const typeTextData = typeText.getAttribute("data-ja");
    const isSpecialType = ["試運転", "臨時", "回送"].includes(typeTextData);

    // 斜体クラス切替
    if (italicTypes.includes(typeTextData) && isJapanese) {
        typeText.classList.add("italic-text");
        rapidType = true;
    } else {
        typeText.classList.remove("italic-text");
        rapidType = false;
    }

    if (isJapanese) {
        if(isSpecialType){
            destinationText.textContent = destinationText.getAttribute("data-ja");
            destinationText.style.letterSpacing = (typeTextData === "試運転") ? "0.3em" : "";
            destinationText.style.fontSize = ""; // 通常サイズに戻す
        } else {
            // 日本語表示に戻す
            typeText.textContent = typeText.getAttribute("data-ja");
            destinationText.textContent = destinationText.getAttribute("data-ja");
            destinationText.style.letterSpacing = "0.1em";
            
            if(rapidType){
                if(typeTextData === "快速" || typeTextData === "新快速"){
                    typeText.style.fontSize = "1.5em";
                }else{
                    typeText.style.fontSize = "1.2em";
                }
                typeText.style.fontWeight = "normal";
                if(typeTextData === "快速"){
                    typeText.style.letterSpacing = "0.5em";
                    typeText.style.marginLeft = "0.5em";
                }else if(typeTextData === "新快速"){
                    typeText.style.letterSpacing = "-0.2em";
                    typeText.style.marginLeft = "-0.2em";
                }else{
                    typeText.style.letterSpacing = "-0.2em";
                    typeText.style.marginLeft = "-0.25em";
                }
                if (window.innerWidth <= 600) {
                    typeText.style.marginTop = "10px";
                } else {
                    typeText.style.marginTop = "30px";
                }
            }else{
                typeText.style.fontSize = "";
                typeText.style.fontWeight = ""; 
                typeText.style.letterSpacing = "";
                typeText.style.marginTop = "";
                typeText.style.marginLeft = "";
            }
        }
        // 行先日本語通常サイズ
        destinationText.style.fontSize = ""; 

        // 車両番号 (No.上) -> (数字上) に戻す
        carDigit.textContent = document.getElementById("car-input").value || "1"; 
        carLabel.textContent = "号車"; 
        carLabel.style.fontSize = "0.6em";
        carLabel.style.marginTop = "0em";
        carNumberArea.appendChild(carDigit);
        carNumberArea.appendChild(carLabel);

    } else {
        // 英語モード
        if(isSpecialType){
            destinationText.textContent = destinationText.getAttribute("data-en");
            destinationText.style.letterSpacing = "normal";
            destinationText.style.fontSize = "0.8em"; 
        } else if (typeTextData === "各停" || typeTextData === "各駅停車" || typeTextData === "普　通" || typeTextData === "快速" || typeTextData === "急行"){
            typeText.textContent = typeText.getAttribute("data-en");
            destinationText.textContent = destinationText.getAttribute("data-en");
            destinationText.style.letterSpacing = "normal";
            destinationText.style.fontSize = "0.8em"; 
            typeText.style.fontSize = "0.8em"; 
        } else if (typeTextData === "新快速"){
            typeText.textContent = typeText.getAttribute("data-en");
            destinationText.textContent = destinationText.getAttribute("data-en");
            destinationText.style.letterSpacing = "normal";
            destinationText.style.fontSize = "0.8em"; 
            typeText.style.fontSize = "0.7em"; 
        } else {
            typeText.textContent = typeText.getAttribute("data-en");
            destinationText.textContent = destinationText.getAttribute("data-en");
            destinationText.style.letterSpacing = "normal";
            destinationText.style.fontSize = "0.8em"; 
            typeText.style.fontSize = "0.5em"; 
        }

        typeText.style.fontWeight = ""; 
        typeText.style.letterSpacing = "normal";
        typeText.style.marginTop = "";
        typeText.style.marginLeft = "";

        // 車両番号 (No.上)
        carLabel.textContent = "No."; 
        carDigit.textContent = document.getElementById("car-input").value || "1";
        carLabel.style.fontSize = "";
        carLabel.style.marginTop = "";
        carNumberArea.appendChild(carLabel);
        carNumberArea.appendChild(carDigit);
    }

    // 表示内容が切り替わった後、必ず縮小判定を行う
    adjustDestinationSize();
}

// ▼ 3秒ごとに切り替える
setInterval(switchLanguage, 3500);

// ▼ 初期化時のイベントリスナー登録
window.addEventListener("DOMContentLoaded", () => {
    updateDisplay();

    // 入力イベントのバインド（change ではなく input でリアルタイム反映）
    document.getElementById('destination-input').addEventListener('input', updateDisplay);
    const romajiInput = document.getElementById('romaji-input');
    if (romajiInput) romajiInput.addEventListener('input', updateDisplay);
    
    document.getElementById('type-select').addEventListener('change', updateDisplay);
    document.getElementById('car-input').addEventListener('input', updateDisplay);
});

// ▼ 画像ダウンロード機能
document.addEventListener("DOMContentLoaded", () => {
    const saveButton = document.getElementById("save-image-button");
    if (saveButton) {
        saveButton.addEventListener("click", () => {
            const display = document.querySelector(".display-frame");
            if (!display) return;
            html2canvas(display, {
                backgroundColor: null,
                scale: 2 
            }).then(canvas => {
                const link = document.createElement("a");
                link.download = "display.png";
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