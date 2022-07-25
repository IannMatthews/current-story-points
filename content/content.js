if (!self.fetch) {
    alert('Browser does not support fetch');
}

chrome.storage.local.get(['csp-data'], function (result) {
    const cspData = result['csp-data'];
    updateCsp(cspData);
});

function updateCsp(cspData) {
    if (cspData) {
        const sprints = document.querySelectorAll('.ghx-meta');

        Array.from(sprints).forEach((sprint) => {
            const issueKeyElements = sprint.querySelectorAll('a.ghx-key');
            const issueKeys = Array.from(issueKeyElements).map((issue) => issue.text);

            const totalStoryPointsElement =
                sprint.getElementsByClassName('ghx-stat-total');
            const totalStoryPointsBadge = totalStoryPointsElement.length
                ? totalStoryPointsElement[0].getElementsByClassName('aui-badge')[0]
                : null;

            const mapResponse = (response) => {
                const issue = JSON.parse(response);

                return {
                    key: issue.key,
                    storyPoints: issue.fields[cspData.storyPoints],
                    currentStoryPoints:
                        issue.fields[cspData.currentStoryPoints],
                };
            };

            let totalCurrentStoryPoints = 0;
            let totalStoryPoints = 0;
            const totalStoryPointsText = totalStoryPointsBadge
                ? totalStoryPointsBadge.innerHTML
                : '';

            const updateHTML = (issue) => {
                totalStoryPoints += issue.storyPoints;
                if (!issue.currentStoryPoints && issue.storyPoints) {
                    totalCurrentStoryPoints += issue.storyPoints;
                }

                if (issue.currentStoryPoints) {
                    totalCurrentStoryPoints += issue.currentStoryPoints;
                }

                if (
                    totalCurrentStoryPoints &&
                    totalStoryPointsBadge &&
                    totalCurrentStoryPoints !== totalStoryPoints
                ) {
                    totalStoryPointsBadge.innerHTML = [
                        totalStoryPointsText,
                        totalCurrentStoryPoints,
                    ].join(' > ');
                }

                document
                    .querySelector(`[data-issue-key='${issue.key}']`)
                    .getElementsByClassName('ghx-statistic-badge')
                    .item(0).innerHTML =
                    issue.currentStoryPoints && issue.storyPoints
                        ? `${issue.storyPoints} > ${issue.currentStoryPoints}`
                        : issue.currentStoryPoints
                            ? `0 > ${issue.currentStoryPoints}`
                            : `${issue.storyPoints || '-'}`;
            };

            const email = cspData.email;
            const password = cspData.apiKey;
            const headers = new Headers({
                Accept: 'application/json',
                Authorization: 'Basic ' + btoa(email + ':' + password),
            });

            issueKeys.forEach((issueId) => {
                fetch(`https://${cspData.subdomain}.atlassian.net/rest/api/3/issue/${issueId}`, {
                    method: 'GET',
                    headers,
                })
                    .then((response) => response.text())
                    .then((text) => updateHTML(mapResponse(text)))
                    .catch((err) => console.error(err));
            });
        });
    }
}
