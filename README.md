# Wakey Wakey: The Focus App for Students

## Inspiration
Many students struggle to stay awake and focused while studying, often finding themselves drifting off during long study sessions. Wakey Wakey was born out of the need for a solution that combines technology and productivity tools to help students maintain focus and alertness. By integrating drowsiness detection with a Pomodoro timer, Wakey Wakey ensures students remain attentive and productive during their study sessions.

## What It Does
Wakey Wakey is a focus app designed to help students stay awake and productive while studying. Its features include:

1. **Drowsiness Detection System**:
   - Utilises a camera feed to monitor the user's face and detect signs of drowsiness in real-time.
   - Alerts the user with an alarm and on-screen prompts if signs of drowsiness are detected.
   - Displays a bounding box and a label ("Awake" or "Dozing Off") on the user's face for visual feedback.

2. **Pomodoro Timer**:
   - A fully functional timer to help students focus on study intervals with short breaks in between.
   - Allows users to adjust the work and break durations dynamically.
   - Plays an alarm at the end of each session to keep users on track.

## How We Built It
### Frontend
- **React**: For building the user interface.
- **Node.js**: Used to manage dependencies and run the development environment.
- **Tailwind CSS**: For styling the app with a modern and responsive design.
- **Vercel**: To host the frontend of the web application.

### Backend
- **Flask**: For building the backend REST API to handle drowsiness detection and communicate with the frontend.
- **YOLOv5**: Used to train the drowsiness detection model.
- **OpenCV**: For capturing and processing video frames in real-time.
- **Flask-CORS**: To handle cross-origin requests between the frontend and backend.

### Hosting and Deployment
- **Vercel**: For hosting the frontend.
- **Render**: For hosting the backend Python server.

## Challenges We Ran Into
- **Model Training**:
  - Training the drowsiness detection model to achieve high accuracy with YOLOv5.
  - Labelling the dataset for training, which required a significant amount of manual effort.
- **Frontend Development**:
  - Designing an intuitive and user-friendly interface with React.
  - Incorporating real-time alerts and drowsiness detection visual feedback.
- **Integration**:
  - Seamlessly connecting the React frontend with the Flask backend.
  - Managing dependencies and configurations for deployment on platforms like Vercel and Render.

## Accomplishments We're Proud Of
- Successfully creating a fully functional web application that integrates drowsiness detection and a productivity timer.
- Achieving considerably high drowsiness detection accuracy with YOLOv5.
- Developing a user-friendly interface that students can easily use to stay focused during their study sessions.

## What We Learned
- How to build and style responsive web applications using React and Tailwind CSS.
- Training machine learning models with YOLOv5 and improving accuracy through dataset labelling and fine-tuning.
- The importance of managing cross-origin requests and integrating frontend and backend services effectively.

## What's Next for Wakey Wakey
- **Integration with Driving Systems**:
  - Expanding the app's use case to include integration with vehicles like cars, buses, and trucks to detect drowsy driving.
- **Enhanced Features**:
  - Adding support for detailed analytics to track user focus and drowsiness trends over time.
  - Introducing gamified productivity features to make the app more engaging.
- **Multi-Device Compatibility**:
  - Expanding support for mobile devices and tablet-friendly interfaces.
- **Improved AI Model**:
  - Further refining the drowsiness detection model for higher accuracy in various environments.

---
