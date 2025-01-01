function copyToClipboard(text) {
  let textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

// Initialize an array to hold the comments hierarchy
let commentsHierarchy = [];

// Get all top-level parent elements with the tag "shreddit-comment"
let parentElements = document.querySelectorAll(
  'shreddit-comment:not([slot^="children-"])'
);

// Function to process a shreddit-comment element recursively
function processCommentElement(element) {
  // Get the author from the "author" attribute
  let author = element.getAttribute("author");

  // Get the comment text from the "md" element
  let mdElement = element.querySelector(".md");
  let comment = mdElement
    ? Array.from(mdElement.getElementsByTagName("p"))
        .map((p) => p.textContent)
        .join("\n")
    : "";

  // Get the replies (nested shreddit-comment elements)
  let replies = Array.from(
    element.querySelectorAll('shreddit-comment[slot^="children-"]')
  );

  // Process replies recursively
  let processedReplies = replies.map((reply) => processCommentElement(reply));

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
let jsonComments = JSON.stringify(commentsHierarchy, null, 2);
copyToClipboard(jsonComments);
