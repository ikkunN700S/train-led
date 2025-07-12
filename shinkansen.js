function updateDisplay() {
    const type = document.getElementById("type-select").value;
    const destination = document.getElementById("destination-input").value;

    const typeArea = document.getElementById("type-area");
    const destinationArea = document.getElementById("destination-area");


    // 上位種別リスト（斜体にしたい種別）
    const italicTypes = ["区間快速", "快速", "新快速", "特別快速"];


    if (type === "試運転") {
        // 試運転モード
        typeArea.style.display = "none"; // 非表示にする
        destinationArea.textContent = "試　運　転"; // 幅広表示
        destinationArea.style.backgroundColor = "black";
        destinationArea.style.color = "white";
        destinationArea.style.width = "8.5em";    // 幅を広げる
        destinationArea.style.height = "1.5em"; // フレックスを無効化
    }else if(type === "臨時" || type === "回送" || type === "団体") {
        // 臨時・回送モード
        typeArea.style.display = "none"; // 非表示にする
        destinationArea.textContent = type.split("").join("　 　"); // 例：「臨　時」
        destinationArea.style.letterSpacing = "";
        destinationArea.style.backgroundColor = "black";
        destinationArea.style.color = "white";
        destinationArea.style.width = "8.5em";    // 幅を広げる
        destinationArea.style.height = "1.5em"; // フレックスを無効化
    }else if(type === "修学旅行") {
        // 修学旅行モード
        typeArea.style.display = "none"; // 非表示にする
        destinationArea.textContent = type.split("").join("　"); // 例：「臨　時」
        destinationArea.style.letterSpacing = "";
        destinationArea.style.backgroundColor = "black";
        destinationArea.style.color = "white";
        destinationArea.style.width = "8.5em";    // 幅を広げる
        destinationArea.style.height = "1.5em"; // フレックスを無効化
    } else {
        // 通常の種別表示に戻す
        typeArea.style.display = ""; // 表示に戻す
        typeArea.textContent = type;
        destinationArea.textContent = destination;
        destinationArea.style.flex = ""; 
        destinationArea.style.letterSpacing = "";
        destinationArea.style.backgroundColor = "";
        destinationArea.style.color = "";
        destinationArea.style.width = "";
        destinationArea.style.height = "";


        // ← ここで斜体クラスを切り替え
        if (italicTypes.includes(type)) {
            typeArea.classList.add("italic-text");
        } else {
            typeArea.classList.remove("italic-text");
        }
        
        // 種別ごとの色設定
        switch (type) {
            case "こだま":
                typeArea.style.backgroundColor = "#3050ff";
                typeArea.style.color = "white";
                break;
            case "かもめB":
                typeArea.textContent = "かもめ";
                typeArea.style.backgroundColor = "#3050ff";
                typeArea.style.color = "white";
                break;
            case "ひかり":
                typeArea.style.backgroundColor = "#ff0000";
                typeArea.style.color = "white";
                break;
            case "かもめR":
                typeArea.textContent = "かもめ";
                typeArea.style.backgroundColor = "#ff0000";
                typeArea.style.color = "white";
                break;
            case "のぞみ":
                typeArea.style.backgroundColor = "#ffff00";
                typeArea.style.color = "Black";
                break;
            case "みずほ":
                typeArea.style.backgroundColor = "#ffa500";
                typeArea.style.color = "black";
                break;
            case "さくら":
                typeArea.style.backgroundColor = "#ff69b4";
                typeArea.style.color = "white";
                break;
            case "つばめ":
                typeArea.style.backgroundColor = "#40e0d0";
                typeArea.style.color = "white";
                break;
            case "はやぶさ":
            case "はやて":
            case "やまびこ":
            case "なすの":
                typeArea.style.backgroundColor = "#41934C";
                typeArea.style.color = "white";
                break;
            case "こまち":
                typeArea.style.backgroundColor = "#ED4399";
                typeArea.style.color = "white";
                break;
            case "つばさ":
                typeArea.style.backgroundColor = "#F36221";
                typeArea.style.color = "white";
                break;
            case "はやぶさH":
                typeArea.textContent = "はやぶさ";
                typeArea.style.backgroundColor = "#9ACD32";
                typeArea.style.color = "white";
                break;
            case "はやてH":
                typeArea.textContent = "はやて";
                typeArea.style.backgroundColor = "#9ACD32";
                typeArea.style.color = "white";
                break;
            case "とき":
            case "たにがわ":
                typeArea.style.backgroundColor = "#F58D79";
                typeArea.style.color = "white";
                break;
            case "あさま":
            case "はくたか":
            case "かがやき":
            case "つるぎ":
                typeArea.style.backgroundColor = "#6A3D98";
                typeArea.style.color = "white";
                break;
            default:
                typeArea.style.backgroundColor = "#444";
                typeArea.style.color = "white";
        }
    }
}
