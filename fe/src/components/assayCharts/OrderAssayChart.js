import { useD3 } from "../../hooks/useD3";
import * as d3 from "d3";
import { assayFormat } from "../../formatter";
import { AssayRangeText } from "./AssayRangeText";

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
            .attr("y2", yCenter)
            .classed("svg-danger-stroke", true)
        svg.append("line")  // hard UB
            .style("stroke-width", boundaryStrokeWidth)
            .attr("x1", scale(assayDetail.asy_hard_ub))
            .attr("y1", yCenter-largeBoundaryDelta)
            .attr("x2", scale(assayDetail.asy_hard_ub))
            .attr("y2", yCenter)
            .classed("svg-danger-stroke", true)
        svg.append("line")  // soft LB
            .style("stroke-width", boundaryStrokeWidth)
            .attr("x1", scale(assayDetail.asy_soft_lb))
            .attr("y1", yCenter-smallBoundaryDelta)
            .attr("x2", scale(assayDetail.asy_soft_lb))
            .attr("y2", yCenter)
            .classed("svg-good-stroke", true)
        svg.append("line")  // soft UB
            .style("stroke-width", boundaryStrokeWidth)
            .attr("x1", scale(assayDetail.asy_soft_ub))
            .attr("y1", yCenter-smallBoundaryDelta)
            .attr("x2", scale(assayDetail.asy_soft_ub))
            .attr("y2", yCenter)
            .classed("svg-good-stroke", true)
        if (assayDetail.resulting_assay !== undefined){
            svg.append("circle")  // resulting assay value dot
            .attr("r", 1.5)
            .attr("cx", scale(assayDetail.resulting_assay))
            .attr("cy", yCenter)
            .classed("svg-primary-fill", true)
        }

    }, [assayDetail]);

    return (
        <>
            <div className="order-assay-chart-container">
                <div className="assay-widget-container">
                    {assayDetail.resulting_assay !== undefined && (
                        <div className="value-container bold">{assayFormat(assayDetail.resulting_assay)}</div>
                    )}
                    <div className="svg-container">
                        <svg
                            ref={ref}
                            className="svg-content-responsive"
                            preserveAspectRatio="xMinYMin meet"
                            viewBox={`0 0 ${width} ${height}`}
                        ></svg>
                    </div>
                </div>
                <AssayRangeText assayDetail={assayDetail}></AssayRangeText>
            </div>
        </>
    );
};
