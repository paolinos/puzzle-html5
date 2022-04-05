export class TagInfo{
    constructor(name, tags=[], tagCollision={}){
        this.name = name;
        this.tags = tags.sort();
        this.tagCollision = tagCollision;
    }

    
    getTagCollision(value){
        return this.tagCollision[value];
    }

    removeTag(value){
        const pos = this.tags.indexOf(value);
        if(pos >= 0){
            this.tags.splice(pos, 1);
            delete this.tagCollision[value];
        }
    }

    check(tagsInfo){
        if(!tagsInfo instanceof TagInfo) throw new Error("Tags should be a tag info");

        // TODO:
        const pos = tagsInfo.tags.indexOf(this.name);
        return  pos >= 0 ? tagsInfo.tags[pos] : null;
    }
}