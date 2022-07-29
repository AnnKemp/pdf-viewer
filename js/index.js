const zoomButton = document.getElementById('zoom');
const input = document.getElementById('inputFile');
const openFile = document.getElementById('openPDF');
const currentPage = document.getElementById('current_page');
const viewer = document.querySelector('.pdf-viewer');
let currentPDF = {};

function resetCurrentPDF(){ // maak object: huidige pdf
    currentPDF = {
        file: null,
        countOfPages: 0,
        currentPage: 1,
        zoom: 1.5
    }
}

openPDF.addEventListener('click', () => { // wanneer op de knop openPDF geclickt wordt . . .
    input.click(); // maak input 'clickable'
    document.getElementsByTagName('h3')[0].innerHTML = '';
    document.getElementsByTagName('canvas')[0].style.display="block";
    // nu kunnen we nog niet bladeren in de pagina's van de pdf of ook niet zoomen, dus dat moet nog worden toegevoegd.
});
document.getElementById('next').addEventListener("click", () => {
    const isValidPage = currentPDF.currentPage < currentPDF.countOfPages;
    if(isValidPage){
        currentPDF.currentPage +=1;
        renderCurrentPage();
    }
});
zoomButton.addEventListener('input', () =>{
 if(currentPDF.file){
    document.getElementById('zoomValue').innerHTML = zoomButton.value + "%";
    currentPDF.zoom = parseInt(zoomButton.value)/100;
    renderCurrentPage();
 }
});
document.getElementById('previous').addEventListener("click", () => {
    const isValidPage = currentPDF.currentPage -1 > 0;
    if(isValidPage){
        currentPDF.currentPage -=1;
        renderCurrentPage();
    }
});

input.addEventListener('change', event =>{ // op change event haal uit event
    const inputFile = event.target.files[0]; // de target files en selecteer de eerste file
    if(inputFile.type === 'application/pdf'){ // als de inputfile een pdf is
        const reader = new FileReader(); // nieuw object
        reader.readAsDataURL(inputFile); // de inputfile inlezen
        reader.onload = () => {
            loadPDF(reader.result); // loadPDF zelfgemaakte functie, result is de inhoud die geladen is
            zoomButton.disabled = false; // default enabled vandaar ...
        }
    } else {
        alert('The file you selected is not a pdf-file!');
    }
});
function loadPDF(data){
    resetCurrentPDF();
    const pdfFile = pdfjsLib.getDocument(data); // bibliotheek ophalen, werkt met promises etc.
    pdfFile.promise.then( doc => {
            currentPDF.file = doc;
            currentPDF.countOfPages = doc.numPages;
            viewer.classList.remove('hidden'); // verwijder className 'hidden' van de lijst met de classes (zie index.html)
            document.querySelector('main h3').classList.add('hidden'); // voeg 'hidden' toe aan de h3 via de classList
            renderCurrentPage(); // so the user can see it
    })
};
function renderCurrentPage(){ // then has a promise and page hoort daarbij
    currentPDF.file.getPage(currentPDF.currentPage).then(page => {
        // currentPDF.file daar was doc aan toegekend  getPage neemt als waarde het paginanummer
        const context = viewer.getContext('2d');
        const viewPort = page.getViewport({scale: currentPDF.zoom}); // object
        viewer.height = viewPort.height; // de hoogte van de pdf als hoogte
        viewer.width = viewPort.width; 

        const renderContext = {
            canvasContext: context,
            viewport: viewPort
        };
        page.render(renderContext);
    }) ;
    currentPage.innerHTML = currentPDF.currentPage + 'of' + currentPDF.countOfPages;// weergave paginanummering
}