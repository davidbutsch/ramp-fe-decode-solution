import dotenv from "dotenv";

dotenv.config();

const challengeUrl = process.env.CHALLENGE_URL!;

console.log(challengeUrl);
