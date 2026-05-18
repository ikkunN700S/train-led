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

    requestLEDRender();
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
                typeText.style.textShadow = "none";
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
        carDigit.textContent = document.getElementById("car-input").value || ""; 
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
        carDigit.textContent = document.getElementById("car-input").value || "";
        carLabel.style.fontSize = "";
        carLabel.style.marginTop = "";
        carNumberArea.appendChild(carLabel);
        carNumberArea.appendChild(carDigit);
    }

    // 表示内容が切り替わった後、必ず縮小判定を行う
    adjustDestinationSize();
}

// ==========================================
// ▼ 自動切替タイマーの制御
// ==========================================
let languageTimer = null;

// タイマーを開始する関数
function startAutoSwitch() {
    // 既にタイマーが動いていなければ開始
    if (!languageTimer) {
        languageTimer = setInterval(switchLanguage, 3500);
    }
}

// タイマーを停止する関数
function stopAutoSwitch() {
    if (languageTimer) {
        clearInterval(languageTimer); // タイマーを解除
        languageTimer = null;         // 変数をリセット
    }
}

// 自動切替スイッチのイベントリスナー設定
document.addEventListener("DOMContentLoaded", () => {
    const autoSwitchToggle = document.getElementById("auto-switch-toggle");
    
    if (autoSwitchToggle) {
        // 初期状態の反映（checkedなら開始）
        if (autoSwitchToggle.checked) {
            startAutoSwitch();
        }

        // スイッチが切り替えられた時の処理
        autoSwitchToggle.addEventListener("change", (e) => {
            if (e.target.checked) {
                startAutoSwitch();
            } else {
                stopAutoSwitch();
            }
        });
    } else {
        // もしHTMLにスイッチがない場合は、後方互換性のため常に動作させる
        startAutoSwitch();
    }
});

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

// ▼ 画像保存（通常モードとドットモードの出し分け対応）
document.addEventListener("DOMContentLoaded", () => {
    const saveButton = document.getElementById("save-image-button");

    if (saveButton) {
        saveButton.addEventListener("click", () => {
            const toggleCheckbox = document.getElementById("toggle-dots");
            const dotCanvas = document.getElementById("dot-canvas");
            
            // 1. ドット表示モードがONの場合
            if (toggleCheckbox && toggleCheckbox.checked && dotCanvas) {
                // すでにあるCanvasを直接画像に変換する（非常に高速）
                const link = document.createElement("a");
                link.download = "led_display_dot.png"; // 保存名をわかりやすく変更
                link.href = dotCanvas.toDataURL("image/png");
                link.click();
            } 
            // 2. 通常表示モードがONの場合
            else {
                // 従来通り html2canvas を使ってHTML要素を画像化する
                const display = document.querySelector(".led-display");
                if (!display) return;

                html2canvas(display, {
                    backgroundColor: null, 
                    scale: 2              
                }).then(canvas => {
                    const link = document.createElement("a");
                    link.download = "led_display_normal.png"; // 保存名をわかりやすく変更
                    link.href = canvas.toDataURL("image/png");
                    link.click();
                });
            }
        });
    }
});

// ▼ リアルLEDドットマトリクス描画エンジン
let dotRenderTimer;

