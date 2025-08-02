import { load } from "cheerio";
import dotenv from "dotenv";
import {} from "process";

dotenv.config();

const challengeUrl = process.env.CHALLENGE_URL!;

const getChallengeHtml = async () => {
  const response = await fetch(challengeUrl);
  const html = await response.text();

  return html;
};

const validateParentAttribs = (
  parent: any, // parent node
  cb: (attribs: Record<string, string>) => boolean // validator
): boolean => {
  if (!parent) return false;

  if (parent! && "attribs" in parent) return false;

  return cb(parent.attribs);
};

const decodeUrlUp = async (html: string) => {
  const $ = load(html);

  //   <section data-id="92*">
  //     <article data-class="*45">
  //       <div data-tag="*78*">
  //         <b class="ref" value="VALID_CHARACTER"></b>
  //       </div>
  //     </article>
  //   </section>

  // Get all b elements with valid class
  const bElements = $("section").find("b.ref");

  // Filter out b elements with invalid parents
  bElements.filter((_index, bElem) => {
    const parentDiv = bElem.parent;
    const isDivAttribsValid = validateParentAttribs(
      parentDiv,
      (attribs) => attribs["data-tag"].endsWith("78") // validator
    );

    const parentArticle = parentDiv?.parent;
    const isArticleAttribsValid = validateParentAttribs(
      parentArticle,
      (attribs) => attribs["data-class"].endsWith("45") // validator
    );

    const parentSection = parentArticle?.parent;
    const isSectionAttribsValid = validateParentAttribs(
      parentSection,
      (attribs) => attribs["data-id"].startsWith("92") // validator
    );

    // All parents must be valid
    return isDivAttribsValid && isArticleAttribsValid && isSectionAttribsValid;
  });

  const decodedUrl = bElements
    .toArray() // Convert to array
    .map((bElem) => bElem.attribs.value) // Map b element value
    .join(""); // Join array to produce url string

  return decodedUrl;
};

(async () => {
  const html = await getChallengeHtml();

  const url = await decodeUrlUp(html);

  console.log(url);
})();
