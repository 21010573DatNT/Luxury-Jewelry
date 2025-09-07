module.exports = (query) => {
    let objectsearch = {
        keyword: "",
        regex: ""
    }

    if(query.keyword){
        objectsearch.keyword = query.keyword;
        const regex = new RegExp(objectsearch.keyword, "i"); //Tìm kiếm keyword không phân biệt hoa thường chỉ cần có chữ giống keyword    
        objectsearch.regex = regex;
    }

    return objectsearch;
}