import { useState, useEffect } from "react";
import { createApi } from "unsplash-js";
import PhotoComp from "./Photocomp";
import { createClient } from "pexels";
import { words } from "./translations";
import { REACT_APP_PEXELS_API_KEY } from "../keys";

const Body = () => {
    const [data, setPhotosResponse] = useState(null);

    const client = createClient(REACT_APP_PEXELS_API_KEY);
    // const searchQuery =
    //     "apple,ball,cat,dog,elephant,fish,grape,hat,ice,juice,kite,lion,moon,nest,owl,pig,quack,rabbit,sun,tree,umbrella,violin,water,xylophone,yarn,zebra,book,car,duck,flower";

    const englishWords = words.map((word) => word.en);

    useEffect(() => {
        // const queryArray = searchQuery.split(",");
        const queryArray = englishWords;
        const fetchPromises = queryArray.map((query) =>
            client.photos
                .search({ query, per_page: 1 })
                .catch((error) => ({ error }))
        );

        Promise.allSettled(fetchPromises)
            .then((resultsArray) => {
                const allPhotos = resultsArray.flatMap((result, index) => {
                    // If the promise was rejected
                    if (result.status === "rejected") {
                        o;
                        console.log("Failed to fetch:", queryArray[index]);
                        return [];
                    }

                    // Check if result.value exists
                    if (!result.value) {
                        console.log(
                            "Received undefined result.value for query:",
                            queryArray[index]
                        );
                        return [];
                    }

                    // Extract photos
                    const photos = Array.isArray(result.value.photos)
                        ? result.value.photos
                        : [result.value.photos];

                    // Check if photos are undefined or null
                    if (
                        !photos ||
                        photos.some(
                            (photo) => photo === undefined || photo === null
                        )
                    ) {
                        console.log(
                            "Received undefined or null photos for query:",
                            queryArray[index]
                        );
                        return [];
                    }

                    // Add query term to each photo object
                    photos.forEach(
                        (photo) => (photo.queryTerm = queryArray[index])
                    );
                    return photos;
                });
                setPhotosResponse(allPhotos);
            })
            .catch(() => {
                console.log("Something went really wrong!");
            });
    }, []);

    // useEffect(() => {
    //     client.photos
    //         .search({ query, per_page: 3 })
    //         .then((result) => {
    //             setPhotosResponse(result);
    //         })
    //         .catch(() => {
    //             console.log("Something went wrong!");
    //         });
    // }, []);

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

    // console.log(data.photos, "data");

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
