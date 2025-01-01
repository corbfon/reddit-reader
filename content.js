function copyToClipboard(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

// Initialize an array to hold the comments hierarchy
const commentsHierarchy = [];

// Get all top-level parent elements with the tag "shreddit-comment"
const parentElements = document.querySelectorAll(
  'shreddit-comment:not([slot^="children-"])'
);

// Function to process a shreddit-comment element recursively
function processCommentElement(element) {
  // Get the author from the "author" attribute
  const author = element.getAttribute("author");

  // Get the comment text from the "md" element
  const mdElement = element.querySelector(".md");
  const comment = mdElement
    ? Array.from(mdElement.getElementsByTagName("p"))
        .map((p) => p.textContent)
        .join("\n")
    : "";

  // Get the replies (nested shreddit-comment elements)
  const replies = Array.from(
    element.querySelectorAll('shreddit-comment[slot^="children-"]')
  );

  // Process replies recursively
  const processedReplies = replies.map((reply) => processCommentElement(reply));

  // Return the comment object
  return {
    author,
    comment,
    replies: processedReplies,
  };
}

// Process each top-level comment element
parentElements.forEach((parentElement) => {
  commentsHierarchy.push(processCommentElement(parentElement));
});

// Output the comments hierarchy to the console
console.log(commentsHierarchy);

// Convert commentsHierarchy to a JSON string and copy to clipboard
const jsonComments = JSON.stringify(commentsHierarchy, null, 2);
copyToClipboard(jsonComments);
