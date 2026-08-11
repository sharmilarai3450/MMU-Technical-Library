async function uploadGallery() {


    const title = document.getElementById("title").value;

    const category = document.getElementById("category").value;

    const year = document.getElementById("year").value;

    const description = document.getElementById("description").value;

    const files = document.getElementById("photos").files;

    const message = document.getElementById("upload-message");



    if (!title || files.length === 0) {

        message.textContent = "Please enter title and select photos.";

        return;

    }



    message.textContent = "Uploading...";



    let imagePaths = [];



    for (let file of files) {


        const fileName =
            Date.now() + "_" + file.name;



        const { error } = await supabaseClient
            .storage
            .from("gallery-images")
            .upload(fileName, file);



        if (error) {

            console.log(error);

            message.textContent =
            "Image upload failed.";

            return;

        }



        imagePaths.push(fileName);


    }



    const { error: dbError } = await supabaseClient

        .from("gallery_events")

        .insert({

            title: title,

            category: category,

            year: year || null,

            description: description || null,

            photos: imagePaths

        });



    if (dbError) {

        console.log(dbError);

        message.textContent =
        "Database entry failed.";

        return;

    }



    message.textContent =
    "Gallery activity uploaded successfully!";


}
function displayGallery(data){


const container = document.getElementById("gallery-container");

container.innerHTML = "";


data.forEach(event => {


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
onclick="openLightbox('${data.publicUrl}')">

`;


});



card.innerHTML = `

<h3>${event.title}</h3>

<p class="gallery-category">
${event.category}
</p>


<div class="gallery-images">

${images}

</div>

`;



container.appendChild(card);


});


}



function filterGallery(category){


if(category === "All"){

displayGallery(galleryData);

}

else{


const filtered = galleryData.filter(item =>

item.category === category

);


displayGallery(filtered);


}


}