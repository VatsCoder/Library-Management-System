export default function Statscard(props) {
    return(
        <>
            <div className="card-stats">
                <div>
                    <span>{props.title}</span>
                    <div className="card-stats-number">{props.value}</div>
                </div>
                    <div className="card-stats-icon">{props.icon}</div>
            </div>
        </>
    );
};
