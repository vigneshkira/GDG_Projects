# TaskFlow: Your Intelligent Task Management Hub

TaskFlow is a modern, AI-powered task management application designed to streamline your workflow and boost your productivity. Built with Next.js, Firebase, and Genkit, it provides a seamless experience for managing tasks, organizing information, and leveraging artificial intelligence to get things done faster.

[Download Demo Video](https://drive.google.com/file/d/FILE_ID_HERE/view](https://drive.google.com/file/d/13OxhLsQVtVYyAb4fBvNWAx5Weqb8skUr/view?usp=sharing
)

https://drive.google.com/file/d/13OxhLsQVtVYyAb4fBvNWAx5Weqb8skUr/view?usp=drive_link




## Core Features

-   **Intuitive Task Management**: Organize your tasks with a drag-and-drop Kanban board (To Do, In Progress, Done) or a sortable list view.
-   **Rich Task Details**: Create tasks with titles, descriptions, due dates, priority levels (low, medium, high), and status.
-   **AI-Powered Task Generation**: Use the "Ask AI" feature to enter a concept or topic, and get an actionable task and a clear explanation generated for you.
-   **Unified Inbox**: A central hub for notifications from simulated platforms like Gmail, LinkedIn, and Google Classroom, with intelligent categorization and actionable suggestions.
-   **Interactive Task Chatbot**: Chat with an AI assistant to create, delete, or ask questions about your tasks in natural language.
-   **Google Workspace Integration**: Attach Google Drive files (Docs, Sheets, Slides) and Google Calendar events to your tasks via URLs for quick access.
-   **Secure Authentication**: User accounts are secured with Firebase Authentication, ensuring that your data is private and protected by Firestore security rules.
-   **Light & Dark Modes**: Switch between light and dark themes to suit your preference.

## Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
-   **AI Integration**: [Genkit](https://firebase.google.com/docs/genkit) with the Gemini API
-   **Backend & Database**: [Firebase](https://firebase.google.com/) (Firestore, Authentication)
-   **State Management**: React Hooks & Context API
-   **Form Handling**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) for validation

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later)
-   `npm` or `yarn`

### 1. Clone the Repository

First, clone the project to your local machine:

```bash
git clone <repository-url>
cd <repository-directory>
```

### 2. Install Dependencies

Install the necessary packages using npm:

```bash
npm install
```

### 3. Set Up Environment Variables

You'll need to connect the app to your own Firebase project.

1.  Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2.  Enable **Firestore** and **Firebase Authentication** (with the Email/Password provider).
3.  In your project's settings, find your web app's Firebase configuration keys.
4.  Create a `.env` file in the root of your project by copying the example:

    ```bash
    cp .env.example .env
    ```

5.  Add your Firebase project's credentials to the `.env` file. It should look like this:

    ```
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
    ```
    
    You will also need to add your Google AI API Key for the AI features to work.
    
    ```
    GOOGLE_API_KEY=your_google_ai_api_key
    ```
    

### 4. Run the Development Server

Start the Next.js development server:

```bash
npm run dev
```

The app should now be running at [http://localhost:9002](http://localhost:9002).

## Deployment

This application is ready to be deployed on platforms like [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/).

-   **Import** your Git repository into the hosting provider.
-   **Configure** the build settings (they are usually auto-detected for Next.js).
-   **Add** your environment variables from the `.env` file to the provider's dashboard.
-   **Deploy!**
