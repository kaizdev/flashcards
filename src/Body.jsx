import { useState, useEffect } from "react";
import { createApi } from "unsplash-js";
import PhotoComp from "./Photocomp";
import { createClient } from "pexels";

const Body = () => {
    const [data, setPhotosResponse] = useState(null);

    const client = createClient(
        "wRJ4oa9IPUP0vxi2s0D6wbSYpYsgyVBoXSNkBAqXsJNt5QU44ZYo0NTW"
    );
    const searchQuery =
        "apple,ball,cat,dog,elephant,fish,grape,hat,ice,juice,kite,lion,moon,nest,owl,pig,quack,rabbit,sun,tree,umbrella,violin,water,xylophone,yarn,zebra,book,car,duck,flower";

    useEffect(() => {
        const queryArray = searchQuery.split(",");
        console.log(queryArray, "queryArray");
        const fetchPromises = queryArray.map((query) =>
            client.photos.search({ query, per_page: 1 })
        );

        Promise.all(fetchPromises)
            .then((resultsArray) => {
                const allPhotos = resultsArray.flatMap((result, index) => {
                    const photos = Array.isArray(result.photos)
                        ? result.photos
                        : [result.photos];
                    // Add query term to each photo object
                    photos.forEach(
                        (photo) => (photo.queryTerm = queryArray[index])
                    );
                    return photos;
                });
                setPhotosResponse(allPhotos); // This line should be here
            })
            .catch(() => {
                console.log("Something went wrong!");
            });
    }, [searchQuery]);

    console.log("data object:", data);

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

    console.log(data.photos, "data");

    if (!results) {
        return <div>No results found!</div>;
    }

    return (
        <div className="feed">
            {results.map((photo) => (
                <div key={photo.id} className="li">
                    <PhotoComp photo={photo} term={photo.queryTerm} />
                </div>
            ))}
        </div>
    );
};
export default Body;
