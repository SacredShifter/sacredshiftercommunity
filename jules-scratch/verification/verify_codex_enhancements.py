import re
from playwright.sync_api import sync_playwright, Page, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Navigate to the app and log in
    page.goto("http://localhost:8081/")

    # Fill in login credentials
    page.get_by_label("Email").fill("test@example.com")
    page.get_by_label("Password").fill("password")

    # Click the sign in button
    page.get_by_role("button", name="Sign In").click()

    # Wait for navigation to the main page after login, e.g., by waiting for a known element
    page.screenshot(path="jules-scratch/verification/debug-after-login.png")
    expect(page.get_by_text("Welcome")).to_be_visible(timeout=10000)

    # Now navigate to the registry
    page.goto("http://localhost:8081/registry")

    # Wait for the list of entries to load
    expect(page.get_by_text("Registry of Resonance")).to_be_visible(timeout=10000)

    # Find the specific entry and click on it
    entry_title_regex = re.compile(r"7447474")
    entry_link = page.get_by_text(entry_title_regex)
    expect(entry_link).to_be_visible()
    entry_link.click()

    # Now we are on the entry page. Let's verify the new elements.
    # 1. Verify the new action buttons are present
    expect(page.get_by_title("Resonate")).to_be_visible()
    expect(page.get_by_title("Echo")).to_be_visible()
    expect(page.get_by_title("Seed")).to_be_visible()
    expect(page.get_by_title("Bookmark")).to_be_visible()

    # 2. Verify the Quick Abstract is there
    expect(page.get_by_text("Dream and digital converged")).to_be_visible()

    # 3. Verify the Resonance Metrics section and chart are visible
    expect(page.get_by_text("Resonance Metrics")).to_be_visible()
    # The chart is inside an iframe or canvas, so we'll just check for the container
    expect(page.locator(".recharts-responsive-container")).to_be_visible()

    # 4. Verify the Community Layer tabs are visible
    expect(page.get_by_role("tab", name="Public Discussion")).to_be_visible()
    expect(page.get_by_role("tab", name="Private Reflection Notes")).to_be_visible()

    # 5. Take a screenshot of the whole page
    page.screenshot(path="jules-scratch/verification/codex-enhancements.png", full_page=True)

    context.close()
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
