export function prepareRoot(parent, id = "app") {
    assert(parent, "\"parent\" argument is required");
    assert(parent instanceof HTMLElement, "\"parent\" argument must be an HTMLElement type");

    let root = document.createElement("div");
    root.id = id;

    if (parent.firstChild) {
        parent.insertBefore(root, parent.firstChild);
    } else {
        parent.appendChild(root);
    }

    return root;
}


export function assert(test, message = "") {
    if (!test) {
        throw new Error(message);
    }
}


export function assertNumber(value, prefix = "") {
    assert(typeof value === "number", `${prefix} must be a number"`);
}


export function div(className = "") {
    let d = document.createElement("div");
    d.classList.add(...(className.split(" ")));
    return d;
}


export function colorInterpolation(colorA, colorB, ratio) {
    const NotNumberTest = /[^01-9a-f]*/i;
    let aNum = Number.parseInt(colorA.replace(NotNumberTest, ''), 16);
    let bNum = Number.parseInt(colorB.replace(NotNumberTest, ''), 16);

    let aR = aNum >> 16;
    let bR = bNum >> 16;
    let aG = (aNum >> 8) & 0x0000ff;
    let bG = (bNum >> 8) & 0x0000ff;
    let aB = aNum & 0x0000ff;
    let bB = bNum & 0x0000ff;
    let r = lerp(aR, bR, ratio) << 16;
    let g = lerp(aG, bG, ratio) << 8;
    let b = lerp(aB, bB, ratio);

    let interStr = Math.round(r + g + b).toString(16);
    return "#" + Array(6-interStr.length).fill("0").join("") + interStr;
}


export function lerp(a, b, t) {
    return (1 - t) * a + t * b;
}


export function outExpo(t) {
    return -Math.pow(2, -10 * t) + 1;
}
