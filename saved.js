document.addEventListener("DOMContentLoaded", async function () {
    const summariesList = document.getElementById("summaries-list");

    async function loadSummaries() {
        const db = firebase.firestore();
        const summaries = await db.collection("summaries").orderBy("timestamp", "desc").get();
        summariesList.innerHTML = "";

        summaries.forEach((doc) => {
            const data = doc.data();
            const summaryElement = document.createElement("div");
            summaryElement.classList.add("summary-item");
            summaryElement.innerHTML = `
                <div class="summary-header">
                    <span class="domain">${data.domain || "Unknown"}</span>
                    <span class="date">${data.timestamp ? new Date(data.timestamp.toDate()).toLocaleDateString() : "N/A"}</span>
                </div>
                <p class="summary-content">${data.summary}</p>
                <button class="delete-btn" data-id="${doc.id}"><img src="assets/delete.png"> Delete</button>
            `;
            summariesList.appendChild(summaryElement);
        });

        document.querySelectorAll(".delete-btn").forEach((btn) => {
            btn.addEventListener("click", async function () {
                const id = this.getAttribute("data-id");
                await db.collection("summaries").doc(id).delete();
                loadSummaries();
            });
        });
    }

    loadSummaries();
});
