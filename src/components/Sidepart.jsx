export default function Sidepart(props) {
    return(
        <>
            <section className="tile-1">
                <div className="welcome">
                    <h1>{props.Heading}</h1>
                    <div>{props.Para}</div>
                </div>
            </section>
        </>
    );
};
