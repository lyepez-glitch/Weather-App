document.addEventListener("DOMContentLoaded", (event) => {
    console.log("DOM fully loaded and parsed");
    const key = '08db9f29263746d3b4313252241404';
    const giphyKey = '51ZQFYIn6AKOgIxI8yAbPBIHT3DzTt6A';
    let fahrenheit, celsius, weather, flag = 'f';
    const img = document.querySelector("img");
    const submitBtn = document.querySelector('.submit');
    const toggleBtn = document.querySelector('.toggle');
    const weatherDiv = document.querySelector("#weather");
    const weatherNumDiv = document.querySelector("#weatherNum");
    const weatherPhotoImg = document.querySelector("#weatherPhoto");

    function getData(location) {
        console.log(key, location)
        const url = `http://api.weatherapi.com/v1/current.json?key=${key}&q=${location}`;
        console.log(12)
        return new Promise(function(resolve, reject) {
            fetch(url)
                .then(function(response) {
                    console.log(response)
                    if (!response.ok) {
                        throw new Error('error, couldn\'t fetch data');
                    }
                    resolve(response)
                })
                .catch(function(error) {
                    reject(error);
                })
        });

    }

    async function processData(location = "London") {
        console.log(key, location)
        const res = await getData(location);
        const data = await res.json();
        console.log("data", data);
        const { feelslike_c, feelslike_f } = data.current;
        fahrenheit = feelslike_f;
        celsius = feelslike_c;
        weather = data.current.condition.text;
        weatherDiv.textContent = weather;
        weatherNumDiv.textContent = toggle();
        weatherPhotoImg.src = await getGif(weather);

    };



    function toggle() {
        if (flag === 'f') {
            flag = 'c';
            return celsius;
        } else {
            flag = 'f';
            return fahrenheit;
        }
    }


    async function getGif(weather) {

        const weatherGif = await fetch(`https://api.giphy.com/v1/gifs/translate?api_key=${giphyKey}&s=${weather}`, {
            mode: 'cors'
        });
        const gif = await weatherGif.json();
        console.log("weatherGif", gif);
        return gif.data.images.original.url;

    };


    submitBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const input = document.querySelector('#location');
        const location = input.value;
        processData(location)
            .then(async function() {
                console.log(fahrenheit, celsius, weather);
                img.src = await getGif(weather);
            });
    });
    toggleBtn.addEventListener("click", (e) => {
        e.preventDefault();
        weatherNumDiv.textContent = toggle();
    });

});