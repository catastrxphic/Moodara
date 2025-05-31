import urllib.request
import os

def download_notification_sound():
    # URL of a simple notification sound (CC0 license)
    url = "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3"
    
    # Get the directory of this script
    assets_dir = os.path.dirname(os.path.abspath(__file__))
    output_path = os.path.join(assets_dir, "notification.mp3")
    
    # Download the file
    print("Downloading notification sound...")
    urllib.request.urlretrieve(url, output_path)
    print(f"Notification sound downloaded to: {output_path}")

if __name__ == "__main__":
    download_notification_sound() 