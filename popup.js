document.addEventListener("DOMContentLoaded", async () => {
  const contentDiv = document.getElementById("content");

  try {
    // Get current tab
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!tab.url.includes("linkedin.com/in/")) {
      contentDiv.innerHTML =
        '<div class="error">Please navigate to a LinkedIn profile page</div>';
      return;
    }

    // Extract profile info from the page
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: extractProfileInfo,
    });


    const profileInfo = results[0].result;

    if (!profileInfo.name) {
      contentDiv.innerHTML =
        '<div class="error">Could not extract profile information</div>';
      return;
    }

    // Search for email using Hunter.io
    const email = await searchEmail(profileInfo.name, profileInfo.company);

    // Display results
    displayProfileData({
      fullName: profileInfo.name,
      email: email,
      organisation: profileInfo.company,
      designation: profileInfo.title,
    });
  } catch (error) {
    console.error("Error:", error);
    contentDiv.innerHTML =
      '<div class="error">Error loading profile data</div>';
  }
});

function extractProfileInfo() {
  const name = document.querySelector("h1")?.textContent?.trim() || "";
  const title =
    document.querySelector(".text-body-medium")?.textContent?.trim() || "";
  const company =
    document
      .querySelector(
        'button[aria-label*="Current company:"] .inline-show-more-text--is-collapsed'
      )
      ?.textContent?.trim() ||
    document
      .querySelector(
        'li:has(button[aria-label*="Current company:"]) .inline-show-more-text--is-collapsed'
      )
      ?.textContent?.trim() ||
    "";

  return { name, title, company };
}

async function searchEmail(fullName, company) {
  if (HUNTER_API_KEY === "YOUR_API_KEY_HERE") {
    return "API key not configured";
  }

  try {
    const domain = await getDomainFromCompany(company);
    if (!domain) return "Domain not found";

    const response = await fetch(
      `https://api.hunter.io/v2/email-finder?domain=${domain}&first_name=${
        fullName.split(" ")[0]
      }&last_name=${fullName.split(" ").slice(-1)[0]}&api_key=${HUNTER_API_KEY}`
    );

    const data = await response.json();

    if (data.data && data.data.email) {
      return data.data.email;
    }

    return "Email not found";
  } catch (error) {
    console.error("Hunter.io API error:", error);
    return "Email lookup failed";
  }
}

async function getDomainFromCompany(company) {
  if (!company) return null;

  try {

    const response = await fetch(
      `https://api.hunter.io/v2/domain-search?company=${encodeURIComponent(
        company
      )}&limit=1&api_key=${HUNTER_API_KEY}`
    );

    const data = await response.json();

    console.log("slkdfjlsd Domain search response:", data);

    if (data.data && data.data.domain) {
      return data.data.domain;
    }

    return null;
  } catch (error) {
    console.error("Domain search error:", error);
    return null;
  }
}

function displayProfileData(data) {
  const contentDiv = document.getElementById("content");

  if (
    !data.fullName &&
    !data.email &&
    !data.organisation &&
    !data.designation
  ) {
    contentDiv.innerHTML = '<div class="error">No data found</div>';
    return;
  }

  contentDiv.innerHTML = `
        <div class="profile-data">
            <div class="label">Full Name:</div>
            <div class="value">${data.fullName || "Not available"}</div>
        </div>
        <div class="profile-data">
            <div class="label">Email:</div>
            <div class="value">${data.email || "Not found"}</div>
        </div>
        <div class="profile-data">
            <div class="label">Organisation:</div>
            <div class="value">${data.organisation || "Not available"}</div>
        </div>
        <div class="profile-data">
            <div class="label">Designation:</div>
            <div class="value">${data.designation || "Not available"}</div>
        </div>
    `;
}
