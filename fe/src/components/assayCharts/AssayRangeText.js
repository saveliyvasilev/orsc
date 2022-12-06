import { assayFormat } from "../../formatter";

export const AssayRangeText = ({ assayDetail }) => {
    return (
        <div className="comment assay-ranges-text">
            <span className="danger">{assayFormat(assayDetail.asy_hard_lb)}</span>|
            <span className="good">{assayFormat(assayDetail.asy_soft_lb)}</span>|<span className="primary">Target</span>
            |<span className="good">{assayFormat(assayDetail.asy_soft_ub)}</span>|
            <span className="danger">{assayFormat(assayDetail.asy_hard_ub)}</span>
        </div>
    );
};
