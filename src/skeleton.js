import './css/sl-loader.scss';
import './css/sizes.scss';
export function randomSkeletonLines(minCount, maxCount) {
    let count = Math.round(Math.random() * (maxCount - minCount) + minCount);
    const e = [];
    while (count > 0) {
        const width = Math.round(Math.random() * 9 + 1) * 10;
        e.push(<div key={count} className={"skeleton m-1 h-px-18 w-" + width}></div>)
        count--;
    }
    return e;
}