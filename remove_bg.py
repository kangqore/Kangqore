from PIL import Image

def remove_background(input_path, output_path, threshold=230):
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()
    
    newData = []
    for item in datas:
        # If the pixel is mostly white, make it transparent
        if item[0] > threshold and item[1] > threshold and item[2] > threshold:
            newData.append((255, 255, 255, 0))
        else:
            # Optionally, we can make all non-transparent pixels black here to enforce the silhouette!
            newData.append((0, 0, 0, 255))
            
    img.putdata(newData)
    img.save(output_path, "PNG")

remove_background("frontend/public/assets/logos/geeks-it.jpg", "frontend/public/assets/logos/geeks-it.png")
