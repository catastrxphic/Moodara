from PIL import Image, ImageDraw, ImageFont
import os

def create_avatar():
    # Create a new image with a white background
    img = Image.new('RGBA', (120, 120), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)

    # Face
    draw.ellipse([20, 20, 100, 100], fill='#FFE4E1')

    # Eyes
    draw.ellipse([35, 45, 50, 60], fill='#4A4A4A')
    draw.ellipse([70, 45, 85, 60], fill='#4A4A4A')

    # Blush
    draw.ellipse([25, 55, 45, 75], fill='#FFB6C1')
    draw.ellipse([75, 55, 95, 75], fill='#FFB6C1')

    # Smile
    draw.arc([45, 50, 75, 80], 0, 180, fill='#4A4A4A', width=2)

    # Hair
    draw.arc([35, 5, 85, 55], 180, 0, fill='#F8B5D3', width=30)

    return img

def create_icon(size):
    # Create a new image with a transparent background
    img = Image.new('RGBA', (size, size), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)

    # Background circle
    draw.ellipse([0, 0, size, size], fill='#F8B5D3')

    # Letter M
    try:
        font = ImageFont.truetype("Arial", int(size * 0.6))
    except:
        font = ImageFont.load_default()

    text = "M"
    text_bbox = draw.textbbox((0, 0), text, font=font)
    text_width = text_bbox[2] - text_bbox[0]
    text_height = text_bbox[3] - text_bbox[1]
    
    x = (size - text_width) // 2
    y = (size - text_height) // 2
    draw.text((x, y), text, fill='white', font=font)

    return img

def main():
    # Create assets directory if it doesn't exist
    assets_dir = os.path.dirname(os.path.abspath(__file__))
    if not os.path.exists(assets_dir):
        os.makedirs(assets_dir)

    # Generate and save avatar
    avatar = create_avatar()
    avatar.save(os.path.join(assets_dir, 'avatar.png'))

    # Generate and save icons
    for size in [16, 48, 128]:
        icon = create_icon(size)
        icon.save(os.path.join(assets_dir, f'icon{size}.png'))

    print("Assets generated successfully!")

if __name__ == "__main__":
    main() 