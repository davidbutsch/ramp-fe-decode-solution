import dotenv from "dotenv";

dotenv.config();

const challengeUrl = process.env.CHALLENGE_URL!;

const getChallengeHtml = async () => {
  const response = await fetch(challengeUrl);
  const html = await response.text();

  return html;
};

(async () => {
  const html = await getChallengeHtml();

  console.log(html);
})();
