

export default class Likes {
    constructor() {
        this.likes = [];
    };

    addLike(uri, title, author, img) {
        const like = {uri, title, author, img};
        this.likes.push(like);
        return like;
    };

    deleteLike(uri) {
        const index = this.likes.findIndex(el => el.uri === uri);
        this.likes.splice(index, 1);
    };

    isLiked(uri) {
        return this.likes.findIndex(el => el.uri === uri) !== -1;
    };

    getNumLikes() {
        return this.likes.length;
    };
}