================================
PHOTO GALLERY IMAGES
================================

Place your photos in this folder with the following names:
- photo1.jpg
- photo2.jpg
- photo3.jpg
- photo4.jpg
- photo5.jpg
- photo6.jpg

TIPS:
- Use JPG, PNG, or WebP format
- Different image heights work best for the Pinterest-style layout
- Recommended minimum width: 400px
- You can add more photos by duplicating gallery items in index.html

To add more images:
1. Add the image file to this folder
2. Open index.html
3. Find the gallery section (search for "gallery-container")
4. Copy an existing gallery-item div and update the image source

Example:
<div class="gallery-item">
    <img src="images/photo7.jpg" alt="Memory 7" onclick="openModal(this.src)">
</div>
