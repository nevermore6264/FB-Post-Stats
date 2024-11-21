document.getElementById("startButton").addEventListener("click", () => {
  const urls = document
    .getElementById("urls")
    .value.split(",")
    .map((url) => url.trim());

  chrome.runtime.sendMessage(
    { action: "extractData", urls: urls },
    (response) => {
      if (response.status === "success") {
        downloadData(response.data);
      } else {
        alert("Error: " + response.error);
      }
    }
  );
});

document.getElementById("restartButton").addEventListener("click", () => {
  // Logic to restart extraction if interrupted
  console.log("Restarting extraction...");
  // Could implement resumption here if data is stored in storage or indexedDB
});

function downloadData(data) {
  let csvContent =
    "Page Name, Post ID, Caption, Likes, Shares, Date/Time, Comments, URL\n";
  data.forEach((item) => {
    csvContent += `${item.pageName}, ${item.postID}, "${item.postCaption}", ${item.postLikes}, ${item.postShares}, ${item.postDateTime}, "${item.postComments}", ${item.postURL}\n`;
  });

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "facebook_data.csv";
  a.click();
  URL.revokeObjectURL(url);
}
