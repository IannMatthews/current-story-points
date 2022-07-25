window.onload = () => {
    document.getElementById('csp-submit').addEventListener('click', function () {
        const subdomain = document.getElementById("subdomain").value;
        const email = document.getElementById("email").value;
        const apiKey = document.getElementById("api-token").value;
        const storyPoints = document.getElementById("story-points").value;
        const currentStoryPoints = document.getElementById("current-story-points").value;

        if (!(subdomain && email && apiKey && storyPoints && currentStoryPoints)) {
            return;
        }

        const cspData = {
            subdomain, email, apiKey, storyPoints, currentStoryPoints
        };
        chrome.storage.local.set({ 'csp-data': cspData });

        alert('Now please refresh your JIRA tabs');
    });
};
