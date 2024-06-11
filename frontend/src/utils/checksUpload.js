// Function to remove uploads checks
export async function checksUpload() {
    const fileInputs = document.querySelectorAll('.upload');
    fileInputs.forEach(input => {
        input.addEventListener('change', function() {
            const label = document.querySelector(`label[for="${this.id}"]`);
            if (this.files.length > 0) {
                label.style.backgroundColor = '#4972B1';
                label.style.color = '#f8f8f8';
            } else {
                label.style.backgroundColor = '#f8f8f8';
                label.style.color = '#5E190B'; 
            }
        });
    });
}