async function renderLEDMatrix() {
    const display = document.querySelector(".led-display");
    const dotCanvas = document.getElementById("dot-canvas");
    const toggleCheckbox = document.getElementById("toggle-dots");

    if (!display || !dotCanvas || !toggleCheckbox) return;

    if (!toggleCheckbox.checked) {
        dotCanvas.style.opacity = "0";
        return;
    }

    const typeText = document.getElementById("type-text");

    const typeTextData = typeText ? typeText.getAttribute("data-ja") : "";

    let outlineCss = "";
    
    if (typeText) {
        // 現在の要素に適用されている最終的なスタイル（計算値）を取得
        const computedShadow = window.getComputedStyle(typeText).textShadow;
        
        // text-shadow が "none" ではない（＝縁取りが存在する）場合のみCSSを追加
        if (computedShadow !== "none") {
            if (!isJapanese){
                // 縁取りあり&&英語
                outlineCss = `
                #type-text {
                    font-weight: 900 !important;
                    -webkit-text-stroke: 0.2px currentColor !important; 
                    text-shadow: 
                        2px 2px 0 black, -2px 2px 0 black,
                        2px -2px 0 black, -2px -2px 0 black,
                        0 2px 0 black, 0 -2px 0 black,
                        2px 0 0 black, -2px 0 0 black !important;
                }
            `;
            }else if(!rapidType){
                // 縁取りあり&&日本語
                outlineCss = `
                #type-text {
                    font-weight: 900 !important;
                    -webkit-text-stroke: 0.4px currentColor !important; 
                    text-shadow: 
                        2px 2px 0 black, -2px 2px 0 black,
                        2px -2px 0 black, -2px -2px 0 black,
                        0 2px 0 black, 0 -2px 0 black,
                        2px 0 0 black, -2px 0 0 black !important;
                }
            `;
            }
        } else {
            if(!isJapanese && typeTextData === "特別快速"){
                // 縁取りなしかつ英語のとき（特別快速英語のとき）
                outlineCss = `
                #type-text {
                    font-weight: 900 !important;
                    -webkit-text-stroke: 0.8px currentColor !important; 
                }
            `;
            }
        }
    }

    let englishCss = "";
    if (!isJapanese) {
        englishCss = `
            #destination-text {
                -webkit-text-stroke: 0.8px white !important;
            }
        `;
    }

    const tempStyle = document.createElement('style');
    tempStyle.innerHTML = `
        ${outlineCss} /* 条件判定した縁取り用CSSを展開 */
        ${englishCss}
        
        /* 号車などの細い文字を太らせてドット落ちを防ぐ */
        .car-label, .car-digit {
            font-weight: 800 !important;
            -webkit-text-stroke: 0.2px currentColor !important;
        }
    `;

    document.head.appendChild(tempStyle);

    await new Promise(resolve => setTimeout(resolve, 5));

    // 2なら縦横2倍（通常表示のダウンロードと同じ）、3なら3倍の超高解像度
    const scaleFactor = 2; 

    // 指定した高解像度で裏側のテキストをサンプリング
    const tempCanvas = await html2canvas(display, {
        scale: scaleFactor, 
        backgroundColor: "#000",
        logging: false
    });

    document.head.removeChild(tempStyle);

    // キャンバスの内部ピクセルサイズを高解像度な状態に設定
    dotCanvas.width = tempCanvas.width;
    dotCanvas.height = tempCanvas.height;

    const ctx = dotCanvas.getContext("2d", { willReadFrequently: true });
    const tempCtx = tempCanvas.getContext("2d");
    
    const imgData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
    const data = imgData.data;

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, dotCanvas.width, dotCanvas.height);

    // ドットの基本サイズ（スケール1の時のサイズ）
    const baseDotSize = 2;   
    const baseRadius = 0.9;  

    // 解像度に合わせてドットを描画するサイズも拡大する
    const dotSize = baseDotSize * scaleFactor;
    const radius = baseRadius * scaleFactor;

    // 明るさのブースト倍率（1.5〜2.0あたりがお勧めです）
    const brightnessBoost = 1.0; 

    for (let y = 0; y < tempCanvas.height; y += dotSize) {
        for (let x = 0; x < tempCanvas.width; x += dotSize) {
            
            const pX = Math.min(x + Math.floor(dotSize / 2), tempCanvas.width - 1);
            const pY = Math.min(y + Math.floor(dotSize / 2), tempCanvas.height - 1);
            const i = (pY * tempCanvas.width + pX) * 4;

            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            ctx.beginPath();
            ctx.arc(x + dotSize / 2, y + dotSize / 2, radius, 0, Math.PI * 2);

            // 中心が少しでも明るければ点灯（黒い縁取りは r,g,b がほぼ 0 になるため消灯扱いになる）
            if (r > 10 || g > 10 || b > 10) {
                const brightR = Math.min(255, Math.floor(r * brightnessBoost));
                const brightG = Math.min(255, Math.floor(g * brightnessBoost));
                const brightB = Math.min(255, Math.floor(b * brightnessBoost));
                ctx.fillStyle = `rgb(${brightR}, ${brightG}, ${brightB})`;
            } else {
                ctx.fillStyle = "#151515"; // 消灯
            }
            ctx.fill();
        }
    }

    dotCanvas.style.opacity = "1";
}

// 連続実行を防ぐための呼び出し関数
function requestLEDRender() {
    clearTimeout(dotRenderTimer);
    // すぐに処理を開始する（実際の待機は関数内の await で行う）
    dotRenderTimer = setTimeout(renderLEDMatrix, 5); 
}

// トグルスイッチのイベント
const toggleDotsCheckbox = document.getElementById('toggle-dots');
if (toggleDotsCheckbox) {
    toggleDotsCheckbox.addEventListener('change', requestLEDRender);
}