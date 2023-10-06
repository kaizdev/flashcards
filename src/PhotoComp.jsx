import { words } from "./translations";

const PhotoComp = ({ photo, term }) => {
    const { src } = photo;

    // function to capitalise first letter of string
    const capitaliseFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    return (
        <>
            <section className="card-border">
                <img className="img" src={src.medium} />
                <div className="image-info">
                    {capitaliseFirstLetter(term)}
                    <br />
                    {words.map((word) =>
                        word.en === term.toLowerCase()
                            ? `${word.zh} ${word.pinyin}`
                            : ""
                    )}
                </div>
            </section>
        </>
    );
};
export default PhotoComp;
