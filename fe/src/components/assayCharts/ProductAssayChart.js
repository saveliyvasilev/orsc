import { useD3 } from "../../hooks/useD3";
import * as d3 from "d3";
import { assayFormat } from "../../formatter";

export const ProductAssayChart = ({ orderProductAssay, scaleMin, scaleMax }) => {
    const width = 100;
    const height = 10;
    // prettier-ignore
    const ref = useD3((svg) => {
        const scale = d3.scaleLinear()
            .domain([scaleMin, scaleMax])
            .range([0, width])

        const yCenter = height/2;
        svg.append("line")  // Horizontal axis
            .style("stroke-width", height/50)
            .attr("x1", 0)
            .attr("y1", yCenter)
            .attr("x2", width)
            .attr("y2", yCenter)
            .classed("svg-comment-stroke", true)
        svg.append("circle")  // resulting assay value dot
            .attr("r", 1.5)
            .attr("cx", scale(orderProductAssay.asy_product))
            .attr("cy", yCenter)
            .classed("svg-primary-fill", true)
    }, []);

    return (
        <div className="assay-widget-container">
            <div className="value-container">{assayFormat(orderProductAssay.asy_product)}</div>
            <div className="svg-container">
                <svg
                    ref={ref}
                    className="svg-content-responsive"
                    preserveAspectRatio="xMinYMin meet"
                    viewBox={`0 0 ${width} ${height}`}
                ></svg>
            </div>
        </div>
    );
};
