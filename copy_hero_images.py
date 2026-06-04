import os
from PIL import Image

src_dir = "/Users/shyanilmishra/.gemini/antigravity-ide/brain/1f59de16-02b7-4650-828a-80e68ffd8a10"
dest_dir = "/Users/shyanilmishra/renewhealthcare/public/images"

images = [
    ("hero_man_1_1780585763409.png", "hero_man_1.webp"),
    ("hero_couple_baby_1_1780585783950.png", "hero_couple_baby_1.webp")
]

os.makedirs(dest_dir, exist_ok=True)

target_width = 1672
target_height = 941
target_aspect = target_width / target_height

for src_name, dest_name in images:
    src_path = os.path.join(src_dir, src_name)
    dest_path = os.path.join(dest_dir, dest_name)
    
    print(f"Processing {src_name} -> {dest_name}...")
    if os.path.exists(src_path):
        with Image.open(src_path) as img:
            # Crop to 1672:941 aspect ratio from center
            img_width, img_height = img.size
            img_aspect = img_width / img_height
            
            if img_aspect > target_aspect:
                # Image is too wide, crop left/right
                new_width = int(img_height * target_aspect)
                offset = (img_width - new_width) // 2
                crop_box = (offset, 0, offset + new_width, img_height)
            else:
                # Image is too tall, crop top/bottom
                new_height = int(img_width / target_aspect)
                offset = (img_height - new_height) // 2
                crop_box = (0, offset, img_width, offset + new_height)
                
            cropped_img = img.crop(crop_box)
            # Resize to exactly 1672x941
            resized_img = cropped_img.resize((target_width, target_height), Image.Resampling.LANCZOS)
            # Save as WebP
            resized_img.save(dest_path, "WEBP", quality=92, method=6)
            
        print(f"Successfully saved to: {dest_path}")
    else:
        print(f"Error: {src_path} does not exist!")

print("\nProcess completed successfully!")
