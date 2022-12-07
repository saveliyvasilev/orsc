export const SmallKPICard = ({ title, value }) => {
    return (
        <div className="small-card">
            <div className="small-card-title">{title}</div>
            <div className="small-card-value"> {value} </div>
        </div>
    );
};
