import { useD3 } from "../../hooks/useD3";
import * as d3 from "d3";
import { assayFormat } from "../../formatter";

export const OrderAssayChart = ({ assayDetail, scaleMin, scaleMax }) => {
    const width = 100;
    const height = 10;
    // prettier-ignore
    const ref = useD3((svg) => {
        const scale = d3.scaleLinear()
            .domain([scaleMin, scaleMax])
            .range([0, width])

        const yCenter = height/2;
        const largeBoundaryDelta = height/2;
        const smallBoundaryDelta = height/3;
        const strokeWidth = height/50
        const boundaryStrokeWidth = height/25
        svg.append("line")  // Horizontal axis
            .style("stroke-width", strokeWidth)
            .attr("x1", 0)
            .attr("y1", yCenter)
            .attr("x2", width)
            .attr("y2", yCenter)
            .classed("svg-comment-stroke", true)
        svg.append("line")  // hard LB
            .style("stroke-width", boundaryStrokeWidth)
            .attr("x1", scale(assayDetail.asy_hard_lb))
            .attr("y1", yCenter-largeBoundaryDelta)
            .attr("x2", scale(assayDetail.asy_hard_lb))
            .attr("y2", yCenter+largeBoundaryDelta)
            .classed("svg-danger-stroke", true)
        svg.append("line")  // hard UB
            .style("stroke-width", boundaryStrokeWidth)
            .attr("x1", scale(assayDetail.asy_hard_ub))
            .attr("y1", yCenter-largeBoundaryDelta)
            .attr("x2", scale(assayDetail.asy_hard_ub))
            .attr("y2", yCenter+largeBoundaryDelta)
            .classed("svg-danger-stroke", true)
        svg.append("line")  // soft LB
            .style("stroke-width", boundaryStrokeWidth)
            .attr("x1", scale(assayDetail.asy_soft_lb))
            .attr("y1", yCenter-smallBoundaryDelta)
            .attr("x2", scale(assayDetail.asy_soft_lb))
            .attr("y2", yCenter+smallBoundaryDelta)
            .classed("svg-comment-stroke", true)
        svg.append("line")  // soft UB
            .style("stroke-width", boundaryStrokeWidth)
            .attr("x1", scale(assayDetail.asy_soft_ub))
            .attr("y1", yCenter-smallBoundaryDelta)
            .attr("x2", scale(assayDetail.asy_soft_ub))
            .attr("y2", yCenter+smallBoundaryDelta)
            .classed("svg-comment-stroke", true)
        svg.append("circle")  // resulting assay value dot
            .attr("r", 2)
            .attr("cx", scale(assayDetail.resulting_assay))
            .attr("cy", yCenter)
            .classed("svg-primary-fill", true)
    }, []);

    return (
        <div className="assay-widget-container">
            <div className="value-container">{assayFormat(assayDetail.resulting_assay)}</div>
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
