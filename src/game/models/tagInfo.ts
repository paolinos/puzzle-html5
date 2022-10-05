
export interface TagData {
    value: number;
    isInternal:() => boolean;
}

export class TagInfo{
    constructor(
        private readonly name:number, 
        private tags:number[]=[], 
        private tagCollision:Record<string, TagData>={}
    ){
        this.tags = this.tags.sort();
    }

    
    getTagCollision(value:string):TagData{
        return this.tagCollision[value];
    }

    removeTag(value:number):void{
        const pos = this.tags.indexOf(value);
        if(pos >= 0){
            this.tags.splice(pos, 1);
            delete this.tagCollision[value];
        }
    }

    check(tagsInfo:TagInfo):number|null {
        //if(!tagsInfo instanceof TagInfo) throw new Error("Tags should be a tag info");

        // TODO:
        const pos = tagsInfo.tags.indexOf(this.name);
        return  pos >= 0 ? tagsInfo.tags[pos] : null;
    }
}