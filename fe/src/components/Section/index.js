export const Section = (props) => {
    return (
        <div className="main-content-container-background">
            <div className="main-content-container">{props.children}</div>
        </div>
    );
};
