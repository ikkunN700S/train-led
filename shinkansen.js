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

function updateDisplay() {
    const type = document.getElementById("type-select").value;
    const destination = document.getElementById("destination-input").value;

    const typeArea = document.getElementById("type-area");
    const typeText = document.getElementById("type-text");
    const destinationArea = document.getElementById("destination-area");
    const destinationText = document.getElementById("destination-text");

    const number = document.getElementById("number-input")?.value || "123"; // 号数の取得
    const numberText = document.getElementById("number-text");

    const romaji = document.getElementById("romaji-input")?.value || "Romaji";

    // ▼ 表示内容の切り替えに備えて保持（属性として保持しておく）
    typeText.setAttribute("data-ja", type.replace(/[BRH]$/, "")); // 「かもめB」などを整形して保持
    typeText.setAttribute("data-en", typeRomajiMap[type.replace(/[BRH]$/, "")] || type);


    destinationText.setAttribute("data-ja", destination);
    destinationText.setAttribute("data-en", romaji);

    numberText.setAttribute("data-ja", number);
    numberText.setAttribute("data-en", number);

    if (type === "試運転") {
        const formatted = "試　運　転";
        typeArea.style.display = "none";
        //destinationText.textContent = formatted;
        destinationText.setAttribute("data-ja", formatted);
        destinationText.setAttribute("data-en", typeRomajiMap[type]);

        // 日本語なら日本語を表示
        if(isJapanese){
            destinationText.textContent = destinationText.getAttribute("data-ja");
            destinationText.style.letterSpacing = "0.3em"; // 全角スペース2個分の文字間隔
            destinationText.style.fontSize = ""; // 元の大きさ
        }else{
            destinationText.textContent = destinationText.getAttribute("data-en");
            destinationText.style.letterSpacing = "normal"; // 英語は通常の文字間隔
            destinationText.style.fontSize = "0.8em"; // 英語縮小
        }
        destinationText.style.backgroundColor = "black";
        destinationText.style.color = "white";
        destinationText.style.width = "8.5em";
        destinationText.style.height = "1.5em";
    } else if (["臨時", "回送", "団体"].includes(type)) {
        const formatted = type.split("").join("　 　"); // ← 全角スペース2個
        typeArea.style.display = "none";
        //destinationText.textContent = formatted;
        destinationText.setAttribute("data-ja", formatted);
        destinationText.setAttribute("data-en", typeRomajiMap[type]);

        // 日本語なら日本語を表示
        if(isJapanese){
            destinationText.textContent = destinationText.getAttribute("data-ja");
            destinationText.style.letterSpacing = ""; // 全角スペース1個分の文字間隔
            destinationText.style.fontSize = ""; // 元の大きさ
        }else{
            destinationText.textContent = destinationText.getAttribute("data-en");
            destinationText.style.letterSpacing = "normal"; // 英語は通常の文字間隔
            destinationText.style.fontSize = "0.8em"; // 英語縮小
        }
        destinationText.style.backgroundColor = "black";
        destinationText.style.color = "white";
        destinationText.style.width = "8.5em";
        destinationText.style.height = "1.5em";
    } else if (type === "修学旅行") {
        const formatted = type.split("").join("　"); // ← 全角スペース1個
        typeArea.style.display = "none";
        //destinationText.textContent = formatted;
        destinationText.setAttribute("data-ja", formatted);
        destinationText.setAttribute("data-en", typeRomajiMap[type]);

        // 日本語なら日本語を表示
        if(isJapanese){
            destinationText.textContent = destinationText.getAttribute("data-ja");
            destinationText.style.letterSpacing = ""; // 全角スペース1個分の文字間隔
            destinationText.style.fontSize = ""; // 元の大きさ
        } else {
            destinationText.textContent = destinationText.getAttribute("data-en");
            destinationText.style.letterSpacing = "normal"; // 英語は通常の文字間隔
            destinationText.style.fontSize = "0.8em"; // 英語縮小
        }
        destinationText.style.backgroundColor = "black";
        destinationText.style.color = "white";
        destinationText.style.width = "8.5em";
        destinationText.style.height = "1.5em";
    } else {
        // 通常の種別表示に戻す
        typeArea.style.display = ""; // 表示に戻す
        //typeText.textContent = type;
        //destinationText.textContent = destination;

        // 日本語なら日本語を表示
        if(isJapanese){
            typeText.textContent = typeText.getAttribute("data-ja");
            destinationText.textContent = destinationText.getAttribute("data-ja");
            destinationText.style.letterSpacing = ""; // 全角スペース1個分の文字間隔
            typeText.style.fontSize = ""; // 通常サイズに戻す
            numberText.style.fontSize = ""; // 通常サイズに戻す
            destinationText.style.fontSize = ""; // 通常サイズに戻す
        }else{
            typeText.textContent = typeText.getAttribute("data-en");
            destinationText.textContent = destinationText.getAttribute("data-en");
            destinationText.style.letterSpacing = "normal"; // 英語は通常の文字間隔
            typeText.style.fontSize = "0.8em"; // 英語縮小
            numberText.style.fontSize = "0.8em"; // 英語縮小
            destinationText.style.fontSize = ""; // 元の大きさ
        }
        // 号数をセット
        numberText.textContent = numberText.getAttribute("data-ja");

        destinationText.style.flex = ""; 
        destinationText.style.backgroundColor = "";
        destinationText.style.color = "";
        destinationText.style.width = "";
        destinationText.style.height = "";

        
        // 種別ごとの色設定
        switch (type) {
            case "こだま":
                typeArea.style.backgroundColor = "#3050ff";
                typeText.style.color = "white";
                break;
            case "かもめB":
                //typeText.textContent = "かもめ";
                typeArea.style.backgroundColor = "#3050ff";
                typeText.style.color = "white";
                break;
            case "ひかり":
                typeArea.style.backgroundColor = "#ff0000";
                typeText.style.color = "white";
                break;
            case "かもめR":
                //typeText.textContent = "かもめ";
                typeArea.style.backgroundColor = "#ff0000";
                typeText.style.color = "white";
                break;
            case "のぞみ":
                typeArea.style.backgroundColor = "#ffff00";
                typeText.style.color = "Black";
                break;
            case "みずほ":
                typeArea.style.backgroundColor = "#ffa500";
                typeText.style.color = "black";
                break;
            case "さくら":
                typeArea.style.backgroundColor = "#ff69b4";
                typeText.style.color = "white";
                break;
            case "つばめ":
                typeArea.style.backgroundColor = "#40e0d0";
                typeText.style.color = "white";
                break;
            case "はやぶさ":
            case "はやて":
            case "やまびこ":
            case "なすの":
                typeArea.style.backgroundColor = "#41934C";
                typeText.style.color = "white";
                break;
            case "こまち":
                typeArea.style.backgroundColor = "#ED4399";
                typeText.style.color = "white";
                break;
            case "つばさ":
                typeArea.style.backgroundColor = "#F36221";
                typeText.style.color = "white";
                break;
            case "はやぶさH":
                //typeText.textContent = "はやぶさ";
                typeArea.style.backgroundColor = "#9ACD32";
                typeText.style.color = "white";
                break;
            case "はやてH":
                //typeText.textContent = "はやて";
                typeArea.style.backgroundColor = "#9ACD32";
                typeText.style.color = "white";
                break;
            case "とき":
            case "たにがわ":
                typeArea.style.backgroundColor = "#F58D79";
                typeText.style.color = "white";
                break;
            case "あさま":
            case "はくたか":
            case "かがやき":
            case "つるぎ":
                typeArea.style.backgroundColor = "#6A3D98";
                typeText.style.color = "white";
                break;
            default:
                typeArea.style.backgroundColor = "#444";
                typeText.style.color = "white";
        }
    }
}

