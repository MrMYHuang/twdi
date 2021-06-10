export class Bookmark {
    uuid: string = '';
    中文品名: string = '';

    constructor(json: Bookmark) {
        this.uuid = json.uuid;
        this.中文品名 = json.中文品名;
    }
}
