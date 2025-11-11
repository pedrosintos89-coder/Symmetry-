const buildingImageUpload = document.getElementById('buildingImageUpload');
const applySymmetryButton = document.getElementById('applySymmetryButton');
const statusMessage = document.getElementById('statusMessage');
const transformedCanvas = document.getElementById('transformedCanvas');
const noResultText = document.getElementById('noResultText');

let currentImageBase64 = null; 

// 1. Gestionnaire de téléchargement d'image
buildingImageUpload.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            currentImageBase64 = e.target.result;
            applySymmetryButton.disabled = false;
            statusMessage.textContent = 'Image chargée. Cliquez pour appliquer la Symétrie.';
            statusMessage.className = 'status-message success';
        };
        reader.readAsDataURL(file);
    } else {
        currentImageBase64 = null;
        applySymmetryButton.disabled = true;
        statusMessage.textContent = 'Veuillez d\'abord sélectionner une image.';
        statusMessage.className = 'status-message';
    }
});

// 2. Gestionnaire du bouton "Appliquer la Symétrie"
applySymmetryButton.addEventListener('click', async function() {
    if (!currentImageBase64) return;

    statusMessage.textContent = 'Application de la théorie de la Symétrie en cours...';
    statusMessage.className = 'status-message';
    applySymmetryButton.disabled = true;

    await applySymmetry(currentImageBase64);

    applySymmetryButton.disabled = false;
    statusMessage.textContent = 'Façade complétée avec succès grâce à la Symétrie!';
    statusMessage.className = 'status-message success';
});


// *** Fonction d'Application de la Théorie de la Symétrie ***
async function applySymmetry(base64Image) {
    return new Promise(resolve => {
        const img = new Image();
        img.onload = function() {
            const halfWidth = img.width;
            const originalHeight = img.height;
            const finalWidth = halfWidth * 2; // Doubler la largeur pour la façade complète

            transformedCanvas.width = finalWidth;
            transformedCanvas.height = originalHeight;
            const ctx = transformedCanvas.getContext('2d');
            ctx.clearRect(0, 0, finalWidth, originalHeight); // Effacer le canvas

            // 1. Dessiner l'image originale (la première moitié)
            ctx.drawImage(img, 0, 0, halfWidth, originalHeight);

            // 2. Refléter l'image et la dessiner sur la deuxième moitié (côté opposé)
            ctx.save();
            ctx.translate(finalWidth, 0); // Déplacer le point d'origine vers la droite (le milieu)
            ctx.scale(-1, 1); // Appliquer la réflexion horizontale
            ctx.drawImage(img, 0, 0, halfWidth, originalHeight);
            ctx.restore();
            
            // Afficher le résultat
            transformedCanvas.style.display = 'block';
            noResultText.style.display = 'none';
            resolve();
        };
        img.src = base64Image;
    });
}
