import fitz # PyMuPDF
import io
import os

pdf_file = "productos.pdf"
doc = fitz.open(pdf_file)
os.makedirs("uploads/productos", exist_ok=True)

# Just to see the text to match images to names
for page_num in range(len(doc)):
    page = doc.load_page(page_num)
    text = page.get_text()
    print(f"--- PAGE {page_num} ---")
    print(text)
    image_list = page.get_images(full=True)
    for img_index, img in enumerate(image_list):
        xref = img[0]
        base_image = doc.extract_image(xref)
        image_bytes = base_image["image"]
        image_ext = base_image["ext"]
        image_filename = f"uploads/productos/page{page_num}_img{img_index}.{image_ext}"
        with open(image_filename, "wb") as f:
            f.write(image_bytes)
        print(f"Saved {image_filename}")
