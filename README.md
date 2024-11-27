<h1 align="center" id="title">Commprep.ai</h1>

<p align="center"><img src="https://socialify.git.ci/Chayandev/commprep.ai/image?font=Inter&amp;logo=https%3A%2F%2Fres.cloudinary.com%2Fdosqbjprt%2Fimage%2Fupload%2Fv1730566855%2Fqkf36yf5rlcju4panfhy.jpg&amp;name=1&amp;owner=1&amp;pattern=Signal&amp;theme=Light" alt="project-image"></p>

<p id="description">CommPrep.ai is a web application designed to help users improve their communication skills through practice in reading listening grammar sentence correction and vocabulary. The platform offers a user-friendly interface for individuals preparing for communication tests enhancing their proficiency in a structured manner.</p>

  
  
# Features Overview 📚🎧✍️

Here're some of the project's best features:

### 1. Authentication Features 🔐
- **Login and Signup**: 
  - Utilized **JWT (JSON Web Token)** for secure authentication. 🔑
  - Implemented **refresh tokens** to maintain user sessions without requiring frequent logins. 🔄

- **Auto-login**:
  - Users are automatically logged in if their session is valid and has not expired. 🚀

- **Logout Functionality**: 
  - Users can log out, which invalidates their current session and refresh token. ❌

- **Avatar Image Upload**:
  - Integrated **Cloudinary** for uploading and managing avatar images during the signup process. 🌐
  - Provided a selection of predefined images for users to choose from. 🖼️

- **Forgot Password**:
  - Implemented a **forgot password** feature that allows users to reset their password securely. 🔑

- **Email Verification**:
  - Added **email verification** functionality that sends a verification code to users' email addresses to confirm their identity. 📧
    
---

### 2. Completed Reading Assessment Functionality 📚
- **Reading Assessment Feature**:
  - Fully functional reading assessment implemented. ✅
  - Utilized predefined assessments for standardized evaluation. 📋

- **Recording and Analyzing Readings**:
  - Integrated **Assembly AI** for transcribing and analyzing reading assessments. 📝
  - Developed a custom algorithm to analyze accuracy and provide a confidence level for each reading. 📊

- **Feedback and Suggestions**:
  - Comprehensive feedback generated based on analysis. 💬
  - Suggestions for improvement provided based on performance. 🏆

---

### 3. Completed Listening Assessment Functionality 🎧
- **Predefined Assessments**:
  - Predefined listening assessments are fetched dynamically from **Cloudinary**. 🎵
  - Each assessment includes audio files stored in the cloud. 📂

- **Timed Question Completion**:
  - Questions can only be answered after listening to the audio within a specified time frame. ⏳
  - Time limit is based on the difficulty level of the assessment. 🎯

- **Scoring and Feedback**:
  - After completing the assessment, the system displays the **score** achieved. 📊
  - Provides detailed feedback on performance, including areas for improvement. 💬

---

### 4. Completed Grammar Assessment Functionality ✍️
- **Dynamic Assessment Loading**:
  - Predefined grammar assessments loaded dynamically based on difficulty. 📋

- **Display Options**:
  - Users can toggle between **Card View** and **List View** to display assessments dynamically. 💡

- **Scoring**:
  - Grammar assessment scores are displayed upon completion to track user performance. 📈

---

### 5. Completed Vocabulary Assessment Functionality 🗂️
- **Assessment and Scoring**:
  - Vocabulary assessments are loaded dynamically, categorized by difficulty level. 📚
  - Upon completion, scores are shown to evaluate user progress and proficiency. 🎯

---

### 6. Profile Section Enhancements 👤
- **Avatar Management**:
  - Users can upload and manage their profile avatar using **Cloudinary**. 📷

- **Progress Tracking**:
  - Displays user progress and scores for each assessment type (Reading, Listening, Grammar, Vocabulary). 📈


  
<h2>💻 Built with</h2>

Technologies used in the project:

*   React
*   Redux Toolkit
*   Tailwind CSS
*   Material UI
*   Node JS
*   Express JS
*   MongoDB
*   NodeMailer
*   AssemblyAI SDK
*   Cloudinery
