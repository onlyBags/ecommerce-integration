from flask import Flask, request, jsonify
import requests
from rembg import remove
from io import BytesIO
import boto3
from botocore.exceptions import NoCredentialsError
import os
from dotenv import load_dotenv
import hashlib
import time

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Initialize S3 client with environment variables
s3_client = boto3.client(
    's3',
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
)

def generate_image_hash(image_bytes):
    timestamp = str(time.time())
    hasher = hashlib.sha256()
    hasher.update(image_bytes)
    hasher.update(timestamp.encode())
    return hasher.hexdigest() + '.png'

def remove_background(image_data):
    output_image = remove(image_data)
    return output_image

def upload_to_s3(file_object, bucket, object_name):
    try:
        s3_client.upload_fileobj(file_object, bucket, object_name)
        return f"https://{bucket}.s3.amazonaws.com/{object_name}"
    except NoCredentialsError:
        print("Credentials not available")
        return None

@app.route('/process-image', methods=['POST'])
def process_image():
    data = request.json
    image_url = data.get('url')
    if not image_url:
        return 'No image URL provided', 400

    response = requests.get(image_url)
    if response.status_code != 200:
        return 'Failed to download image', 400

    input_image = response.content
    output_image = remove_background(input_image)

    # Convert the processed image to a BytesIO object for uploading
    output_io = BytesIO(output_image)
    object_name = "processed_images/" + generate_image_hash(output_image)

    # Upload to S3 and get the URL
    bucket_name = os.getenv('S3_BUCKET_NAME')
    image_url = upload_to_s3(output_io, bucket_name, object_name)

    # Return the URL
    return jsonify({'url': image_url})

if __name__ == "__main__":
    port = int(os.getenv('PYTHON_PORT', 5000))  # Default to 5000 if not set
    app.run(host='0.0.0.0', port=port)
