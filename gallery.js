let galleryData = [];


async function loadGallery() {


    const { data, error } = await supabaseClient

        .from("gallery_events")

        .select("*")

        .order("created_at", { ascending: false });



    if (error) {

        console.log(error);
        return;

    }


    galleryData = data;

    displayGallery(galleryData, true);


    // Make All button active when page loads

    const allButton = document.querySelector(".gallery-filter button");

    if (allButton) {

        allButton.classList.add("active");

    }


}




function displayGallery(events, showCategories = false) {


    const container = document.getElementById("gallery-container");

    container.innerHTML = "";



    if (events.length === 0) {

        container.innerHTML = "<p>No pictures available.</p>";

        return;

    }



    if (showCategories) {


        const categories = {};


        events.forEach(event => {


            if (!categories[event.category]) {

                categories[event.category] = [];

            }


            categories[event.category].push(event);


        });



        for (const category in categories) {


            createCategorySection(

                category,

                categories[category],

                container

            );


        }



    } else {


        createCategorySection(

            events[0].category,

            events,

            container

        );


    }


}






function createCategorySection(category, events, container) {



    const categoryHeading = document.createElement("h2");

    categoryHeading.className = "gallery-category-title";

    categoryHeading.textContent = category;


    container.appendChild(categoryHeading);





    events.forEach(event => {



        const card = document.createElement("div");

        card.className = "gallery-card";



        let images = "";




        event.photos.forEach(photo => {



            const { data } = supabaseClient

                .storage

                .from("gallery-images")

                .getPublicUrl(photo);



            images += `


            <img

            src="${data.publicUrl}"

            class="gallery-image"

            onclick="openLightbox('${data.publicUrl}')"

            >


            `;


        });






        card.innerHTML = `



        <h3>${event.title}</h3>



        ${
            event.year
            ?
            `<p>Year: ${event.year}</p>`
            :
            ""
        }





        ${
            event.description
            ?
            `<p>${event.description}</p>`
            :
            ""
        }





        <div class="gallery-images">

        ${images}

        </div>



        `;



        container.appendChild(card);



    });



}









function filterGallery(category){


    if(category === "All"){


        displayGallery(galleryData, true);


    }
    else {


        const filtered = galleryData.filter(event =>


            event.category === category


        );


        displayGallery(filtered, false);


    }




    // Change active button color

    const buttons = document.querySelectorAll(".gallery-filter button");


    buttons.forEach(button => {


        button.classList.remove("active");


        if(button.textContent.trim() === category){


            button.classList.add("active");


        }


    });


}









function openLightbox(imageURL){



    const lightbox = document.getElementById("image-lightbox");

    const image = document.getElementById("lightbox-image");



    image.src = imageURL;


    lightbox.style.display = "flex";



}









document.getElementById("close-lightbox").onclick = function(){



    document.getElementById("image-lightbox").style.display = "none";



};







loadGallery();