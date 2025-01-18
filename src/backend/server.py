import base64
import cv2
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
import torch

app = Flask(__name__)
CORS(app)  # Allow requests from React

# Load YOLO model
model = torch.hub.load('ultralytics/yolov5', 'custom', path='../models/exp8/weights/best.pt', force_reload=True)

@app.route('/process_frame', methods=['POST'])
def process_frame():
    try:
        data = request.json
        frame_data = data['frame']

        # Decode the Base64 image
        _, encoded_image = frame_data.split(",", 1)
        decoded_image = base64.b64decode(encoded_image)
        np_image = np.frombuffer(decoded_image, dtype=np.uint8)
        frame = cv2.imdecode(np_image, cv2.IMREAD_COLOR)

        # Run YOLO model on the frame
        results = model(frame)

        # Check for drowsiness detection (example logic)
        is_drowsy = any(obj['name'] == 'drowsy' for obj in results.pandas().xyxy[0].to_dict('records'))

        # Return response
        response = {
            "status": "Drowsy" if is_drowsy else "Alert",
            "advice": "Take a break!" if is_drowsy else "Keep going!"
        }
        return jsonify(response)
    except Exception as e:
        return jsonify({"error": str(e)}), 400


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
