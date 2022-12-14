export const Card = ({ title, style = {}, children }) => {
    return (
        <div className="card" style={style}>
            <div className="card-title">{title}</div>
            <div className="card-content"> {children} </div>
        </div>
    );
};
