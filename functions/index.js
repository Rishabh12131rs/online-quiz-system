const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const pdf = require("pdf-parse");
const { getStorage } = require("firebase-admin/storage");

// Initialize Firebase Admin
admin.initializeApp();

// --- *** IMPORTANT: PASTE YOUR AI API KEY HERE *** ---
// Get this from Google AI Studio: https://aistudio.google.com/app/apikey
const GEMINI_API_KEY = "AIzaSyA6z6HnTP7L8V1UYo3wncjkyvOaI6lsiCU";
// -----------------------------------------------------

// Initialize the AI model
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// This is the function your website will call
exports.generateQuizFromPdf = functions.https.onCall(async (data, context) => {
    // 1. Check if user is authenticated
    if (!context.auth) {
        throw new functions.https.HttpsError(
            "unauthenticated", 
            "You must be logged in to create a quiz."
        );
    }

    const { filePath, title, author, authorUID } = data;
    const bucket = getStorage().bucket();

    try {
        // 2. Download the PDF from Firebase Storage
        const fileContents = await bucket.file(filePath).download();

        // 3. Parse the text from the PDF buffer
        const pdfData = await pdf(fileContents[0]);
        const pdfText = pdfData.text;

        if (pdfText.length < 100) {
             throw new functions.https.HttpsError(
                "invalid-argument", 
                "PDF is too short. It must have at least 100 characters of text."
            );
        }

        // 4. Create the prompt for the AI
        const prompt = `
        Based on the following text, generate 5 high-quality multiple-choice questions.
        The questions should be in a strict JSON array format.
        Each question object must have:
        1. A "question" key with the question text.
        2. An "options" key with an array of 4 answer strings. The first option MUST be the correct answer.
        3. A "correct_answer_index" key, which must be 0.
        4. An "explanation" key, with a brief explanation of why the answer is correct.

        Do not include any text before or after the JSON array.

        TEXT:
        ---
        ${pdfText.substring(0, 8000)}
        ---
        JSON_OUTPUT:
        `;

        // 5. Call the Gemini AI API
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let jsonText = response.text();

        // Clean the AI's response to make sure it's valid JSON
        jsonText = jsonText.trim().replace(/^```json\n/, "").replace(/```$/, "");

        let questionsArray = [];
        try {
            questionsArray = JSON.parse(jsonText);
        } catch(e) {
            console.error("Gemini output was not valid JSON:", jsonText);
            throw new functions.https.HttpsError(
                "internal", 
                "The AI returned an invalid response. Please try again."
            );
        }

        // 6. Format the new quiz object
        const newQuiz = {
            title: title,
            author: author,
            authorUID: authorUID,
            likeCount: 0,
            likedBy: [],
            type: 'quiz', // This is a "Community" quiz, created by a user
            recommendedStudyGuideId: null,
            questions: questionsArray.map(q => ({
                ...q,
                questionType: 'mc', // All AI-generated questions are MC
                imageUrl: null
            }))
        };

        // 7. Save the new quiz to Firestore
        const quizDocRef = await admin.firestore().collection("quizzes").add(newQuiz);

        // 8. Delete the original PDF from Storage
        await bucket.file(filePath).delete();

        // 9. Return the new Quiz ID to the website
        return { quizId: quizDocRef.id };

    } catch (error) {
        console.error("Error in function:", error);
        // Clean up the file if something went wrong
        await bucket.file(filePath).delete();
        throw new functions.https.HttpsError(
            "internal", 
            error.message || "An unknown error occurred."
        );
    }
});