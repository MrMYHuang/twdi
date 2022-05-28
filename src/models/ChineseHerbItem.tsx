export interface IChineseHerbItem {
    許可證字號: string
    限制項目: string
    藥品名稱: string
    劑型與類別: string
    適應症及效能: string
    處方成分: string
    "單/複方": string
    包裝: string
    藥商名稱: string
    製造商名稱: string
    製造商地址: string
    發證日期: string
    有效日期: string
}

export class ChineseHerbItem implements IChineseHerbItem {
    許可證字號: string
    限制項目: string
    藥品名稱: string
    劑型與類別: string
    適應症及效能: string
    處方成分: string
    "單/複方": string
    包裝: string
    藥商名稱: string
    製造商名稱: string
    製造商地址: string
    發證日期: string
    有效日期: string
    
    constructor(json: any) {
        this.許可證字號 = json.許可證字號;
        this.限制項目 = json.限制項目;
        this.藥品名稱 = json.藥品名稱;
        this.劑型與類別 = json.劑型與類別;
        this.適應症及效能 = json.適應症及效能;
        this.處方成分 = json.處方成分;
        this["單/複方"] = json.單複方;
        this.包裝 = json.包裝;
        this.藥商名稱 = json.藥商名稱;
        this.製造商名稱 = json.製造商名稱;
        this.製造商地址 = json.製造商地址;
        this.發證日期 = json.發證日期;
        this.有效日期 = json.有效日期;
    }

    static sortedKeys = [
        "藥品名稱",
        "適應症及效能",
        "限制項目",
        "處方成分",
        "單/複方",
        "劑型與類別",
        "包裝",
        "藥商名稱",
        "製造商名稱",
        "製造商地址",
        "許可證字號",
        "發證日期",
        "有效日期",
    ];
}
