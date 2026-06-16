const url = "https://arw-t-8.onrender.com/api/contact";
// Or maybe they called it something else. Let's just do a GET to /health or similar to see if it's up.
async function checkHealth() {
  try {
    const res = await fetch("https://arw-t-8.onrender.com/health");
    console.log("Health status:", res.status, await res.text());
  } catch(e) {
    console.error("Health check failed:", e.message);
  }
}
checkHealth();
