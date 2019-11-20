const zeroPadding = (n) => {
    let num = Number(n);
    return num<10?`0${num}`:`${num}`;
}

export default {
    zeroPadding
};
