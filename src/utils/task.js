const arrow = (color, indent = 0) => `color: ${color}; text-indent:${(0.4 * 4) * indent}em; padding: 0.4em; margin-right: 0.4em;`;
const style = (color, backgroundColor) => `display: inline-block; color: ${color}; background-color: ${backgroundColor}; border-radius: 3px; padding: 0.4em; margin-right: 0.4em;`;
const diff = (start, end) => {
    const value = end - start,
        color = value > 50 ? "red" : (value > 25 ? "darkorange" : "green");
    return { value, color };
};

export default function start(name){
    const startTime = performance.now();
    const startFormat = `%c-->%c${name}`;
    console.debug(startFormat, arrow('green'), style("gray", "white"));
    return {
        end: () => {
            const duration = diff(startTime, performance.now());
            const endFormat = `%c<--%c${name}%c${duration.value.toFixed(2)}ms`;
            console.debug(endFormat, arrow('red'), style("gray", "white"), style("white", duration.color));
        }
    };
};