import { useState, useEffect } from "react";
import { createApi } from "unsplash-js";
import PhotoComp from "./Photocomp";

const Body = () => {
    const [data, setPhotosResponse] = useState(null);

    const api = createApi({
        // Don't forget to set your access token here!
        // See https://unsplash.com/developers
        accessKey: "RFBhlSKuj2pYq3wqU2Gw5obteW85ZBhXlAAO4XQuLs0",
    });

    const searchTerms = "apple,ball,cat,dog,elephant";

    // ,fish,grape,hat,ice,juice,kite,lion,moon,nest,owl,pig,quack,rabbit,sun,tree,umbrella,violin,water,xylophone,yarn,zebra,book,car,duck,flower";

    useEffect(() => {
        const termsArray = searchTerms.split(","); // Split the search terms by comma
        const fetchPromises = termsArray.map(
            (term) => api.photos.getRandom({ query: term.trim() }) // Create a promise for each term
        );

        Promise.all(fetchPromises)
            .then((resultsArray) => {
                const allPhotos = resultsArray.flatMap((result, index) => {
                    const photos = Array.isArray(result.response)
                        ? result.response
                        : [result.response];
                    // Add query term to each photo object
                    photos.forEach(
                        (photo) => (photo.queryTerm = termsArray[index])
                    );
                    return photos;
                });
                setPhotosResponse(allPhotos); // Combine all photos into one array
            })
            .catch(() => {
                console.log("Something went wrong!");
            });
    }, [searchTerms]); // Dependency array includes searchTerms

    // useEffect(() => {
    //     api.photos
    //         .getRandom({ query: "dog", count: 5 })
    //         .then((result) => {
    //             setPhotosResponse(result);
    //         })
    //         .catch(() => {
    //             console.log("Something went wrong!");
    //         });
    // }, []);

    // Check if data is still loading
    if (data === null) {
        return <div>Loading...</div>;
    }

    // Check for errors
    if (data.errors) {
        return (
            <div>
                <div>{data.errors[0]}</div>
                <div>PS: Make sure to set your access token!</div>
            </div>
        );
    }

    // Safely access nested properties
    const results = data;

    const resultsArray = Array.isArray(results) ? results : [results];

    console.log(results, "results");
    console.log(data, "data");

    if (!results) {
        return <div>No results found!</div>;
    }

    return (
        <div className="feed">
            <ul className="columnUl">
                {results.map((photo) => (
                    <li key={photo.id} className="li">
                        <PhotoComp photo={photo} term={photo.queryTerm} />
                    </li>
                ))}
            </ul>
        </div>
    );
};
export default Body;
