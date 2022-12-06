import { useRef, useEffect } from "react";

import * as d3 from "d3";

export const useD3 = (renderChartFn, dependencies) => {
    const ref = useRef();

    useEffect(() => {
        d3.select(ref.current).selectAll("*").remove(); // Clear svg content before adding new elements
        renderChartFn(d3.select(ref.current));

        return () => {};
    }, dependencies);

    return ref;
};
