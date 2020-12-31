import { Indicator, RawVar, Structure } from "./types_server";

export function validateIndicators(s: Structure, rawVars: RawVar[]): void {

    s.indicators.forEach(ind => {
        checkAndUpdateIndicator(ind, rawVars);
    });

}

export function checkAndUpdateIndicator(ind: Indicator, rawVars: RawVar[]): void {

    if (ind.isBinary) {
        if (ind.condition.trim() === "") {
            ind.err = true;
            ind.msg = "No expression";
            return;
        }
    }

    if (ind.isNumber) {
        if (ind.condition.trim() === "") {
            ind.err = true;
            ind.msg = "No expression";
            return;
        }
    }

    const tokens = ind.isBinary
        ? getTokensBinary(ind.condition)
        : getTokensNumber(ind.condition);

    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i].err) {
            ind.err = true;
            ind.msg = "Bad expression format";
            return;
        }
    }

    for (let i = 0; i < tokens.length; i++) {
        if (!rawVars.some(a => a.variableName === tokens[i].text)) {
            ind.err = true;
            ind.msg = "Expression refers to variable that is not in dataset";
            return;
        }
    }

    ind.err = false;
    ind.msg = "";

}

type Token = {
    id: string,
    text: string,
    err: boolean,
};

export function getTokensBinary(str: string): Token[] {
    let v0 = str;
    v0 = v0.split("(").map(a => a.trim()).filter(a => a).join("$");
    v0 = v0.split(")").map(a => a.trim()).filter(a => a).join("$");
    v0 = v0.split("&").map(a => a.trim()).filter(a => a).join("$");
    v0 = v0.split("|").map(a => a.trim()).filter(a => a).join("$");
    v0 = v0.split("=>").map(a => a.trim()).filter(a => a).join("$");
    v0 = v0.split("<=").map(a => a.trim()).filter(a => a).join("$");
    v0 = v0.split(">").map(a => a.trim()).filter(a => a).join("$");
    v0 = v0.split("<").map(a => a.trim()).filter(a => a).join("$");
    v0 = v0.split("==").map(a => a.trim()).filter(a => a).join("$");
    v0 = v0.split("!").map(a => a.trim()).filter(a => a).join("$");
    v0 = v0.split("*").map(a => a.trim()).filter(a => a).join("$");
    v0 = v0.split("/").map(a => a.trim()).filter(a => a).join("$");
    v0 = v0.split("+").map(a => a.trim()).filter(a => a).join("$");
    v0 = v0.split("-").map(a => a.trim()).filter(a => a).join("$");
    return v0.split("$")
        .map(a => a.trim())
        .filter(a => a)
        .filter(a => isNaN(Number(a)))
        .filter((v, i, arr) => arr.indexOf(v) === i)
        .map((a, i) => {
            return {
                id: a + "-" + i,
                text: a,
                err: a.includes(" "),
            };
        });
}


export function getTokensNumber(str: string): Token[] {
    let v0 = str;
    v0 = v0.split("(").map(a => a.trim()).filter(a => a).join("$");
    v0 = v0.split(")").map(a => a.trim()).filter(a => a).join("$");
    v0 = v0.split("*").map(a => a.trim()).filter(a => a).join("$");
    v0 = v0.split("/").map(a => a.trim()).filter(a => a).join("$");
    v0 = v0.split("+").map(a => a.trim()).filter(a => a).join("$");
    v0 = v0.split("-").map(a => a.trim()).filter(a => a).join("$");
    return v0.split("$")
        .map(a => a.trim())
        .filter(a => a)
        .filter(a => isNaN(Number(a)))
        .filter((v, i, arr) => arr.indexOf(v) === i)
        .map((a, i) => {
            return {
                id: a + "-" + i,
                text: a,
                err: a.includes(" "),
            };
        });
}