function switchLanguage() {
    const typeArea = document.getElementById("type-area");
    const typeText = document.getElementById("type-text");
    const destinationArea = document.getElementById("destination-area");
    const destinationText = document.getElementById("destination-text");

    const numberText = document.getElementById("number-text");

    if (!typeArea || !typeText || !destinationArea || !destinationText) return;

    // 現在の表示モード取得（例: "試運転", "臨時", "回送" など）
    const typeTextData = typeText.getAttribute("data-ja");

    // 特殊種別かどうか
    const isSpecialType = ["試運転", "臨時", "回送", "団体", "修学旅行"].includes(typeTextData);

    if (isJapanese) {
        if (isSpecialType) {
            destinationText.textContent = destinationText.getAttribute("data-en");
            destinationText.style.letterSpacing = "normal";
            destinationText.style.fontSize = "0.8em"; // 英語縮小
        } else {
            typeText.textContent = typeText.getAttribute("data-en");
            destinationText.textContent = destinationText.getAttribute("data-en");
            destinationText.style.letterSpacing = "normal";
            typeText.style.fontSize = "0.8em"; // 英語縮小
        }
    } else {
        if (isSpecialType) {
            destinationText.textContent = destinationText.getAttribute("data-ja");
            destinationText.style.letterSpacing = (typeTextData === "試運転") ? "0.3em" : "";
            destinationText.style.fontSize = ""; // 通常サイズに戻す
        } else {
            typeText.textContent = typeText.getAttribute("data-ja");
            destinationText.textContent = destinationText.getAttribute("data-ja");
            destinationText.style.letterSpacing = "0.2em";
            typeText.style.fontSize = ""; // 通常サイズに戻す
        }
    }


    isJapanese = !isJapanese;
}

// ▼ 3秒ごとに日本語とローマ字を切り替える
setInterval(switchLanguage, 3500);

// ▼ 初期表示更新
window.addEventListener("DOMContentLoaded", updateDisplay);

// 画像保存
document.addEventListener("DOMContentLoaded", () => {
    const saveButton = document.getElementById("save-image-button");

    if (saveButton) {
        saveButton.addEventListener("click", () => {
            const display = document.querySelector(".led-display");
            if (!display) return;

            html2canvas(display, {
                backgroundColor: null, // 背景透過を維持
                scale: 2              // 高解像度で保存
            }).then(canvas => {
                const link = document.createElement("a");
                link.download = "display.png";
                link.href = canvas.toDataURL("image/png");
                link.click();
            });
        });
    }
});
